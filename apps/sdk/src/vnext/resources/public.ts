import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { tipsGoalConfigurationSchema } from "../../domain/settings-schemas";
import { goalVotingConfigurationSchema, publicGoalWidgetSchema, userTemplateSchema } from "../../domain/shared-schemas";
import type { GoalVotingConfiguration, PublicGoalWidget, UserTemplate } from "../../domain/shared";
import type { TipsGoalConfiguration } from "../../domain/settings";
import { requestAndParse } from "../request";

class PublicGoalWidgetResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: string,
    private readonly goalId: string,
  ) {}

  get(requestOptions?: RequestOptions): Promise<PublicGoalWidget> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/widget/goal/${this.goalId}/${this.userId}`,
        scope: "public",
      },
      publicGoalWidgetSchema,
      requestOptions,
      "Invalid public goal widget response.",
    );
  }
}

class PublicGoalScope {
  readonly widget: PublicGoalWidgetResource;

  constructor(transport: TipplyTransport, userId: string, goalId: string) {
    this.widget = new PublicGoalWidgetResource(transport, userId, goalId);
  }
}

class PublicGoalsTemplatesResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: string,
  ) {}

  list(requestOptions?: RequestOptions): Promise<UserTemplate[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/templates/TIPS_GOAL/${this.userId}`,
        scope: "public",
      },
      z.array(userTemplateSchema),
      requestOptions,
      "Invalid public goal templates response.",
    );
  }
}

class PublicGoalsConfigurationResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: string,
  ) {}

  get(requestOptions?: RequestOptions): Promise<TipsGoalConfiguration> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/configuration/TIPS_GOAL/${this.userId}`,
        scope: "public",
      },
      tipsGoalConfigurationSchema,
      requestOptions,
      "Invalid public goal configuration response.",
    );
  }
}

class PublicGoalsResource {
  readonly templates: PublicGoalsTemplatesResource;
  readonly configuration: PublicGoalsConfigurationResource;

  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: string,
  ) {
    this.templates = new PublicGoalsTemplatesResource(transport, userId);
    this.configuration = new PublicGoalsConfigurationResource(transport, userId);
  }

  id(goalId: string): PublicGoalScope {
    return new PublicGoalScope(this.transport, this.userId, goalId);
  }
}

class PublicVotingTemplatesResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: string,
  ) {}

  list(requestOptions?: RequestOptions): Promise<UserTemplate[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/templates/GOAL_VOTING/${this.userId}`,
        scope: "public",
      },
      z.array(userTemplateSchema),
      requestOptions,
      "Invalid public voting templates response.",
    );
  }
}

class PublicVotingConfigurationResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: string,
  ) {}

  get(requestOptions?: RequestOptions): Promise<GoalVotingConfiguration> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/configuration/GOAL_VOTING/${this.userId}`,
        scope: "public",
      },
      goalVotingConfigurationSchema,
      requestOptions,
      "Invalid public voting configuration response.",
    );
  }
}

class PublicVotingResource {
  readonly templates: PublicVotingTemplatesResource;
  readonly configuration: PublicVotingConfigurationResource;

  constructor(transport: TipplyTransport, userId: string) {
    this.templates = new PublicVotingTemplatesResource(transport, userId);
    this.configuration = new PublicVotingConfigurationResource(transport, userId);
  }
}

class PublicWidgetMessageResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: string,
  ) {}

  get(requestOptions?: RequestOptions): Promise<boolean> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/widgetmessage/${this.userId}`,
        scope: "public",
      },
      z.boolean(),
      requestOptions,
      "Invalid public widget message response.",
    );
  }
}

export class PublicUserScope {
  readonly goals: PublicGoalsResource;
  readonly voting: PublicVotingResource;
  readonly widgetMessage: PublicWidgetMessageResource;

  constructor(transport: TipplyTransport, userId: string) {
    this.goals = new PublicGoalsResource(transport, userId);
    this.voting = new PublicVotingResource(transport, userId);
    this.widgetMessage = new PublicWidgetMessageResource(transport, userId);
  }
}

export class PublicRootResource {
  constructor(private readonly transport: TipplyTransport) {}

  user(userId: string): PublicUserScope {
    return new PublicUserScope(this.transport, userId);
  }
}
