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

  /** Updates an existing goal. */
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

  /** Resets the selected goal progress. */
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

  /** Returns the authenticated user's goal voting configuration. */
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
  /** Goal voting configuration endpoints. */
  readonly voting: GoalVotingResource;

  constructor(private readonly transport: TipplyTransport) {
    this.voting = new GoalVotingResource(transport);
  }

  /** Lists the authenticated user's goals. */
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

  /** Creates a new goal for the authenticated user. */
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

  /** Opens the scope for a specific goal identifier. */
  id(goalId: GoalId): GoalScope {
    return new GoalScope(this.transport, goalId);
  }
}
