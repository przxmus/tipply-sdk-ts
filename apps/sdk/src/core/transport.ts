import { TipplyAuthenticationError, TipplyConfigurationError, TipplyHttpError } from "./errors";
import { resolveClientOptions, resolveSessionCookie } from "./options";
import { serializeQuery } from "./query";
import type {
  RequestOptions,
  TipplyClientOptions,
  TipplyRequestScope,
  TipplyTransportRequest,
  TipplyTransportResponseContext,
} from "./types";

function toHeadersObject(headers: Headers): Record<string, string> {
  const output: Record<string, string> = {};

  headers.forEach((value, key) => {
    output[key] = value;
  });

  return output;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : undefined;
}

function resolveBaseUrl(scope: TipplyRequestScope, options: ReturnType<typeof resolveClientOptions>): string {
  return scope === "public" ? options.transport.publicBaseUrl : options.transport.proxyBaseUrl;
}

function createAbortSignal(timeoutMs: number, signal: AbortSignal | undefined): { signal: AbortSignal; cleanup(): void } {
  if (typeof AbortSignal.any === "function" && typeof AbortSignal.timeout === "function") {
    const composedSignal = signal ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs);
    return {
      signal: composedSignal,
      cleanup() {},
    };
  }

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(new Error(`Request timed out after ${timeoutMs}ms.`)), timeoutMs);

  const abortFromParent = () => controller.abort(signal?.reason);
  signal?.addEventListener("abort", abortFromParent, { once: true });

  return {
    signal: controller.signal,
    cleanup() {
      clearTimeout(timeoutHandle);
      signal?.removeEventListener("abort", abortFromParent);
    },
  };
}

export class TipplyTransport {
  private readonly resolvedOptions: ReturnType<typeof resolveClientOptions>;

  constructor(options: TipplyClientOptions = {}) {
    this.resolvedOptions = resolveClientOptions(options);
  }

  withOptions(options: TipplyClientOptions): TipplyTransport {
    return new TipplyTransport(options);
  }

  get config(): ReturnType<typeof resolveClientOptions> {
    return this.resolvedOptions;
  }

  async request<TResponse>(request: TipplyTransportRequest<TResponse>, requestOptions: RequestOptions = {}): Promise<TResponse> {
    const scope = request.scope ?? "proxy";
    const baseUrl = resolveBaseUrl(scope, this.resolvedOptions);
    const url = `${baseUrl}${request.path}${serializeQuery(request.query)}`;
    const headers = new Headers({
      Accept: "application/json",
      ...(request.headers ?? {}),
    });

    if (request.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (request.auth) {
      headers.set("Referer", `${this.resolvedOptions.transport.appOrigin}/`);

      if (request.method !== "GET") {
        headers.set("Origin", this.resolvedOptions.transport.appOrigin);
      }

      const authCookie = await resolveSessionCookie(this.resolvedOptions.session);

      if (authCookie) {
        headers.set("Cookie", `${this.resolvedOptions.transport.cookieName}=${authCookie}`);
      } else if (!this.resolvedOptions.transport.includeCredentials) {
        throw new TipplyConfigurationError(
          "Authenticated requests require a session authCookie, getAuthCookie, or browserSession transport configuration.",
          { method: request.method, url },
        );
      }
    }

    const timeoutMs = requestOptions.timeoutMs ?? this.resolvedOptions.transport.timeoutMs;
    const { signal, cleanup } = createAbortSignal(timeoutMs, requestOptions.signal);

    try {
      const requestInit: RequestInit = {
        method: request.method,
        headers,
        signal,
      };

      if (request.body !== undefined) {
        requestInit.body = JSON.stringify(request.body);
      }

      if (request.auth && this.resolvedOptions.transport.includeCredentials) {
        requestInit.credentials = "include";
      }

      const response = await this.resolvedOptions.transport.fetch(url, requestInit);

      const responseBody = await parseResponseBody(response);
      const context: TipplyTransportResponseContext = {
        method: request.method,
        url,
        status: response.status,
        headers: toHeadersObject(response.headers),
        body: responseBody,
      };

      if (!response.ok) {
        if (response.status === 401) {
          const authenticationMessage =
            typeof responseBody === "object" &&
            responseBody !== null &&
            "error_description" in responseBody &&
            typeof responseBody.error_description === "string"
              ? responseBody.error_description
              : "Authentication failed. Check your Tipply session cookie.";

          throw new TipplyAuthenticationError(authenticationMessage, context);
        }

        throw new TipplyHttpError(`Request failed with status ${response.status}.`, context);
      }

      return responseBody as TResponse;
    } catch (error) {
      if (error instanceof TipplyHttpError || error instanceof TipplyConfigurationError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new TipplyHttpError(`Request aborted while calling ${request.method} ${request.path}.`, {
          method: request.method,
          url,
          body: undefined,
        });
      }

      throw new TipplyHttpError(
        error instanceof Error ? error.message : "Request failed before receiving a response.",
        {
          method: request.method,
          url,
          body: undefined,
        },
      );
    } finally {
      cleanup();
    }
  }
}
