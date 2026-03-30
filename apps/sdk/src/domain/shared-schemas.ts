import { z } from "zod";

import {
  asAccountId,
  asGoalId,
  asMediaId,
  asModeratorId,
  asPaymentId,
  asReportId,
  asTemplateId,
  asTipId,
  asUserId,
  asWithdrawalId,
} from "./ids";
import { isoDateStringSchema, minorUnitAmountSchema, unknownRecordSchema } from "./parsing";
import type {
  Account,
  Goal,
  GoalStats,
  GoalVotingConfiguration,
  MediaFormats,
  MediaItem,
  MediaUsage,
  Moderator,
  Notification,
  PaymentMethodConfigurationEntry,
  PaymentMethodsConfiguration,
  PublicGoalWidget,
  PublicTemplate,
  Report,
  Tip,
  TipsGoalTemplateConfig,
  UserPaymentMethod,
  UserPaymentMethods,
  UserTemplate,
  Withdrawal,
  WithdrawalMethodsConfiguration,
} from "./shared";

const goalWireSchema = z
  .object({
    id: z.string(),
    template_id: z.string(),
    title: z.string(),
    target: minorUnitAmountSchema,
    initial_value: minorUnitAmountSchema,
    without_commission: z.boolean(),
    count_from: isoDateStringSchema,
    created: isoDateStringSchema,
    is_default: z.boolean(),
  })
  .passthrough();

export const goalSchema = goalWireSchema.transform<Goal>((wire) => ({
  id: asGoalId(wire.id),
  templateId: asTemplateId(wire.template_id),
  title: wire.title,
  target: wire.target,
  initialValue: wire.initial_value,
  withoutCommission: wire.without_commission,
  countFrom: wire.count_from,
  createdAt: wire.created,
  isDefault: wire.is_default,
}));

const goalStatsWireSchema = z
  .object({
    amount: minorUnitAmountSchema,
    commission: minorUnitAmountSchema,
  })
  .passthrough();

export const goalStatsSchema = goalStatsWireSchema.transform<GoalStats>((wire) => ({
  amount: wire.amount,
  commission: wire.commission,
}));

export const goalVotingConfigurationSchema = z
  .object({
    goals: z.array(
      z
        .object({
          goal: goalWireSchema,
          color: z.string(),
          stats: goalStatsWireSchema,
        })
        .passthrough(),
    ),
  })
  .passthrough()
  .transform<GoalVotingConfiguration>((wire) => ({
    goals: wire.goals.map((entry) => ({
      goal: goalSchema.parse(entry.goal),
      color: entry.color,
      stats: goalStatsSchema.parse(entry.stats),
    })),
  }));

const mediaItemWireSchema = z
  .object({
    id: z.number(),
    provider_metadata: unknownRecordSchema,
    name: z.string(),
    enabled: z.boolean(),
    provider_name: z.string(),
    provider_status: z.number(),
    provider_reference: z.string(),
    width: z.number(),
    height: z.number(),
    context: z.string(),
    updated_at: isoDateStringSchema,
    created_at: isoDateStringSchema,
    content_type: z.string(),
    size: z.number(),
  })
  .passthrough();

export const mediaItemSchema = mediaItemWireSchema.transform<MediaItem>((wire) => ({
  id: asMediaId(wire.id),
  providerMetadata: wire.provider_metadata,
  name: wire.name,
  enabled: wire.enabled,
  providerName: wire.provider_name,
  providerStatus: wire.provider_status,
  providerReference: wire.provider_reference,
  width: wire.width,
  height: wire.height,
  context: wire.context,
  updatedAt: wire.updated_at,
  createdAt: wire.created_at,
  contentType: wire.content_type,
  size: wire.size,
}));

export const mediaUsageSchema = z
  .object({
    usage: z.number(),
    total: z.number(),
  })
  .passthrough()
  .transform<MediaUsage>((wire) => ({
    usage: wire.usage,
    total: wire.total,
  }));

export const mediaFormatsSchema = z
  .record(
    z.string(),
    z
      .object({
        url: z.string(),
        properties: unknownRecordSchema,
      })
      .passthrough(),
  )
  .transform<MediaFormats>((wire) =>
    Object.fromEntries(
      Object.entries(wire).map(([key, value]) => [
        key,
        {
          url: value.url,
          properties: value.properties,
        },
      ]),
    ),
  );

const templateElementPositionSchema = z
  .object({
    x: z.number(),
    y: z.number(),
  })
  .partial()
  .passthrough();

const templateElementAnimationSchema = z
  .object({
    enable: z.boolean().optional(),
  })
  .passthrough();

const templateElementSizeSchema = z
  .object({
    width: z.number().optional(),
    height: z.number().optional(),
  })
  .passthrough();

const templateElementStylesSchema = z
  .object({
    color: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.number().optional(),
    fontStyle: z.string().optional(),
    fontWeight: z.number().optional(),
    textAlign: z.string().optional(),
    textShadow: z.string().optional(),
    width: z.number().optional(),
    zIndex: z.number().optional(),
  })
  .passthrough();

