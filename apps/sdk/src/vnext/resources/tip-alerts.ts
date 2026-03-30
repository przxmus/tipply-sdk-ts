import { resolveSessionCookie } from "../../core/options";
import { TipplyTransport } from "../../core/transport";
import { TipAlertCommandClient } from "../../realtime/tip-alert-commands";
import type { TipAlertsListener, TipAlertsListenerOptions, TipAlertsWidgetUrl } from "../../realtime/tip-alerts";
import { createTipAlertsListenerFromWidgetUrl, PublicTipAlertsListener } from "../../realtime/tip-alerts";
import { MeResource } from "./me";

/**
 * Authenticated helpers for realtime tip alerts.
 *
 * Use this namespace when you want to create a listener for the current user or
 * send the realtime command that skips the alert currently displayed by Tipply.
 */
export class AuthenticatedTipAlertsResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly me: MeResource,
  ) {}

  /**
   * Creates a realtime listener for the authenticated user's `TIP_ALERT` stream.
   *
   * @param options - Listener configuration such as reconnection behavior.
   * @returns A disconnected {@link TipAlertsListener} for the current authenticated user.
   *
   * @throws {TipplyAuthenticationError} If the current session is missing or rejected.
   * @throws {TipplyHttpError} If loading the current user fails.
   */
  async createListener(options?: TipAlertsListenerOptions): Promise<TipAlertsListener> {
    const currentUser = await this.me.get();
    return new PublicTipAlertsListener(currentUser.id, this.transport.config.transport.alertSocketBaseUrl, options);
  }

  /**
   * Sends the realtime command that skips the currently displayed alert.
   *
   * @returns A promise that resolves after the command is accepted by the socket.
   *
   * @throws {TipplyAuthenticationError} If the current session is missing or rejected.
   * @throws {TipplyHttpError} If the current user cannot be resolved before sending the command.
   * @throws {Error} If the realtime command socket fails or times out.
   *
   * @example
   * ```typescript
   * await client.tipAlerts.skipCurrent();
   * ```
   */
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

  /**
   * Creates a public listener from a widget URL without resolving the current user first.
   *
   * @param widgetUrl - A full `TIP_ALERT` widget URL or raw widget path.
   * @param options - Listener configuration such as reconnection behavior.
   * @returns A disconnected {@link TipAlertsListener}.
   *
   * @throws {Error} If {@link widgetUrl} does not contain a valid `TIP_ALERT` user path.
   */
  fromWidgetUrl(widgetUrl: TipAlertsWidgetUrl, options?: TipAlertsListenerOptions): TipAlertsListener {
    return createTipAlertsListenerFromWidgetUrl(widgetUrl, this.transport.config.transport.alertSocketBaseUrl, options);
  }
}
