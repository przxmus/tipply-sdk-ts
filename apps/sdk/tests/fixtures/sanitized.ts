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
} from "../../src";
import type {
  Account,
  CounterToEndLiveConfiguration,
  CurrentUser,
  DashboardAnnouncement,
  DashboardNotification,
  ForbiddenWordsSettings,
  Goal,
  GoalVotingConfiguration,
  MediaFormats,
  MediaItem,
  MediaUsage,
  Moderator,
  PaymentMethodsConfiguration,
  ProfanityFilterSettings,
  PublicGoalWidget,
  PublicUserProfile,
  PublicTemplate,
  Tip,
  TipAlertConfiguration,
  ToggleDisabledResult,
  TipsGoalConfiguration,
  TipsGoalTemplateConfig,
  UserConfiguration,
  UserPaymentMethod,
  UserPaymentMethods,
  UserProfile,
  UserTemplate,
  Withdrawal,
  WithdrawalMethodsConfiguration,
} from "../../src";
import type { CreateGoalInput } from "../../src";
import type { CreateModeratorInput } from "../../src";
import type { Report } from "../../src";

export const rawCurrentUserFixture = {
  id: "user-123",
  username: "streamer",
  email: "streamer@example.com",
  last_login: "2026-03-30T00:49:33+02:00",
  is_verified: true,
  google_auth_enabled: false,
  has_pending_banktransfer_validation_request: false,
  email_auth_enabled: true,
  google_id: null,
  verified_at: "2026-03-01T08:00:00+01:00",
  withdrawal_2fa_enabled: false,
  commission_threshold: 500,
  payments_disabled: false,
  widget_message_disabled: false,
  widget_alerts_disabled: false,
  widget_alerts_sound_disabled: false,
  missing_personal_data: false,
  redirect_to_missing_data_form: false,
  new_statue_accepted: true,
  fraud: false,
  fraud_amount: 0,
  moderation_mode: false,
  message_audio: true,
  color_theme: "light",
  minimal_amount_allowed: 100,
  synth_migration: false,
  bank_standard_disabled: false,
  bank_express_disabled: false,
  paypal_standard_disabled: false,
  paypal_express_disabled: false,
  fraud_check_time: "2026-03-30T00:00:00+02:00",
  bank_transfer_validation_requested: false,
  validated_with_bank_transfer: true,
};

export const currentUserFixture: CurrentUser = {
  id: asUserId("user-123"),
  username: "streamer",
  email: "streamer@example.com",
  lastLogin: "2026-03-30T00:49:33+02:00",
  isVerified: true,
  googleAuthEnabled: false,
  hasPendingBankTransferValidationRequest: false,
  emailAuthEnabled: true,
  googleId: null,
  verifiedAt: "2026-03-01T08:00:00+01:00",
  withdrawal2faEnabled: false,
  commissionThreshold: 500,
  paymentsDisabled: false,
  widgetMessageDisabled: false,
  widgetAlertsDisabled: false,
  widgetAlertsSoundDisabled: false,
  missingPersonalData: false,
  redirectToMissingDataForm: false,
  newStatueAccepted: true,
  fraud: false,
  fraudAmount: 0,
  moderationMode: false,
  messageAudio: true,
  colorTheme: "light",
  minimalAmountAllowed: 100,
  synthMigration: false,
  bankStandardDisabled: false,
  bankExpressDisabled: false,
  paypalStandardDisabled: false,
  paypalExpressDisabled: false,
  fraudCheckTime: "2026-03-30T00:00:00+02:00",
  bankTransferValidationRequested: false,
  validatedWithBankTransfer: true,
};

