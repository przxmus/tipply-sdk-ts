import type { ISODateString, JsonObject, LiteralUnion, MinorUnitAmount } from "./common";
import type { TipRecord } from "./tips";

export type NotificationType = LiteralUnion<"withdrawal_accepted" | "profile_verified" | "user_verified">;

export interface AnnouncementRecord extends JsonObject {}

export interface IncomeStatistics {
  total: MinorUnitAmount;
  last28: MinorUnitAmount;
  last7: MinorUnitAmount;
  last7_percent_change: number;
  current_month: MinorUnitAmount;
  current_month_percent_change: number;
}

export interface TipStatistics {
  count: number;
  count_percentage: number;
  messages_length: number;
  messages_length_percentage: number;
}

export interface NotificationRecord {
  id: string | number;
  type: NotificationType;
  payload: JsonObject;
  created_at: ISODateString;
  read_at?: ISODateString | null;
}

export type RecentTipRecord = TipRecord;
