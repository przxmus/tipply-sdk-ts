import { HttpClient } from "./core/http";
import type { TipplyClientOptions } from "./core/types";
import { ConfigurationsApi } from "./resources/configurations";
import { DashboardApi } from "./resources/dashboard";
import { GoalsApi } from "./resources/goals";
import { IdentityApi } from "./resources/identity";
import { PaymentMethodsApi } from "./resources/payment-methods";
import { ProfileApi } from "./resources/profile";
import { PublicApi } from "./resources/public";
import { TemplatesApi } from "./resources/templates";

export class TipplyClient {
  readonly identity: IdentityApi;
  readonly dashboard: DashboardApi;
  readonly profile: ProfileApi;
  readonly paymentMethods: PaymentMethodsApi;
  readonly configurations: ConfigurationsApi;
  readonly goals: GoalsApi;
  readonly templates: TemplatesApi;
  readonly public: PublicApi;

  private readonly options: TipplyClientOptions;
  private readonly httpClient: HttpClient;

  constructor(options: TipplyClientOptions = {}) {
    this.options = { ...options };
    this.httpClient = new HttpClient(options);
    this.identity = new IdentityApi(this.httpClient);
    this.dashboard = new DashboardApi(this.httpClient);
    this.profile = new ProfileApi(this.httpClient);
    this.paymentMethods = new PaymentMethodsApi(this.httpClient);
    this.configurations = new ConfigurationsApi(this.httpClient);
    this.goals = new GoalsApi(this.httpClient);
    this.templates = new TemplatesApi(this.httpClient);
    this.public = new PublicApi(this.httpClient);
  }

  withAccessToken(accessToken: string): TipplyClient {
    const nextOptions: TipplyClientOptions = { accessToken };

    if (this.options.fetch) {
      nextOptions.fetch = this.options.fetch;
    }

    if (this.options.proxyBaseUrl) {
      nextOptions.proxyBaseUrl = this.options.proxyBaseUrl;
    }

    if (this.options.publicBaseUrl) {
      nextOptions.publicBaseUrl = this.options.publicBaseUrl;
    }

    if (this.options.validateResponses !== undefined) {
      nextOptions.validateResponses = this.options.validateResponses;
    }

    return new TipplyClient(nextOptions);
  }
}
