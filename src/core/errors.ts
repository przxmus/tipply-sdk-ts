import type { TipplyHttpErrorContext } from "./types";

export class TipplyError extends Error {
  readonly method: string;
  readonly url: string;
  readonly status: number | undefined;
  readonly headers: Record<string, string> | undefined;
  readonly body: unknown;

  constructor(message: string, context: TipplyHttpErrorContext) {
    super(message);
    this.name = "TipplyError";
    this.method = context.method;
    this.url = context.url;
    this.status = context.status;
    this.headers = context.headers;
    this.body = context.body;
  }
}

export class TipplyHttpError extends TipplyError {
  constructor(message: string, context: TipplyHttpErrorContext) {
    super(message, context);
    this.name = "TipplyHttpError";
  }
}

export class TipplyAuthError extends TipplyHttpError {
  constructor(message: string, context: TipplyHttpErrorContext) {
    super(message, context);
    this.name = "TipplyAuthError";
  }
}

export class TipplyValidationError extends TipplyError {
  constructor(message: string, context: TipplyHttpErrorContext) {
    super(message, context);
    this.name = "TipplyValidationError";
  }
}