export const rawProfileFixture = {
  id: "user-123",
  link: "streamer",
  description: "Example profile description",
  fullname: "Example Streamer",
  fullname_locked: true,
  personal_number: null,
  address: {
    city: "Warsaw",
    street: "Example Street 1",
    postal_code: "00-001",
    country: "PL",
  },
  bank_number: null,
  bank_number_modification_date: null,
  paypal_email: "streamer@example.com",
  google_avatar_url: null,
  avatar: {
    provider_metadata: { filename: "avatar.png" },
    name: "avatar.png",
    enabled: true,
    provider_name: "sonata.media.provider.user_image",
    provider_status: 1,
    provider_reference: "avatar.png",
    width: 256,
    height: 256,
    context: "user",
    updated_at: "2026-03-30T00:49:33+02:00",
    created_at: "2026-03-30T00:49:33+02:00",
    content_type: "image/png",
    size: 1024,
    id: 101,
  },
  theme_color: "blue",
  hits: 42,
  social_media_link: "https://twitch.tv/streamer",
  is_company: false,
  contact_name: "Example Streamer",
  contact_email: "streamer@example.com",
  replace_emotes: true,
  emotes_id: "streamer",
  emotes_init: true,
  social_media_links: [{ label: "Twitch", url: "https://twitch.tv/streamer" }],
  show_ranking_and_messages: true,
};

export const profileFixture: UserProfile = {
  id: asUserId("user-123"),
  link: "streamer",
  description: "Example profile description",
  fullname: "Example Streamer",
  fullnameLocked: true,
  personalNumber: null,
  address: {
    city: "Warsaw",
    street: "Example Street 1",
    postalCode: "00-001",
    country: "PL",
  },
  bankNumber: null,
  bankNumberModificationDate: null,
  paypalEmail: "streamer@example.com",
  googleAvatarUrl: null,
  avatar: {
    providerMetadata: { filename: "avatar.png" },
    name: "avatar.png",
    enabled: true,
    providerName: "sonata.media.provider.user_image",
    providerStatus: 1,
    providerReference: "avatar.png",
    width: 256,
    height: 256,
    context: "user",
    updatedAt: "2026-03-30T00:49:33+02:00",
    createdAt: "2026-03-30T00:49:33+02:00",
    contentType: "image/png",
    size: 1024,
    id: 101,
  },
  themeColor: "blue",
  hits: 42,
  socialMediaLink: "https://twitch.tv/streamer",
  isCompany: false,
  contactName: "Example Streamer",
  contactEmail: "streamer@example.com",
  replaceEmotes: true,
  emotesId: "streamer",
  emotesInit: true,
  socialMediaLinks: [{ label: "Twitch", url: "https://twitch.tv/streamer" }],
  showRankingAndMessages: true,
};

export const rawPublicUserProfileFixture = {
  id: "userId",
  nick_name: "przxmus",
  description: "",
  google_avatar_url: "https://cdn.example.com/avatar.png",
  theme_color: "green",
  show_ranking_and_messages: true,
  voice_message_minimal_amount: 500,
  payments_disabled: false,
  verified: false,
  moderation_mode_enabled: false,
  missing_personal_data: true,
  is_fraud: false,
  paypal_enabled: true,
};

export const publicUserProfileFixture: PublicUserProfile = {
  id: asUserId("userId"),
  nickName: "przxmus",
  description: "",
  googleAvatarUrl: "https://cdn.example.com/avatar.png",
  themeColor: "green",
  showRankingAndMessages: true,
  voiceMessageMinimalAmount: 500,
  paymentsDisabled: false,
  verified: false,
  moderationModeEnabled: false,
  missingPersonalData: true,
  isFraud: false,
  paypalEnabled: true,
};

export const tipAlertConfigurationFixture: TipAlertConfiguration = {
  voiceMessages: {
    enabled: true,
    amount: 1500,
  },
  delayingTips: {
    enabled: false,
    delay: 0,
  },
  displaySettings: {
    defaults: {
      sounds: {
        fileId: "",
        fileName: "",
        volume: 0.5,
        mediumId: 101,
      },
      templates: {
        templateId: "template-default",
      },
    },
    thresholds: {
      sounds: [],
      templates: [],
      synth: [
        {
          options: {
            volume: 0.4,
            readAmount: false,
            readMessage: true,
            readNickname: false,
            readLink: false,
            interLink: false,
          },
          voiceType: "GOOGLE_POLISH_FEMALE",
          amount: 0,
          templateId: "DEFAULT_TIP_ALERT_1",
        },
      ],
    },
  },
  twitchActivityTimer: 0,
  kickActivityTimer: 0,
};

