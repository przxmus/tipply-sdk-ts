import type {
  CounterTemplateElementsOptions,
  TemplateElementOption,
  TipsGoalTemplateConfig,
  UnknownTemplateConfig,
} from "./shared";

export interface TipsGoalTemplateReplacementInput extends TipsGoalTemplateConfig {}

export interface CounterTemplateReplacementInput {
  title: string;
  editable: boolean;
  amountWithoutCommission: boolean;
  spacingBetweenElements: number;
  numberDisplayedItems: number;
  displayDirection: "vertical" | "horizontal" | (string & {});
  showDonatesFromDate: Record<string, unknown>;
  animation: {
    enable: boolean;
    duration: number;
  };
  elementsOptions: CounterTemplateElementsOptions;
  mode?: string;
}

export interface GenericTemplateReplacementInput {
  title: string;
  editable: boolean;
  elementsOptions: UnknownTemplateConfig;
}

export type TemplateReplacementInput =
  | TipsGoalTemplateReplacementInput
  | CounterTemplateReplacementInput
  | GenericTemplateReplacementInput;

export function toTemplateReplacementWire(input: TemplateReplacementInput): Record<string, unknown> {
  return input as unknown as Record<string, unknown>;
}

export type TemplateElement = TemplateElementOption;
