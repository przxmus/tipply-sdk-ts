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

const AUTH_REFRESH_PATH = "/user";
const RECONNECT_DELAY_MS = 1_000;

function getSetCookieHeaders(headers: Headers): string[] {
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const setCookie = headers.get("set-cookie");
  return setCookie ? [setCookie] : [];
}

function readCookieValue(cookie: string, cookieName: string): string | undefined {
  const [cookiePair] = cookie.split(";", 1);

  if (!cookiePair) {
    return undefined;
  }

  const separatorIndex = cookiePair.indexOf("=");

  if (separatorIndex === -1) {
    return undefined;
  }

  const name = cookiePair.slice(0, separatorIndex).trim();

  if (name !== cookieName) {
    return undefined;
  }

  const value = cookiePair.slice(separatorIndex + 1).trim();
  return value.length > 0 ? value : undefined;
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

async function parseResponseBodyAs(response: Response, responseType: "auto" | "text" | "arrayBuffer"): Promise<unknown> {
  if (responseType === "auto") {
    return parseResponseBody(response);
  }

  if (response.status === 204) {
    return undefined;
  }

  if (responseType === "text") {
    const text = await response.text();
    return text.length > 0 ? text : undefined;
  }

  return response.arrayBuffer();
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

async function sleep(ms: number, signal: AbortSignal | undefined): Promise<void> {
  if (signal?.aborted) {
    throw new DOMException("Request aborted.", "AbortError");
  }

  await new Promise<void>((resolve, reject) => {
    const handle = setTimeout(() => {
      signal?.removeEventListener("abort", abortHandler);
      resolve();
    }, ms);

    const abortHandler = () => {
      clearTimeout(handle);
      reject(new DOMException("Request aborted.", "AbortError"));
    };

    signal?.addEventListener("abort", abortHandler, { once: true });
  });
}

export class TipplyTransport {
  private readonly resolvedOptions: ReturnType<typeof resolveClientOptions>;
  private authCookieOverride: string | undefined;
  private authCookieOverrideActive = false;
  private periodicRefreshTimer: ReturnType<typeof setInterval> | undefined;
  private refreshInFlight: Promise<void> | null = null;

  constructor(options: TipplyClientOptions = {}) {
    this.resolvedOptions = resolveClientOptions(options);

    if (this.resolvedOptions.session && "authCookie" in this.resolvedOptions.session) {
      this.authCookieOverride = this.resolvedOptions.session.authCookie;
      this.authCookieOverrideActive = true;
    }

    this.startPeriodicRefresh();
  }

  withOptions(options: TipplyClientOptions): TipplyTransport {
    return new TipplyTransport(options);
  }

  get config(): ReturnType<typeof resolveClientOptions> {
    return this.resolvedOptions;
  }

  /** Stops background auth refresh timers created for this transport. */
  close(): void {
    if (this.periodicRefreshTimer !== undefined) {
      clearInterval(this.periodicRefreshTimer);
      this.periodicRefreshTimer = undefined;
    }
  }

  async request<TResponse>(request: TipplyTransportRequest<TResponse>, requestOptions: RequestOptions = {}): Promise<TResponse> {
    if (!request.auth || this.resolvedOptions.auth.reconnectTries <= 1) {
      return this.executeRequest<TResponse>(request, requestOptions);
    }

    let attempt = 1;
    let lastError: unknown;

    while (attempt <= this.resolvedOptions.auth.reconnectTries) {
      if (attempt === this.resolvedOptions.auth.reconnectTries && attempt > 1) {
        await this.refreshViaUser({ swallowErrors: true });
      }

      try {
        return await this.executeRequest<TResponse>(request, requestOptions);
      } catch (error) {
        lastError = error;

        if (!this.shouldRetryRequest(error, attempt, requestOptions.signal)) {
          throw error;
        }

        attempt += 1;
        await sleep(RECONNECT_DELAY_MS, requestOptions.signal);
      }
    }

    throw lastError;
  }

  private startPeriodicRefresh(): void {
    if (this.resolvedOptions.auth.refreshTokenEveryMs === undefined) {
      return;
    }

    if (!this.canSendAuthenticatedRequests()) {
      return;
    }

    this.periodicRefreshTimer = setInterval(() => {
      void this.refreshViaUser({ swallowErrors: true });
    }, this.resolvedOptions.auth.refreshTokenEveryMs);

    this.periodicRefreshTimer.unref?.();
  }

  private canSendAuthenticatedRequests(): boolean {
    return this.resolvedOptions.session !== undefined;
  }

  private shouldRetryRequest(error: unknown, attempt: number, signal: AbortSignal | undefined): boolean {
    if (signal?.aborted || attempt >= this.resolvedOptions.auth.reconnectTries) {
      return false;
    }

    if (error instanceof TipplyAuthenticationError) {
      return true;
    }

    if (!(error instanceof TipplyHttpError)) {
      return false;
    }

    if (error.status === undefined) {
      return true;
    }

    return error.status === 408 || error.status === 429 || error.status >= 500;
  }

  private async executeRequest<TResponse>(
    request: TipplyTransportRequest<TResponse>,
    requestOptions: RequestOptions,
  ): Promise<TResponse> {
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

      const authCookie = await this.resolveAuthCookie();

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
      this.captureAuthCookie(response.headers);

      const responseBody = await parseResponseBodyAs(response, request.responseType ?? "auto");
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

  private async resolveAuthCookie(): Promise<string | undefined> {
    if (this.authCookieOverrideActive) {
      return this.authCookieOverride;
    }

    return resolveSessionCookie(this.resolvedOptions.session);
  }

  private captureAuthCookie(headers: Headers): void {
    if (!this.resolvedOptions.auth.refreshTokenOnRequests) {
      return;
    }

    for (const setCookie of getSetCookieHeaders(headers)) {
      const authCookie = readCookieValue(setCookie, this.resolvedOptions.transport.cookieName);

      if (!authCookie) {
        continue;
      }

      this.authCookieOverride = authCookie;
      this.authCookieOverrideActive = true;
      return;
    }
  }

  private async refreshViaUser(options: { swallowErrors: boolean }): Promise<void> {
    if (this.refreshInFlight) {
      if (options.swallowErrors) {
        await this.refreshInFlight.catch(() => undefined);
        return;
      }

      await this.refreshInFlight;
      return;
    }

    this.refreshInFlight = this.executeRequest(
      {
        method: "GET",
        path: AUTH_REFRESH_PATH,
        auth: true,
      },
      {},
    ).then(() => undefined);

    try {
      if (options.swallowErrors) {
        await this.refreshInFlight.catch(() => undefined);
        return;
      }

      await this.refreshInFlight;
    } finally {
      this.refreshInFlight = null;
    }
  }
}
