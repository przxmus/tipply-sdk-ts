import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { reportSchema } from "../../domain/shared-schemas";
import type { Report } from "../../domain/shared";
import { requestAndParse } from "../request";

/** Authenticated access to generated account reports. */
export class ReportsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /** Lists reports available for download by the authenticated user. */
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
