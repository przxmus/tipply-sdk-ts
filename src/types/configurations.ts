import type { ISODateString, JsonObject, LiteralUnion, MinorUnitAmount } from "./common";

export type UserConfigurationType = LiteralUnion<
  "COUNTER_TO_END_LIVE" | "GLOBAL" | "LARGEST_DONATES" | "LATEST_DONATES" | "TIP_ALERT" | "TIPS_GOAL"
>;

export interface CounterToEndLiveConfiguration {
  priceFromAddTime: MinorUnitAmount;
  extraTime: number;
  startDate: ISODateString;
  twitchActivityTimer: number;
  showDays: boolean;
  addTimeWithoutCommission: boolean;
  kickActivityTimer: number;
  isCountdownRunning: boolean;
}

export interface GlobalConfiguration {
  forbidden_words: string[];
  profanity_filter_enabled: boolean;
}

export interface TipAlertVoiceMessagesConfiguration {
  enable: boolean;
  amount: MinorUnitAmount;
}

export interface TipAlertDelayConfiguration {
  enable: boolean;
  delay: number;
}

export interface TipAlertDefaultSoundSelection {
  fileId: string;
  fileName: string;
  volume: number;
  mediumId: number | string;
}

export interface TipAlertDefaultTemplateSelection {
  templateId: string;
}

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

export interface TipAlertDisplaySettings {
  defaults: {
    sounds: TipAlertDefaultSoundSelection;
    templates: TipAlertDefaultTemplateSelection;
  };
  tresholds: {
    sounds: JsonObject[];
    templates: JsonObject[];
    synth: TipAlertSynthThreshold[];
  };
}

export interface TipAlertConfiguration {
  voiceMessages: TipAlertVoiceMessagesConfiguration;
  delayingTips: TipAlertDelayConfiguration;
  displaySettings: TipAlertDisplaySettings;
  twitchActivityTimer: number;
  kickActivityTimer: number;
}

export interface TipsGoalConfiguration {
  goalValue: MinorUnitAmount;
  goalName: string;
  sumPaymentsFrom: string | JsonObject;
  amountWithoutCommission: boolean;
}

export interface ToggleDisabledResponse {
  disabled: boolean;
}

export interface ForbiddenWordsResponse {
  enabled: boolean;
  words: string[];
}

export interface ProfanityFilterResponse {
  enabled: boolean;
}

export interface BaseUserConfigurationRecord<TType extends string, TConfig> {
  type: TType;
  config: TConfig;
}

export type CounterToEndLiveConfigurationRecord = BaseUserConfigurationRecord<"COUNTER_TO_END_LIVE", CounterToEndLiveConfiguration>;

export type GlobalConfigurationRecord = BaseUserConfigurationRecord<"GLOBAL", GlobalConfiguration>;

export type LargestDonatesConfigurationRecord = BaseUserConfigurationRecord<"LARGEST_DONATES", JsonObject>;

export type LatestDonatesConfigurationRecord = BaseUserConfigurationRecord<"LATEST_DONATES", JsonObject>;

export type TipAlertConfigurationRecord = BaseUserConfigurationRecord<"TIP_ALERT", TipAlertConfiguration>;

export type TipsGoalConfigurationRecord = BaseUserConfigurationRecord<"TIPS_GOAL", TipsGoalConfiguration>;

export type UserConfigurationRecord =
  | CounterToEndLiveConfigurationRecord
  | GlobalConfigurationRecord
  | LargestDonatesConfigurationRecord
  | LatestDonatesConfigurationRecord
  | TipAlertConfigurationRecord
  | TipsGoalConfigurationRecord;
