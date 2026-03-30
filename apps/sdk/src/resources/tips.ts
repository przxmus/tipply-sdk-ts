import { assertArray } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { ListTipsQuery, TipRecord, TipsModerationRecord, TipsPendingRecord } from "../types/tips";

function assertTips(value: unknown): asserts value is TipRecord[] {
  assertArray(value, { method: "GET", url: "/user/tips" });
}

function assertModerationRecords(value: unknown): asserts value is TipsModerationRecord[] {
  assertArray(value, { method: "GET", url: "/user/tipsmoderation" });
}

function assertPendingRecords(value: unknown): asserts value is TipsPendingRecord[] {
  assertArray(value, { method: "GET", url: "/user/tipspending" });
}

export class TipsApi {
  constructor(private readonly httpClient: HttpClient) {}

  list(query: ListTipsQuery = {}): Promise<TipRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/tips",
      query: {
        limit: query.limit,
        offset: query.offset,
        filter: query.filter,
        search: query.search,
      },
      requiresAuth: true,
      validator: assertTips,
    });
  }

  listModerationQueue(): Promise<TipsModerationRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/tipsmoderation",
      requiresAuth: true,
      validator: assertModerationRecords,
    });
  }

  listModerationBasket(): Promise<TipsModerationRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/tipsmoderation/basket",
      requiresAuth: true,
      validator: assertModerationRecords,
    });
  }

  listPending(): Promise<TipsPendingRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/tipspending",
      requiresAuth: true,
      validator: assertPendingRecords,
    });
  }

  toggleMessageAudio(): Promise<void> {
    return this.httpClient.request({
      method: "POST",
      path: "/user/toggle-message-audio",
      requiresAuth: true,
    });
  }
}
