import { TipplyAuthError, TipplyHttpError, TipplyValidationError } from "./errors";
import { serializeQuery } from "./query";
import type { TipplyClientOptions, TipplyRequestOptions, Validator } from "./types";

interface ResolvedClientOptions {
  accessToken: string | undefined;
  getAccessToken: TipplyClientOptions["getAccessToken"] | undefined;
  fetch: typeof fetch;
  proxyBaseUrl: string;
  publicBaseUrl: string;
  validateResponses: boolean;
}

function normalizeBaseUrl(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

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

export class HttpClient {
  readonly options: Readonly<ResolvedClientOptions>;
  private readonly fetchImpl: typeof fetch;

  constructor(options: TipplyClientOptions = {}) {
    this.fetchImpl = options.fetch ?? globalThis.fetch;

    if (!this.fetchImpl) {
      throw new Error("Global fetch is not available. Provide a fetch implementation in TipplyClientOptions.fetch.");
    }

    this.options = {
      accessToken: options.accessToken,
      getAccessToken: options.getAccessToken,
      fetch: this.fetchImpl,
      proxyBaseUrl: normalizeBaseUrl(options.proxyBaseUrl ?? "https://proxy.tipply.pl"),
      publicBaseUrl: normalizeBaseUrl(options.publicBaseUrl ?? "https://tipply.pl/api"),
      validateResponses: options.validateResponses ?? false,
    };
  }

  withAccessToken(accessToken: string): HttpClient {
    const nextOptions: TipplyClientOptions = {
      fetch: this.options.fetch,
      proxyBaseUrl: this.options.proxyBaseUrl,
      publicBaseUrl: this.options.publicBaseUrl,
      validateResponses: this.options.validateResponses,
      accessToken,
    };

    return new HttpClient(nextOptions);
  }

  private async resolveAccessToken(): Promise<string | undefined> {
    if (this.options.accessToken) {
      return this.options.accessToken;
    }

    const token = await this.options.getAccessToken?.();
    return token ?? undefined;
  }

  private resolveUrl(path: string, scope: "proxy" | "public", query?: TipplyRequestOptions<unknown>["query"]): string {
    const baseUrl = scope === "public" ? this.options.publicBaseUrl : this.options.proxyBaseUrl;
    return `${baseUrl}${path}${serializeQuery(query)}`;
  }

  async request<TResponse>(options: TipplyRequestOptions<TResponse>): Promise<TResponse> {
    const scope = options.scope ?? "proxy";
    const url = this.resolveUrl(options.path, scope, options.query);
    const headers = new Headers({
      Accept: "application/json",
    });

    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (options.requiresAuth) {
      const accessToken = await this.resolveAccessToken();

      if (!accessToken) {
        throw new TipplyAuthError("This endpoint requires an access token.", {
          method: options.method,
          url,
        });
      }

      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const requestInit: RequestInit = {
      method: options.method,
      headers,
    };

    if (options.body !== undefined) {
      requestInit.body = JSON.stringify(options.body);
    }

    const response = await this.fetchImpl(url, requestInit);

    const responseBody = await parseResponseBody(response);
    const context = {
      method: options.method,
      url,
      status: response.status,
      headers: toHeadersObject(response.headers),
      body: responseBody,
    };

    if (!response.ok) {
      const authErrorMessage =
        response.status === 401 && typeof responseBody === "object" && responseBody !== null && "error_description" in responseBody
          ? String(responseBody.error_description)
          : undefined;

      if (response.status === 401) {
        throw new TipplyAuthError(authErrorMessage ?? "Authentication failed.", context);
      }

      throw new TipplyHttpError(`Request failed with status ${response.status}.`, context);
    }

    if (options.validator && this.options.validateResponses) {
      try {
        const validator: Validator<TResponse> = options.validator;
        validator(responseBody);
      } catch (error) {
        if (error instanceof TipplyValidationError) {
          throw error;
        }

        throw new TipplyValidationError(error instanceof Error ? error.message : "Response validation failed.", context);
      }
    }

    return responseBody as TResponse;
  }
}
