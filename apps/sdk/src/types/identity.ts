import type { ISODateString, MinorUnitAmount, UUID } from "./common";

export interface CurrentUser {
  id: UUID;
  username: string;
  email: string;
  last_login?: ISODateString | null;
  is_verified: boolean;
  google_auth_enabled: boolean;
  has_pending_banktransfer_validation_request: boolean;
  email_auth_enabled: boolean;
  google_id?: string | null;
  verified_at?: ISODateString | null;
  withdrawal_2fa_enabled: boolean;
  commission_threshold: MinorUnitAmount;
  payments_disabled: boolean;
  widget_message_disabled: boolean;
  widget_alerts_disabled: boolean;
  widget_alerts_sound_disabled: boolean;
  missing_personal_data: boolean;
  redirect_to_missing_data_form: boolean;
  new_statue_accepted: boolean;
  fraud: boolean;
  fraud_amount: MinorUnitAmount;
  moderation_mode: boolean;
  message_audio: boolean;
  color_theme?: string | null;
  minimal_amount_allowed: MinorUnitAmount;
  synth_migration: boolean;
  bank_standard_disabled: boolean;
  bank_express_disabled: boolean;
  paypal_standard_disabled: boolean;
  paypal_express_disabled: boolean;
  fraud_check_time?: ISODateString | null;
  bank_transfer_validation_requested: boolean;
  validated_with_bank_transfer: boolean;
}
