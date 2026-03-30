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

export function asUserId(value: string): UserId {
  return brandString<"UserId">(value);
}

export function asGoalId(value: string): GoalId {
  return brandString<"GoalId">(value);
}

export function asTemplateId(value: string): TemplateId {
  return brandString<"TemplateId">(value);
}

export function asTipId(value: string): TipId {
  return brandString<"TipId">(value);
}

export function asPaymentId(value: string): PaymentId {
  return brandString<"PaymentId">(value);
}

export function asModeratorId(value: string): ModeratorId {
  return brandString<"ModeratorId">(value);
}

export function asMediaId(value: number): MediaId {
  return brandNumber<"MediaId">(value);
}

export function asWithdrawalId(value: string): WithdrawalId {
  return brandString<"WithdrawalId">(value);
}

export function asAccountId(value: string): AccountId {
  return brandString<"AccountId">(value);
}

export function asReportId(value: string): ReportId {
  return brandString<"ReportId">(value);
}
