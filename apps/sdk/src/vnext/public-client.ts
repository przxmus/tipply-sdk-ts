import type { TipplyClientOptions } from "../core/types";
import { TipplyTransport } from "../core/transport";
import type { UserId } from "../domain/ids";
import { PublicRootResource, type PublicRootTipAlertsResource } from "./resources/public";

export class TipplyPublicClient {
  readonly public: PublicRootResource;
  readonly tipAlerts: PublicRootTipAlertsResource;

  private readonly transport: TipplyTransport;

  constructor(options: TipplyClientOptions = {}) {
    this.transport = new TipplyTransport(options);
    this.public = new PublicRootResource(this.transport);
    this.tipAlerts = this.public.tipAlerts;
  }

  user(userId: UserId) {
    return this.public.user(userId);
  }
}
