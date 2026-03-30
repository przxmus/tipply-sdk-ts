import { TipplyClientVNext } from "../vnext/client";
import type { TipplyClientOptions } from "../core/types";

/**
 * Creates an authenticated Tipply SDK client.
 *
 * Use this entrypoint when you need access to private account, dashboard,
 * configuration, moderation, payout, and public-read endpoints through a
 * shared authenticated session.
 *
 * @param options - Session configuration and transport overrides for the client.
 * @returns A configured authenticated {@link TipplyClientVNext} instance.
 *
 * @example
 * ```typescript
 * import { createTipplyClient } from "tipply-sdk-ts";
 *
 * const client = createTipplyClient({
 *   authCookie: process.env.TIPPLY_AUTH_COOKIE!,
 * });
 *
 * const me = await client.me.get();
 * ```
 */
export function createTipplyClient(options: TipplyClientOptions = {}): TipplyClientVNext {
  return new TipplyClientVNext(options);
}
