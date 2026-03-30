export type MaybePromise<T> = T | Promise<T>;
export type FetchLike = typeof fetch;

export type Validator<T> = (value: unknown) => asserts value is T;

export type TipplyRequestScope = "proxy" | "public";

export type RequestQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly (string | number | boolean | null | undefined)[];

export type RequestQuery = Record<string, RequestQueryValue>;

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

export interface TipplyTransportOptions {
  fetch?: FetchLike;
  proxyBaseUrl?: string;
  publicBaseUrl?: string;
  appOrigin?: string;
  cookieName?: string;
  includeCredentials?: boolean;
  timeoutMs?: number;
}

export interface RequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface TipplyClientOptions {
  session?: TipplySessionOptions;
  transport?: TipplyTransportOptions;
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

export interface TipplyRequestOptions<TResponse> {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: RequestQuery;
  body?: unknown;
  requiresAuth?: boolean;
  scope?: "proxy" | "public";
  validator?: Validator<TResponse>;
}

export interface TipplyTransportRequest<TResponse> {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: RequestQuery;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  scope?: TipplyRequestScope;
}

export interface TipplyTransportResponseContext {
  method: string;
  url: string;
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
}

export type TipplyHttpErrorContext = TipplyTransportResponseContext;
