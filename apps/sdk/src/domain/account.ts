import type { UserId } from "./ids";
import type { IsoDateString, MinorUnitAmount, Notification, Tip, UnknownSocialMediaLink, UnknownProviderMetadata } from "./shared";

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

export type DashboardAnnouncement = Record<string, unknown>;

export interface IncomeStatistics {
  total: MinorUnitAmount;
  last28: MinorUnitAmount;
  last7: MinorUnitAmount;
  last7PercentChange: number;
  currentMonth: MinorUnitAmount;
  currentMonthPercentChange: number;
}

export interface TipStatistics {
  count: number;
  countPercentage: number;
  messagesLength: number;
  messagesLengthPercentage: number;
}

export interface UserProfileAddress {
  city: string;
  street: string;
  postalCode: string;
  country: string;
}

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

export interface UpdatePageSettingsInput {
  description?: string;
  replaceEmotes?: boolean;
}

export type PublicSocialMediaLink = UnknownSocialMediaLink;
export type RecentTip = Tip;
export type DashboardNotification = Notification;
