import type { RequestOptions } from "../../core/types";
import { currentUserSchema, parseCurrentUser } from "../../domain/account-schemas";
import type { CurrentUser } from "../../domain/account";
import { TipplyTransport } from "../../core/transport";
import { requestAndParse } from "../request";

/**
 * Authenticated current-user operations.
 */
export class MeResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Loads the current authenticated Tipply user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The current authenticated user profile.
   *
   * @throws {TipplyAuthenticationError} If the current session is missing or rejected.
   * @throws {TipplyHttpError} If the request fails or times out.
   * @throws {TipplyValidationError} If response validation is enabled and the payload cannot be parsed.
   *
   * @example
   * ```typescript
   * const me = await client.me.get();
   * console.log(me.username);
   * ```
   */
  get(requestOptions?: RequestOptions): Promise<CurrentUser> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user",
        auth: true,
      },
      currentUserSchema,
      requestOptions,
      "Invalid current user response.",
      (value) => parseCurrentUser(value, { method: "GET", url: "/user" }),
    );
  }
}
