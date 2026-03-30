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
 * This is the main entrypoint for private account, dashboard, configuration,
 * moderation, and public-read operations that benefit from a shared session.
 */
export class TipplyClientVNext {
  /** Current authenticated user endpoints. */
  readonly me: MeResource;
  /** Dashboard statistics, announcements, and notifications. */
  readonly dashboard: DashboardResource;
  /** Profile management and public profile reads. */
  readonly profile: ProfileResource;
  /** Payment method reads and updates. */
  readonly paymentMethods: PaymentMethodsResource;
  /** User configuration endpoints. */
  readonly settings: SettingsResource;
  /** Goals and goal voting endpoints. */
  readonly goals: GoalsResource;
  /** Template listing and replacement endpoints. */
  readonly templates: TemplatesResource;
  /** Tip listing, moderation, and resend operations. */
  readonly tips: TipsResource;
  /** Moderator management endpoints. */
  readonly moderators: ModeratorsResource;
  /** Media library reads and format inspection. */
  readonly media: MediaResource;
  /** Withdrawal history, payout accounts, and confirmation PDFs. */
  readonly withdrawals: WithdrawalsResource;
  /** Generated report listing. */
  readonly reports: ReportsResource;
  /** Realtime tip alerts helpers for authenticated users. */
  readonly tipAlerts: AuthenticatedTipAlertsResource;
  /** Public endpoints available from the authenticated client. */
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

  /** Clones the client with a different session configuration. */
  withSession(session: TipplySessionOptions): TipplyClientVNext {
    return new TipplyClientVNext({
      ...this.options,
      session,
    });
  }

  /** Clones the client with a static auth cookie. */
  withAuthCookie(authCookie: string): TipplyClientVNext {
    return this.withSession({ authCookie });
  }
}
