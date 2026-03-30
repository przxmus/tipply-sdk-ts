import type { TipplyTransportResponseContext } from "./types";

/** Base class for SDK-specific errors enriched with request metadata. */
export class TipplyError extends Error {
  /** Stable machine-readable error code. */
  readonly code: string;
  /** HTTP method used for the failed request. */
  readonly method: string;
  /** Resolved request URL or path associated with the failure. */
  readonly url: string;
  /** HTTP status when a response was received. */
  readonly status: number | undefined;
  /** Response headers captured for the failure, when available. */
  readonly headers: Record<string, string> | undefined;
  /** Parsed response body associated with the failure, when available. */
  readonly body: unknown;

  constructor(message: string, code: string, context: TipplyTransportResponseContext) {
    super(message);
    this.name = "TipplyError";
    this.code = code;
    this.method = context.method;
    this.url = context.url;
    this.status = context.status;
    this.headers = context.headers;
    this.body = context.body;
  }
}

/** Raised when an HTTP request fails, times out, or is aborted. */
export class TipplyHttpError extends TipplyError {
  constructor(message: string, context: TipplyTransportResponseContext) {
    super(message, "HTTP_ERROR", context);
    this.name = "TipplyHttpError";
  }
}

/** Raised when Tipply rejects the provided authentication context. */
export class TipplyAuthenticationError extends TipplyHttpError {
  constructor(message: string, context: TipplyTransportResponseContext) {
    super(message, context);
    this.name = "TipplyAuthenticationError";
    Object.defineProperty(this, "code", {
      value: "AUTHENTICATION_ERROR",
      enumerable: true,
      configurable: true,
      writable: false,
    });
  }
}

/** Raised when a payload cannot be validated against the expected schema. */
export class TipplyResponseValidationError extends TipplyError {
  constructor(message: string, context: TipplyTransportResponseContext) {
    super(message, "RESPONSE_VALIDATION_ERROR", context);
    this.name = "TipplyResponseValidationError";
  }
}

/** Raised when the client configuration is inconsistent for the requested operation. */
export class TipplyConfigurationError extends TipplyError {
  constructor(message: string, context: TipplyTransportResponseContext) {
    super(message, "CONFIGURATION_ERROR", context);
    this.name = "TipplyConfigurationError";
  }
}

/** Backward-compatible alias for `TipplyAuthenticationError`. */
export class TipplyAuthError extends TipplyAuthenticationError {}

/** Backward-compatible alias for `TipplyResponseValidationError`. */
export class TipplyValidationError extends TipplyResponseValidationError {}
