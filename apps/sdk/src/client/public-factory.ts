import { TipplyPublicClient } from "../vnext/public-client";
import type { TipplyClientOptions } from "../core/types";

/**
 * Creates a public Tipply SDK client.
 *
 * Use this entrypoint when you only need unauthenticated widget, template, or
 * realtime `TIP_ALERT` access, and you already know the internal Tipply
 * `userId` required by the widget endpoints.
 *
 * @param options - Transport overrides for the public client.
 * @returns A configured public {@link TipplyPublicClient} instance.
 *
 * @example
 * ```typescript
 * import { createTipplyClient } from "tipply-sdk-ts";
 * import { createTipplyPublicClient } from "tipply-sdk-ts/public";
 *
 * const authenticated = createTipplyClient({
 *   authCookie: process.env.TIPPLY_AUTH_COOKIE!,
 * });
 * const me = await authenticated.me.get();
 *
 * const client = createTipplyPublicClient();
 * const widgetMessageEnabled = await client.user(me.id).widgetMessage.get();
 * ```
 */
export function createTipplyPublicClient(options: TipplyClientOptions = {}): TipplyPublicClient {
  return new TipplyPublicClient(options);
}