export const rawTipAlertConfigurationFixture = {
  voiceMessages: {
    enable: true,
    amount: 1500,
  },
  delayingTips: {
    enable: false,
    delay: 0,
  },
  displaySettings: {
    defaults: {
      sounds: {
        fileId: "",
        fileName: "",
        volume: 0.5,
        mediumId: 101,
      },
      templates: {
        templateId: "template-default",
      },
    },
    tresholds: {
      sounds: [],
      templates: [],
      synth: [
        {
          options: {
            volume: 0.4,
            readAmount: false,
            readMessage: true,
            readNickname: false,
            readLink: false,
            interLink: false,
          },
          voiceType: "GOOGLE_POLISH_FEMALE",
          amount: 0,
          templateId: "DEFAULT_TIP_ALERT_1",
        },
      ],
    },
  },
  twitchActivityTimer: 0,
  kickActivityTimer: 0,
};

export const countdownConfigurationFixture: CounterToEndLiveConfiguration = {
  priceFromAddTime: 1000,
  extraTime: 30,
  startDate: "2026-03-30T00:49:33+02:00",
  twitchActivityTimer: 0,
  showDays: false,
  addTimeWithoutCommission: false,
  kickActivityTimer: 0,
  isCountdownRunning: false,
};

export const settingsFixture: UserConfiguration[] = [
  { type: "COUNTER_TO_END_LIVE", config: countdownConfigurationFixture },
  {
    type: "GLOBAL",
    config: {
      forbiddenWords: ["blocked-word"],
      profanityFilterEnabled: true,
    },
  },
  {
    type: "LARGEST_DONATES",
    config: {
      mode: "latest",
    },
  },
  {
    type: "LATEST_DONATES",
    config: {
      mode: "latest",
    },
  },
  {
    type: "TIP_ALERT",
    config: tipAlertConfigurationFixture,
  },
  {
    type: "TIPS_GOAL",
    config: {
      goalValue: 20000,
      goalName: "New microphone",
      sumPaymentsFrom: "ALL",
      amountWithoutCommission: true,
    },
  },
];

export const rawSettingsFixture = [
  { type: "COUNTER_TO_END_LIVE", config: countdownConfigurationFixture },
  {
    type: "GLOBAL",
    config: {
      forbidden_words: ["blocked-word"],
      profanity_filter_enabled: true,
    },
  },
  { type: "LARGEST_DONATES", config: { mode: "latest" } },
  { type: "LATEST_DONATES", config: { mode: "latest" } },
  { type: "TIP_ALERT", config: rawTipAlertConfigurationFixture },
  {
    type: "TIPS_GOAL",
    config: {
      goalValue: 20000,
      goalName: "New microphone",
      sumPaymentsFrom: "ALL",
      amountWithoutCommission: true,
    },
  },
];

export const paymentMethodsConfigurationFixture: PaymentMethodsConfiguration = {
  cashbill: {
    state: "enabled",
    minimalAmount: 100,
  },
  cashbill_bpp: {
    state: "enabled",
    minimalAmount: 4000,
  },
  paypal: {
    state: "enabled",
    minimalAmount: 1500,
  },
  gt_psc: {
    state: false,
    minimalAmount: 100,
  },
};

export const rawPaymentMethodsConfigurationFixture = {
  cashbill: {
    state: "enabled",
    minimal_amount: 100,
  },
  cashbill_bpp: {
    state: "enabled",
    minimal_amount: 4000,
  },
  paypal: {
    state: "enabled",
    minimal_amount: 1500,
  },
  gt_psc: {
    state: false,
    minimal_amount: 100,
  },
};

export const userPaymentMethodFixture: UserPaymentMethod = {
  enabled: true,
  minimalAmount: 1500,
  humanMethodName: "PayPal",
};

export const rawUserPaymentMethodFixture = {
  enabled: true,
  minimal_amount: 1500,
  human_method_name: "PayPal",
};

export const userPaymentMethodsFixture: UserPaymentMethods = {
  paypal: userPaymentMethodFixture,
  cashbill: {
    enabled: true,
    minimalAmount: 100,
    humanMethodName: "Przelew",
  },
};