const templateElementOptionSchema: z.ZodTypeAny = z.lazy((): z.ZodTypeAny =>
  z
    .object({
      styles: templateElementStylesSchema.optional(),
      position: templateElementPositionSchema.optional(),
      animation: templateElementAnimationSchema.optional(),
      size: templateElementSizeSchema.optional(),
      children: z.record(z.string(), templateElementOptionSchema).optional(),
      gradientColor: z.string().optional(),
      progressColor: z.string().optional(),
      stripes: z.boolean().optional(),
      changePosition: z.boolean().optional(),
      isVisible: z.boolean().optional(),
      textValue: z.string().optional(),
    })
    .passthrough(),
);

const tipsGoalTemplateConfigSchema = z
  .object({
    title: z.string(),
    editable: z.boolean(),
    elementsOptions: z
      .object({
        goalName: templateElementOptionSchema.optional(),
        amountPaid: templateElementOptionSchema.optional(),
        goalNumbers: templateElementOptionSchema.optional(),
        progressBar: templateElementOptionSchema.optional(),
        visualObject: templateElementOptionSchema.optional(),
      })
      .passthrough(),
  })
  .passthrough();

const userTemplateWireSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    updated_at: isoDateStringSchema,
    config: unknownRecordSchema,
  })
  .passthrough();

export const userTemplateSchema = userTemplateWireSchema.transform<UserTemplate>((wire) => ({
  id: asTemplateId(wire.id),
  type: wire.type,
  updatedAt: wire.updated_at,
  config: wire.config,
}));

export const publicTemplateSchema = userTemplateWireSchema.transform<PublicTemplate>((wire) => ({
  id: asTemplateId(wire.id),
  type: wire.type,
  updatedAt: wire.updated_at,
  config: wire.config,
}));

export const publicTipsGoalTemplateSchema = z
  .object({
    id: z.string(),
    type: z.literal("TIPS_GOAL"),
    updated_at: isoDateStringSchema,
    config: tipsGoalTemplateConfigSchema,
  })
  .passthrough()
  .transform<PublicTemplate<"TIPS_GOAL", TipsGoalTemplateConfig>>((wire) => ({
    id: asTemplateId(wire.id),
    type: wire.type,
    updatedAt: wire.updated_at,
    config: wire.config as TipsGoalTemplateConfig,
  }));

export const publicGoalWidgetSchema = z
  .object({
    config: goalWireSchema,
    stats: goalStatsWireSchema,
  })
  .passthrough()
  .transform<PublicGoalWidget>((wire) => ({
    config: goalSchema.parse(wire.config),
    stats: goalStatsSchema.parse(wire.stats),
  }));

export const userPaymentMethodSchema = z
  .object({
    enabled: z.boolean(),
    minimal_amount: minorUnitAmountSchema,
    human_method_name: z.string(),
  })
  .passthrough()
  .transform<UserPaymentMethod>((wire) => ({
    enabled: wire.enabled,
    minimalAmount: wire.minimal_amount,
    humanMethodName: wire.human_method_name,
  }));

export const userPaymentMethodsSchema = z
  .record(z.string(), userPaymentMethodSchema)
  .transform<UserPaymentMethods>((wire) => Object.fromEntries(Object.entries(wire)));

export const paymentMethodsConfigurationSchema = z
  .record(
    z.string(),
    z
      .object({
        state: z.union([z.string(), z.boolean()]).optional(),
        minimal_amount: minorUnitAmountSchema.optional(),
        disabled_label: z.string().optional(),
        tooltip_text: z.string().optional(),
        on_hover_text: z.string().optional(),
        home_percentage_prefix: z.string().optional(),
        home_percentage: z.number().optional(),
        home_fixed: minorUnitAmountSchema.optional(),
        is_for_verified: z.boolean().optional(),
      })
      .passthrough(),
  )
  .transform<PaymentMethodsConfiguration>((wire) =>
    Object.fromEntries(
      Object.entries(wire).map(([key, value]) => [
        key,
        {
          ...(value.state !== undefined ? { state: value.state } : {}),
          ...(value.minimal_amount !== undefined ? { minimalAmount: value.minimal_amount } : {}),
          ...(value.disabled_label !== undefined ? { disabledLabel: value.disabled_label } : {}),
          ...(value.tooltip_text !== undefined ? { tooltipText: value.tooltip_text } : {}),
          ...(value.on_hover_text !== undefined ? { onHoverText: value.on_hover_text } : {}),
          ...(value.home_percentage_prefix !== undefined ? { homePercentagePrefix: value.home_percentage_prefix } : {}),
          ...(value.home_percentage !== undefined ? { homePercentage: value.home_percentage } : {}),
          ...(value.home_fixed !== undefined ? { homeFixed: value.home_fixed } : {}),
          ...(value.is_for_verified !== undefined ? { isForVerified: value.is_for_verified } : {}),
        } satisfies PaymentMethodConfigurationEntry,
      ]),
    ),
  );

