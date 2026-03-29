import { assertArray } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { TemplateUpdateRequest, UserTemplateRecord } from "../types/templates";

function assertUserTemplates(value: unknown): asserts value is UserTemplateRecord[] {
  assertArray(value, { method: "GET", url: "/user/templates" });
}

export class TemplatesApi {
  constructor(private readonly httpClient: HttpClient) {}

  listUserTemplates(): Promise<UserTemplateRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/templates",
      requiresAuth: true,
      validator: assertUserTemplates,
    });
  }

  updateTemplate(templateId: string, payload: TemplateUpdateRequest): Promise<void> {
    return this.httpClient.request({
      method: "PUT",
      path: `/templates/${templateId}`,
      body: payload,
      requiresAuth: true,
    });
  }
}
