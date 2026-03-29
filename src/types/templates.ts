import type { ISODateString, JsonObject, JsonValue, LiteralUnion, MinorUnitAmount, UUID } from "./common";
import type { GoalRecord, GoalStats, GoalVotingConfiguration } from "./goals";
import type { TipsGoalConfiguration } from "./configurations";

export type UserTemplateType = LiteralUnion<"TIP_ALERT" | "TIPS_GOAL" | "LATEST_DONATES" | "LARGEST_DONATES">;

export type PublicTemplateType = LiteralUnion<"TIPS_GOAL" | "GOAL_VOTING">;

export interface BaseTemplateRecord<TType extends string, TConfig> {
  id: UUID;
  type: TType;
  config: TConfig;
  updated_at: ISODateString;
}

export type TipAlertTemplateRecord = BaseTemplateRecord<"TIP_ALERT", JsonObject>;
export type TipsGoalTemplateRecord = BaseTemplateRecord<"TIPS_GOAL", JsonObject>;
export type LatestDonatesTemplateRecord = BaseTemplateRecord<"LATEST_DONATES", JsonObject>;
export type LargestDonatesTemplateRecord = BaseTemplateRecord<"LARGEST_DONATES", JsonObject>;

export type UserTemplateRecord =
  | TipAlertTemplateRecord
  | TipsGoalTemplateRecord
  | LatestDonatesTemplateRecord
  | LargestDonatesTemplateRecord;

export type GoalVotingTemplateRecord = BaseTemplateRecord<"GOAL_VOTING", JsonObject>;

export type PublicGoalTemplateRecord = TipsGoalTemplateRecord;
export type PublicVotingTemplateRecord = GoalVotingTemplateRecord;

export interface TemplateElementPosition extends JsonObject {
  x: number;
  y: number;
}

export interface TemplateElementOption extends JsonObject {
  styles?: JsonObject;
  position?: TemplateElementPosition;
  isVisible?: boolean;
  textValue?: string;
}

export interface TipsGoalTemplateElementsOptions extends JsonObject {
  goalName?: TemplateElementOption;
  amountPaid?: TemplateElementOption;
  goalNumbers?: TemplateElementOption;
  progressBar?: TemplateElementOption;
  visualObject?: TemplateElementOption;
}

export interface CounterTemplateElementsOptions extends JsonObject {
  textInput?: TemplateElementOption;
  additionalTime?: TemplateElementOption;
  visualObject?: TemplateElementOption;
}

export interface TipsGoalTemplateUpdateRequest extends JsonObject {
  title: string;
  editable: boolean;
  elementsOptions: TipsGoalTemplateElementsOptions;
}

export interface CounterTemplateUpdateRequest extends JsonObject {
  title: string;
  editable: boolean;
  amountWithoutCommission: boolean;
  spacingBetweenElements: number;
  numberDisplayedItems: number;
  displayDirection: LiteralUnion<"vertical" | "horizontal">;
  showDonatesFromDate: JsonObject;
  animation: {
    enable: boolean;
    duration: number;
  };
  elementsOptions: CounterTemplateElementsOptions;
  mode?: string;
}

export interface GenericTemplateUpdateRequest extends JsonObject {
  title: string;
  editable: boolean;
  elementsOptions: JsonObject;
}

export type TemplateUpdateRequest = TipsGoalTemplateUpdateRequest | CounterTemplateUpdateRequest | GenericTemplateUpdateRequest;

export interface PublicGoalWidgetResponse {
  config: GoalRecord;
  stats: GoalStats;
}

export interface PublicTipsGoalConfigurationRecord {
  type: "TIPS_GOAL";
  config: TipsGoalConfiguration;
}

export type PublicGoalVotingConfigurationRecord = GoalVotingConfiguration;