export const accountSchema = z
  .object({
    account_id: z.string(),
    balance: minorUnitAmountSchema,
    locked: z.boolean(),
    status: z.string(),
    type: z.string(),
    opened_at: isoDateStringSchema,
    company: z.boolean(),
  })
  .passthrough()
  .transform<Account>((wire) => ({
    accountId: asAccountId(wire.account_id),
    balance: wire.balance,
    locked: wire.locked,
    status: wire.status,
    type: wire.type,
    openedAt: wire.opened_at,
    company: wire.company,
  }));

export const withdrawalSchema = z
  .object({
    withdrawal_id: z.string(),
    method_name: z.string(),
    amount: minorUnitAmountSchema,
    commission: minorUnitAmountSchema,
    status: z.string(),
    requested_at: isoDateStringSchema,
    accepted_at: isoDateStringSchema.nullish(),
    transferred_at: isoDateStringSchema.nullish(),
    can_print_confirmation: z.boolean(),
    invoice_number: z.string().nullish(),
    human_method_name: z.string(),
  })
  .passthrough()
  .transform<Withdrawal>((wire) => ({
    withdrawalId: asWithdrawalId(wire.withdrawal_id),
    methodName: wire.method_name,
    amount: wire.amount,
    commission: wire.commission,
    status: wire.status,
    requestedAt: wire.requested_at,
    ...(wire.accepted_at !== undefined ? { acceptedAt: wire.accepted_at } : {}),
    ...(wire.transferred_at !== undefined ? { transferredAt: wire.transferred_at } : {}),
    canPrintConfirmation: wire.can_print_confirmation,
    ...(wire.invoice_number !== undefined ? { invoiceNumber: wire.invoice_number } : {}),
    humanMethodName: wire.human_method_name,
  }));

export const withdrawalMethodsConfigurationSchema = z
  .record(z.string(), unknownRecordSchema)
  .transform<WithdrawalMethodsConfiguration>((wire) => Object.fromEntries(Object.entries(wire)));

export const reportSchema = z
  .object({
    id: z.string(),
    is_downloadable: z.boolean(),
    report_number: z.string(),
    generated_at: isoDateStringSchema,
  })
  .passthrough()
  .transform<Report>((wire) => ({
    id: asReportId(wire.id),
    isDownloadable: wire.is_downloadable,
    reportNumber: wire.report_number,
    generatedAt: wire.generated_at,
  }));

export const notificationSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    type: z.string(),
    payload: unknownRecordSchema,
    created_at: isoDateStringSchema,
    read_at: isoDateStringSchema.nullish(),
  })
  .passthrough()
  .transform<Notification>((wire) => ({
    id: wire.id,
    type: wire.type,
    payload: wire.payload,
    createdAt: wire.created_at,
    ...(wire.read_at !== undefined ? { readAt: wire.read_at } : {}),
  }));

export const tipSchema = z
  .object({
    id: z.string(),
    payment_id: z.string(),
    commission: minorUnitAmountSchema,
    test: z.boolean(),
    resent: z.boolean(),
    consumed: z.boolean(),
    count_points: z.boolean(),
    source: z.string(),
    referrer: z.string(),
    deleted: z.boolean(),
    nickname: z.string(),
    nickname_tts: z.string(),
    email: z.string(),
    amount: minorUnitAmountSchema,
    goal: goalWireSchema.nullish(),
    goal_title: z.string().optional(),
    message: z.string().optional(),
    message_tts: z.string().optional(),
    created_at: isoDateStringSchema,
    human_method_name: z.string(),
  })
  .passthrough()
  .transform<Tip>((wire) => ({
    id: asTipId(wire.id),
    paymentId: asPaymentId(wire.payment_id),
    commission: wire.commission,
    test: wire.test,
    resent: wire.resent,
    consumed: wire.consumed,
    countPoints: wire.count_points,
    source: wire.source,
    referrer: wire.referrer,
    deleted: wire.deleted,
    nickname: wire.nickname,
    nicknameTts: wire.nickname_tts,
    email: wire.email,
    amount: wire.amount,
    ...(wire.goal !== undefined ? { goal: wire.goal ? goalSchema.parse(wire.goal) : wire.goal } : {}),
    ...(wire.goal_title !== undefined ? { goalTitle: wire.goal_title } : {}),
    ...(wire.message !== undefined ? { message: wire.message } : {}),
    ...(wire.message_tts !== undefined ? { messageTts: wire.message_tts } : {}),
    createdAt: wire.created_at,
    humanMethodName: wire.human_method_name,
  }));

export const moderatorSchema = z
  .object({
    id: z.string(),
    user_id: z.string(),
    moderation_mode: z.string(),
    moderator_name: z.string(),
    link_time: z.number(),
    link: z.string(),
    created: isoDateStringSchema,
  })
  .passthrough()
  .transform<Moderator>((wire) => ({
    id: asModeratorId(wire.id),
    userId: asUserId(wire.user_id),
    moderationMode: wire.moderation_mode,
    moderatorName: wire.moderator_name,
    linkTime: wire.link_time,
    link: wire.link,
    createdAt: wire.created,
  }));
