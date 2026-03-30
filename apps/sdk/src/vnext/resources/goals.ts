import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { goalSchema, goalVotingConfigurationSchema } from "../../domain/shared-schemas";
import type { Goal, GoalVotingConfiguration } from "../../domain/shared";
import type { CreateGoalInput, UpdateGoalInput } from "../../domain/goals";
import { toCreateGoalWire, toUpdateGoalWire } from "../../domain/goals";
import { requestAndParse } from "../request";
import { z } from "zod";

class GoalScope {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly goalId: string,
  ) {}

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

  id(goalId: string): GoalScope {
    return new GoalScope(this.transport, goalId);
  }
}
