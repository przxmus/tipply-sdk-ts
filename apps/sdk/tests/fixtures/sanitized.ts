import type {
  CounterToEndLiveConfiguration,
  ForbiddenWordsResponse,
  GoalRecord,
  GoalVotingConfiguration,
  NotificationRecord,
  PaymentMethodsConfiguration,
  ProfanityFilterResponse,
  PublicGoalTemplateRecord,
  PublicGoalWidgetResponse,
  PublicTipsGoalConfigurationRecord,
  PublicVotingTemplateRecord,
  ReportRecord,
  TipAlertConfiguration,
  TipRecord,
  ToggleDisabledResponse,
  UserConfigurationRecord,
  UserPaymentMethod,
  UserPaymentMethods,
  UserProfile,
  UserTemplateRecord,
  WithdrawalMethodsConfiguration,
  WithdrawalRecord,
} from "../../src";
import type { AccountRecord, CreateModeratorRequest, CurrentUser, MediaUsage, MediumFormats, MediumRecord, ModeratorRecord } from "../../src";

export const currentUserFixture: CurrentUser = {
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

export const profileFixture: UserProfile = {
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

export const tipAlertConfigurationFixture: TipAlertConfiguration = {
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

export const configurationsFixture: UserConfigurationRecord[] = [
  {
    type: "COUNTER_TO_END_LIVE",
    config: countdownConfigurationFixture,
  },
  {
    type: "GLOBAL",
    config: {
      forbidden_words: ["blocked-word"],
      profanity_filter_enabled: true,
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

export const paymentMethodsConfigurationFixture: PaymentMethodsConfiguration = {
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
  minimal_amount: 1500,
  human_method_name: "PayPal",
};

export const userPaymentMethodsFixture: UserPaymentMethods = {
  paypal: userPaymentMethodFixture,
  cashbill: {
    enabled: true,
    minimal_amount: 100,
    human_method_name: "Przelew",
  },
};

export const goalFixture: GoalRecord = {
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

export const templateFixture: UserTemplateRecord = {
  id: "template-123",
  type: "TIPS_GOAL",
  updated_at: "2026-03-30T00:49:33+02:00",
  config: {
    title: "Goal Template",
    editable: true,
  },
};

export const publicGoalTemplatesFixture: PublicGoalTemplateRecord[] = [templateFixture];

export const publicVotingTemplatesFixture: PublicVotingTemplateRecord[] = [
  {
    id: "template-voting-1",
    type: "GOAL_VOTING",
    updated_at: "2026-03-30T00:49:33+02:00",
    config: {
      title: "Voting Template",
    },
  },
];

export const publicGoalConfigurationFixture: PublicTipsGoalConfigurationRecord = {
  type: "TIPS_GOAL",
  config: {
    goalValue: 20000,
    goalName: "New microphone",
    sumPaymentsFrom: "ALL",
    amountWithoutCommission: true,
  },
};

export const publicGoalWidgetFixture: PublicGoalWidgetResponse = {
  config: goalFixture,
  stats: {
    amount: 1000,
    commission: 50,
  },
};

export const tipFixture: TipRecord = {
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
  goal: goalFixture,
  goal_title: "New microphone",
  message: "Great stream",
  message_tts: "",
  created_at: "2026-03-30T00:49:33+02:00",
  human_method_name: "PayPal",
};

export const moderatorFixture: ModeratorRecord = {
  user_id: "user-123",
  moderation_mode: "1",
  id: "moderator-123",
  moderator_name: "Moderator One",
  link_time: 100,
  link: "",
  created: "2026-03-30T00:49:33+02:00",
};

export const createModeratorFixture: CreateModeratorRequest = {
  moderator_name: "Moderator One",
  link_time: 100,
  link: "",
};

export const mediumFixture: MediumRecord = {
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

export const mediumFormatsFixture: MediumFormats = {
  reference: {
    url: "https://cdn.example.com/alert.mp3",
    properties: {
      src: "https://cdn.example.com/alert.mp3",
      title: "alert.mp3",
    },
  },
};

export const accountFixture: AccountRecord = {
  account_id: "account-123",
  balance: 5000,
  locked: false,
  status: "ACTIVE",
  type: "PRIMARY",
  opened_at: "2026-03-30T00:49:33+02:00",
  company: false,
};

export const withdrawalFixture: WithdrawalRecord = {
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

export const reportFixture: ReportRecord = {
  is_downloadable: true,
  report_number: "RPT-1",
  generated_at: "2026-03-30T00:49:33+02:00",
  id: "report-1",
};

export const notificationFixture: NotificationRecord = {
  id: "notification-1",
  type: "user_verified",
  payload: {
    message: "Account verified",
  },
  created_at: "2026-03-30T00:49:33+02:00",
  read_at: null,
};

export const forbiddenWordsFixture: ForbiddenWordsResponse = {
  enabled: true,
  words: ["blocked-word"],
};

export const profanityFilterFixture: ProfanityFilterResponse = {
  enabled: true,
};

export const toggleDisabledFixture: ToggleDisabledResponse = {
  disabled: false,
};