export const rawUserPaymentMethodsFixture = {
  paypal: rawUserPaymentMethodFixture,
  cashbill: {
    enabled: true,
    minimal_amount: 100,
    human_method_name: "Przelew",
  },
};

export const goalFixture: Goal = {
  id: asGoalId("goal-123"),
  templateId: asTemplateId("template-123"),
  title: "New microphone",
  target: 20000,
  initialValue: 0,
  withoutCommission: true,
  countFrom: "2026-03-30T00:49:33+02:00",
  createdAt: "2026-03-30T00:49:33+02:00",
  isDefault: true,
};

export const rawGoalFixture = {
  id: "goal-123",
  template_id: "template-123",
  title: "New microphone",
  target: 20000,
  initial_value: 0,
  without_commission: true,
  count_from: "2026-03-30T00:49:33+02:00",
  created: "2026-03-30T00:49:33+02:00",
  is_default: true,
};

export const createGoalFixture: CreateGoalInput = {
  title: "New microphone",
  target: 20000,
  initialValue: 0,
  withoutCommission: true,
  templateId: asTemplateId("template-123"),
};

export const updateGoalFixture = {
  title: "New microphone",
  target: 20000,
  initialValue: 0,
  withoutCommission: true,
  templateId: asTemplateId("template-123"),
  countFrom: "2026-03-30T00:49:33+02:00",
  createdAt: "2026-03-30T00:49:33+02:00",
  isDefault: true,
};

export const votingFixture: GoalVotingConfiguration = {
  goals: [
    {
      goal: goalFixture,
      color: "#007FFF",
      stats: {
        amount: 1000,
        commission: 50,
      },
    },
  ],
};

export const rawVotingFixture = {
  goals: [
    {
      goal: rawGoalFixture,
      color: "#007FFF",
      stats: {
        amount: 1000,
        commission: 50,
      },
    },
  ],
};

export const templateFixture: UserTemplate = {
  id: asTemplateId("template-123"),
  type: "TIPS_GOAL",
  updatedAt: "2026-03-30T00:49:33+02:00",
  config: {
    title: "Goal Template",
    editable: true,
  },
};

export const rawTemplateFixture = {
  id: "template-123",
  type: "TIPS_GOAL",
  updated_at: "2026-03-30T00:49:33+02:00",
  config: {
    title: "Goal Template",
    editable: true,
  },
};

export const publicGoalTemplateFixture: PublicTemplate<
  "TIPS_GOAL",
  TipsGoalTemplateConfig
> = {
  id: asTemplateId("template-123"),
  type: "TIPS_GOAL",
  updatedAt: "2026-03-30T00:49:33+02:00",
  config: {
    title: "Goal Template",
    editable: true,
    elementsOptions: {
      goalName: {
        isVisible: true,
        position: { x: 0, y: 210 },
        styles: {
          color: "#fff",
          fontFamily: "Sora",
          fontSize: 35,
          fontStyle: "normal",
          fontWeight: 900,
          textAlign: "center",
          textShadow: "0px 0px 8px rgba(0, 0, 0, 0.67)",
          width: 800,
          zIndex: 3,
        },
        textValue: "Goal Template",
      },
    },
  },
};

export const rawPublicGoalTemplateFixture = {
  id: "template-123",
  type: "TIPS_GOAL",
  updated_at: "2026-03-30T00:49:33+02:00",
  config: {
    title: "Goal Template",
    editable: true,
    elementsOptions: {
      goalName: {
        isVisible: true,
        position: { x: 0, y: 210 },
        styles: {
          color: "#fff",
          fontFamily: "Sora",
          fontSize: 35,
          fontStyle: "normal",
          fontWeight: 900,
          textAlign: "center",
          textShadow: "0px 0px 8px rgba(0, 0, 0, 0.67)",
          width: 800,
          zIndex: 3,
        },
        textValue: "Goal Template",
      },
    },
  },
};

export const publicGoalTemplatesFixture: PublicTemplate<
  "TIPS_GOAL",
  TipsGoalTemplateConfig
