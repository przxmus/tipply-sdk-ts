import { z } from "zod";

import { asUserId } from "./ids";
import { camelizeValue, isoDateStringSchema, minorUnitAmountSchema, parseWithSchema, unknownRecordSchema } from "./parsing";
import { mediaItemSchema, notificationSchema, tipSchema } from "./shared-schemas";
import type {
  CurrentUser,
  DashboardAnnouncement,
  DashboardNotification,
  IncomeStatistics,
  PublicUserProfile,
  PublicSocialMediaLink,
  RecentTip,
  TipStatistics,
  UpdatePageSettingsInput,
  UserProfile,
  UserProfileAddress,
  UserProfileAvatar,
} from "./account";
import type { TipplyTransportResponseContext } from "../core/types";

const currentUserWireSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    last_login: isoDateStringSchema.nullish(),
    is_verified: z.boolean(),
    google_auth_enabled: z.boolean(),
    has_pending_banktransfer_validation_request: z.boolean(),
    email_auth_enabled: z.boolean(),
    google_id: z.string().nullish(),
    verified_at: isoDateStringSchema.nullish(),
    withdrawal_2fa_enabled: z.boolean(),
    commission_threshold: minorUnitAmountSchema,
    payments_disabled: z.boolean(),
    widget_message_disabled: z.boolean(),
    widget_alerts_disabled: z.boolean(),
    widget_alerts_sound_disabled: z.boolean(),
    missing_personal_data: z.boolean(),
    redirect_to_missing_data_form: z.boolean(),
    new_statue_accepted: z.boolean(),
    fraud: z.boolean(),
    fraud_amount: minorUnitAmountSchema,
    moderation_mode: z.boolean(),
    message_audio: z.boolean(),
    color_theme: z.string().nullish(),
    minimal_amount_allowed: minorUnitAmountSchema,
    synth_migration: z.boolean(),
    bank_standard_disabled: z.boolean(),
    bank_express_disabled: z.boolean(),
    paypal_standard_disabled: z.boolean(),
    paypal_express_disabled: z.boolean(),
    fraud_check_time: isoDateStringSchema.nullish(),
    bank_transfer_validation_requested: z.boolean(),
    validated_with_bank_transfer: z.boolean(),
  })
  .passthrough();

export const currentUserSchema = currentUserWireSchema.transform<CurrentUser>((wire) => ({
  id: asUserId(wire.id),
  username: wire.username,
  email: wire.email,
  ...(wire.last_login !== undefined ? { lastLogin: wire.last_login } : {}),
  isVerified: wire.is_verified,
  googleAuthEnabled: wire.google_auth_enabled,
  hasPendingBankTransferValidationRequest: wire.has_pending_banktransfer_validation_request,
  emailAuthEnabled: wire.email_auth_enabled,
  ...(wire.google_id !== undefined ? { googleId: wire.google_id } : {}),
  ...(wire.verified_at !== undefined ? { verifiedAt: wire.verified_at } : {}),
  withdrawal2faEnabled: wire.withdrawal_2fa_enabled,
  commissionThreshold: wire.commission_threshold,
  paymentsDisabled: wire.payments_disabled,
  widgetMessageDisabled: wire.widget_message_disabled,
  widgetAlertsDisabled: wire.widget_alerts_disabled,
  widgetAlertsSoundDisabled: wire.widget_alerts_sound_disabled,
  missingPersonalData: wire.missing_personal_data,
  redirectToMissingDataForm: wire.redirect_to_missing_data_form,
  newStatueAccepted: wire.new_statue_accepted,
  fraud: wire.fraud,
  fraudAmount: wire.fraud_amount,
  moderationMode: wire.moderation_mode,
  messageAudio: wire.message_audio,
  ...(wire.color_theme !== undefined ? { colorTheme: wire.color_theme } : {}),
  minimalAmountAllowed: wire.minimal_amount_allowed,
  synthMigration: wire.synth_migration,
  bankStandardDisabled: wire.bank_standard_disabled,
  bankExpressDisabled: wire.bank_express_disabled,
  paypalStandardDisabled: wire.paypal_standard_disabled,
  paypalExpressDisabled: wire.paypal_express_disabled,
  ...(wire.fraud_check_time !== undefined ? { fraudCheckTime: wire.fraud_check_time } : {}),
  bankTransferValidationRequested: wire.bank_transfer_validation_requested,
  validatedWithBankTransfer: wire.validated_with_bank_transfer,
}));

