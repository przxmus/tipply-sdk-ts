import { z, type ZodType } from "zod";
import type { TipplyTransportResponseContext } from "../core/types";

export const unknownRecordSchema = z.record(z.string(), z.unknown());
export const isoDateStringSchema = z.string();
export const minorUnitAmountSchema = z.number();

function toCamelCaseSegment(input: string): string {
  return input.replace(/[_-]([a-zA-Z0-9])/g, (_, letter: string) =>
    /[a-z]/.test(letter) ? letter.toUpperCase() : letter,
  );
}

export function camelizeValue<TValue>(value: TValue): TValue {
  if (Array.isArray(value)) {
    return value.map((entry) => camelizeValue(entry)) as TValue;
  }

  if (value && typeof value === "object" && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [toCamelCaseSegment(key), camelizeValue(entry)]),
    ) as TValue;
  }

  return value;
}

export function parseWithSchema<TOutput>(
  schema: ZodType<TOutput>,
  value: unknown,
  context: TipplyTransportResponseContext,
  message = "Response validation failed.",
  fallback?: (value: unknown) => TOutput,
): TOutput {
  const parsed = schema.safeParse(value);

  if (parsed.success) {
    return parsed.data;
  }

  void context;
  void message;

  if (fallback) {
    return fallback(value);
  }

  return camelizeValue(value) as TOutput;
}
