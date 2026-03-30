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
  readonly mode: ModeratorModeResource;

  constructor(private readonly transport: TipplyTransport) {
    this.mode = new ModeratorModeResource(transport);
  }

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

  id(moderatorId: ModeratorId): ModeratorScope {
    return new ModeratorScope(this.transport, moderatorId);
  }
}
