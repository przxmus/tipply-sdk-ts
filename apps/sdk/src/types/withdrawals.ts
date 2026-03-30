import type { ISODateString, JsonObject, LiteralUnion, MinorUnitAmount } from "./common";

export type WithdrawalStatus = LiteralUnion<"ACCEPTED" | "TRANSFERRED">;

export type WithdrawalMethodKey = LiteralUnion<"bank_express" | "bank_standard" | "paypal" | "paypal_express">;

export interface AccountRecord {
  account_id: string;
  balance: MinorUnitAmount;
  locked: boolean;
  status: string;
  type: string;
  opened_at: ISODateString;
  company: boolean;
}

export interface WithdrawalRecord {
  withdrawal_id: string;
  method_name: string;
  amount: MinorUnitAmount;
  commission: MinorUnitAmount;
  status: WithdrawalStatus;
  requested_at: ISODateString;
  accepted_at?: ISODateString | null;
  transferred_at?: ISODateString | null;
  can_print_confirmation: boolean;
  invoice_number?: string | null;
  human_method_name: string;
}

export type WithdrawalMethodsConfiguration = Partial<Record<WithdrawalMethodKey, JsonObject>>;

export interface ListWithdrawalsQuery {
  statuses?: readonly WithdrawalStatus[];
  limit?: number;
  offset?: number;
}
