import type { TipplyTransportResponseContext } from "./types";

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

export class TipplyHttpError extends TipplyError {
  constructor(message: string, context: TipplyTransportResponseContext) {
    super(message, "HTTP_ERROR", context);
    this.name = "TipplyHttpError";
  }
}

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

export class TipplyResponseValidationError extends TipplyError {
  constructor(message: string, context: TipplyTransportResponseContext) {
    super(message, "RESPONSE_VALIDATION_ERROR", context);
    this.name = "TipplyResponseValidationError";
  }
}

export class TipplyConfigurationError extends TipplyError {
  constructor(message: string, context: TipplyTransportResponseContext) {
    super(message, "CONFIGURATION_ERROR", context);
    this.name = "TipplyConfigurationError";
  }
}

export class TipplyAuthError extends TipplyAuthenticationError {}

export class TipplyValidationError extends TipplyResponseValidationError {}
