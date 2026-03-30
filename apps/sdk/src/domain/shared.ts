import type {
  AccountId,
  GoalId,
  MediaId,
  ModeratorId,
  PaymentId,
  ReportId,
  TemplateId,
  TipId,
  UserId,
  WithdrawalId,
} from "./ids";

/** ISO-8601 date-time string returned by Tipply APIs. */
export type IsoDateString = string;
/** Monetary amount stored in the provider's minor units. */
export type MinorUnitAmount = number;
/** Generic record used for payloads with unknown structure. */
export type UnknownRecord = Record<string, unknown>;
/** Provider-specific metadata attached to media items. */
export type UnknownProviderMetadata = UnknownRecord;
/** Notification payload with an API-defined shape not yet modeled by the SDK. */
export type UnknownNotificationPayload = UnknownRecord;
/** Template configuration with an API-defined shape not yet modeled by the SDK. */
export type UnknownTemplateConfig = UnknownRecord;
/** Template style record with partially known keys. */
export type UnknownTemplateStyles = UnknownRecord;
/** Public social media link payload with an API-defined shape. */
export type UnknownSocialMediaLink = UnknownRecord;
/** Threshold entry payload with an API-defined shape. */
export type UnknownThresholdEntry = UnknownRecord;
/** Withdrawal method configuration with an API-defined shape. */
export type UnknownWithdrawalMethodConfiguration = UnknownRecord;
/** Fallback configuration record used for unmodeled user settings. */
export type UnknownConfiguration = UnknownRecord;

/** Supported payment method keys returned by Tipply. */
export type PaymentMethodKey =
  | "cashbill"
  | "cashbill_blik"
  | "cashbill_bpp"
  | "cashbill_credit_card"
  | "justpay"
  | "justpay_classic"
  | "justpay_full"
  | "paypal"
  | "psc"
  | (string & {});

/** Payment method configuration keys, including grouped Tipply-specific entries. */
export type PaymentMethodConfigurationKey = PaymentMethodKey | "gt_psc";

/** Withdrawal status values returned by Tipply. */
export type WithdrawalStatus = "ACCEPTED" | "TRANSFERRED" | (string & {});
/** Withdrawal method keys returned by Tipply. */
export type WithdrawalMethodKey = "bank_express" | "bank_standard" | "paypal" | "paypal_express" | (string & {});
/** Notification types currently modeled by the SDK. */
export type NotificationType = "withdrawal_accepted" | "profile_verified" | "user_verified" | (string & {});
/** User configuration record discriminators returned by Tipply. */
export type UserConfigurationType =
  | "COUNTER_TO_END_LIVE"
  | "GLOBAL"
  | "LARGEST_DONATES"
  | "LATEST_DONATES"
  | "TIP_ALERT"
  | "TIPS_GOAL"
  | (string & {});

/** Template types owned by the authenticated user. */
export type UserTemplateType = "TIP_ALERT" | "TIPS_GOAL" | "LATEST_DONATES" | "LARGEST_DONATES" | (string & {});
/** Template types available through the public API. */
export type PublicTemplateType = "TIPS_GOAL" | "GOAL_VOTING" | (string & {});

/** Goal definition returned by Tipply. */
export interface Goal {
  id: GoalId;
  templateId: TemplateId;
  title: string;
  target: MinorUnitAmount;
  initialValue: MinorUnitAmount;
  withoutCommission: boolean;
  countFrom: IsoDateString;
  createdAt: IsoDateString;
  isDefault: boolean;
}

/** Aggregated goal statistics. */
export interface GoalStats {
  amount: MinorUnitAmount;
  commission: MinorUnitAmount;
}

/** Goal entry used in public and authenticated voting configuration payloads. */
export interface GoalVotingEntry {
  goal: Goal;
  color: string;
  stats: GoalStats;
}

/** Goal voting configuration returned by Tipply. */
export interface GoalVotingConfiguration {
  goals: GoalVotingEntry[];
}

/** Media library item owned by the authenticated user. */
export interface MediaItem {
  id: MediaId;
  providerMetadata: UnknownProviderMetadata;
  name: string;
  enabled: boolean;
  providerName: string;
  providerStatus: number;
  providerReference: string;
  width: number;
  height: number;
  context: string;
  updatedAt: IsoDateString;
  createdAt: IsoDateString;
  contentType: string;
  size: number;
}

/** Media storage usage information. */
export interface MediaUsage {
  usage: number;
  total: number;
}

/** HTML-like properties attached to a generated media format. */
export interface MediaFormatProperties {
  alt?: string;
  title?: string;
  src?: string;
  width?: number;
  height?: number;
  srcset?: string;
  sizes?: string;
  [key: string]: unknown;
}

/** A single generated format entry for a media item. */
export interface MediaFormatEntry {
  url: string;
  properties: MediaFormatProperties;
}

/** Available generated formats keyed by format name. */
export type MediaFormats = Record<string, MediaFormatEntry>;

/** Supported template font family values. */
export type TemplateFontFamily = "Sora" | "Lato" | (string & {});
/** Supported template font style values. */
export type TemplateFontStyle = "normal" | (string & {});
/** Supported template text alignment values. */
export type TemplateTextAlign = "left" | "center" | "right" | (string & {});

/** Two-dimensional position of a template element. */
export interface TemplateElementPosition {
  x: number;
  y: number;
  [key: string]: unknown;
}

/** Animation settings for a template element. */
export interface TemplateElementAnimation {
  enable?: boolean;
  [key: string]: unknown;
}

/** Width and height overrides for a template element. */
export interface TemplateElementSize {
  width?: number;
  height?: number;
  [key: string]: unknown;
}

