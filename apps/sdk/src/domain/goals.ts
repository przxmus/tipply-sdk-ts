import type { IsoDateString, MinorUnitAmount } from "./shared";

export interface CreateGoalInput {
  title: string;
  target: MinorUnitAmount;
  initialValue: MinorUnitAmount;
  withoutCommission: boolean;
  templateId: string;
}

export interface UpdateGoalInput extends CreateGoalInput {
  countFrom: IsoDateString;
  createdAt: IsoDateString;
  isDefault: boolean;
}

export function toCreateGoalWire(input: CreateGoalInput): Record<string, unknown> {
  return {
    title: input.title,
    target: input.target,
    initial_value: input.initialValue,
    without_commission: input.withoutCommission,
    template_id: input.templateId,
  };
}

export function toUpdateGoalWire(input: UpdateGoalInput): Record<string, unknown> {
  return {
    title: input.title,
    target: input.target,
    initial_value: input.initialValue,
    without_commission: input.withoutCommission,
    template_id: input.templateId,
    count_from: input.countFrom,
    created: input.createdAt,
    is_default: input.isDefault,
  };
}
