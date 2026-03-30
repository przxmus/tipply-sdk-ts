import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { userTemplateSchema } from "../../domain/shared-schemas";
import type { UserTemplate } from "../../domain/shared";
import type { TemplateId } from "../../domain/ids";
import type { TemplateReplacementInput } from "../../domain/templates";
import { toTemplateReplacementWire } from "../../domain/templates";
import { requestAndParse } from "../request";

class TemplateScope {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly templateId: TemplateId,
  ) {}

  /**
   * Replaces the full configuration of an existing template.
   *
   * @param input - The replacement payload accepted by Tipply for the template type.
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A promise that resolves when Tipply accepts the replacement.
   */
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

  /**
   * Lists templates available to the authenticated user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The list of user-owned templates.
   */
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

  /**
   * Opens the scope for a single template.
   *
   * @param templateId - The Tipply template identifier.
   * @returns A scoped helper for the selected template.
   */
  id(templateId: TemplateId): TemplateScope {
    return new TemplateScope(this.transport, templateId);
  }
}
