import { createTipplyClient } from "../src";

const authCookie = process.env.TIPPLY_AUTH_COOKIE;

if (!authCookie) {
  throw new Error("Set TIPPLY_AUTH_COOKIE before running this example.");
}

const client = createTipplyClient({
  authCookie,
  auth: {
    refreshTokenEvery: true,
    reconnectTries: 3,
  },
});

const [me, profile, income, points, recentTips, notifications] = await Promise.all([
  client.me.get(),
  client.profile.get(),
  client.dashboard.stats.income.get(),
  client.dashboard.points.get(),
  client.dashboard.tips.recent.list(),
  client.dashboard.notifications.list(),
]);

console.log(
  JSON.stringify(
    {
      userId: me.id,
      username: me.username,
      profileSlug: profile.link,
      totalIncome: income.total,
      currentMonthIncome: income.currentMonth,
      points,
      recentTipsCount: recentTips.length,
      notificationsCount: notifications.length,
    },
    null,
    2,
  ),
);
