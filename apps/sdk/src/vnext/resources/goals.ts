import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { goalSchema, goalVotingConfigurationSchema } from "../../domain/shared-schemas";
import type { Goal, GoalVotingConfiguration } from "../../domain/shared";
import type { CreateGoalInput, UpdateGoalInput } from "../../domain/goals";
import type { GoalId } from "../../domain/ids";
import { toCreateGoalWire, toUpdateGoalWire } from "../../domain/goals";
import { requestAndParse } from "../request";
import { z } from "zod";

class GoalScope {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly goalId: GoalId,
  ) {}

  /**
   * Updates an existing goal.
   *
   * @param input - The full goal payload expected by Tipply.
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A promise that resolves when Tipply accepts the update.
   */
  update(input: UpdateGoalInput, requestOptions?: RequestOptions): Promise<void> {
    return this.transport.request(
      {
        method: "PATCH",
        path: `/user/goals/${this.goalId}`,
        body: toUpdateGoalWire(input),
        auth: true,
      },
      requestOptions,
    );
  }

  /**
   * Resets the selected goal progress.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A promise that resolves when Tipply accepts the reset.
   */
  reset(requestOptions?: RequestOptions): Promise<void> {
    return this.transport.request(
      {
        method: "PATCH",
        path: `/user/goals/${this.goalId}/reset`,
        auth: true,
      },
      requestOptions,
    );
  }
}

class GoalVotingResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Loads the authenticated user's goal voting configuration.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The goal voting configuration returned by Tipply.
   */
  get(requestOptions?: RequestOptions): Promise<GoalVotingConfiguration> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/voting",
        auth: true,
      },
      goalVotingConfigurationSchema,
      requestOptions,
      "Invalid goal voting response.",
    );
  }
}

export class GoalsResource {
  readonly voting: GoalVotingResource;

  constructor(private readonly transport: TipplyTransport) {
    this.voting = new GoalVotingResource(transport);
  }

  /**
   * Lists the authenticated user's goals.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The goals visible to the authenticated user.
   */
  list(requestOptions?: RequestOptions): Promise<Goal[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/goals",
        auth: true,
      },
      z.array(goalSchema),
      requestOptions,
      "Invalid goals response.",
    );
  }

  /**
   * Creates a new goal.
   *
   * @param input - The goal payload to create.
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The created goal returned by Tipply.
   *
   * @example
   * ```typescript
   * const goal = await client.goals.create({
   *   title: "New microphone",
   *   target: 50000,
   *   initialValue: 0,
   *   withoutCommission: false,
   *   templateId: asTemplateId("template-123"),
   * });
   * ```
   */
  create(input: CreateGoalInput, requestOptions?: RequestOptions): Promise<Goal> {
    return requestAndParse(
      this.transport,
      {
        method: "POST",
        path: "/user/goals",
        body: toCreateGoalWire(input),
        auth: true,
      },
      goalSchema,
      requestOptions,
      "Invalid goal create response.",
    );
  }

  /**
   * Opens the scope for a single goal.
   *
   * @param goalId - The Tipply goal identifier.
   * @returns A scoped helper for the selected goal.
   */
  id(goalId: GoalId): GoalScope {
    return new GoalScope(this.transport, goalId);
  }
}
