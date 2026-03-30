import type { RequestOptions } from "../../core/types";
import { currentUserSchema } from "../../domain/account-schemas";
import type { CurrentUser } from "../../domain/account";
import { TipplyTransport } from "../../core/transport";
import { requestAndParse } from "../request";

/**
 * Authenticated current-user operations.
 */
export class MeResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Reads the current authenticated Tipply user.
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
    );
  }
}
