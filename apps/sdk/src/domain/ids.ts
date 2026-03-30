type Brand<TValue, TName extends string> = TValue & {
  readonly __brand: TName;
};

export type UserId = Brand<string, "UserId">;
export type GoalId = Brand<string, "GoalId">;
export type TemplateId = Brand<string, "TemplateId">;
export type TipId = Brand<string, "TipId">;
export type PaymentId = Brand<string, "PaymentId">;
export type ModeratorId = Brand<string, "ModeratorId">;
export type MediaId = Brand<number, "MediaId">;
export type WithdrawalId = Brand<string, "WithdrawalId">;
export type AccountId = Brand<string, "AccountId">;
export type ReportId = Brand<string, "ReportId">;

function brandString<TBrand extends string>(value: string): Brand<string, TBrand> {
  return value as Brand<string, TBrand>;
}

function brandNumber<TBrand extends string>(value: number): Brand<number, TBrand> {
  return value as Brand<number, TBrand>;
}

/**
 * Casts a raw string into a branded `UserId`.
 *
 * @param value - The raw user identifier returned by Tipply.
 * @returns The same value narrowed to {@link UserId}.
 */
export function asUserId(value: string): UserId {
  return brandString<"UserId">(value);
}

/**
 * Casts a raw string into a branded `GoalId`.
 *
 * @param value - The raw goal identifier returned by Tipply.
 * @returns The same value narrowed to {@link GoalId}.
 */
export function asGoalId(value: string): GoalId {
  return brandString<"GoalId">(value);
}

/**
 * Casts a raw string into a branded `TemplateId`.
 *
 * @param value - The raw template identifier returned by Tipply.
 * @returns The same value narrowed to {@link TemplateId}.
 */
export function asTemplateId(value: string): TemplateId {
  return brandString<"TemplateId">(value);
}

/**
 * Casts a raw string into a branded `TipId`.
 *
 * @param value - The raw tip identifier returned by Tipply.
 * @returns The same value narrowed to {@link TipId}.
 */
export function asTipId(value: string): TipId {
  return brandString<"TipId">(value);
}

/**
 * Casts a raw string into a branded `PaymentId`.
 *
 * @param value - The raw payment identifier returned by Tipply.
 * @returns The same value narrowed to {@link PaymentId}.
 */
export function asPaymentId(value: string): PaymentId {
  return brandString<"PaymentId">(value);
}

/**
 * Casts a raw string into a branded `ModeratorId`.
 *
 * @param value - The raw moderator identifier returned by Tipply.
 * @returns The same value narrowed to {@link ModeratorId}.
 */
export function asModeratorId(value: string): ModeratorId {
  return brandString<"ModeratorId">(value);
}

/**
 * Casts a raw number into a branded `MediaId`.
 *
 * @param value - The raw media identifier returned by Tipply.
 * @returns The same value narrowed to {@link MediaId}.
 */
export function asMediaId(value: number): MediaId {
  return brandNumber<"MediaId">(value);
}

/**
 * Casts a raw string into a branded `WithdrawalId`.
 *
 * @param value - The raw withdrawal identifier returned by Tipply.
 * @returns The same value narrowed to {@link WithdrawalId}.
 */
export function asWithdrawalId(value: string): WithdrawalId {
  return brandString<"WithdrawalId">(value);
}

/**
 * Casts a raw string into a branded `AccountId`.
 *
 * @param value - The raw payout account identifier returned by Tipply.
 * @returns The same value narrowed to {@link AccountId}.
 */
export function asAccountId(value: string): AccountId {
  return brandString<"AccountId">(value);
}

/**
 * Casts a raw string into a branded `ReportId`.
 *
 * @param value - The raw report identifier returned by Tipply.
 * @returns The same value narrowed to {@link ReportId}.
 */
export function asReportId(value: string): ReportId {
  return brandString<"ReportId">(value);
}
