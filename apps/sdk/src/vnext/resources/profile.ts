import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { publicSocialMediaLinkListSchema, publicUserProfileSchema, toUpdatePageSettingsWire, userProfileSchema } from "../../domain/account-schemas";
import type { PublicSocialMediaLink, PublicUserProfile, UpdatePageSettingsInput, UserProfile } from "../../domain/account";
import { requestAndParse } from "../request";

class ProfilePendingChangesResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Checks whether the authenticated profile has pending changes.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns `true` when Tipply reports pending profile changes; otherwise `false`.
   */
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

  /**
   * Updates writable page settings on the authenticated profile.
   *
   * @param input - The page settings patch to send to Tipply.
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The updated user profile returned by Tipply.
   *
   * @example
   * ```typescript
   * await client.profile.page.updateSettings({
   *   description: "Variety streamer and live coder.",
   * });
   * ```
   */
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

  /**
   * Lists public social media links for a profile slug.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns Public social media links exposed for the selected profile slug.
   */
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

class PublicProfileResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly slug: string,
  ) {}

  /**
   * Loads the public profile payload for a profile slug.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns Public profile information exposed for the selected profile slug.
   */
  get(requestOptions?: RequestOptions): Promise<PublicUserProfile> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: `/public/user/profile/${encodeURIComponent(this.slug)}`,
        scope: "proxy",
      },
      publicUserProfileSchema,
      requestOptions,
      "Invalid public user profile response.",
    );
  }
}

class PublicProfileScope {
  readonly socialLinks: PublicProfileSocialLinksResource;
  private readonly profile: PublicProfileResource;

  constructor(transport: TipplyTransport, slug: string) {
    this.profile = new PublicProfileResource(transport, slug);
    this.socialLinks = new PublicProfileSocialLinksResource(transport, slug);
  }

  /**
   * Loads the public profile payload for the selected slug.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns Public profile information exposed for the selected profile slug.
   */
  get(requestOptions?: RequestOptions): Promise<PublicUserProfile> {
    return this.profile.get(requestOptions);
  }
}

/**
 * Authenticated and public profile operations.
 */
export class ProfileResource {
  readonly pendingChanges: ProfilePendingChangesResource;
  readonly page: ProfilePageResource;

  constructor(private readonly transport: TipplyTransport) {
    this.pendingChanges = new ProfilePendingChangesResource(transport);
    this.page = new ProfilePageResource(transport);
  }

  /**
   * Loads the authenticated user's profile.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The authenticated user profile.
   */
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

  /**
   * Opens the public profile scope for a profile slug.
   *
   * @param slug - The public Tipply profile slug.
   * @returns A scope exposing public profile endpoints for the slug.
   */
  public(slug: string): PublicProfileScope {
    return new PublicProfileScope(this.transport, slug);
  }
}
