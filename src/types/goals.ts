import type { ISODateString, MinorUnitAmount, UUID } from "./common";

export interface GoalRecord {
  id: UUID;
  template_id: string;
  title: string;
  target: MinorUnitAmount;
  initial_value: MinorUnitAmount;
  without_commission: boolean;
  count_from: ISODateString;
  created: ISODateString;
  is_default: boolean;
}

export interface CreateGoalRequest {
  title: string;
  target: MinorUnitAmount;
  initial_value: MinorUnitAmount;
  without_commission: boolean;
  template_id: string;
}

export interface GoalStats {
  amount: MinorUnitAmount;
  commission: MinorUnitAmount;
}

export interface GoalVotingEntry {
  goal: GoalRecord;
  color: string;
  stats: GoalStats;
}

export interface GoalVotingConfiguration {
  goals: GoalVotingEntry[];
}
