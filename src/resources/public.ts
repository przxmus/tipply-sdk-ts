import { assertArray, assertBoolean, assertPlainObject } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { GoalVotingConfiguration } from "../types/goals";
import type {
  PublicGoalTemplateRecord,
  PublicGoalWidgetResponse,
  PublicTipsGoalConfigurationRecord,
  PublicVotingTemplateRecord,
} from "../types/templates";

function assertGoalTemplates(value: unknown): asserts value is PublicGoalTemplateRecord[] {
  assertArray(value, { method: "GET", url: "/templates/TIPS_GOAL/{userId}" });
}

function assertTipsGoalConfiguration(value: unknown): asserts value is PublicTipsGoalConfigurationRecord {
  assertPlainObject(value, { method: "GET", url: "/configuration/TIPS_GOAL/{userId}" });
}

function assertGoalWidget(value: unknown): asserts value is PublicGoalWidgetResponse {
  assertPlainObject(value, { method: "GET", url: "/widget/goal/{goalId}/{userId}" });
}

function assertVotingTemplates(value: unknown): asserts value is PublicVotingTemplateRecord[] {
  assertArray(value, { method: "GET", url: "/templates/GOAL_VOTING/{userId}" });
}

function assertVotingConfiguration(value: unknown): asserts value is GoalVotingConfiguration {
  assertPlainObject(value, { method: "GET", url: "/configuration/GOAL_VOTING/{userId}" });
}

export class PublicApi {
  constructor(private readonly httpClient: HttpClient) {}

  getGoalTemplates(userId: string): Promise<PublicGoalTemplateRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: `/templates/TIPS_GOAL/${userId}`,
      scope: "public",
      validator: assertGoalTemplates,
    });
  }

  getGoalConfiguration(userId: string): Promise<PublicTipsGoalConfigurationRecord> {
    return this.httpClient.request({
      method: "GET",
      path: `/configuration/TIPS_GOAL/${userId}`,
      scope: "public",
      validator: assertTipsGoalConfiguration,
    });
  }

  getGoalWidget(goalId: string, userId: string): Promise<PublicGoalWidgetResponse> {
    return this.httpClient.request({
      method: "GET",
      path: `/widget/goal/${goalId}/${userId}`,
      scope: "public",
      validator: assertGoalWidget,
    });
  }

  getWidgetMessage(userId: string): Promise<boolean> {
    return this.httpClient.request({
      method: "GET",
      path: `/widgetmessage/${userId}`,
      scope: "public",
      validator: (value): asserts value is boolean => {
        assertBoolean(value, { method: "GET", url: "/widgetmessage/{userId}" }, "Expected widget message flag");
      },
    });
  }

  getVotingTemplates(userId: string): Promise<PublicVotingTemplateRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: `/templates/GOAL_VOTING/${userId}`,
      scope: "public",
      validator: assertVotingTemplates,
    });
  }

  getVotingConfiguration(userId: string): Promise<GoalVotingConfiguration> {
    return this.httpClient.request({
      method: "GET",
      path: `/configuration/GOAL_VOTING/${userId}`,
      scope: "public",
      validator: assertVotingConfiguration,
    });
  }
}
