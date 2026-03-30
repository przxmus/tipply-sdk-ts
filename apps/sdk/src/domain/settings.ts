import type { MinorUnitAmount, UnknownConfiguration, UnknownThresholdEntry, UserConfigurationType } from "./shared";

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

export interface GlobalConfiguration {
  forbiddenWords: string[];
  profanityFilterEnabled: boolean;
}

export interface TipAlertVoiceMessagesConfiguration {
  enabled: boolean;
  amount: MinorUnitAmount;
}

export interface TipAlertDelayConfiguration {
  enabled: boolean;
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
  thresholds: {
    sounds: UnknownThresholdEntry[];
    templates: UnknownThresholdEntry[];
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
  sumPaymentsFrom: string | Record<string, unknown>;
  amountWithoutCommission: boolean;
}

export interface ToggleDisabledResult {
  disabled: boolean;
}

export interface ForbiddenWordsSettings {
  enabled: boolean;
  words: string[];
}

export interface ProfanityFilterSettings {
  enabled: boolean;
}

export interface UserConfigurationRecord<TType extends string = UserConfigurationType, TConfig = UnknownConfiguration> {
  type: TType;
  config: TConfig;
}

export type UserConfiguration =
  | UserConfigurationRecord<"COUNTER_TO_END_LIVE", CounterToEndLiveConfiguration>
  | UserConfigurationRecord<"GLOBAL", GlobalConfiguration>
  | UserConfigurationRecord<"LARGEST_DONATES", UnknownConfiguration>
  | UserConfigurationRecord<"LATEST_DONATES", UnknownConfiguration>
  | UserConfigurationRecord<"TIP_ALERT", TipAlertConfiguration>
  | UserConfigurationRecord<"TIPS_GOAL", TipsGoalConfiguration>
  | UserConfigurationRecord;
