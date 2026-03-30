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

/** ISO-8601 date string returned by Tipply APIs. */
export type IsoDateString = string;
/** Monetary amount expressed in minor units. */
export type MinorUnitAmount = number;
/** Generic record used when Tipply returns an unmodeled object. */
export type UnknownRecord = Record<string, unknown>;
export type UnknownProviderMetadata = UnknownRecord;
export type UnknownNotificationPayload = UnknownRecord;
export type UnknownTemplateConfig = UnknownRecord;
export type UnknownTemplateStyles = UnknownRecord;
export type UnknownSocialMediaLink = UnknownRecord;
export type UnknownThresholdEntry = UnknownRecord;
export type UnknownWithdrawalMethodConfiguration = UnknownRecord;
export type UnknownConfiguration = UnknownRecord;

/** Payment method keys currently recognized by the SDK. */
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

export type PaymentMethodConfigurationKey = PaymentMethodKey | "gt_psc";

export type WithdrawalStatus = "ACCEPTED" | "TRANSFERRED" | (string & {});
export type WithdrawalMethodKey = "bank_express" | "bank_standard" | "paypal" | "paypal_express" | (string & {});
export type NotificationType = "withdrawal_accepted" | "profile_verified" | "user_verified" | (string & {});
export type UserConfigurationType =
  | "COUNTER_TO_END_LIVE"
  | "GLOBAL"
  | "LARGEST_DONATES"
  | "LATEST_DONATES"
  | "TIP_ALERT"
  | "TIPS_GOAL"
  | (string & {});

export type UserTemplateType = "TIP_ALERT" | "TIPS_GOAL" | "LATEST_DONATES" | "LARGEST_DONATES" | (string & {});
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

/** Current progress statistics for a goal. */
export interface GoalStats {
  amount: MinorUnitAmount;
  commission: MinorUnitAmount;
}

/** Voting entry combining a goal, color, and current stats. */
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

/** Summary of current media storage usage. */
export interface MediaUsage {
  usage: number;
  total: number;
}

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

/** Derived media format entry returned by Tipply. */
export interface MediaFormatEntry {
  url: string;
  properties: MediaFormatProperties;
}

/** Media formats keyed by format name. */
export type MediaFormats = Record<string, MediaFormatEntry>;

export type TemplateFontFamily = "Sora" | "Lato" | (string & {});
export type TemplateFontStyle = "normal" | (string & {});
export type TemplateTextAlign = "left" | "center" | "right" | (string & {});

export interface TemplateElementPosition {
  x: number;
  y: number;
  [key: string]: unknown;
}

export interface TemplateElementAnimation {
  enable?: boolean;
  [key: string]: unknown;
}

export interface TemplateElementSize {
  width?: number;
  height?: number;
  [key: string]: unknown;
}

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

export interface TipsGoalTemplateElementsOptions {
  goalName?: TemplateElementOption;
  amountPaid?: TemplateElementOption;
  goalNumbers?: TemplateElementOption;
  progressBar?: TemplateElementOption;
  visualObject?: TemplateElementOption;
  [key: string]: unknown;
}

export interface CounterTemplateElementsOptions {
  textInput?: TemplateElementOption;
  additionalTime?: TemplateElementOption;
  visualObject?: TemplateElementOption;
  [key: string]: unknown;
}

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

/** Public goal widget payload containing configuration and current stats. */
export interface PublicGoalWidget {
  config: Goal;
  stats: GoalStats;
}

/** User-configurable payment method entry. */
export interface UserPaymentMethod {
  enabled: boolean;
  minimalAmount: MinorUnitAmount;
  humanMethodName: string;
}

/** Payment methods configured for the authenticated user. */
export type UserPaymentMethods = Partial<Record<PaymentMethodKey, UserPaymentMethod>>;

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

export type PaymentMethodsConfiguration = Partial<Record<PaymentMethodConfigurationKey, PaymentMethodConfigurationEntry>>;

/** Input used to update a single payment method. */
export type UpdatePaymentMethodInput = { enabled: boolean } | { minimalAmount: MinorUnitAmount };

/** Payout account returned by withdrawal endpoints. */
export interface Account {
  accountId: AccountId;
  balance: MinorUnitAmount;
  locked: boolean;
  status: string;
  type: string;
  openedAt: IsoDateString;
  company: boolean;
}

/** Withdrawal record returned by Tipply. */
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

export type WithdrawalMethodsConfiguration = Partial<Record<WithdrawalMethodKey, UnknownWithdrawalMethodConfiguration>>;

/** Generated report entry available to the authenticated user. */
export interface Report {
  id: ReportId;
  isDownloadable: boolean;
  reportNumber: string;
  generatedAt: IsoDateString;
}

/** Dashboard notification entry returned by Tipply. */
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
