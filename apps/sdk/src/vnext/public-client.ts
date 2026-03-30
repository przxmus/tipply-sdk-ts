import type { TipplyClientOptions } from "../core/types";
import { TipplyTransport } from "../core/transport";
import type { UserId } from "../domain/ids";
import { PublicRootResource, type PublicRootTipAlertsResource } from "./resources/public";

/** Public-only Tipply SDK client for unauthenticated endpoints and realtime listeners. */
export class TipplyPublicClient {
  /** Root namespace for public HTTP endpoints. */
  readonly public: PublicRootResource;
  /** Shortcut namespace for public realtime tip alert helpers. */
  readonly tipAlerts: PublicRootTipAlertsResource;

  private readonly transport: TipplyTransport;

  constructor(options: TipplyClientOptions = {}) {
    this.transport = new TipplyTransport(options);
    this.public = new PublicRootResource(this.transport);
    this.tipAlerts = this.public.tipAlerts;
  }

  /** Returns the public resource scope for a specific Tipply user. */
  user(userId: UserId) {
    return this.public.user(userId);
  }
}
