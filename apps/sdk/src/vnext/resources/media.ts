import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { mediaFormatsSchema, mediaItemSchema, mediaUsageSchema } from "../../domain/shared-schemas";
import type { MediaFormats, MediaItem, MediaUsage } from "../../domain/shared";
import type { MediaId } from "../../domain/ids";
import { requestAndParse } from "../request";

class MediaUsageResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Loads media storage usage.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The current media usage summary.
   */
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

  /**
   * Loads generated formats for a media item.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The generated formats keyed by format name.
   */
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
  readonly formats: MediaFormatsResource;

  constructor(transport: TipplyTransport, mediaId: MediaId) {
    this.formats = new MediaFormatsResource(transport, mediaId);
  }
}

export class MediaResource {
  readonly usage: MediaUsageResource;

  constructor(private readonly transport: TipplyTransport) {
    this.usage = new MediaUsageResource(transport);
  }

  /**
   * Lists media items owned by the authenticated user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The authenticated user's media inventory.
   */
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

  /**
   * Opens the scope for a single media item.
   *
   * @param mediaId - The Tipply media identifier.
   * @returns A scoped helper for the selected media item.
   */
  id(mediaId: MediaId): MediaScope {
    return new MediaScope(this.transport, mediaId);
  }
}
