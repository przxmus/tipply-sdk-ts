import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { moderatorSchema } from "../../domain/shared-schemas";
import type { Moderator } from "../../domain/shared";
import type { ModeratorId } from "../../domain/ids";
import type { CreateModeratorInput } from "../../domain/moderators";
import { toCreateModeratorWire } from "../../domain/moderators";
import { requestAndParse } from "../request";

class ModeratorScope {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly moderatorId: ModeratorId,
  ) {}

  /** Removes the selected moderator. */
  remove(requestOptions?: RequestOptions): Promise<void> {
    return this.transport.request(
      {
        method: "DELETE",
        path: `/moderators/${this.moderatorId}`,
        auth: true,
      },
      requestOptions,
    );
  }
}

class ModeratorModeResource {
  constructor(private readonly transport: TipplyTransport) {}

  /** Toggles moderator mode for the authenticated user. */
  toggle(requestOptions?: RequestOptions): Promise<void> {
    return this.transport.request(
      {
        method: "POST",
        path: "/user/toggle-moderator",
        auth: true,
      },
      requestOptions,
    );
  }
}

export class ModeratorsResource {
  /** Moderator mode toggle endpoint. */
  readonly mode: ModeratorModeResource;

  constructor(private readonly transport: TipplyTransport) {
    this.mode = new ModeratorModeResource(transport);
  }

  /** Lists moderators linked to the authenticated account. */
  list(requestOptions?: RequestOptions): Promise<Moderator[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/moderators",
        auth: true,
      },
      z.array(moderatorSchema),
      requestOptions,
      "Invalid moderators response.",
    );
  }

  /** Creates a moderator link. */
  create(input: CreateModeratorInput, requestOptions?: RequestOptions): Promise<Moderator> {
    return requestAndParse(
      this.transport,
      {
        method: "POST",
        path: "/moderators",
        body: toCreateModeratorWire(input),
        auth: true,
      },
      moderatorSchema,
      requestOptions,
      "Invalid moderator create response.",
    );
  }

  /** Opens the scope for a specific moderator identifier. */
  id(moderatorId: ModeratorId): ModeratorScope {
    return new ModeratorScope(this.transport, moderatorId);
  }
}
