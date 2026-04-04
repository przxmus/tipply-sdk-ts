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

  /**
   * Loads the public goal widget payload for a user and goal.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The goal widget configuration and current stats.
   */
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

  constructor(transport: TipplyTransport, userId: UserId, goalId: GoalId) {
    this.widget = new PublicGoalWidgetResource(transport, userId, goalId);
  }
}

class PublicGoalsTemplatesResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
  ) {}

  /**
   * Lists public `TIPS_GOAL` templates for a user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns Public `TIPS_GOAL` templates visible for the selected user.
   */
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

  /**
   * Loads the public `TIPS_GOAL` configuration for a user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The public goal widget configuration.
   */
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
    private readonly userId: UserId,
  ) {
    this.templates = new PublicGoalsTemplatesResource(transport, userId);
    this.configuration = new PublicGoalsConfigurationResource(transport, userId);
  }

  /**
   * Opens the scope for a single public goal.
   *
   * @param goalId - The Tipply goal identifier.
   * @returns A scoped helper for the selected public goal.
   */
  id(goalId: GoalId): PublicGoalScope {
    return new PublicGoalScope(this.transport, this.userId, goalId);
  }
}

class PublicVotingTemplatesResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly userId: UserId,
  ) {}

  /**
   * Lists public `GOAL_VOTING` templates for a user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns Public voting templates visible for the selected user.
   */
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

  /**
   * Loads the public goal voting configuration for a user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The public goal voting configuration.
   */
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

  /**
   * Downloads the raw CSS for a user's template fonts.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A CSS string returned by Tipply.
   */
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

  /**
   * Checks whether widget messages are enabled for a user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns `true` when widget messages are enabled; otherwise `false`.
   */
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

  /**
   * Creates a realtime listener for a user's public `TIP_ALERT` stream.
   *
   * @param options - Listener configuration such as reconnection behavior.
   * @returns A disconnected {@link TipAlertsListener} for the selected user.
   */
  createListener(options?: TipAlertsListenerOptions): TipAlertsListener {
    return new PublicTipAlertsListener(this.userId, this.transport.config.transport.alertSocketBaseUrl, options);
  }
}

export class PublicRootTipAlertsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Creates a public `TIP_ALERT` listener from a widget URL.
   *
   * @param widgetUrl - A full `TIP_ALERT` widget URL or raw widget path.
   * @param options - Listener configuration such as reconnection behavior.
   * @returns A disconnected {@link TipAlertsListener}.
   *
   * @throws {Error} If {@link widgetUrl} does not contain a valid `TIP_ALERT` user path.
   */
  fromWidgetUrl(widgetUrl: TipAlertsWidgetUrl, options?: TipAlertsListenerOptions): TipAlertsListener {
    return createTipAlertsListenerFromWidgetUrl(widgetUrl, this.transport.config.transport.alertSocketBaseUrl, options);
  }
}

export class PublicUserScope {
  readonly goals: PublicGoalsResource;
  readonly voting: PublicVotingResource;
  readonly templateFonts: PublicTemplateFontsResource;
  readonly widgetMessage: PublicWidgetMessageResource;
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
  readonly tipAlerts: PublicRootTipAlertsResource;

  constructor(private readonly transport: TipplyTransport) {
    this.tipAlerts = new PublicRootTipAlertsResource(transport);
  }

  /**
   * Opens the public resource scope for a user.
   *
   * @param userId - A known internal Tipply user identifier. Public profile
   * endpoints no longer expose other users' IDs.
   * @returns A scope exposing public widget, template, voting, and realtime endpoints.
   */
  user(userId: UserId): PublicUserScope {
    return new PublicUserScope(this.transport, userId);
  }
}
