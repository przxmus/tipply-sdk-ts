/** A value that can be produced synchronously or asynchronously. */
export type MaybePromise<T> = T | Promise<T>;
/** A `fetch`-compatible implementation used by the SDK transport layer. */
export type FetchLike = typeof fetch;

/** Assertion function used to validate transport responses. */
export type Validator<T> = (value: unknown) => asserts value is T;

/** Selects whether a request should use the authenticated proxy or public API. */
export type TipplyRequestScope = "proxy" | "public";

/** Supported query value shapes accepted by SDK request builders. */
export type RequestQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly (string | number | boolean | null | undefined)[];

/** Object form used to serialize URL query parameters. */
export type RequestQuery = Record<string, RequestQueryValue>;

/** Session strategies supported by authenticated clients. */
export type TipplySessionOptions =
  | {
      authCookie: string;
    }
  | {
      getAuthCookie: () => MaybePromise<string | null | undefined>;
    }
  | {
      browserSession: true;
    };

/** Enables periodic auth token refreshes through the authenticated `/user` endpoint. */
export interface TipplyTokenRefreshIntervalOptions {
  intervalMs?: number;
}

/** Auth token lifecycle and retry behavior for authenticated HTTP requests. */
export interface TipplyAuthLifecycleOptions {
  refreshTokenOnRequests?: boolean;
  refreshTokenEvery?: boolean | TipplyTokenRefreshIntervalOptions;
  reconnectTries?: number | false;
}

/** Low-level transport overrides for HTTP and websocket endpoints. */
export interface TipplyTransportOptions {
  fetch?: FetchLike;
  proxyBaseUrl?: string;
  publicBaseUrl?: string;
  alertSocketBaseUrl?: string;
  commandsSocketBaseUrl?: string;
  appOrigin?: string;
  cookieName?: string;
  includeCredentials?: boolean;
  timeoutMs?: number;
}

/** Per-request overrides accepted by resource methods. */
export interface RequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

/** Top-level configuration accepted by {@link createTipplyClient} and {@link createTipplyPublicClient}. */
export interface TipplyClientOptions {
  session?: TipplySessionOptions;
  transport?: TipplyTransportOptions;
  auth?: TipplyAuthLifecycleOptions;
  validation?: boolean;
  authCookie?: string;
  getAuthCookie?: () => MaybePromise<string | null | undefined>;
  cookieName?: string;
  includeCredentials?: boolean;
  appOrigin?: string;
  fetch?: FetchLike;
  proxyBaseUrl?: string;
  publicBaseUrl?: string;
  validateResponses?: boolean;
}

/** Normalized request metadata used by high-level request helpers. */
export interface TipplyRequestOptions<TResponse> {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: RequestQuery;
  body?: unknown;
  requiresAuth?: boolean;
  scope?: "proxy" | "public";
  validator?: Validator<TResponse>;
}

/** Low-level transport request descriptor. */
export interface TipplyTransportRequest<TResponse> {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: RequestQuery;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  scope?: TipplyRequestScope;
  responseType?: "auto" | "text" | "arrayBuffer";
}

/** Context captured for transport and validation errors. */
export interface TipplyTransportResponseContext {
  method: string;
  url: string;
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
}

/** Backward-compatible alias for HTTP error context. */
export type TipplyHttpErrorContext = TipplyTransportResponseContext;
