import { z, type ZodType } from "zod";

import { TipplyResponseValidationError } from "../core/errors";
import type { TipplyTransportResponseContext } from "../core/types";

export const unknownRecordSchema = z.record(z.string(), z.unknown());
export const isoDateStringSchema = z.string();
export const minorUnitAmountSchema = z.number();

export function parseWithSchema<TOutput>(
  schema: ZodType<TOutput>,
  value: unknown,
  context: TipplyTransportResponseContext,
  message = "Response validation failed.",
): TOutput {
  const parsed = schema.safeParse(value);

  if (parsed.success) {
    return parsed.data;
  }

  throw new TipplyResponseValidationError(
    `${message} ${parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
      .join("; ")}`,
    context,
  );
}
