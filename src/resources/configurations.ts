import { assertArray, assertBoolean, assertPlainObject } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type {
  CounterToEndLiveConfiguration,
  ForbiddenWordsResponse,
  ProfanityFilterResponse,
  TipAlertConfiguration,
  ToggleDisabledResponse,
  UserConfigurationRecord,
} from "../types/configurations";

function assertUserConfigurations(value: unknown): asserts value is UserConfigurationRecord[] {
  assertArray(value, { method: "GET", url: "/user/configuration" });
}

function assertToggleResponse(value: unknown): asserts value is ToggleDisabledResponse {
  assertPlainObject(value, { method: "PATCH", url: "/user/configuration/toggle-alerts" });
  assertBoolean(value.disabled, { method: "PATCH", url: "/user/configuration/toggle-alerts" }, "Expected disabled flag");
}

function assertForbiddenWordsResponse(value: unknown): asserts value is ForbiddenWordsResponse {
  assertPlainObject(value, { method: "GET", url: "/user/configuration/global/forbidden_words" });
}

function assertProfanityFilterResponse(value: unknown): asserts value is ProfanityFilterResponse {
  assertPlainObject(value, { method: "GET", url: "/user/configuration/global/profanity_filter" });
  assertBoolean(value.enabled, { method: "GET", url: "/user/configuration/global/profanity_filter" }, "Expected enabled flag");
}

export class ConfigurationsApi {
  constructor(private readonly httpClient: HttpClient) {}

  list(): Promise<UserConfigurationRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/configuration",
      requiresAuth: true,
      validator: assertUserConfigurations,
    });
  }

  updateTipAlert(payload: TipAlertConfiguration): Promise<void> {
    return this.httpClient.request({
      method: "PUT",
      path: "/user/configuration/TIP_ALERT",
      body: payload,
      requiresAuth: true,
    });
  }

  updateCountdown(payload: CounterToEndLiveConfiguration): Promise<void> {
    return this.httpClient.request({
      method: "PUT",
      path: "/user/configuration/COUNTER_TO_END_LIVE",
      body: payload,
      requiresAuth: true,
    });
  }

  toggleAlerts(disabled: boolean): Promise<ToggleDisabledResponse> {
    return this.httpClient.request({
      method: "PATCH",
      path: "/user/configuration/toggle-alerts",
      body: { disabled },
      requiresAuth: true,
      validator: assertToggleResponse,
    });
  }

  toggleAlertSound(disabled: boolean): Promise<ToggleDisabledResponse> {
    return this.httpClient.request({
      method: "PATCH",
      path: "/user/configuration/toggle-alerts-sound",
      body: { disabled },
      requiresAuth: true,
      validator: assertToggleResponse,
    });
  }

  getForbiddenWords(): Promise<ForbiddenWordsResponse> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/configuration/global/forbidden_words",
      requiresAuth: true,
      validator: assertForbiddenWordsResponse,
    });
  }

  getProfanityFilter(): Promise<ProfanityFilterResponse> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/configuration/global/profanity_filter",
      requiresAuth: true,
      validator: assertProfanityFilterResponse,
    });
  }
}
