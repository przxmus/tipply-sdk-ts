import type { MaybePromise } from "../types/common";

export type FetchLike = typeof fetch;

export type Validator<T> = (value: unknown) => asserts value is T;

export type RequestQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly (string | number | boolean | null | undefined)[];

export type RequestQuery = Record<string, RequestQueryValue>;

export interface TipplyClientOptions {
  accessToken?: string;
  getAccessToken?: () => MaybePromise<string | null | undefined>;
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

export interface TipplyHttpErrorContext {
  method: string;
  url: string;
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
}
