import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { userTemplateSchema } from "../../domain/shared-schemas";
import type { UserTemplate } from "../../domain/shared";
import type { TemplateReplacementInput } from "../../domain/templates";
import { toTemplateReplacementWire } from "../../domain/templates";
import { requestAndParse } from "../request";

class TemplateScope {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly templateId: string,
  ) {}

  replace(input: TemplateReplacementInput, requestOptions?: RequestOptions): Promise<void> {
    return this.transport.request(
      {
        method: "PUT",
        path: `/templates/${this.templateId}`,
        body: toTemplateReplacementWire(input),
        auth: true,
      },
      requestOptions,
    );
  }
}

export class TemplatesResource {
  constructor(private readonly transport: TipplyTransport) {}

  list(requestOptions?: RequestOptions): Promise<UserTemplate[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/templates",
        auth: true,
      },
      z.array(userTemplateSchema),
      requestOptions,
      "Invalid templates response.",
    );
  }

  id(templateId: string): TemplateScope {
    return new TemplateScope(this.transport, templateId);
  }
}
