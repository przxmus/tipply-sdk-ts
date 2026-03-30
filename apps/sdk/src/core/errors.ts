import type { TipplyTransportResponseContext } from "./types";

/** Base class for SDK errors enriched with HTTP request context. */
export class TipplyError extends Error {
  readonly code: string;
  readonly method: string;
  readonly url: string;
  readonly status: number | undefined;
  readonly headers: Record<string, string> | undefined;
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

/** Raised when a response payload cannot be validated against the expected schema. */
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

/** Backward-compatible alias for {@link TipplyAuthenticationError}. */
export class TipplyAuthError extends TipplyAuthenticationError {}

/** Backward-compatible alias for {@link TipplyResponseValidationError}. */
export class TipplyValidationError extends TipplyResponseValidationError {}