/** Style configuration supported by known template elements. */
export interface TemplateElementStyles extends UnknownTemplateStyles {
  color?: string;
  fontFamily?: TemplateFontFamily;
  fontSize?: number;
  fontStyle?: TemplateFontStyle;
  fontWeight?: number;
  textAlign?: TemplateTextAlign;
  textShadow?: string;
  width?: number;
  zIndex?: number;
}

/** Single node in a nested template element tree. */
export interface TemplateElementOption {
  styles?: TemplateElementStyles;
  position?: TemplateElementPosition;
  animation?: TemplateElementAnimation;
  size?: TemplateElementSize;
  children?: Record<string, TemplateElementOption>;
  gradientColor?: string;
  progressColor?: string;
  stripes?: boolean;
  changePosition?: boolean;
  isVisible?: boolean;
  textValue?: string;
  [key: string]: unknown;
}

/** Element options specific to `TIPS_GOAL` templates. */
export interface TipsGoalTemplateElementsOptions {
  goalName?: TemplateElementOption;
  amountPaid?: TemplateElementOption;
  goalNumbers?: TemplateElementOption;
  progressBar?: TemplateElementOption;
  visualObject?: TemplateElementOption;
  [key: string]: unknown;
}

/** Element options specific to counter-based templates. */
export interface CounterTemplateElementsOptions {
  textInput?: TemplateElementOption;
  additionalTime?: TemplateElementOption;
  visualObject?: TemplateElementOption;
  [key: string]: unknown;
}

/** Configuration payload for a `TIPS_GOAL` template. */
export interface TipsGoalTemplateConfig {
  title: string;
  editable: boolean;
  elementsOptions: TipsGoalTemplateElementsOptions;
}

/** Template owned by the authenticated user. */
export interface UserTemplate<TType extends string = UserTemplateType, TConfig = UnknownTemplateConfig> {
  id: TemplateId;
  type: TType;
  updatedAt: IsoDateString;
  config: TConfig;
}

/** Template exposed through the public API. */
export interface PublicTemplate<TType extends string = PublicTemplateType, TConfig = UnknownTemplateConfig> {
  id: TemplateId;
  type: TType;
  updatedAt: IsoDateString;
  config: TConfig;
}

/** Public goal widget payload combining goal config and current stats. */
export interface PublicGoalWidget {
  config: Goal;
  stats: GoalStats;
}

/** User-configurable payment method settings. */
export interface UserPaymentMethod {
  enabled: boolean;
  minimalAmount: MinorUnitAmount;
  humanMethodName: string;
}

/** Map of payment methods configured for the authenticated user. */
export type UserPaymentMethods = Partial<Record<PaymentMethodKey, UserPaymentMethod>>;

/** Configuration metadata describing how a payment method behaves in the UI. */
export interface PaymentMethodConfigurationEntry {
  state?: string | boolean;
  minimalAmount?: MinorUnitAmount;
  disabledLabel?: string;
  tooltipText?: string;
  onHoverText?: string;
  homePercentagePrefix?: string;
  homePercentage?: number;
  homeFixed?: MinorUnitAmount;
  isForVerified?: boolean;
  [key: string]: unknown;
}

/** Map of payment method configuration entries. */
export type PaymentMethodsConfiguration = Partial<Record<PaymentMethodConfigurationKey, PaymentMethodConfigurationEntry>>;

/** Input used to update a single payment method. */
export type UpdatePaymentMethodInput = { enabled: boolean } | { minimalAmount: MinorUnitAmount };

/** Payout account returned by the withdrawals endpoints. */
export interface Account {
  accountId: AccountId;
  balance: MinorUnitAmount;
  locked: boolean;
  status: string;
  type: string;
  openedAt: IsoDateString;
  company: boolean;
}

/** Withdrawal record returned by the withdrawals endpoints. */
export interface Withdrawal {
  withdrawalId: WithdrawalId;
  methodName: string;
  amount: MinorUnitAmount;
  commission: MinorUnitAmount;
  status: WithdrawalStatus;
  requestedAt: IsoDateString;
  acceptedAt?: IsoDateString | null;
  transferredAt?: IsoDateString | null;
  canPrintConfirmation: boolean;
  invoiceNumber?: string | null;
  humanMethodName: string;
}

/** Map of withdrawal method configuration entries. */
export type WithdrawalMethodsConfiguration = Partial<Record<WithdrawalMethodKey, UnknownWithdrawalMethodConfiguration>>;

/** Generated report available to the authenticated user. */
export interface Report {
  id: ReportId;
  isDownloadable: boolean;
  reportNumber: string;
  generatedAt: IsoDateString;
}

/** Notification entry returned by the dashboard endpoints. */
export interface Notification {
  id: string | number;
  type: NotificationType;
  payload: UnknownNotificationPayload;
  createdAt: IsoDateString;
  readAt?: IsoDateString | null;
}

/** Tip record returned by list and dashboard endpoints. */
export interface Tip {
  id: TipId;
  paymentId: PaymentId;
  commission: MinorUnitAmount;
  test: boolean;
  resent: boolean;
  consumed: boolean;
  countPoints: boolean;
  source: string;
  referrer: string;
  deleted: boolean;
  nickname: string;
  nicknameTts: string;
  email: string;
  amount: MinorUnitAmount;
  goal?: Goal | null;
  goalTitle?: string;
  message?: string;
  messageTts?: string;
  createdAt: IsoDateString;
  humanMethodName: string;
}

/** Moderator link returned by moderator management endpoints. */
export interface Moderator {
  id: ModeratorId;
  userId: UserId;
  moderationMode: string;
  moderatorName: string;
  linkTime: number;
  link: string;
  createdAt: IsoDateString;
}
