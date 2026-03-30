type Brand<TValue, TName extends string> = TValue & {
  readonly __brand: TName;
};

/** Branded identifier for a Tipply user. */
export type UserId = Brand<string, "UserId">;
/** Branded identifier for a Tipply goal. */
export type GoalId = Brand<string, "GoalId">;
/** Branded identifier for a Tipply template. */
export type TemplateId = Brand<string, "TemplateId">;
/** Branded identifier for a Tipply tip. */
export type TipId = Brand<string, "TipId">;
/** Branded identifier for a Tipply payment. */
export type PaymentId = Brand<string, "PaymentId">;
/** Branded identifier for a Tipply moderator. */
export type ModeratorId = Brand<string, "ModeratorId">;
/** Branded identifier for a Tipply media item. */
export type MediaId = Brand<number, "MediaId">;
/** Branded identifier for a Tipply withdrawal. */
export type WithdrawalId = Brand<string, "WithdrawalId">;
/** Branded identifier for a Tipply payout account. */
export type AccountId = Brand<string, "AccountId">;
/** Branded identifier for a Tipply report. */
export type ReportId = Brand<string, "ReportId">;

function brandString<TBrand extends string>(value: string): Brand<string, TBrand> {
  return value as Brand<string, TBrand>;
}

function brandNumber<TBrand extends string>(value: number): Brand<number, TBrand> {
  return value as Brand<number, TBrand>;
}

/** Casts a raw string into a branded `UserId`. */
export function asUserId(value: string): UserId {
  return brandString<"UserId">(value);
}

/** Casts a raw string into a branded `GoalId`. */
export function asGoalId(value: string): GoalId {
  return brandString<"GoalId">(value);
}

/** Casts a raw string into a branded `TemplateId`. */
export function asTemplateId(value: string): TemplateId {
  return brandString<"TemplateId">(value);
}

/** Casts a raw string into a branded `TipId`. */
export function asTipId(value: string): TipId {
  return brandString<"TipId">(value);
}

/** Casts a raw string into a branded `PaymentId`. */
export function asPaymentId(value: string): PaymentId {
  return brandString<"PaymentId">(value);
}

/** Casts a raw string into a branded `ModeratorId`. */
export function asModeratorId(value: string): ModeratorId {
  return brandString<"ModeratorId">(value);
}

/** Casts a raw number into a branded `MediaId`. */
export function asMediaId(value: number): MediaId {
  return brandNumber<"MediaId">(value);
}

/** Casts a raw string into a branded `WithdrawalId`. */
export function asWithdrawalId(value: string): WithdrawalId {
  return brandString<"WithdrawalId">(value);
}

/** Casts a raw string into a branded `AccountId`. */
export function asAccountId(value: string): AccountId {
  return brandString<"AccountId">(value);
}

/** Casts a raw string into a branded `ReportId`. */
export function asReportId(value: string): ReportId {
  return brandString<"ReportId">(value);
}
