import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { reportSchema } from "../../domain/shared-schemas";
import type { Report } from "../../domain/shared";
import { requestAndParse } from "../request";

export class ReportsResource {
  constructor(private readonly transport: TipplyTransport) {}

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
