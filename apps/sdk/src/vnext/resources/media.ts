import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { mediaFormatsSchema, mediaItemSchema, mediaUsageSchema } from "../../domain/shared-schemas";
import type { MediaFormats, MediaItem, MediaUsage } from "../../domain/shared";
import type { MediaId } from "../../domain/ids";
import { requestAndParse } from "../request";

class MediaUsageResource {
  constructor(private readonly transport: TipplyTransport) {}

  /** Returns current media storage usage for the authenticated account. */
  get(requestOptions?: RequestOptions): Promise<MediaUsage> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/media/usage",
        auth: true,
      },
      mediaUsageSchema,
      requestOptions,
      "Invalid media usage response.",
    );
  }
}

class MediaFormatsResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly mediaId: MediaId,
  ) {}

  /** Lists generated formats for the selected media item. */
  get(requestOptions?: RequestOptions): Promise<MediaFormats> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/medium/${this.mediaId}/formats`,
        auth: true,
      },
      mediaFormatsSchema,
      requestOptions,
      "Invalid media formats response.",
    );
  }
}

class MediaScope {
  /** Generated formats for the selected media item. */
  readonly formats: MediaFormatsResource;

  constructor(transport: TipplyTransport, mediaId: MediaId) {
    this.formats = new MediaFormatsResource(transport, mediaId);
  }
}

export class MediaResource {
  /** Media usage statistics. */
  readonly usage: MediaUsageResource;

  constructor(private readonly transport: TipplyTransport) {
    this.usage = new MediaUsageResource(transport);
  }

  /** Lists media items owned by the authenticated user. */
  list(requestOptions?: RequestOptions): Promise<MediaItem[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/media",
        auth: true,
      },
      z.array(mediaItemSchema),
      requestOptions,
      "Invalid media list response.",
    );
  }

  /** Opens the scope for a specific media identifier. */
  id(mediaId: MediaId): MediaScope {
    return new MediaScope(this.transport, mediaId);
  }
}