export const dashboardAnnouncementSchema = unknownRecordSchema.transform<DashboardAnnouncement>((wire) => wire);

export const incomeStatisticsSchema = z
  .object({
    total: minorUnitAmountSchema,
    last28: minorUnitAmountSchema,
    last7: minorUnitAmountSchema,
    last7_percent_change: z.number(),
    current_month: minorUnitAmountSchema,
    current_month_percent_change: z.number(),
  })
  .passthrough()
  .transform<IncomeStatistics>((wire) => ({
    total: wire.total,
    last28: wire.last28,
    last7: wire.last7,
    last7PercentChange: wire.last7_percent_change,
    currentMonth: wire.current_month,
    currentMonthPercentChange: wire.current_month_percent_change,
  }));

export const tipStatisticsSchema = z
  .object({
    count: z.number(),
    count_percentage: z.number(),
    messages_length: z.number(),
    messages_length_percentage: z.number(),
  })
  .passthrough()
  .transform<TipStatistics>((wire) => ({
    count: wire.count,
    countPercentage: wire.count_percentage,
    messagesLength: wire.messages_length,
    messagesLengthPercentage: wire.messages_length_percentage,
  }));

const userProfileAddressSchema = z
  .object({
    city: z.string(),
    street: z.string(),
    postal_code: z.string(),
    country: z.string(),
  })
  .passthrough()
  .transform<UserProfileAddress>((wire) => ({
    city: wire.city,
    street: wire.street,
    postalCode: wire.postal_code,
    country: wire.country,
  }));

const userProfileAvatarSchema = mediaItemSchema.transform<UserProfileAvatar>((wire) => ({
  id: wire.id,
  providerMetadata: wire.providerMetadata,
  name: wire.name,
  enabled: wire.enabled,
  providerName: wire.providerName,
  providerStatus: wire.providerStatus,
  providerReference: wire.providerReference,
  width: wire.width,
  height: wire.height,
  context: wire.context,
  updatedAt: wire.updatedAt,
  createdAt: wire.createdAt,
  contentType: wire.contentType,
  size: wire.size,
}));

export const userProfileSchema = z
  .object({
    id: z.string(),
    link: z.string(),
    description: z.string(),
    fullname: z.string(),
    fullname_locked: z.boolean(),
    personal_number: z.string().nullish(),
    address: userProfileAddressSchema.nullish(),
    bank_number: z.string().nullish(),
    bank_number_modification_date: isoDateStringSchema.nullish(),
    paypal_email: z.string().nullish(),
    google_avatar_url: z.string().nullish(),
    avatar: mediaItemSchema.nullish(),
    theme_color: z.string().nullish(),
    hits: z.number(),
    social_media_link: z.string().nullish(),
    is_company: z.boolean(),
    contact_name: z.string().nullish(),
    contact_email: z.string().nullish(),
    replace_emotes: z.boolean(),
    emotes_id: z.string().nullish(),
    emotes_init: z.boolean(),
    social_media_links: z.array(unknownRecordSchema),
    show_ranking_and_messages: z.boolean(),
  })
  .passthrough()
  .transform<UserProfile>((wire) => ({
    id: asUserId(wire.id),
    link: wire.link,
    description: wire.description,
    fullname: wire.fullname,
    fullnameLocked: wire.fullname_locked,
    ...(wire.personal_number !== undefined ? { personalNumber: wire.personal_number } : {}),
    ...(wire.address !== undefined && wire.address !== null ? { address: wire.address } : {}),
    ...(wire.bank_number !== undefined ? { bankNumber: wire.bank_number } : {}),
    ...(wire.bank_number_modification_date !== undefined
      ? { bankNumberModificationDate: wire.bank_number_modification_date }
      : {}),
    ...(wire.paypal_email !== undefined ? { paypalEmail: wire.paypal_email } : {}),
    ...(wire.google_avatar_url !== undefined ? { googleAvatarUrl: wire.google_avatar_url } : {}),
    ...(wire.avatar !== undefined && wire.avatar !== null ? { avatar: wire.avatar } : {}),
    ...(wire.theme_color !== undefined ? { themeColor: wire.theme_color } : {}),
    hits: wire.hits,
    ...(wire.social_media_link !== undefined ? { socialMediaLink: wire.social_media_link } : {}),
    isCompany: wire.is_company,
    ...(wire.contact_name !== undefined ? { contactName: wire.contact_name } : {}),
    ...(wire.contact_email !== undefined ? { contactEmail: wire.contact_email } : {}),
    replaceEmotes: wire.replace_emotes,
    ...(wire.emotes_id !== undefined ? { emotesId: wire.emotes_id } : {}),
    emotesInit: wire.emotes_init,
    socialMediaLinks: wire.social_media_links,
    showRankingAndMessages: wire.show_ranking_and_messages,
  }));

