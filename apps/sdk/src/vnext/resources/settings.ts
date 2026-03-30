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

  /**
   * Replaces the user's `TIP_ALERT` configuration.
   *
   * @param input - The full tip alert configuration payload.
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A promise that resolves when Tipply accepts the update.
   */
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

  /**
   * Replaces the user's `COUNTER_TO_END_LIVE` configuration.
   *
   * @param input - The full countdown configuration payload.
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A promise that resolves when Tipply accepts the update.
   */
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

  /**
   * Enables or disables alerts globally.
   *
   * @param disabled - Whether alerts should be disabled.
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The disabled state reported by Tipply after the update.
   */
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

  /**
   * Enables or disables alert sounds globally.
   *
   * @param disabled - Whether alert sounds should be disabled.
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The disabled state reported by Tipply after the update.
   */
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

  /**
   * Loads forbidden words settings.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The forbidden words configuration returned by Tipply.
   */
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

  /**
   * Loads profanity filter settings.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The profanity filter configuration returned by Tipply.
   */
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

  /**
   * Lists all user configuration records available to the authenticated account.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The list of Tipply configuration records.
   */
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
