import type { GoalId, PaymentId, TipId, UserId } from "./ids";
import type { IsoDateString, MinorUnitAmount } from "./shared";

/** Parsed donation payload emitted by realtime `TIP_ALERT` listeners. */
export interface TipAlertDonation {
  id: TipId;
  receiverId: UserId;
  nickname: string;
  email: string;
  message?: string | null;
  amount: MinorUnitAmount;
  commission: MinorUnitAmount;
  test: boolean;
  resent: boolean;
  source: string;
  paymentId?: PaymentId | null;
  audioUrl?: string | null;
  goalId?: GoalId | null;
  moderatedAt?: IsoDateString | null;
  createdAt: IsoDateString;
  goalTitle?: string | null;
  ttsNicknameGoogleFemale?: string | null;
  ttsMessageGoogleFemale?: string | null;
  ttsAmountGoogleFemale?: string | null;
  raw: Record<string, unknown>;
}
