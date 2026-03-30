import type { UserId } from "./ids";
import type { IsoDateString, MinorUnitAmount, Notification, Tip, UnknownSocialMediaLink, UnknownProviderMetadata } from "./shared";

/** Authenticated account payload returned by `client.me.get()`. */
export interface CurrentUser {
  id: UserId;
  username: string;
  email: string;
  lastLogin?: IsoDateString | null;
  isVerified: boolean;
  googleAuthEnabled: boolean;
  hasPendingBankTransferValidationRequest: boolean;
  emailAuthEnabled: boolean;
  googleId?: string | null;
  verifiedAt?: IsoDateString | null;
  withdrawal2faEnabled: boolean;
  commissionThreshold: MinorUnitAmount;
  paymentsDisabled: boolean;
  widgetMessageDisabled: boolean;
  widgetAlertsDisabled: boolean;
  widgetAlertsSoundDisabled: boolean;
  missingPersonalData: boolean;
  redirectToMissingDataForm: boolean;
  newStatueAccepted: boolean;
  fraud: boolean;
  fraudAmount: MinorUnitAmount;
  moderationMode: boolean;
  messageAudio: boolean;
  colorTheme?: string | null;
  minimalAmountAllowed: MinorUnitAmount;
  synthMigration: boolean;
  bankStandardDisabled: boolean;
  bankExpressDisabled: boolean;
  paypalStandardDisabled: boolean;
  paypalExpressDisabled: boolean;
  fraudCheckTime?: IsoDateString | null;
  bankTransferValidationRequested: boolean;
  validatedWithBankTransfer: boolean;
}

/** Unstructured dashboard announcement payload returned by Tipply. */
export type DashboardAnnouncement = Record<string, unknown>;

/** Dashboard income metrics returned by Tipply. */
export interface IncomeStatistics {
  total: MinorUnitAmount;
  last28: MinorUnitAmount;
  last7: MinorUnitAmount;
  last7PercentChange: number;
  currentMonth: MinorUnitAmount;
  currentMonthPercentChange: number;
}

/** Dashboard tip volume metrics returned by Tipply. */
export interface TipStatistics {
  count: number;
  countPercentage: number;
  messagesLength: number;
  messagesLengthPercentage: number;
}

/** Postal address attached to a user profile. */
export interface UserProfileAddress {
  city: string;
  street: string;
  postalCode: string;
  country: string;
}

/** Avatar metadata embedded in the user profile payload. */
export interface UserProfileAvatar {
  id: number;
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

/** Authenticated profile payload returned by `client.profile.get()`. */
export interface UserProfile {
  id: UserId;
  link: string;
  description: string;
  fullname: string;
  fullnameLocked: boolean;
  personalNumber?: string | null;
  address?: UserProfileAddress;
  bankNumber?: string | null;
  bankNumberModificationDate?: IsoDateString | null;
  paypalEmail?: string | null;
  googleAvatarUrl?: string | null;
  avatar?: UserProfileAvatar;
  themeColor?: string | null;
  hits: number;
  socialMediaLink?: string | null;
  isCompany: boolean;
  contactName?: string | null;
  contactEmail?: string | null;
  replaceEmotes: boolean;
  emotesId?: string | null;
  emotesInit: boolean;
  socialMediaLinks: UnknownSocialMediaLink[];
  showRankingAndMessages: boolean;
}

/** Writable subset of profile page settings supported by the SDK. */
export interface UpdatePageSettingsInput {
  description?: string;
  replaceEmotes?: boolean;
}

/** Public social media link payload returned for a profile slug. */
export type PublicSocialMediaLink = UnknownSocialMediaLink;
/** Alias used for dashboard recent tips. */
export type RecentTip = Tip;
/** Alias used for dashboard notifications. */
export type DashboardNotification = Notification;
