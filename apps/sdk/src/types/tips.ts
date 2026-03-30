import type { ISODateString, LiteralUnion, MinorUnitAmount, UUID } from "./common";
import type { JsonObject } from "./common";
import type { GoalRecord } from "./goals";

export type TipFilter = LiteralUnion<"default" | "amount" | "paymentMethod">;

export interface TipRecord {
  payment_id: UUID;
  commission: MinorUnitAmount;
  test: boolean;
  resent: boolean;
  consumed: boolean;
  count_points: boolean;
  source: string;
  referrer: string;
  deleted: boolean;
  id: UUID;
  nickname: string;
  nickname_tts: string;
  email: string;
  amount: MinorUnitAmount;
  goal?: GoalRecord | null;
  goal_title?: string;
  message?: string;
  message_tts?: string;
  created_at: ISODateString;
  human_method_name: string;
}

export interface ListTipsQuery {
  limit?: number;
  offset?: number;
  filter?: TipFilter;
  search?: string;
}

export interface TipsModerationRecord extends JsonObject {}

export interface TipsPendingRecord extends JsonObject {}
