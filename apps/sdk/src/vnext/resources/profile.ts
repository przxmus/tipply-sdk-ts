import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { publicSocialMediaLinkListSchema, toUpdatePageSettingsWire, userProfileSchema } from "../../domain/account-schemas";
import type { PublicSocialMediaLink, UpdatePageSettingsInput, UserProfile } from "../../domain/account";
import { requestAndParse } from "../request";

class ProfilePendingChangesResource {
  constructor(private readonly transport: TipplyTransport) {}

  /** Checks whether the authenticated profile has pending moderation changes. */
  async check(requestOptions?: RequestOptions): Promise<boolean> {
    const response = await this.transport.request<unknown>(
      {
        method: "GET",
        path: "/user/profile",
        query: { pending: true },
        auth: true,
      },
      requestOptions,
    );

    return response !== undefined;
  }
}

class ProfilePageResource {
  constructor(private readonly transport: TipplyTransport) {}

  /** Updates page-level profile settings such as description and emote replacement. */
  updateSettings(input: UpdatePageSettingsInput, requestOptions?: RequestOptions): Promise<UserProfile> {
    return requestAndParse(
      this.transport,
      {
        method: "PATCH",
        path: "/user/profile/page_settings",
        body: toUpdatePageSettingsWire(input),
        auth: true,
      },
      userProfileSchema,
      requestOptions,
      "Invalid profile update response.",
    );
  }
}

class PublicProfileSocialLinksResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly slug: string,
  ) {}

  /** Lists public social media links for a profile slug. */
  list(requestOptions?: RequestOptions): Promise<PublicSocialMediaLink[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/public/profile/${encodeURIComponent(this.slug)}/social-media`,
        scope: "proxy",
      },
      publicSocialMediaLinkListSchema,
      requestOptions,
      "Invalid public social media response.",
    );
  }
}

class PublicProfileScope {
  /** Public social media links for the selected profile slug. */
  readonly socialLinks: PublicProfileSocialLinksResource;

  constructor(transport: TipplyTransport, slug: string) {
    this.socialLinks = new PublicProfileSocialLinksResource(transport, slug);
  }
}

/**
 * Authenticated and public profile operations.
 */
export class ProfileResource {
  /** Profile moderation and pending-change helpers. */
  readonly pendingChanges: ProfilePendingChangesResource;
  /** Page settings update helpers. */
  readonly page: ProfilePageResource;

  constructor(private readonly transport: TipplyTransport) {
    this.pendingChanges = new ProfilePendingChangesResource(transport);
    this.page = new ProfilePageResource(transport);
  }

  /** Returns the authenticated user's profile. */
  get(requestOptions?: RequestOptions): Promise<UserProfile> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/profile",
        auth: true,
      },
      userProfileSchema,
      requestOptions,
      "Invalid user profile response.",
    );
  }

  /** Opens the public profile scope for a profile slug. */
  public(slug: string): PublicProfileScope {
    return new PublicProfileScope(this.transport, slug);
  }
}
