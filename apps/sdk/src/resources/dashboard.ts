import { assertArray, assertNumber, assertPlainObject, assertString } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { AnnouncementRecord, IncomeStatistics, NotificationRecord, RecentTipRecord, TipStatistics } from "../types/dashboard";

function assertAnnouncementArray(value: unknown): asserts value is AnnouncementRecord[] {
  assertArray(value, { method: "GET", url: "/announcements" });
}

function assertIncomeStatistics(value: unknown): asserts value is IncomeStatistics {
  const context = { method: "GET", url: "/user/statistics/income" };
  assertPlainObject(value, context);
  assertNumber(value.total, context, "Expected total income");
  assertNumber(value.last28, context, "Expected last28 income");
  assertNumber(value.last7, context, "Expected last7 income");
}

function assertTipStatistics(value: unknown): asserts value is TipStatistics {
  const context = { method: "GET", url: "/user/statistics/tips" };
  assertPlainObject(value, context);
  assertNumber(value.count, context, "Expected tip count");
  assertNumber(value.messages_length, context, "Expected messages length");
}

function assertRecentTips(value: unknown): asserts value is RecentTipRecord[] {
  const context = { method: "GET", url: "/user/tips?limit=12" };
  assertArray(value, context);

  for (const item of value) {
    assertPlainObject(item, context);
    assertString(item.id, context, "Expected tip id");
    assertString(item.nickname, context, "Expected tip nickname");
    assertNumber(item.amount, context, "Expected tip amount");
  }
}

function assertNotifications(value: unknown): asserts value is NotificationRecord[] {
  const context = { method: "GET", url: "/user/notifications" };
  assertArray(value, context);

  for (const item of value) {
    assertPlainObject(item, context);
    assertString(item.type, context, "Expected notification type");
    assertString(item.created_at, context, "Expected notification timestamp");
  }
}

export class DashboardApi {
  constructor(private readonly httpClient: HttpClient) {}

  getAnnouncements(): Promise<AnnouncementRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/announcements",
      requiresAuth: true,
      validator: assertAnnouncementArray,
    });
  }

  getExtraAnnouncements(): Promise<AnnouncementRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/extraannouncements",
      requiresAuth: true,
      validator: assertAnnouncementArray,
    });
  }

  getIncomeStatistics(): Promise<IncomeStatistics> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/statistics/income",
      requiresAuth: true,
      validator: assertIncomeStatistics,
    });
  }

  getTipStatistics(): Promise<TipStatistics> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/statistics/tips",
      requiresAuth: true,
      validator: assertTipStatistics,
    });
  }

  getPoints(): Promise<number> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/points",
      requiresAuth: true,
      validator: (value): asserts value is number => {
        assertNumber(value, { method: "GET", url: "/user/points" }, "Expected points counter");
      },
    });
  }

  getRecentTips(): Promise<RecentTipRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/tips",
      query: { limit: 12 },
      requiresAuth: true,
      validator: assertRecentTips,
    });
  }

  getNotifications(): Promise<NotificationRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/notifications",
      requiresAuth: true,
      validator: assertNotifications,
    });
  }
}
