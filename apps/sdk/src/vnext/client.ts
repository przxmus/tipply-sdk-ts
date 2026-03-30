import type { TipplyClientOptions, TipplySessionOptions } from "../core/types";
import { TipplyTransport } from "../core/transport";
import { DashboardResource } from "./resources/dashboard";
import { GoalsResource } from "./resources/goals";
import { MediaResource } from "./resources/media";
import { MeResource } from "./resources/me";
import { ModeratorsResource } from "./resources/moderators";
import { PaymentMethodsResource } from "./resources/payment-methods";
import { ProfileResource } from "./resources/profile";
import { PublicRootResource } from "./resources/public";
import { ReportsResource } from "./resources/reports";
import { SettingsResource } from "./resources/settings";
import { TemplatesResource } from "./resources/templates";
import { AuthenticatedTipAlertsResource } from "./resources/tip-alerts";
import { TipsResource } from "./resources/tips";
import { WithdrawalsResource } from "./resources/withdrawals";

/**
 * Authenticated Tipply SDK client.
 *
 * This class exposes the full authenticated SDK surface, including account
 * data, settings, moderation, tips, withdrawals, and public read endpoints
 * that can share the same transport configuration.
 *
 * @example
 * ```typescript
 * import { createTipplyClient } from "tipply-sdk-ts";
 *
 * const client = createTipplyClient({
 *   authCookie: process.env.TIPPLY_AUTH_COOKIE!,
 * });
 *
 * const profile = await client.profile.get();
 * ```
 */
export class TipplyClientVNext {
  readonly me: MeResource;
  readonly dashboard: DashboardResource;
  readonly profile: ProfileResource;
  readonly paymentMethods: PaymentMethodsResource;
  readonly settings: SettingsResource;
  readonly goals: GoalsResource;
  readonly templates: TemplatesResource;
  readonly tips: TipsResource;
  readonly moderators: ModeratorsResource;
  readonly media: MediaResource;
  readonly withdrawals: WithdrawalsResource;
  readonly reports: ReportsResource;
  readonly tipAlerts: AuthenticatedTipAlertsResource;
  readonly public: PublicRootResource;

  private readonly options: TipplyClientOptions;
  private readonly transport: TipplyTransport;

  constructor(options: TipplyClientOptions = {}) {
    this.options = { ...options };
    this.transport = new TipplyTransport(options);
    this.me = new MeResource(this.transport);
    this.dashboard = new DashboardResource(this.transport);
    this.profile = new ProfileResource(this.transport);
    this.paymentMethods = new PaymentMethodsResource(this.transport);
    this.settings = new SettingsResource(this.transport);
    this.goals = new GoalsResource(this.transport);
    this.templates = new TemplatesResource(this.transport);
    this.tips = new TipsResource(this.transport);
    this.moderators = new ModeratorsResource(this.transport);
    this.media = new MediaResource(this.transport);
    this.withdrawals = new WithdrawalsResource(this.transport);
    this.reports = new ReportsResource(this.transport);
    this.tipAlerts = new AuthenticatedTipAlertsResource(this.transport, this.me);
    this.public = new PublicRootResource(this.transport);
  }

  /**
   * Clones the client with a different session strategy.
   *
   * @param session - The session configuration to use in the cloned client.
   * @returns A new {@link TipplyClientVNext} instance that reuses the current transport options.
   *
   * @example
   * ```typescript
   * const impersonatedClient = client.withSession({
   *   getAuthCookie: async () => process.env.OTHER_TIPPLY_AUTH_COOKIE,
   * });
   * ```
   */
  withSession(session: TipplySessionOptions): TipplyClientVNext {
    return new TipplyClientVNext({
      ...this.options,
      session,
    });
  }

  /**
   * Clones the client with a static auth cookie.
   *
   * @param authCookie - The raw Tipply `auth_token` cookie value.
   * @returns A new {@link TipplyClientVNext} instance that authenticates with the provided cookie.
   */
  withAuthCookie(authCookie: string): TipplyClientVNext {
    return this.withSession({ authCookie });
  }
}
