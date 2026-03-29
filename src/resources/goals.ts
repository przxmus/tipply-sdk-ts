import { assertArray, assertPlainObject, assertString } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { CreateGoalRequest, GoalRecord, GoalVotingConfiguration } from "../types/goals";

function assertGoalRecord(value: unknown): asserts value is GoalRecord {
  const context = { method: "GET", url: "/user/goals" };
  assertPlainObject(value, context);
  assertString(value.id, context, "Expected goal id");
  assertString(value.title, context, "Expected goal title");
}

function assertGoals(value: unknown): asserts value is GoalRecord[] {
  const context = { method: "GET", url: "/user/goals" };
  assertArray(value, context);

  for (const item of value) {
    assertGoalRecord(item);
  }
}

function assertVoting(value: unknown): asserts value is GoalVotingConfiguration {
  assertPlainObject(value, { method: "GET", url: "/user/voting" });
}

export class GoalsApi {
  constructor(private readonly httpClient: HttpClient) {}

  list(): Promise<GoalRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/goals",
      requiresAuth: true,
      validator: assertGoals,
    });
  }

  create(payload: CreateGoalRequest): Promise<GoalRecord> {
    return this.httpClient.request({
      method: "POST",
      path: "/user/goals",
      body: payload,
      requiresAuth: true,
      validator: assertGoalRecord,
    });
  }

  update(goalId: string, payload: GoalRecord): Promise<void> {
    return this.httpClient.request({
      method: "PATCH",
      path: `/user/goals/${goalId}`,
      body: payload,
      requiresAuth: true,
    });
  }

  reset(goalId: string): Promise<void> {
    return this.httpClient.request({
      method: "PATCH",
      path: `/user/goals/${goalId}/reset`,
      requiresAuth: true,
    });
  }

  getVoting(): Promise<GoalVotingConfiguration> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/voting",
      requiresAuth: true,
      validator: assertVoting,
    });
  }
}
