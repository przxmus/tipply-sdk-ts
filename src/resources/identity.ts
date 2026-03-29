import { assertPlainObject, assertString } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { CurrentUser } from "../types/identity";

function assertCurrentUser(value: unknown): asserts value is CurrentUser {
  const context = { method: "GET", url: "/user" };
  assertPlainObject(value, context);
  assertString(value.id, context, "Expected user id");
  assertString(value.username, context, "Expected username");
  assertString(value.email, context, "Expected email");
}

export class IdentityApi {
  constructor(private readonly httpClient: HttpClient) {}

  getCurrentUser(): Promise<CurrentUser> {
    return this.httpClient.request({
      method: "GET",
      path: "/user",
      requiresAuth: true,
      validator: assertCurrentUser,
    });
  }
}
