import type { TipplyClientOptions, TipplySessionOptions } from "../core/types";
import { TipplyTransport } from "../core/transport";
import { DashboardResource } from "./resources/dashboard";
import { GoalsResource } from "./resources/goals";
import { MeResource } from "./resources/me";
import { PaymentMethodsResource } from "./resources/payment-methods";
import { ProfileResource } from "./resources/profile";
import { SettingsResource } from "./resources/settings";
import { TemplatesResource } from "./resources/templates";

/**
 * Internal vNext client under active migration.
 */
export class TipplyClientVNext {
  readonly me: MeResource;
  readonly dashboard: DashboardResource;
  readonly profile: ProfileResource;
  readonly paymentMethods: PaymentMethodsResource;
  readonly settings: SettingsResource;
  readonly goals: GoalsResource;
  readonly templates: TemplatesResource;

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
  }

  withSession(session: TipplySessionOptions): TipplyClientVNext {
    return new TipplyClientVNext({
      ...this.options,
      session,
    });
  }

  withAuthCookie(authCookie: string): TipplyClientVNext {
    return this.withSession({ authCookie });
  }
}
