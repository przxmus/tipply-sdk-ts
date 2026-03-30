import { z } from "zod";

import { requestAndParse } from "../request";
import { dashboardAnnouncementListSchema, incomeStatisticsSchema, notificationListSchema, recentTipListSchema, tipStatisticsSchema } from "../../domain/account-schemas";
import type { DashboardAnnouncement, DashboardNotification, IncomeStatistics, RecentTip, TipStatistics } from "../../domain/account";
import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";

class DashboardAnnouncementsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /** Lists dashboard announcements shown in the authenticated panel. */
  list(requestOptions?: RequestOptions): Promise<DashboardAnnouncement[]> {
    return requestAndParse(
      this.transport,
      { method: "GET", path: "/announcements", auth: true },
      dashboardAnnouncementListSchema,
      requestOptions,
      "Invalid dashboard announcements response.",
    );
  }

  /** Lists the extra dashboard announcement feed. */
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

  /** Returns income summary statistics for the authenticated user. */
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

  /** Returns tip volume and message statistics for the authenticated user. */
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
  /** Income summary statistics. */
  readonly income: DashboardIncomeStatsResource;
  /** Tip count and message statistics. */
  readonly tips: DashboardTipStatsResource;

  constructor(transport: TipplyTransport) {
    this.income = new DashboardIncomeStatsResource(transport);
    this.tips = new DashboardTipStatsResource(transport);
  }
}

class DashboardPointsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /** Returns the user's current Tipply points balance. */
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

  /** Lists the latest tips shown on the dashboard, limited to 12 items. */
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
  /** Recently received tips for the dashboard view. */
  readonly recent: DashboardRecentTipsResource;

  constructor(transport: TipplyTransport) {
    this.recent = new DashboardRecentTipsResource(transport);
  }
}

class DashboardNotificationsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /** Lists dashboard notifications for the authenticated user. */
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
  /** Dashboard announcement feeds. */
  readonly announcements: DashboardAnnouncementsResource;
  /** Dashboard statistics grouped by category. */
  readonly stats: DashboardStatsResource;
  /** Tipply points balance. */
  readonly points: DashboardPointsResource;
  /** Dashboard-specific tip feeds. */
  readonly tips: DashboardTipsResource;
  /** Dashboard notifications. */
  readonly notifications: DashboardNotificationsResource;

  constructor(transport: TipplyTransport) {
    this.announcements = new DashboardAnnouncementsResource(transport);
    this.stats = new DashboardStatsResource(transport);
    this.points = new DashboardPointsResource(transport);
    this.tips = new DashboardTipsResource(transport);
    this.notifications = new DashboardNotificationsResource(transport);
  }
}
