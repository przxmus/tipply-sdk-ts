import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { reportSchema } from "../../domain/shared-schemas";
import type { Report } from "../../domain/shared";
import { requestAndParse } from "../request";

export class ReportsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Lists reports available to the authenticated user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns Generated report entries returned by Tipply.
   */
  list(requestOptions?: RequestOptions): Promise<Report[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/reports",
        auth: true,
      },
      z.array(reportSchema),
      requestOptions,
      "Invalid reports response.",
    );
  }
}
