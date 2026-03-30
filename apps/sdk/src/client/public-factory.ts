import { TipplyClient } from "../client";
import type { TipplyClientOptions } from "../core/types";

/**
 * Creates a Tipply client intended for public, unauthenticated API access.
 *
 * The implementation is unified with the main client and relies on callers to
 * avoid authenticated operations until the dedicated public surface is
 * finalized.
 */
export function createTipplyPublicClient(options: TipplyClientOptions = {}): TipplyClient {
  return new TipplyClient(options);
}
