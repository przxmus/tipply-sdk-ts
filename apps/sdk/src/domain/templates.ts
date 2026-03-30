import type {
  CounterTemplateElementsOptions,
  TemplateElementOption,
  TipsGoalTemplateConfig,
  UnknownTemplateConfig,
} from "./shared";

/** Replacement input for `TIPS_GOAL` templates. */
export interface TipsGoalTemplateReplacementInput extends TipsGoalTemplateConfig {}

/** Replacement input for counter-based templates such as latest or largest donations. */
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

/** Fallback replacement input for templates with unknown config shapes. */
export interface GenericTemplateReplacementInput {
  title: string;
  editable: boolean;
  elementsOptions: UnknownTemplateConfig;
}

/** Supported template replacement payloads accepted by `templates.id(...).replace()`. */
export type TemplateReplacementInput =
  | TipsGoalTemplateReplacementInput
  | CounterTemplateReplacementInput
  | GenericTemplateReplacementInput;

/** Serializes a template replacement payload to Tipply's expected wire shape. */
export function toTemplateReplacementWire(input: TemplateReplacementInput): Record<string, unknown> {
  return input as unknown as Record<string, unknown>;
}

/** Alias for a single template element configuration node. */
export type TemplateElement = TemplateElementOption;
