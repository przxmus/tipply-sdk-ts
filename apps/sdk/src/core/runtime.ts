import { TipplyValidationError } from "./errors";
import type { TipplyHttpErrorContext } from "./types";

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function assertPlainObject(value: unknown, context: TipplyHttpErrorContext, message = "Expected object response"): asserts value is Record<string, unknown> {
  if (!isPlainObject(value)) {
    throw new TipplyValidationError(message, context);
  }
}

export function assertArray(value: unknown, context: TipplyHttpErrorContext, message = "Expected array response"): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new TipplyValidationError(message, context);
  }
}

export function assertBoolean(value: unknown, context: TipplyHttpErrorContext, message = "Expected boolean response"): asserts value is boolean {
  if (typeof value !== "boolean") {
    throw new TipplyValidationError(message, context);
  }
}

export function assertNumber(value: unknown, context: TipplyHttpErrorContext, message = "Expected numeric response"): asserts value is number {
  if (typeof value !== "number") {
    throw new TipplyValidationError(message, context);
  }
}

export function assertString(value: unknown, context: TipplyHttpErrorContext, message = "Expected string value"): asserts value is string {
  if (typeof value !== "string") {
    throw new TipplyValidationError(message, context);
  }
}
