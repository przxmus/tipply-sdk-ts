import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { tipsGoalConfigurationSchema } from "../../domain/settings-schemas";
import { goalVotingConfigurationSchema, publicGoalWidgetSchema, publicTemplateSchema, publicTipsGoalTemplateSchema } from "../../domain/shared-schemas";
import type { GoalId, UserId } from "../../domain/ids";
import type { GoalVotingConfiguration, PublicGoalWidget, PublicTemplate, TipsGoalTemplateConfig } from "../../domain/shared";
import type { TipsGoalConfiguration } from "../../domain/settings";
import {
  createTipAlertsListenerFromWidgetUrl,
  PublicTipAlertsListener,
  type TipAlertsListener,
  type TipAlertsListenerOptions,
  type TipAlertsWidgetUrl,
} from "../../realtime/tip-alerts";
import { requestAndParse } from "../request";

class PublicGoalWidgetResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
    private readonly goalId: GoalId,
  ) {}

  /** Returns the public widget payload for a specific goal and user. */
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
  /** Goal widget payload for the selected goal. */
  readonly widget: PublicGoalWidgetResource;

  constructor(transport: TipplyTransport, userId: UserId, goalId: GoalId) {
    this.widget = new PublicGoalWidgetResource(transport, userId, goalId);
  }
}

class PublicGoalsTemplatesResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
  ) {}

  /** Lists public `TIPS_GOAL` templates for the selected user. */
  list(requestOptions?: RequestOptions): Promise<PublicTemplate<"TIPS_GOAL", TipsGoalTemplateConfig>[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/templates/TIPS_GOAL/${this.userId}`,
        scope: "public",
      },
      z.array(publicTipsGoalTemplateSchema),
      requestOptions,
      "Invalid public goal templates response.",
    );
  }
}

class PublicGoalsConfigurationResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
  ) {}

  /** Returns the public `TIPS_GOAL` configuration for the selected user. */
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
  /** Public `TIPS_GOAL` templates. */
  readonly templates: PublicGoalsTemplatesResource;
  /** Public `TIPS_GOAL` configuration. */
  readonly configuration: PublicGoalsConfigurationResource;

  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
  ) {
    this.templates = new PublicGoalsTemplatesResource(transport, userId);
    this.configuration = new PublicGoalsConfigurationResource(transport, userId);
  }

  /** Opens the scope for a specific public goal. */
  id(goalId: GoalId): PublicGoalScope {
    return new PublicGoalScope(this.transport, this.userId, goalId);
  }
}

class PublicVotingTemplatesResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
  ) {}

  /** Lists public `GOAL_VOTING` templates for the selected user. */
  list(requestOptions?: RequestOptions): Promise<PublicTemplate<"GOAL_VOTING">[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/templates/GOAL_VOTING/${this.userId}`,
        scope: "public",
      },
      z.array(publicTemplateSchema),
      requestOptions,
      "Invalid public voting templates response.",
    ) as Promise<PublicTemplate<"GOAL_VOTING">[]>;
  }
}

class PublicVotingConfigurationResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
  ) {}

  /** Returns the public goal voting configuration for the selected user. */
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
  /** Public `GOAL_VOTING` templates. */
  readonly templates: PublicVotingTemplatesResource;
  /** Public goal voting configuration. */
  readonly configuration: PublicVotingConfigurationResource;

  constructor(transport: TipplyTransport, userId: UserId) {
    this.templates = new PublicVotingTemplatesResource(transport, userId);
    this.configuration = new PublicVotingConfigurationResource(transport, userId);
  }
}

class PublicTemplateFontsResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
  ) {}

  /** Downloads the raw CSS for the selected user's template fonts. */
  get(requestOptions?: RequestOptions): Promise<string> {
    return this.transport.request(
      {
        method: "GET",
        path: `/templatefonts/${this.userId}`,
        scope: "public",
        headers: {
          Accept: "text/css",
        },
        responseType: "text",
      },
      requestOptions,
    ) as Promise<string>;
  }
}

class PublicWidgetMessageResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
  ) {}

  /** Returns whether the public widget message feature is enabled for the selected user. */
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

class PublicTipAlertsResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
  ) {}

  /** Creates a public `TIP_ALERT` listener for the selected user. */
  createListener(options?: TipAlertsListenerOptions): TipAlertsListener {
    return new PublicTipAlertsListener(this.userId, this.transport.config.transport.alertSocketBaseUrl, options);
  }
}

export class PublicRootTipAlertsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /** Creates a public `TIP_ALERT` listener from a widget URL. */
  fromWidgetUrl(widgetUrl: TipAlertsWidgetUrl, options?: TipAlertsListenerOptions): TipAlertsListener {
    return createTipAlertsListenerFromWidgetUrl(widgetUrl, this.transport.config.transport.alertSocketBaseUrl, options);
  }
}

export class PublicUserScope {
  /** Public goal endpoints for the selected user. */
  readonly goals: PublicGoalsResource;
  /** Public goal voting endpoints for the selected user. */
  readonly voting: PublicVotingResource;
  /** Raw CSS font definitions for public widgets. */
  readonly templateFonts: PublicTemplateFontsResource;
  /** Public widget message availability flag. */
  readonly widgetMessage: PublicWidgetMessageResource;
  /** Public realtime tip alerts helpers. */
  readonly tipAlerts: PublicTipAlertsResource;

  constructor(transport: TipplyTransport, userId: UserId) {
    this.goals = new PublicGoalsResource(transport, userId);
    this.voting = new PublicVotingResource(transport, userId);
    this.templateFonts = new PublicTemplateFontsResource(transport, userId);
    this.widgetMessage = new PublicWidgetMessageResource(transport, userId);
    this.tipAlerts = new PublicTipAlertsResource(transport, userId);
  }
}

export class PublicRootResource {
  /** Root realtime helpers for public tip alerts. */
  readonly tipAlerts: PublicRootTipAlertsResource;

  constructor(private readonly transport: TipplyTransport) {
    this.tipAlerts = new PublicRootTipAlertsResource(transport);
  }

  /** Opens the public resource scope for a specific user. */
  user(userId: UserId): PublicUserScope {
    return new PublicUserScope(this.transport, userId);
  }
}
