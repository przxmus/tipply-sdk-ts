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

  /** Replaces the user's `TIP_ALERT` configuration. */
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

  /** Replaces the user's `COUNTER_TO_END_LIVE` configuration. */
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

  /** Enables or disables alert display globally. */
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

  /** Enables or disables alert sounds globally. */
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

  /** Reads the forbidden words moderation settings. */
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

  /** Reads the profanity filter moderation settings. */
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
  /** `TIP_ALERT` configuration updates. */
  readonly tipAlerts: TipAlertsSettingsResource;
  /** Countdown configuration updates. */
  readonly countdown: CountdownSettingsResource;
  /** Global alert visibility toggle. */
  readonly alerts: AlertsSettingsResource;
  /** Global alert sound toggle. */
  readonly alertSound: AlertSoundSettingsResource;
  /** Forbidden words moderation settings. */
  readonly forbiddenWords: ForbiddenWordsSettingsResource;
  /** Profanity filter settings. */
  readonly profanityFilter: ProfanityFilterSettingsResource;

  constructor(private readonly transport: TipplyTransport) {
    this.tipAlerts = new TipAlertsSettingsResource(transport);
    this.countdown = new CountdownSettingsResource(transport);
    this.alerts = new AlertsSettingsResource(transport);
    this.alertSound = new AlertSoundSettingsResource(transport);
    this.forbiddenWords = new ForbiddenWordsSettingsResource(transport);
    this.profanityFilter = new ProfanityFilterSettingsResource(transport);
  }

  /** Lists every user configuration record returned by Tipply. */
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
