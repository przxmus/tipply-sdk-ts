import { assertArray } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { ReportRecord } from "../types/reports";

function assertReports(value: unknown): asserts value is ReportRecord[] {
  assertArray(value, { method: "GET", url: "/user/reports" });
}

export class ReportsApi {
  constructor(private readonly httpClient: HttpClient) {}

  list(): Promise<ReportRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/reports",
      requiresAuth: true,
      validator: assertReports,
    });
  }
}
