import { z } from "zod";

import { minorUnitAmountSchema, parseWithSchema, unknownRecordSchema } from "./parsing";
import type {
  CounterToEndLiveConfiguration,
  ForbiddenWordsSettings,
  GlobalConfiguration,
  ProfanityFilterSettings,
  TipAlertConfiguration,
  TipAlertDefaultSoundSelection,
  TipAlertDefaultTemplateSelection,
  TipAlertDelayConfiguration,
  TipAlertDisplaySettings,
  TipAlertSynthThreshold,
  TipAlertVoiceMessagesConfiguration,
  TipsGoalConfiguration,
  ToggleDisabledResult,
  UserConfiguration,
} from "./settings";
import type { TipplyTransportResponseContext } from "../core/types";

export const counterToEndLiveConfigurationSchema = z
  .object({
    priceFromAddTime: minorUnitAmountSchema,
    extraTime: z.number(),
    startDate: z.string(),
    twitchActivityTimer: z.number(),
    showDays: z.boolean(),
    addTimeWithoutCommission: z.boolean(),
    kickActivityTimer: z.number(),
    isCountdownRunning: z.boolean(),
  })
  .passthrough();

const globalConfigurationWireSchema = z
  .object({
    forbidden_words: z.array(z.string()),
    profanity_filter_enabled: z.boolean(),
  })
  .passthrough();

export const globalConfigurationSchema = globalConfigurationWireSchema.transform<GlobalConfiguration>((wire) => ({
  forbiddenWords: wire.forbidden_words,
  profanityFilterEnabled: wire.profanity_filter_enabled,
}));

const tipAlertVoiceMessagesConfigurationSchema = z
  .object({
    enable: z.boolean(),
    amount: minorUnitAmountSchema,
  })
  .passthrough()
  .transform<TipAlertVoiceMessagesConfiguration>((wire) => ({
    enabled: wire.enable,
    amount: wire.amount,
  }));

const tipAlertDelayConfigurationSchema = z
  .object({
    enable: z.boolean(),
    delay: z.number(),
  })
  .passthrough()
  .transform<TipAlertDelayConfiguration>((wire) => ({
    enabled: wire.enable,
    delay: wire.delay,
  }));

const tipAlertDefaultSoundSelectionSchema = z
  .object({
    fileId: z.string(),
    fileName: z.string(),
    volume: z.number(),
    mediumId: z.union([z.string(), z.number()]),
  })
  .passthrough()
  .transform<TipAlertDefaultSoundSelection>((wire) => ({
    fileId: wire.fileId,
    fileName: wire.fileName,
    volume: wire.volume,
    mediumId: wire.mediumId,
  }));

const tipAlertDefaultTemplateSelectionSchema = z
  .object({
    templateId: z.string(),
  })
  .passthrough()
  .transform<TipAlertDefaultTemplateSelection>((wire) => ({
    templateId: wire.templateId,
  }));

const tipAlertSynthThresholdSchema = z
  .object({
    options: z
      .object({
        volume: z.number(),
        readAmount: z.boolean(),
        readMessage: z.boolean(),
        readNickname: z.boolean(),
        readLink: z.boolean(),
        interLink: z.boolean(),
      })
      .passthrough(),
    voiceType: z.string(),
    amount: minorUnitAmountSchema,
    templateId: z.string(),
  })
  .passthrough()
  .transform<TipAlertSynthThreshold>((wire) => ({
    options: wire.options,
    voiceType: wire.voiceType,
    amount: wire.amount,
    templateId: wire.templateId,
  }));

const tipAlertDisplaySettingsWireSchema = z
  .object({
    defaults: z
      .object({
        sounds: z.object({
          fileId: z.string(),
          fileName: z.string(),
          volume: z.number(),
          mediumId: z.union([z.string(), z.number()]),
        }),
        templates: z.object({
          templateId: z.string(),
        }),
      })
      .passthrough(),
    tresholds: z
      .object({
        sounds: z.array(unknownRecordSchema),
        templates: z.array(unknownRecordSchema),
        synth: z.array(
          z.object({
            options: z
              .object({
                volume: z.number(),
                readAmount: z.boolean(),
                readMessage: z.boolean(),
                readNickname: z.boolean(),
                readLink: z.boolean(),
                interLink: z.boolean(),
              })
              .passthrough(),
            voiceType: z.string(),
            amount: minorUnitAmountSchema,
            templateId: z.string(),
          }),
        ),
      })
      .passthrough(),
  })
  .passthrough();

const tipAlertDisplaySettingsSchema = tipAlertDisplaySettingsWireSchema.transform<TipAlertDisplaySettings>((wire) => ({
  defaults: {
    sounds: tipAlertDefaultSoundSelectionSchema.parse(wire.defaults.sounds),
    templates: tipAlertDefaultTemplateSelectionSchema.parse(wire.defaults.templates),
  },
  thresholds: {
    sounds: wire.tresholds.sounds,
    templates: wire.tresholds.templates,
    synth: wire.tresholds.synth.map((entry) => tipAlertSynthThresholdSchema.parse(entry)),
  },
}));