export const publicSocialMediaLinkListSchema = z
  .array(unknownRecordSchema)
  .transform<PublicSocialMediaLink[]>((wire) => wire);

export const publicUserProfileSchema = z
  .object({
    id: z.string(),
    nick_name: z.string(),
    description: z.string(),
    google_avatar_url: z.string().nullish(),
    theme_color: z.string().nullish(),
    show_ranking_and_messages: z.boolean(),
    voice_message_minimal_amount: minorUnitAmountSchema,
    payments_disabled: z.boolean(),
    verified: z.boolean(),
    moderation_mode_enabled: z.boolean(),
    missing_personal_data: z.boolean(),
    is_fraud: z.boolean(),
    paypal_enabled: z.boolean(),
  })
  .passthrough()
  .transform<PublicUserProfile>((wire) => ({
    id: asUserId(wire.id),
    nickName: wire.nick_name,
    description: wire.description,
    ...(wire.google_avatar_url !== undefined ? { googleAvatarUrl: wire.google_avatar_url } : {}),
    ...(wire.theme_color !== undefined ? { themeColor: wire.theme_color } : {}),
    showRankingAndMessages: wire.show_ranking_and_messages,
    voiceMessageMinimalAmount: wire.voice_message_minimal_amount,
    paymentsDisabled: wire.payments_disabled,
    verified: wire.verified,
    moderationModeEnabled: wire.moderation_mode_enabled,
    missingPersonalData: wire.missing_personal_data,
    isFraud: wire.is_fraud,
    paypalEnabled: wire.paypal_enabled,
  }));

export const recentTipListSchema = z.array(tipSchema).transform<RecentTip[]>((wire) => wire);
export const notificationListSchema = z.array(notificationSchema).transform<DashboardNotification[]>((wire) => wire);
export const dashboardAnnouncementListSchema = z.array(dashboardAnnouncementSchema).transform<DashboardAnnouncement[]>((wire) => wire);

