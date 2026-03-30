import { TipplyTransport } from "../../core/transport";
import type { TipAlertsListener, TipAlertsListenerOptions, TipAlertsWidgetUrl } from "../../realtime/tip-alerts";
import { createTipAlertsListenerFromWidgetUrl, PublicTipAlertsListener } from "../../realtime/tip-alerts";
import { MeResource } from "./me";

export class AuthenticatedTipAlertsResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly me: MeResource,
  ) {}

  async createListener(options?: TipAlertsListenerOptions): Promise<TipAlertsListener> {
    const currentUser = await this.me.get();
    return new PublicTipAlertsListener(currentUser.id, this.transport.config.transport.alertSocketBaseUrl, options);
  }

  fromWidgetUrl(widgetUrl: TipAlertsWidgetUrl, options?: TipAlertsListenerOptions): TipAlertsListener {
    return createTipAlertsListenerFromWidgetUrl(widgetUrl, this.transport.config.transport.alertSocketBaseUrl, options);
  }
}