>[] = [publicGoalTemplateFixture];
export const rawPublicGoalTemplatesFixture = [rawPublicGoalTemplateFixture];

export const publicVotingTemplatesFixture: PublicTemplate<"GOAL_VOTING">[] = [
  {
    id: asTemplateId("template-voting-1"),
    type: "GOAL_VOTING",
    updatedAt: "2026-03-30T00:49:33+02:00",
    config: {
      title: "Voting Template",
    },
  },
];

export const rawPublicVotingTemplatesFixture = [
  {
    id: "template-voting-1",
    type: "GOAL_VOTING",
    updated_at: "2026-03-30T00:49:33+02:00",
    config: {
      title: "Voting Template",
    },
  },
];

export const publicGoalConfigurationFixture: TipsGoalConfiguration = {
  goalValue: 20000,
  goalName: "New microphone",
  sumPaymentsFrom: "ALL",
  amountWithoutCommission: true,
};

export const rawPublicGoalConfigurationFixture = {
  type: "TIPS_GOAL",
  config: {
    goalValue: 20000,
    goalName: "New microphone",
    sumPaymentsFrom: "ALL",
    amountWithoutCommission: true,
  },
};

export const publicTemplateFontsFixture =
  "@import url('https://fonts.example.com/sora.css');";

export const publicGoalWidgetFixture: PublicGoalWidget = {
  config: goalFixture,
  stats: {
    amount: 1000,
    commission: 50,
  },
};

export const rawPublicGoalWidgetFixture = {
  config: rawGoalFixture,
  stats: {
    amount: 1000,
    commission: 50,
  },
};

export const tipFixture: Tip = {
  id: asTipId("tip-123"),
  paymentId: asPaymentId("payment-123"),
  commission: 50,
  test: false,
  resent: false,
  consumed: false,
  countPoints: true,
  source: "internal",
  referrer: "",
  deleted: false,
  nickname: "Supporter",
  nicknameTts: "",
  email: "supporter@example.com",
  amount: 1500,
  goal: goalFixture,
  goalTitle: "New microphone",
  message: "Great stream",
  messageTts: "",
  createdAt: "2026-03-30T00:49:33+02:00",
  humanMethodName: "PayPal",
};

export const rawTipFixture = {
  payment_id: "payment-123",
  commission: 50,
  test: false,
  resent: false,
  consumed: false,
  count_points: true,
  source: "internal",
  referrer: "",
  deleted: false,
  id: "tip-123",
  nickname: "Supporter",
  nickname_tts: "",
  email: "supporter@example.com",
  amount: 1500,
  goal: rawGoalFixture,
  goal_title: "New microphone",
  message: "Great stream",
  message_tts: "",
  created_at: "2026-03-30T00:49:33+02:00",
  human_method_name: "PayPal",
};

export const moderatorFixture: Moderator = {
  id: asModeratorId("moderator-123"),
  userId: asUserId("user-123"),
  moderationMode: "1",
  moderatorName: "Moderator One",
  linkTime: 100,
  link: "",
  createdAt: "2026-03-30T00:49:33+02:00",
};

export const rawModeratorFixture = {
  user_id: "user-123",
  moderation_mode: "1",
  id: "moderator-123",
  moderator_name: "Moderator One",
  link_time: 100,
  link: "",
  created: "2026-03-30T00:49:33+02:00",
};

export const createModeratorFixture: CreateModeratorInput = {
  moderatorName: "Moderator One",
  linkTime: 100,
  link: "",
};

export const mediaFixture: MediaItem = {
  id: asMediaId(501),
  providerMetadata: { filename: "alert.mp3" },
  name: "alert.mp3",
  enabled: true,
  providerName: "sonata.media.provider.audio",
  providerStatus: 1,
  providerReference: "alert.mp3",
  width: 0,
  height: 0,
  context: "alerts",
  updatedAt: "2026-03-30T00:49:33+02:00",
  createdAt: "2026-03-30T00:49:33+02:00",
  contentType: "audio/mpeg",
  size: 2048,
};

