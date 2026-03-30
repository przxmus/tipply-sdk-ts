import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { unknownRecordSchema } from "../../domain/parsing";
import { tipSchema } from "../../domain/shared-schemas";
import type { Tip } from "../../domain/shared";
import type { TipId } from "../../domain/ids";
import type { PendingTip, TipFilter, TipModerationItem, TipsListQuery } from "../../domain/tips";
import { requestAndParse } from "../request";

class TipsListRequestBuilder {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly query: TipsListQuery = {},
  ) {}

  /**
   * Sets the Tipply sort or filter mode.
   *
   * @param filter - The filter mode accepted by the tips endpoint.
   * @returns A new immutable builder with the selected filter applied.
   */
  filter(filter: TipFilter): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, filter });
  }

  /**
   * Adds a text search query.
   *
   * @param search - The search string to send to Tipply.
   * @returns A new immutable builder with the search term applied.
   */
  search(search: string): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, search });
  }

  /**
   * Limits the number of tips returned by the next request.
   *
   * @param limit - Maximum number of tips to request.
   * @returns A new immutable builder with the limit applied.
   */
  limit(limit: number): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, limit });
  }

  /**
   * Skips the first items returned by the endpoint.
   *
   * @param offset - Number of items to skip.
   * @returns A new immutable builder with the offset applied.
   */
  offset(offset: number): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, offset });
  }

  /**
   * Executes the tips list request.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The list of tips that match the accumulated filters.
   *
   * @example
   * ```typescript
   * const tips = await client.tips
   *   .list()
   *   .filter("amount")
   *   .search("microphone")
   *   .limit(10)
   *   .get();
   * ```
   */
  get(requestOptions?: RequestOptions): Promise<Tip[]> {
    const filter = this.query.filter === "paymentMethod" ? "paymentMethod" : this.query.filter;

    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/tips",
        query: {
          limit: this.query.limit,
          offset: this.query.offset,
          filter,
          search: this.query.search,
        },
        auth: true,
      },
      z.array(tipSchema),
      requestOptions,
      "Invalid tips response.",
    );
  }
}

class TipsModerationResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Lists items currently waiting in the moderation queue.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns Raw moderation queue items returned by Tipply.
   */
  listQueue(requestOptions?: RequestOptions): Promise<TipModerationItem[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/tipsmoderation",
        auth: true,
      },
      z.array(unknownRecordSchema),
      requestOptions,
      "Invalid moderation queue response.",
    );
  }

  /**
   * Lists items currently placed in the moderation basket.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns Raw moderation basket items returned by Tipply.
   */
  listBasket(requestOptions?: RequestOptions): Promise<TipModerationItem[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/tipsmoderation/basket",
        auth: true,
      },
      z.array(unknownRecordSchema),
      requestOptions,
      "Invalid moderation basket response.",
    );
  }
}

class PendingTipsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Lists pending tips.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns Raw pending tip items returned by Tipply.
   */
  list(requestOptions?: RequestOptions): Promise<PendingTip[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/tipspending",
        auth: true,
      },
      z.array(unknownRecordSchema),
      requestOptions,
      "Invalid pending tips response.",
    );
  }
}

class TipsAudioResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Toggles message-audio playback for incoming tips.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A promise that resolves when Tipply accepts the toggle.
   */
  toggle(requestOptions?: RequestOptions): Promise<void> {
    return this.transport.request(
      {
        method: "POST",
        path: "/user/toggle-message-audio",
        auth: true,
      },
      requestOptions,
    );
  }
}

class TipScope {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly tipId: TipId,
  ) {}

  /**
   * Replays the selected tip through the alert pipeline.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A promise that resolves when Tipply accepts the replay request.
   */
  resend(requestOptions?: RequestOptions): Promise<void> {
    return this.transport.request(
      {
        method: "POST",
        path: `/tip/${this.tipId}/resend`,
        auth: true,
      },
      requestOptions,
    );
  }
}

export class TipsResource {
  readonly moderation: TipsModerationResource;
  readonly pending: PendingTipsResource;
  readonly audio: TipsAudioResource;

  constructor(private readonly transport: TipplyTransport) {
    this.moderation = new TipsModerationResource(transport);
    this.pending = new PendingTipsResource(transport);
    this.audio = new TipsAudioResource(transport);
  }

  /**
   * Starts a fluent builder for listing tips.
   *
   * @returns A new immutable tips list request builder.
   */
  list(): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport);
  }

  /**
   * Opens the scope for a single tip.
   *
   * @param tipId - The Tipply tip identifier.
   * @returns A scoped helper for the selected tip.
   */
  id(tipId: TipId): TipScope {
    return new TipScope(this.transport, tipId);
  }
}
