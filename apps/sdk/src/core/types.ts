/** A value that can be returned synchronously or asynchronously. */
export type MaybePromise<T> = T | Promise<T>;

/** A fetch-compatible function used by the transport layer. */
export type FetchLike = typeof fetch;

/** An assertion function that validates and narrows a response payload. */
export type Validator<T> = (value: unknown) => asserts value is T;

/** Selects whether a request should use the authenticated proxy or public API base URL. */
export type TipplyRequestScope = "proxy" | "public";

/** Supported query parameter value shapes accepted by the request helpers. */
export type RequestQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly (string | number | boolean | null | undefined)[];

/** A query-string object passed to transport requests. */
export type RequestQuery = Record<string, RequestQueryValue>;

/**
 * Session configuration used for authenticated requests.
 *
 * You can provide a static cookie, a lazy cookie resolver, or rely on the
 * current browser session when credentials are included by `fetch`.
 */
export type TipplySessionOptions =
  | {
      /** The raw Tipply authentication cookie value. */
      authCookie: string;
    }
  | {
      /** Resolves the raw Tipply authentication cookie value on demand. */
      getAuthCookie: () => MaybePromise<string | null | undefined>;
    }
  | {
      /** Uses browser-managed cookies instead of setting the auth header manually. */
      browserSession: true;
    };

/** Low-level transport overrides shared by authenticated and public clients. */
export interface TipplyTransportOptions {
  /** Custom `fetch` implementation used for HTTP requests. */
  fetch?: FetchLike;
  /** Base URL for authenticated proxy endpoints. */
  proxyBaseUrl?: string;
  /** Base URL for public API endpoints. */
  publicBaseUrl?: string;
  /** Base URL for the public tip alerts socket server. */
  alertSocketBaseUrl?: string;
  /** Base URL for the authenticated tip alert command socket server. */
  commandsSocketBaseUrl?: string;
  /** Application origin forwarded on authenticated requests and websocket commands. */
  appOrigin?: string;
  /** Cookie name used when attaching auth cookies manually. */
  cookieName?: string;
  /** Whether requests should include browser-managed credentials. */
  includeCredentials?: boolean;
  /** Default request timeout in milliseconds. */
  timeoutMs?: number;
}

/** Per-request overrides accepted by resource methods. */
export interface RequestOptions {
  /** Abort signal forwarded to the underlying fetch request. */
  signal?: AbortSignal;
  /** Overrides the default transport timeout for a single request. */
  timeoutMs?: number;
}

/**
 * High-level SDK client configuration.
 *
 * The shorthand auth and transport fields are normalized into the internal
 * session and transport configuration during client creation.
 */
export interface TipplyClientOptions {
  /** Explicit session configuration for authenticated operations. */
  session?: TipplySessionOptions;
  /** Low-level transport overrides. */
  transport?: TipplyTransportOptions;
  /** Enables schema validation for parsed responses. */
  validation?: boolean;
  /** Shorthand for `session: { authCookie }`. */
  authCookie?: string;
  /** Shorthand for `session: { getAuthCookie }`. */
  getAuthCookie?: () => MaybePromise<string | null | undefined>;
  /** Shorthand for `transport.cookieName`. */
  cookieName?: string;
  /** Shorthand for `transport.includeCredentials`. */
  includeCredentials?: boolean;
  /** Shorthand for `transport.appOrigin`. */
  appOrigin?: string;
  /** Shorthand for `transport.fetch`. */
  fetch?: FetchLike;
  /** Shorthand for `transport.proxyBaseUrl`. */
  proxyBaseUrl?: string;
  /** Shorthand for `transport.publicBaseUrl`. */
  publicBaseUrl?: string;
  /** Backward-compatible alias for `validation`. */
  validateResponses?: boolean;
}

/** Metadata describing a typed SDK resource request before it reaches the transport layer. */
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

/** Context attached to transport and validation errors. */
export interface TipplyTransportResponseContext {
  method: string;
  url: string;
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
}

/** Alias kept for compatibility with older error typing. */
export type TipplyHttpErrorContext = TipplyTransportResponseContext;
