import { assertArray, assertPlainObject } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { MediaUsage, MediumFormats, MediumRecord } from "../types/media";

function assertMedia(value: unknown): asserts value is MediumRecord[] {
  assertArray(value, { method: "GET", url: "/user/media" });
}

function assertMediaUsage(value: unknown): asserts value is MediaUsage {
  assertPlainObject(value, { method: "GET", url: "/user/media/usage" });
}

function assertMediumFormats(value: unknown): asserts value is MediumFormats {
  assertPlainObject(value, { method: "GET", url: "/medium/{id}/formats" });
}

export class MediaApi {
  constructor(private readonly httpClient: HttpClient) {}

  list(): Promise<MediumRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/media",
      requiresAuth: true,
      validator: assertMedia,
    });
  }

  getUsage(): Promise<MediaUsage> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/media/usage",
      requiresAuth: true,
      validator: assertMediaUsage,
    });
  }

  getFormats(mediumId: number): Promise<MediumFormats> {
    return this.httpClient.request({
      method: "GET",
      path: `/medium/${mediumId}/formats`,
      requiresAuth: true,
      validator: assertMediumFormats,
    });
  }
}
