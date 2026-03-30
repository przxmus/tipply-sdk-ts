import type { MinorUnitAmount, UnknownConfiguration, UnknownThresholdEntry, UserConfigurationType } from "./shared";

/** Configuration for the `COUNTER_TO_END_LIVE` widget. */
export interface CounterToEndLiveConfiguration {
  priceFromAddTime: MinorUnitAmount;
  extraTime: number;
  startDate: string;
  twitchActivityTimer: number;
  showDays: boolean;
  addTimeWithoutCommission: boolean;
  kickActivityTimer: number;
  isCountdownRunning: boolean;
}

/** Global moderation settings grouped under the `GLOBAL` configuration record. */
export interface GlobalConfiguration {
  forbiddenWords: string[];
  profanityFilterEnabled: boolean;
}

/** Text-to-speech configuration for voice messages in tip alerts. */
export interface TipAlertVoiceMessagesConfiguration {
  enabled: boolean;
  amount: MinorUnitAmount;
}

/** Delay settings applied before showing queued tips. */
export interface TipAlertDelayConfiguration {
  enabled: boolean;
  delay: number;
}

/** Default sound selection used by the tip alert widget. */
export interface TipAlertDefaultSoundSelection {
  fileId: string;
  fileName: string;
  volume: number;
  mediumId: number | string;
}

/** Default template selection used by the tip alert widget. */
export interface TipAlertDefaultTemplateSelection {
  templateId: string;
}

/** Threshold-driven speech synthesis settings for tip alerts. */
export interface TipAlertSynthThreshold {
  options: {
    volume: number;
    readAmount: boolean;
    readMessage: boolean;
    readNickname: boolean;
    readLink: boolean;
    interLink: boolean;
  };
  voiceType: string;
  amount: MinorUnitAmount;
  templateId: string;
}

/** Visual and threshold settings for tip alert sounds, templates, and synthesis. */
export interface TipAlertDisplaySettings {
  defaults: {
    sounds: TipAlertDefaultSoundSelection;
    templates: TipAlertDefaultTemplateSelection;
  };
  thresholds: {
    sounds: UnknownThresholdEntry[];
    templates: UnknownThresholdEntry[];
    synth: TipAlertSynthThreshold[];
  };
}

/** Full `TIP_ALERT` configuration record. */
export interface TipAlertConfiguration {
  voiceMessages: TipAlertVoiceMessagesConfiguration;
  delayingTips: TipAlertDelayConfiguration;
  displaySettings: TipAlertDisplaySettings;
  twitchActivityTimer: number;
  kickActivityTimer: number;
}

/** Public and private configuration for the `TIPS_GOAL` widget. */
export interface TipsGoalConfiguration {
  goalValue: MinorUnitAmount;
  goalName: string;
  sumPaymentsFrom: string | Record<string, unknown>;
  amountWithoutCommission: boolean;
}

/** Result returned by alert visibility and sound toggle endpoints. */
export interface ToggleDisabledResult {
  disabled: boolean;
}

/** Forbidden words moderation settings. */
export interface ForbiddenWordsSettings {
  enabled: boolean;
  words: string[];
}

/** Profanity filter enablement state. */
export interface ProfanityFilterSettings {
  enabled: boolean;
}

/** Generic user configuration record keyed by Tipply configuration type. */
export interface UserConfigurationRecord<TType extends string = UserConfigurationType, TConfig = UnknownConfiguration> {
  type: TType;
  config: TConfig;
}

/** Discriminated union of known user configuration records exposed by the SDK. */
export type UserConfiguration =
  | UserConfigurationRecord<"COUNTER_TO_END_LIVE", CounterToEndLiveConfiguration>
  | UserConfigurationRecord<"GLOBAL", GlobalConfiguration>
  | UserConfigurationRecord<"LARGEST_DONATES", UnknownConfiguration>
  | UserConfigurationRecord<"LATEST_DONATES", UnknownConfiguration>
  | UserConfigurationRecord<"TIP_ALERT", TipAlertConfiguration>
  | UserConfigurationRecord<"TIPS_GOAL", TipsGoalConfiguration>
  | UserConfigurationRecord;
