import { assertArray, assertPlainObject, assertString } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { PublicSocialMediaLink, UpdatePageSettingsRequest, UserProfile } from "../types/profile";

function assertUserProfile(value: unknown): asserts value is UserProfile {
  const context = { method: "GET", url: "/user/profile" };
  assertPlainObject(value, context);
  assertString(value.id, context, "Expected profile id");
  assertString(value.link, context, "Expected profile link");
  assertString(value.fullname, context, "Expected profile fullname");
}

function assertSocialMediaLinks(value: unknown): asserts value is PublicSocialMediaLink[] {
  assertArray(value, { method: "GET", url: "/public/profile/{slug}/social-media" });
}

export class ProfileApi {
  constructor(private readonly httpClient: HttpClient) {}

  get(): Promise<UserProfile> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/profile",
      requiresAuth: true,
      validator: assertUserProfile,
    });
  }

  async hasPendingChanges(): Promise<boolean> {
    const response = await this.httpClient.request<unknown>({
      method: "GET",
      path: "/user/profile",
      query: { pending: true },
      requiresAuth: true,
    });

    return response !== undefined;
  }

  updatePageSettings(payload: UpdatePageSettingsRequest): Promise<UserProfile> {
    return this.httpClient.request({
      method: "PATCH",
      path: "/user/profile/page_settings",
      body: payload,
      requiresAuth: true,
      validator: assertUserProfile,
    });
  }

  getPublicSocialMedia(slug: string): Promise<PublicSocialMediaLink[]> {
    return this.httpClient.request({
      method: "GET",
      path: `/public/profile/${encodeURIComponent(slug)}/social-media`,
      requiresAuth: false,
      validator: assertSocialMediaLinks,
    });
  }
}
