import { TipplyClientVNext } from "../vnext/client";
import type { TipplyClientOptions } from "../core/types";

/**
 * Creates a Tipply client instance.
 *
 * This is the vNext root factory entrypoint. During the rewrite it delegates to
 * the existing client implementation until the new domain surface is fully
 * migrated.
 */
export function createTipplyClient(options: TipplyClientOptions = {}): TipplyClientVNext {
  return new TipplyClientVNext(options);
}
