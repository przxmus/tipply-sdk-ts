import type { ZodType } from "zod";

import { parseWithSchema } from "../domain/parsing";
import type { RequestOptions, TipplyTransportRequest } from "../core/types";
import { TipplyTransport } from "../core/transport";

/** Executes a transport request and parses the response with the provided Zod schema. */
export async function requestAndParse<TOutput>(
  transport: TipplyTransport,
  request: TipplyTransportRequest<unknown>,
  schema: ZodType<TOutput>,
  requestOptions?: RequestOptions,
  message?: string,
  fallback?: (value: unknown) => TOutput,
): Promise<TOutput> {
  const response = await transport.request<unknown>(request, requestOptions);

  return parseWithSchema(
    schema,
    response,
    {
      method: request.method,
      url: request.path,
    },
    message,
    fallback,
  );
}
