import { z } from "zod";

import { requestAndParse } from "../request";
import { dashboardAnnouncementListSchema, incomeStatisticsSchema, notificationListSchema, recentTipListSchema, tipStatisticsSchema } from "../../domain/account-schemas";
import type { DashboardAnnouncement, DashboardNotification, IncomeStatistics, RecentTip, TipStatistics } from "../../domain/account";
import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";

class DashboardAnnouncementsResource {
  constructor(private readonly transport: TipplyTransport) {}

  list(requestOptions?: RequestOptions): Promise<DashboardAnnouncement[]> {
    return requestAndParse(
      this.transport,
      { method: "GET", path: "/announcements", auth: true },
      dashboardAnnouncementListSchema,
      requestOptions,
      "Invalid dashboard announcements response.",
    );
  }

  listExtra(requestOptions?: RequestOptions): Promise<DashboardAnnouncement[]> {
    return requestAndParse(
      this.transport,
      { method: "GET", path: "/extraannouncements", auth: true },
      dashboardAnnouncementListSchema,
      requestOptions,
      "Invalid dashboard extra announcements response.",
    );
  }
}

class DashboardIncomeStatsResource {
  constructor(private readonly transport: TipplyTransport) {}

  get(requestOptions?: RequestOptions): Promise<IncomeStatistics> {
    return requestAndParse(
      this.transport,
      { method: "GET", path: "/user/statistics/income", auth: true },
      incomeStatisticsSchema,
      requestOptions,
      "Invalid income statistics response.",
    );
  }
}

class DashboardTipStatsResource {
  constructor(private readonly transport: TipplyTransport) {}

  get(requestOptions?: RequestOptions): Promise<TipStatistics> {
    return requestAndParse(
      this.transport,
      { method: "GET", path: "/user/statistics/tips", auth: true },
      tipStatisticsSchema,
      requestOptions,
      "Invalid tip statistics response.",
    );
  }
}

class DashboardStatsResource {
  readonly income: DashboardIncomeStatsResource;
  readonly tips: DashboardTipStatsResource;

  constructor(transport: TipplyTransport) {
    this.income = new DashboardIncomeStatsResource(transport);
    this.tips = new DashboardTipStatsResource(transport);
  }
}

class DashboardPointsResource {
  constructor(private readonly transport: TipplyTransport) {}

  get(requestOptions?: RequestOptions): Promise<number> {
    return requestAndParse(
      this.transport,
      { method: "GET", path: "/user/points", auth: true },
      z.number(),
      requestOptions,
      "Invalid dashboard points response.",
    );
  }
}

class DashboardRecentTipsResource {
  constructor(private readonly transport: TipplyTransport) {}

  list(requestOptions?: RequestOptions): Promise<RecentTip[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/tips",
        query: { limit: 12 },
        auth: true,
      },
      recentTipListSchema,
      requestOptions,
      "Invalid recent tips response.",
    );
  }
}

class DashboardTipsResource {
  readonly recent: DashboardRecentTipsResource;

  constructor(transport: TipplyTransport) {
    this.recent = new DashboardRecentTipsResource(transport);
  }
}

class DashboardNotificationsResource {
  constructor(private readonly transport: TipplyTransport) {}

  list(requestOptions?: RequestOptions): Promise<DashboardNotification[]> {
    return requestAndParse(
      this.transport,
      { method: "GET", path: "/user/notifications", auth: true },
      notificationListSchema,
      requestOptions,
      "Invalid dashboard notifications response.",
    );
  }
}

/**
 * Dashboard-oriented authenticated reads.
 */
export class DashboardResource {
  readonly announcements: DashboardAnnouncementsResource;
  readonly stats: DashboardStatsResource;
  readonly points: DashboardPointsResource;
  readonly tips: DashboardTipsResource;
  readonly notifications: DashboardNotificationsResource;

  constructor(transport: TipplyTransport) {
    this.announcements = new DashboardAnnouncementsResource(transport);
    this.stats = new DashboardStatsResource(transport);
    this.points = new DashboardPointsResource(transport);
    this.tips = new DashboardTipsResource(transport);
    this.notifications = new DashboardNotificationsResource(transport);
  }
}
