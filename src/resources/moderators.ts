import { assertArray, assertPlainObject } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { CreateModeratorRequest, ModeratorRecord } from "../types/moderators";

function assertModerators(value: unknown): asserts value is ModeratorRecord[] {
  assertArray(value, { method: "GET", url: "/moderators" });
}

function assertModerator(value: unknown): asserts value is ModeratorRecord {
  assertPlainObject(value, { method: "POST", url: "/moderators" });
}

export class ModeratorsApi {
  constructor(private readonly httpClient: HttpClient) {}

  list(): Promise<ModeratorRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/moderators",
      requiresAuth: true,
      validator: assertModerators,
    });
  }

  create(payload: CreateModeratorRequest): Promise<ModeratorRecord> {
    return this.httpClient.request({
      method: "POST",
      path: "/moderators",
      body: payload,
      requiresAuth: true,
      validator: assertModerator,
    });
  }

  remove(moderatorId: string): Promise<void> {
    return this.httpClient.request({
      method: "DELETE",
      path: `/moderators/${moderatorId}`,
      requiresAuth: true,
    });
  }

  toggleMode(): Promise<void> {
    return this.httpClient.request({
      method: "POST",
      path: "/user/toggle-moderator",
      requiresAuth: true,
    });
  }
}
