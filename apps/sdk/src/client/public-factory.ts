import { TipplyPublicClient } from "../vnext/public-client";
import type { TipplyClientOptions } from "../core/types";

/**
 * Creates a public Tipply SDK client.
 *
 * Use this entrypoint when you only need unauthenticated widget, template, or
 * realtime `TIP_ALERT` access.
 *
 * @param options - Transport overrides for the public client.
 * @returns A configured public {@link TipplyPublicClient} instance.
 *
 * @example
 * ```typescript
 * import { asUserId } from "tipply-sdk-ts";
 * import { createTipplyPublicClient } from "tipply-sdk-ts/public";
 *
 * const client = createTipplyPublicClient();
 * const widgetMessageEnabled = await client.user(asUserId("user-123")).widgetMessage.get();
 * ```
 */
export function createTipplyPublicClient(options: TipplyClientOptions = {}): TipplyPublicClient {
  return new TipplyPublicClient(options);
}
