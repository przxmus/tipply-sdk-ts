import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import {
  counterToEndLiveConfigurationSchema,
  forbiddenWordsSettingsSchema,
  profanityFilterSettingsSchema,
  tipAlertConfigurationSchema,
  toCounterToEndLiveConfigurationWire,
  toTipAlertConfigurationWire,
  toggleDisabledResultSchema,
  userConfigurationListSchema,
} from "../../domain/settings-schemas";
import type {
  CounterToEndLiveConfiguration,
  ForbiddenWordsSettings,
  ProfanityFilterSettings,
  TipAlertConfiguration,
  ToggleDisabledResult,
  UserConfiguration,
} from "../../domain/settings";
import { requestAndParse } from "../request";

class TipAlertsSettingsResource {
  constructor(private readonly transport: TipplyTransport) {}

  update(input: TipAlertConfiguration, requestOptions?: RequestOptions): Promise<void> {
    return this.transport.request(
      {
        method: "PUT",
        path: "/user/configuration/TIP_ALERT",
        body: toTipAlertConfigurationWire(input),
        auth: true,
      },
      requestOptions,
    );
  }
}

class CountdownSettingsResource {
  constructor(private readonly transport: TipplyTransport) {}

  update(input: CounterToEndLiveConfiguration, requestOptions?: RequestOptions): Promise<void> {
    return this.transport.request(
      {
        method: "PUT",
        path: "/user/configuration/COUNTER_TO_END_LIVE",
        body: toCounterToEndLiveConfigurationWire(input),
        auth: true,
      },
      requestOptions,
    );
  }
}

class AlertsSettingsResource {
  constructor(private readonly transport: TipplyTransport) {}

  toggle(disabled: boolean, requestOptions?: RequestOptions): Promise<ToggleDisabledResult> {
    return requestAndParse(
      this.transport,
      {
        method: "PATCH",
        path: "/user/configuration/toggle-alerts",
        body: { disabled },
        auth: true,
      },
      toggleDisabledResultSchema,
      requestOptions,
      "Invalid alert toggle response.",
    );
  }
}

class AlertSoundSettingsResource {
  constructor(private readonly transport: TipplyTransport) {}

  toggle(disabled: boolean, requestOptions?: RequestOptions): Promise<ToggleDisabledResult> {
    return requestAndParse(
      this.transport,
      {
        method: "PATCH",
        path: "/user/configuration/toggle-alerts-sound",
        body: { disabled },
        auth: true,
      },
      toggleDisabledResultSchema,
      requestOptions,
      "Invalid alert sound toggle response.",
    );
  }
}

class ForbiddenWordsSettingsResource {
  constructor(private readonly transport: TipplyTransport) {}

  get(requestOptions?: RequestOptions): Promise<ForbiddenWordsSettings> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/configuration/global/forbidden_words",
        auth: true,
      },
      forbiddenWordsSettingsSchema,
      requestOptions,
      "Invalid forbidden words response.",
    );
  }
}

class ProfanityFilterSettingsResource {
  constructor(private readonly transport: TipplyTransport) {}

  get(requestOptions?: RequestOptions): Promise<ProfanityFilterSettings> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/configuration/global/profanity_filter",
        auth: true,
      },
      profanityFilterSettingsSchema,
      requestOptions,
      "Invalid profanity filter response.",
    );
  }
}

export class SettingsResource {
  readonly tipAlerts: TipAlertsSettingsResource;
  readonly countdown: CountdownSettingsResource;
  readonly alerts: AlertsSettingsResource;
  readonly alertSound: AlertSoundSettingsResource;
  readonly forbiddenWords: ForbiddenWordsSettingsResource;
  readonly profanityFilter: ProfanityFilterSettingsResource;

  constructor(private readonly transport: TipplyTransport) {
    this.tipAlerts = new TipAlertsSettingsResource(transport);
    this.countdown = new CountdownSettingsResource(transport);
    this.alerts = new AlertsSettingsResource(transport);
    this.alertSound = new AlertSoundSettingsResource(transport);
    this.forbiddenWords = new ForbiddenWordsSettingsResource(transport);
    this.profanityFilter = new ProfanityFilterSettingsResource(transport);
  }

  list(requestOptions?: RequestOptions): Promise<UserConfiguration[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/configuration",
        auth: true,
      },
      userConfigurationListSchema,
      requestOptions,
      "Invalid settings response.",
    );
  }
}
