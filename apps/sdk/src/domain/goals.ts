import type { TemplateId } from "./ids";
import type { IsoDateString, MinorUnitAmount } from "./shared";

/** Input payload accepted by `client.goals.create()`. */
export interface CreateGoalInput {
  title: string;
  target: MinorUnitAmount;
  initialValue: MinorUnitAmount;
  withoutCommission: boolean;
  templateId: TemplateId;
}

/** Full goal payload accepted by `client.goals.id(goalId).update()`. */
export interface UpdateGoalInput extends CreateGoalInput {
  countFrom: IsoDateString;
  createdAt: IsoDateString;
  isDefault: boolean;
}

/**
 * Serializes a goal creation payload into Tipply's wire format.
 *
 * @param input - The goal input to serialize.
 * @returns A wire-format object ready to send to Tipply.
 */
export function toCreateGoalWire(input: CreateGoalInput): Record<string, unknown> {
  return {
    title: input.title,
    target: input.target,
    initial_value: input.initialValue,
    without_commission: input.withoutCommission,
    template_id: input.templateId,
  };
}

/**
 * Serializes a goal update payload into Tipply's wire format.
 *
 * @param input - The goal update input to serialize.
 * @returns A wire-format object ready to send to Tipply.
 */
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
