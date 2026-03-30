import { resolveSessionCookie } from "../../core/options";
import { TipplyTransport } from "../../core/transport";
import { TipAlertCommandClient } from "../../realtime/tip-alert-commands";
import type { TipAlertsListener, TipAlertsListenerOptions, TipAlertsWidgetUrl } from "../../realtime/tip-alerts";
import { createTipAlertsListenerFromWidgetUrl, PublicTipAlertsListener } from "../../realtime/tip-alerts";
import { MeResource } from "./me";

/** Authenticated helpers for public listeners and tip alert websocket commands. */
export class AuthenticatedTipAlertsResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly me: MeResource,
  ) {}

  /** Creates a realtime listener for the authenticated user's public `TIP_ALERT` stream. */
  async createListener(options?: TipAlertsListenerOptions): Promise<TipAlertsListener> {
    const currentUser = await this.me.get();
    return new PublicTipAlertsListener(currentUser.id, this.transport.config.transport.alertSocketBaseUrl, options);
  }

  /** Sends the realtime command that skips the currently displayed alert. */
  async skipCurrent(): Promise<void> {
    const [currentUser, authCookie] = await Promise.all([
      this.me.get(),
      resolveSessionCookie(this.transport.config.session),
    ]);

    return new TipAlertCommandClient(currentUser.id, this.transport.config.transport.commandsSocketBaseUrl, {
      appOrigin: this.transport.config.transport.appOrigin,
      ...(authCookie ? { authCookie } : {}),
      cookieName: this.transport.config.transport.cookieName,
      timeoutMs: this.transport.config.transport.timeoutMs,
    }).skipCurrent();
  }

  /** Creates a listener from a widget URL without first resolving the current user. */
  fromWidgetUrl(widgetUrl: TipAlertsWidgetUrl, options?: TipAlertsListenerOptions): TipAlertsListener {
    return createTipAlertsListenerFromWidgetUrl(widgetUrl, this.transport.config.transport.alertSocketBaseUrl, options);
  }
}
