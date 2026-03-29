import type { JsonObject, LiteralUnion, MinorUnitAmount } from "./common";

export type PaymentMethodKey = LiteralUnion<
  | "cashbill"
  | "cashbill_blik"
  | "cashbill_bpp"
  | "cashbill_credit_card"
  | "justpay"
  | "justpay_classic"
  | "justpay_full"
  | "paypal"
  | "psc"
>;

export type PaymentMethodConfigurationKey = PaymentMethodKey | "gt_psc";

export interface PaymentMethodConfigurationEntry extends JsonObject {
  state?: string | boolean;
  minimal_amount?: MinorUnitAmount;
  disabled_label?: string;
  tooltip_text?: string;
  on_hover_text?: string;
  home_percentage_prefix?: string;
  home_percentage?: number;
  home_fixed?: MinorUnitAmount;
  is_for_verified?: boolean;
}

export type PaymentMethodsConfiguration = Partial<Record<PaymentMethodConfigurationKey, PaymentMethodConfigurationEntry>>;

export interface UserPaymentMethod {
  enabled: boolean;
  minimal_amount: MinorUnitAmount;
  human_method_name: string;
}

export type UserPaymentMethods = Partial<Record<PaymentMethodKey, UserPaymentMethod>>;

export type UpdatePaymentMethodRequest = { enabled: boolean } | { minimalAmount: MinorUnitAmount };