export const tipAlertConfigurationSchema = z
  .object({
    voiceMessages: z.object({
      enable: z.boolean(),
      amount: minorUnitAmountSchema,
    }),
    delayingTips: z.object({
      enable: z.boolean(),
      delay: z.number(),
    }),
    displaySettings: tipAlertDisplaySettingsWireSchema,
    twitchActivityTimer: z.number(),
    kickActivityTimer: z.number(),
  })
  .passthrough()
  .transform<TipAlertConfiguration>((wire) => ({
    voiceMessages: tipAlertVoiceMessagesConfigurationSchema.parse(wire.voiceMessages),
    delayingTips: tipAlertDelayConfigurationSchema.parse(wire.delayingTips),
    displaySettings: tipAlertDisplaySettingsSchema.parse(wire.displaySettings),
    twitchActivityTimer: wire.twitchActivityTimer,
    kickActivityTimer: wire.kickActivityTimer,
  }));

const tipsGoalConfigurationValueSchema = z
  .object({
    goalValue: minorUnitAmountSchema,
    goalName: z.string(),
    sumPaymentsFrom: z.union([z.string(), unknownRecordSchema]),
    amountWithoutCommission: z.boolean(),
  })
  .passthrough();

export const tipsGoalConfigurationSchema = z
  .union([
    tipsGoalConfigurationValueSchema,
    z
      .object({
        type: z.string(),
        config: tipsGoalConfigurationValueSchema,
      })
      .passthrough()
      .transform((wire) => wire.config),
  ])
  .transform<TipsGoalConfiguration>((wire) => ({
    goalValue: wire.goalValue,
    goalName: wire.goalName,
    sumPaymentsFrom: wire.sumPaymentsFrom,
    amountWithoutCommission: wire.amountWithoutCommission,
  }));

const userConfigurationWireSchema = z
  .object({
    type: z.string(),
    config: z.unknown(),
  })
  .passthrough();

function parseKnownUserConfiguration(type: string, config: unknown): UserConfiguration["config"] {
  switch (type) {
    case "COUNTER_TO_END_LIVE": {
      const parsed = counterToEndLiveConfigurationSchema.safeParse(config);
      return parsed.success ? parsed.data : (config as UserConfiguration["config"]);
    }
    case "GLOBAL": {
      const parsed = globalConfigurationSchema.safeParse(config);
      return parsed.success ? parsed.data : (config as UserConfiguration["config"]);
    }
    case "TIP_ALERT": {
      const parsed = tipAlertConfigurationSchema.safeParse(config);
      return parsed.success ? parsed.data : (config as UserConfiguration["config"]);
    }
    case "TIPS_GOAL": {
      const parsed = tipsGoalConfigurationSchema.safeParse(config);
      return parsed.success ? parsed.data : (config as UserConfiguration["config"]);
    }
    default:
      return config as UserConfiguration["config"];
  }
}

export const userConfigurationSchema = userConfigurationWireSchema.transform<UserConfiguration>((wire) => {
  return {
    type: wire.type as UserConfiguration["type"],
    config: parseKnownUserConfiguration(wire.type, wire.config),
  } as UserConfiguration;
});

export const userConfigurationListSchema = z.array(userConfigurationSchema).transform<UserConfiguration[]>((wire) => wire);

export const toggleDisabledResultSchema = z
  .object({
    disabled: z.boolean(),
  })
  .passthrough()
  .transform<ToggleDisabledResult>((wire) => ({
    disabled: wire.disabled,
  }));

export const forbiddenWordsSettingsSchema = z
  .object({
    enabled: z.boolean(),
    words: z.array(z.string()),
  })
  .passthrough()
  .transform<ForbiddenWordsSettings>((wire) => ({
    enabled: wire.enabled,
    words: wire.words,
  }));

export const profanityFilterSettingsSchema = z
  .object({
    enabled: z.boolean(),
  })
  .passthrough()
  .transform<ProfanityFilterSettings>((wire) => ({
    enabled: wire.enabled,
  }));

export function parseUserConfigurations(value: unknown, context: TipplyTransportResponseContext): UserConfiguration[] {
  return parseWithSchema(userConfigurationListSchema, value, context, "Invalid settings response.");
}

export function toTipAlertConfigurationWire(input: TipAlertConfiguration): Record<string, unknown> {
  return {
    voiceMessages: {
      enable: input.voiceMessages.enabled,
      amount: input.voiceMessages.amount,
    },
    delayingTips: {
      enable: input.delayingTips.enabled,
      delay: input.delayingTips.delay,
    },
    displaySettings: {
      defaults: {
        sounds: input.displaySettings.defaults.sounds,
        templates: input.displaySettings.defaults.templates,
      },
      tresholds: {
        sounds: input.displaySettings.thresholds.sounds,
        templates: input.displaySettings.thresholds.templates,
        synth: input.displaySettings.thresholds.synth,
      },
    },
    twitchActivityTimer: input.twitchActivityTimer,
    kickActivityTimer: input.kickActivityTimer,
  };
}

export function toCounterToEndLiveConfigurationWire(input: CounterToEndLiveConfiguration): Record<string, unknown> {
  return {
    priceFromAddTime: input.priceFromAddTime,
    extraTime: input.extraTime,
    startDate: input.startDate,
    twitchActivityTimer: input.twitchActivityTimer,
    showDays: input.showDays,
    addTimeWithoutCommission: input.addTimeWithoutCommission,
    kickActivityTimer: input.kickActivityTimer,
    isCountdownRunning: input.isCountdownRunning,
  };
}
