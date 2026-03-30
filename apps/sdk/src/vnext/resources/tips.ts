import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { unknownRecordSchema } from "../../domain/parsing";
import { tipSchema } from "../../domain/shared-schemas";
import type { Tip } from "../../domain/shared";
import type { PendingTip, TipFilter, TipModerationItem, TipsListQuery } from "../../domain/tips";
import { requestAndParse } from "../request";

class TipsListRequestBuilder {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly query: TipsListQuery = {},
  ) {}

  filter(filter: TipFilter): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, filter });
  }

  search(search: string): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, search });
  }

  limit(limit: number): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, limit });
  }

  offset(offset: number): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport, { ...this.query, offset });
  }

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

export class TipsResource {
  readonly moderation: TipsModerationResource;
  readonly pending: PendingTipsResource;
  readonly audio: TipsAudioResource;

  constructor(private readonly transport: TipplyTransport) {
    this.moderation = new TipsModerationResource(transport);
    this.pending = new PendingTipsResource(transport);
    this.audio = new TipsAudioResource(transport);
  }

  list(): TipsListRequestBuilder {
    return new TipsListRequestBuilder(this.transport);
  }
}