export const rawMediaFixture = {
  provider_metadata: { filename: "alert.mp3" },
  name: "alert.mp3",
  enabled: true,
  provider_name: "sonata.media.provider.audio",
  provider_status: 1,
  provider_reference: "alert.mp3",
  width: 0,
  height: 0,
  context: "alerts",
  updated_at: "2026-03-30T00:49:33+02:00",
  created_at: "2026-03-30T00:49:33+02:00",
  content_type: "audio/mpeg",
  size: 2048,
  id: 501,
};

export const mediaUsageFixture: MediaUsage = {
  usage: 2048,
  total: 10240,
};

export const mediaFormatsFixture: MediaFormats = {
  reference: {
    url: "https://cdn.example.com/alert.mp3",
    properties: {
      src: "https://cdn.example.com/alert.mp3",
      title: "alert.mp3",
    },
  },
};

export const rawMediaFormatsFixture = {
  reference: {
    url: "https://cdn.example.com/alert.mp3",
    properties: {
      src: "https://cdn.example.com/alert.mp3",
      title: "alert.mp3",
    },
  },
};

export const accountFixture: Account = {
  accountId: asAccountId("account-123"),
  balance: 5000,
  locked: false,
  status: "ACTIVE",
  type: "PRIMARY",
  openedAt: "2026-03-30T00:49:33+02:00",
  company: false,
};

export const rawAccountFixture = {
  account_id: "account-123",
  balance: 5000,
  locked: false,
  status: "ACTIVE",
  type: "PRIMARY",
  opened_at: "2026-03-30T00:49:33+02:00",
  company: false,
};

export const withdrawalFixture: Withdrawal = {
  withdrawalId: asWithdrawalId("withdrawal-123"),
  methodName: "paypal",
  amount: 4000,
  commission: 100,
  status: "ACCEPTED",
  requestedAt: "2026-03-30T00:49:33+02:00",
  acceptedAt: "2026-03-30T01:00:00+02:00",
  transferredAt: null,
  canPrintConfirmation: false,
  invoiceNumber: null,
  humanMethodName: "PayPal",
};

export const rawWithdrawalFixture = {
  withdrawal_id: "withdrawal-123",
  method_name: "paypal",
  amount: 4000,
  commission: 100,
  status: "ACCEPTED",
  requested_at: "2026-03-30T00:49:33+02:00",
  accepted_at: "2026-03-30T01:00:00+02:00",
  transferred_at: null,
  can_print_confirmation: false,
  invoice_number: null,
  human_method_name: "PayPal",
};

export const withdrawalMethodsFixture: WithdrawalMethodsConfiguration = {
  paypal: {
    state: "enabled",
  },
  bank_standard: {
    state: "enabled",
  },
};

export const rawWithdrawalMethodsFixture = withdrawalMethodsFixture;

export const reportFixture: Report = {
  id: asReportId("report-1"),
  isDownloadable: true,
  reportNumber: "RPT-1",
  generatedAt: "2026-03-30T00:49:33+02:00",
};

export const rawReportFixture = {
  is_downloadable: true,
  report_number: "RPT-1",
  generated_at: "2026-03-30T00:49:33+02:00",
  id: "report-1",
};

export const notificationFixture: DashboardNotification = {
  id: "notification-1",
  type: "user_verified",
  payload: {
    message: "Account verified",
  },
  createdAt: "2026-03-30T00:49:33+02:00",
  readAt: null,
};

export const rawNotificationFixture = {
  id: "notification-1",
  type: "user_verified",
  payload: {
    message: "Account verified",
  },
  created_at: "2026-03-30T00:49:33+02:00",
  read_at: null,
};

export const dashboardAnnouncementFixture: DashboardAnnouncement = {
  id: "announcement-1",
};
export const extraDashboardAnnouncementFixture: DashboardAnnouncement = {
  id: "announcement-2",
};

export const forbiddenWordsFixture: ForbiddenWordsSettings = {
  enabled: true,
  words: ["blocked-word"],
};

export const profanityFilterFixture: ProfanityFilterSettings = {
  enabled: true,
};

export const toggleDisabledFixture: ToggleDisabledResult = {
  disabled: false,
};
