import type { TipplyClientOptions } from "../core/types";
import { TipplyTransport } from "../core/transport";
import type { UserId } from "../domain/ids";
import { PublicRootResource, type PublicRootTipAlertsResource } from "./resources/public";

/**
 * Public-only Tipply SDK client.
 *
 * This client is intended for unauthenticated widget, template, voting, and
 * realtime `TIP_ALERT` reads.
 *
 * @example
 * ```typescript
 * import { asUserId } from "tipply-sdk-ts";
 * import { createTipplyPublicClient } from "tipply-sdk-ts/public";
 *
 * const client = createTipplyPublicClient();
 * const goalTemplates = await client.user(asUserId("user-123")).goals.templates.list();
 * ```
 */
export class TipplyPublicClient {
  readonly public: PublicRootResource;
  readonly tipAlerts: PublicRootTipAlertsResource;

  private readonly transport: TipplyTransport;

  constructor(options: TipplyClientOptions = {}) {
    this.transport = new TipplyTransport(options);
    this.public = new PublicRootResource(this.transport);
    this.tipAlerts = this.public.tipAlerts;
  }

  /**
   * Opens the public resource scope for a specific user.
   *
   * @param userId - The Tipply user identifier to read public data for.
   * @returns A scoped public resource object for the selected user.
   */
  user(userId: UserId) {
    return this.public.user(userId);
  }
}
