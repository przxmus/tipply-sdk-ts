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

  /**
   * Removes the selected moderator.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A promise that resolves when Tipply accepts the removal.
   */
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

  /**
   * Toggles moderator mode for the authenticated user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A promise that resolves when Tipply accepts the toggle.
   */
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

  /**
   * Lists moderators linked to the authenticated account.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The linked moderators returned by Tipply.
   */
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

  /**
   * Creates a moderator link.
   *
   * @param input - The moderator payload to create.
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The created moderator record.
   */
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

  /**
   * Opens the scope for a single moderator.
   *
   * @param moderatorId - The Tipply moderator identifier.
   * @returns A scoped helper for the selected moderator.
   */
  id(moderatorId: ModeratorId): ModeratorScope {
    return new ModeratorScope(this.transport, moderatorId);
  }
}