function toCurrentUserFallback(value: unknown): CurrentUser {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return camelizeValue(value) as CurrentUser;
  }

  const wire = camelizeValue(value) as Record<string, unknown>;

  return {
    id: asUserId(String(wire.id ?? "")),
    username: typeof wire.username === "string" ? wire.username : "",
    email: typeof wire.email === "string" ? wire.email : "",
    ...(Object.hasOwn(wire, "lastLogin") ? { lastLogin: (wire.lastLogin ?? null) as string | null } : {}),
    isVerified: Boolean(wire.isVerified),
    googleAuthEnabled: Boolean(wire.googleAuthEnabled),
    hasPendingBankTransferValidationRequest: Boolean(
      wire.hasPendingBankTransferValidationRequest ?? wire.hasPendingBanktransferValidationRequest,
    ),
    emailAuthEnabled: Boolean(wire.emailAuthEnabled),
    ...(Object.hasOwn(wire, "googleId") ? { googleId: (wire.googleId ?? null) as string | null } : {}),
    ...(Object.hasOwn(wire, "verifiedAt") ? { verifiedAt: (wire.verifiedAt ?? null) as string | null } : {}),
    withdrawal2faEnabled: Boolean(wire.withdrawal2faEnabled),
    commissionThreshold: Number(wire.commissionThreshold ?? 0),
    paymentsDisabled: Boolean(wire.paymentsDisabled),
    widgetMessageDisabled: Boolean(wire.widgetMessageDisabled),
    widgetAlertsDisabled: Boolean(wire.widgetAlertsDisabled),
    widgetAlertsSoundDisabled: Boolean(wire.widgetAlertsSoundDisabled),
    missingPersonalData: Boolean(wire.missingPersonalData),
    redirectToMissingDataForm: Boolean(wire.redirectToMissingDataForm),
    newStatueAccepted: Boolean(wire.newStatueAccepted),
    fraud: Boolean(wire.fraud),
    fraudAmount: Number(wire.fraudAmount ?? 0),
    moderationMode: Boolean(wire.moderationMode),
    messageAudio: Boolean(wire.messageAudio),
    ...(Object.hasOwn(wire, "colorTheme") ? { colorTheme: (wire.colorTheme ?? null) as string | null } : {}),
    minimalAmountAllowed: Number(wire.minimalAmountAllowed ?? 0),
    synthMigration: Boolean(wire.synthMigration),
    bankStandardDisabled: Boolean(wire.bankStandardDisabled),
    bankExpressDisabled: Boolean(wire.bankExpressDisabled),
    paypalStandardDisabled: Boolean(wire.paypalStandardDisabled),
    paypalExpressDisabled: Boolean(wire.paypalExpressDisabled),
    ...(Object.hasOwn(wire, "fraudCheckTime") ? { fraudCheckTime: (wire.fraudCheckTime ?? null) as string | null } : {}),
    bankTransferValidationRequested: Boolean(wire.bankTransferValidationRequested),
    validatedWithBankTransfer: Boolean(wire.validatedWithBankTransfer),
  };
}

export function parseCurrentUser(value: unknown, context: TipplyTransportResponseContext): CurrentUser {
  return parseWithSchema(currentUserSchema, value, context, "Invalid current user response.", toCurrentUserFallback);
}

export function parseIncomeStatistics(value: unknown, context: TipplyTransportResponseContext): IncomeStatistics {
  return parseWithSchema(incomeStatisticsSchema, value, context, "Invalid income statistics response.");
}

export function parseTipStatistics(value: unknown, context: TipplyTransportResponseContext): TipStatistics {
  return parseWithSchema(tipStatisticsSchema, value, context, "Invalid tip statistics response.");
}

export function parseDashboardAnnouncements(value: unknown, context: TipplyTransportResponseContext): DashboardAnnouncement[] {
  return parseWithSchema(dashboardAnnouncementListSchema, value, context, "Invalid dashboard announcements response.");
}

export function parseRecentTips(value: unknown, context: TipplyTransportResponseContext): RecentTip[] {
  return parseWithSchema(recentTipListSchema, value, context, "Invalid recent tips response.");
}

export function parseDashboardNotifications(value: unknown, context: TipplyTransportResponseContext): DashboardNotification[] {
  return parseWithSchema(notificationListSchema, value, context, "Invalid dashboard notifications response.");
}

export function parseUserProfile(value: unknown, context: TipplyTransportResponseContext): UserProfile {
  return parseWithSchema(userProfileSchema, value, context, "Invalid user profile response.");
}

export function parsePublicSocialMediaLinks(
  value: unknown,
  context: TipplyTransportResponseContext,
): PublicSocialMediaLink[] {
  return parseWithSchema(publicSocialMediaLinkListSchema, value, context, "Invalid public social media response.");
}

export function parsePublicUserProfile(value: unknown, context: TipplyTransportResponseContext): PublicUserProfile {
  return parseWithSchema(publicUserProfileSchema, value, context, "Invalid public user profile response.");
}

export function toUpdatePageSettingsWire(input: UpdatePageSettingsInput): Record<string, unknown> {
  return {
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.replaceEmotes !== undefined ? { replaceEmotes: input.replaceEmotes } : {}),
  };
}
