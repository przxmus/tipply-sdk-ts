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

  /** Applies the Tipply sort/filter mode used by the tips list endpoint. */
  filter(filter: TipFilter): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, filter });
  }

  /** Applies a text search filter to the tips list request. */
  search(search: string): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, search });
  }

  /** Limits the number of tips returned by the next `get()` call. */
  limit(limit: number): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, limit });
  }

  /** Skips the first `offset` tips in the next `get()` call. */
  offset(offset: number): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, offset });
  }

  /** Executes the tips list request with the accumulated filters. */
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

  /** Lists items currently waiting in the moderation queue. */
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

  /** Lists items currently placed in the moderation basket. */
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

  /** Lists pending tips that are not yet finalized. */
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

  /** Toggles message-audio playback for incoming tips. */
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

  /** Replays the selected tip through the alert pipeline. */
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
  /** Moderation queue and basket endpoints. */
  readonly moderation: TipsModerationResource;
  /** Pending tips endpoint. */
  readonly pending: PendingTipsResource;
  /** Tip message-audio toggle endpoint. */
  readonly audio: TipsAudioResource;

  constructor(private readonly transport: TipplyTransport) {
    this.moderation = new TipsModerationResource(transport);
    this.pending = new PendingTipsResource(transport);
    this.audio = new TipsAudioResource(transport);
  }

  /** Starts a fluent request builder for listing tips. */
  list(): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport);
  }

  /** Opens the scope for a specific tip identifier. */
  id(tipId: TipId): TipScope {
    return new TipScope(this.transport, tipId);
  }
}
