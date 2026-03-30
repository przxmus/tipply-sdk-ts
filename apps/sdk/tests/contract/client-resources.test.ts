import { describe, expect, test } from "bun:test";

import { asGoalId, asMediaId, asModeratorId, asTemplateId, asTipId, asUserId, asWithdrawalId, createTipplyClient } from "../../src";
import { createTipplyPublicClient } from "../../src/public";
import {
  accountFixture,
  countdownConfigurationFixture,
  createGoalFixture,
  createModeratorFixture,
  currentUserFixture,
  dashboardAnnouncementFixture,
  extraDashboardAnnouncementFixture,
  forbiddenWordsFixture,
  goalFixture,
  mediaFixture,
  mediaFormatsFixture,
  mediaUsageFixture,
  notificationFixture,
  paymentMethodsConfigurationFixture,
  profileFixture,
  profanityFilterFixture,
  publicGoalConfigurationFixture,
  publicTemplateFontsFixture,
  publicGoalTemplatesFixture,
  publicGoalWidgetFixture,
  publicVotingTemplatesFixture,
  rawAccountFixture,
  rawCurrentUserFixture,
  rawGoalFixture,
  rawMediaFixture,
  rawMediaFormatsFixture,
  rawNotificationFixture,
  rawPaymentMethodsConfigurationFixture,
  rawProfileFixture,
  rawPublicGoalConfigurationFixture,
  rawPublicGoalTemplatesFixture,
  rawPublicGoalWidgetFixture,
  rawPublicVotingTemplatesFixture,
  rawReportFixture,
  rawSettingsFixture,
  rawTemplateFixture,
  rawTipFixture,
  rawUserPaymentMethodFixture,
  rawUserPaymentMethodsFixture,
  rawVotingFixture,
  rawWithdrawalFixture,
  rawWithdrawalMethodsFixture,
  rawModeratorFixture,
  reportFixture,
  settingsFixture,
  templateFixture,
  tipAlertConfigurationFixture,
  tipFixture,
  toggleDisabledFixture,
  updateGoalFixture,
  userPaymentMethodFixture,
  userPaymentMethodsFixture,
  votingFixture,
  withdrawalFixture,
  withdrawalMethodsFixture,
} from "../fixtures/sanitized";
import { createMockFetch, emptyResponse, jsonResponse } from "../support/mock-fetch";

function createFixtureClient() {
  const { fetch, requests } = createMockFetch((request) => {
    const { method, url } = request;
    const pathname = url.pathname;

    if (method === "GET" && pathname === "/user") return jsonResponse(rawCurrentUserFixture);
    if (method === "GET" && pathname === "/announcements") return jsonResponse([dashboardAnnouncementFixture]);
    if (method === "GET" && pathname === "/extraannouncements") return jsonResponse([extraDashboardAnnouncementFixture]);
    if (method === "GET" && pathname === "/user/statistics/income") {
      return jsonResponse({
        total: 5000,
        last28: 2500,
        last7: 1200,
        last7_percent_change: 12,
        current_month: 3000,
        current_month_percent_change: 8,
      });
    }
    if (method === "GET" && pathname === "/user/statistics/tips") {
      return jsonResponse({
        count: 5,
        count_percentage: 20,
        messages_length: 100,
        messages_length_percentage: 10,
      });
    }
    if (method === "GET" && pathname === "/user/points") return jsonResponse(321);
    if (method === "GET" && pathname === "/user/tips" && url.searchParams.get("limit") === "12") return jsonResponse([rawTipFixture]);
    if (method === "GET" && pathname === "/user/notifications") return jsonResponse([rawNotificationFixture]);
    if (method === "GET" && pathname === "/user/profile" && url.searchParams.get("pending") === "true") return jsonResponse({ pending: true });
    if (method === "GET" && pathname === "/user/profile") return jsonResponse(rawProfileFixture);
    if (method === "PATCH" && pathname === "/user/profile/page_settings") return jsonResponse(rawProfileFixture);
    if (method === "GET" && pathname === "/public/profile/streamer/social-media") {
      return jsonResponse([{ label: "Twitch", url: "https://twitch.tv/streamer" }]);
    }
    if (method === "GET" && pathname === "/payment-methods-configuration") return jsonResponse(rawPaymentMethodsConfigurationFixture);
    if (method === "GET" && pathname === "/user/payment-methods") return jsonResponse(rawUserPaymentMethodsFixture);
    if (method === "POST" && pathname === "/user/payment-methods/paypal") return jsonResponse(rawUserPaymentMethodFixture);
    if (method === "GET" && pathname === "/user/configuration") return jsonResponse(rawSettingsFixture);
    if (method === "PUT" && pathname === "/user/configuration/TIP_ALERT") return emptyResponse();
    if (method === "PUT" && pathname === "/user/configuration/COUNTER_TO_END_LIVE") return emptyResponse();
    if (method === "PATCH" && pathname === "/user/configuration/toggle-alerts") return jsonResponse(toggleDisabledFixture);
    if (method === "PATCH" && pathname === "/user/configuration/toggle-alerts-sound") return jsonResponse(toggleDisabledFixture);
    if (method === "GET" && pathname === "/user/configuration/global/forbidden_words") return jsonResponse(forbiddenWordsFixture);
    if (method === "GET" && pathname === "/user/configuration/global/profanity_filter") return jsonResponse(profanityFilterFixture);
    if (method === "GET" && pathname === "/user/goals") return jsonResponse([rawGoalFixture]);
    if (method === "POST" && pathname === "/user/goals") return jsonResponse(rawGoalFixture);
    if (method === "PATCH" && pathname === "/user/goals/goal-123") return emptyResponse();
    if (method === "PATCH" && pathname === "/user/goals/goal-123/reset") return emptyResponse();
    if (method === "GET" && pathname === "/user/voting") return jsonResponse(rawVotingFixture);
    if (method === "GET" && pathname === "/user/templates") return jsonResponse([rawTemplateFixture]);
    if (method === "PUT" && pathname === "/templates/template-123") return emptyResponse();
    if (method === "GET" && pathname === "/user/tips" && url.searchParams.get("limit") === "10") return jsonResponse([rawTipFixture]);
    if (method === "GET" && pathname === "/user/tipsmoderation") return jsonResponse([{ id: "mod-tip-1" }]);
    if (method === "GET" && pathname === "/user/tipsmoderation/basket") return jsonResponse([{ id: "mod-tip-2" }]);
    if (method === "GET" && pathname === "/user/tipspending") return jsonResponse([{ id: "pending-tip-1" }]);
    if (method === "POST" && pathname === "/user/toggle-message-audio") return emptyResponse();
    if (method === "POST" && pathname === "/test-tip") return jsonResponse({ ok: true, id: "test-tip-123" });
    if (method === "GET" && pathname === "/moderators") return jsonResponse([rawModeratorFixture]);
    if (method === "POST" && pathname === "/moderators") {
      return jsonResponse(rawModeratorFixture);
    }
    if (method === "DELETE" && pathname === "/moderators/moderator-123") return emptyResponse();
    if (method === "POST" && pathname === "/user/toggle-moderator") return emptyResponse();
    if (method === "GET" && pathname === "/user/media") return jsonResponse([rawMediaFixture]);
    if (method === "GET" && pathname === "/user/media/usage") return jsonResponse(mediaUsageFixture);
    if (method === "GET" && pathname === "/medium/501/formats") return jsonResponse(rawMediaFormatsFixture);
    if (method === "GET" && pathname === "/user/accounts") return jsonResponse([rawAccountFixture]);
    if (method === "GET" && pathname === "/withdrawal-methods-configuration") return jsonResponse(rawWithdrawalMethodsFixture);
    if (method === "GET" && pathname === "/user/withdrawals/latest") return jsonResponse([rawWithdrawalFixture]);
    if (method === "GET" && pathname === "/user/withdrawals") return jsonResponse([rawWithdrawalFixture]);
    if (method === "GET" && pathname === "/user/reports") return jsonResponse([rawReportFixture]);
    if (method === "GET" && pathname === "/api/templates/TIPS_GOAL/user-123") return jsonResponse(rawPublicGoalTemplatesFixture);
    if (method === "GET" && pathname === "/api/configuration/TIPS_GOAL/user-123") return jsonResponse(rawPublicGoalConfigurationFixture);
    if (method === "GET" && pathname === "/api/templatefonts/user-123") {
      return new Response(publicTemplateFontsFixture, {
        status: 200,
        headers: { "content-type": "text/css" },
      });
    }
    if (method === "GET" && pathname === "/api/widget/goal/goal-123/user-123") return jsonResponse(rawPublicGoalWidgetFixture);
    if (method === "GET" && pathname === "/api/widgetmessage/user-123") return jsonResponse(true);
    if (method === "GET" && pathname === "/api/templates/GOAL_VOTING/user-123") return jsonResponse(rawPublicVotingTemplatesFixture);
    if (method === "GET" && pathname === "/api/configuration/GOAL_VOTING/user-123") return jsonResponse(rawVotingFixture);
    if (method === "GET" && pathname === "/bank/print-confirmation/withdrawal-123/pdf") {
      return new Response(Uint8Array.from([37, 80, 68, 70]), {
        status: 200,
        headers: { "content-type": "application/pdf" },
      });
    }

    throw new Error(`Unhandled request: ${method} ${pathname}`);
  });

  return {
    client: createTipplyClient({ authCookie: "cookie-123", fetch }),
    requests,
  };
}

describe("resource namespaces", () => {
  test("me namespace reads current user", async () => {
    const { client } = createFixtureClient();
    await expect(client.me.get()).resolves.toEqual(currentUserFixture);
  });

  test("dashboard namespace reads announcements, stats, tips and notifications", async () => {
    const { client } = createFixtureClient();
    await expect(client.dashboard.announcements.list()).resolves.toEqual([dashboardAnnouncementFixture]);
    await expect(client.dashboard.announcements.listExtra()).resolves.toEqual([extraDashboardAnnouncementFixture]);
    await expect(client.dashboard.stats.income.get()).resolves.toEqual({
      total: 5000,
      last28: 2500,
      last7: 1200,
      last7PercentChange: 12,
      currentMonth: 3000,
      currentMonthPercentChange: 8,
    });
    await expect(client.dashboard.stats.tips.get()).resolves.toEqual({
      count: 5,
      countPercentage: 20,
      messagesLength: 100,
      messagesLengthPercentage: 10,
    });
    await expect(client.dashboard.points.get()).resolves.toBe(321);
    await expect(client.dashboard.tips.recent.list()).resolves.toEqual([tipFixture]);
    await expect(client.dashboard.notifications.list()).resolves.toEqual([notificationFixture]);
  });

  test("profile namespace supports reads and writes", async () => {
    const { client } = createFixtureClient();
    await expect(client.profile.get()).resolves.toEqual(profileFixture);
    await expect(client.profile.pendingChanges.check()).resolves.toBe(true);
    await expect(client.profile.page.updateSettings({ description: profileFixture.description })).resolves.toEqual(profileFixture);
    await expect(client.profile.public("streamer").socialLinks.list()).resolves.toEqual(profileFixture.socialMediaLinks);
  });

  test("payment methods namespace reads config and updates method", async () => {
    const { client } = createFixtureClient();
    await expect(client.paymentMethods.configuration.get()).resolves.toEqual(paymentMethodsConfigurationFixture);
    await expect(client.paymentMethods.list()).resolves.toEqual(userPaymentMethodsFixture);
    await expect(client.paymentMethods.method("paypal").update({ minimalAmount: 1500 })).resolves.toEqual(userPaymentMethodFixture);
  });

  test("settings namespace reads and writes configuration payloads", async () => {
    const { client } = createFixtureClient();
    await expect(client.settings.list()).resolves.toEqual(settingsFixture);
    await expect(client.settings.tipAlerts.update(tipAlertConfigurationFixture)).resolves.toBeUndefined();
    await expect(client.settings.countdown.update(countdownConfigurationFixture)).resolves.toBeUndefined();
    await expect(client.settings.alerts.toggle(false)).resolves.toEqual(toggleDisabledFixture);
    await expect(client.settings.alertSound.toggle(false)).resolves.toEqual(toggleDisabledFixture);
    await expect(client.settings.forbiddenWords.get()).resolves.toEqual(forbiddenWordsFixture);
    await expect(client.settings.profanityFilter.get()).resolves.toEqual(profanityFilterFixture);
  });

  test("public client exposes the tip alert listener factory", () => {
    const client = createTipplyPublicClient();
    const listener = client.user(asUserId("user-123")).tipAlerts.createListener();

    expect(typeof listener.connect).toBe("function");
    expect(typeof listener.destroy).toBe("function");
    expect(typeof listener.on).toBe("function");
  });

  test("public client can create a tip alert listener from a widget URL", () => {
    const client = createTipplyPublicClient();
    const listener = client.tipAlerts.fromWidgetUrl("https://widgets.tipply.pl/TIP_ALERT/user-123");

    expect(listener.userId).toBe("user-123");
  });

  test("authenticated client can create a tip alert listener from the current session user", async () => {
    const { client } = createFixtureClient();
    const listener = await client.tipAlerts.createListener();

    expect(listener.userId).toBe(currentUserFixture.id);
  });

  test("authenticated client exposes tip resend and skip controls", () => {
    const { client } = createFixtureClient();

    expect(typeof client.tips.id(asTipId("tip-123")).resend).toBe("function");
    expect(typeof client.tips.sendTest).toBe("function");
    expect(typeof client.tipAlerts.skipCurrent).toBe("function");
  });

  test("settings list tolerates malformed known config records", async () => {
    const { fetch } = createMockFetch((request) => {
      if (request.method === "GET" && request.url.pathname === "/user/configuration") {
        return jsonResponse([
          {
            type: "GLOBAL",
            config: {
              forbidden_words: {
                enabled: true,
                words: ["blocked-word"],
              },
              profanity_filter_enabled: true,
            },
          },
        ]);
      }

      throw new Error(`Unhandled request: ${request.method} ${request.url.pathname}`);
    });

    const client = createTipplyClient({ authCookie: "cookie-123", fetch });

    await expect(client.settings.list()).resolves.toEqual([
      {
        type: "GLOBAL",
        config: {
          forbidden_words: {
            enabled: true,
            words: ["blocked-word"],
          },
          profanity_filter_enabled: true,
        },
      },
    ]);
  });

  test("settings list tolerates array config payloads for known records", async () => {
    const { fetch } = createMockFetch((request) => {
      if (request.method === "GET" && request.url.pathname === "/user/configuration") {
        return jsonResponse([
          {
            type: "GLOBAL",
            config: ["unexpected", "array"],
          },
        ]);
      }

      throw new Error(`Unhandled request: ${request.method} ${request.url.pathname}`);
    });

    const client = createTipplyClient({ authCookie: "cookie-123", fetch });

    await expect(client.settings.list()).resolves.toEqual([
      {
        type: "GLOBAL",
        config: ["unexpected", "array"],
      },
    ]);
  });

  test("public namespace supports documented template fonts and wrapped goal configuration", async () => {
    const { client } = createFixtureClient();
    const publicUser = client.public.user(asUserId("user-123"));

    await expect(publicUser.goals.configuration.get()).resolves.toEqual(publicGoalConfigurationFixture);
    await expect(publicUser.templateFonts.get()).resolves.toEqual(publicTemplateFontsFixture);
  });

  test("withdrawals namespace downloads confirmation pdf bytes", async () => {
    const { client } = createFixtureClient();
    const bytes = new Uint8Array(await client.withdrawals.id(asWithdrawalId("withdrawal-123")).confirmationPdf.get());

    expect(Array.from(bytes)).toEqual([37, 80, 68, 70]);
  });

  test("goals namespace supports list create update reset and voting", async () => {
    const { client } = createFixtureClient();
    await expect(client.goals.list()).resolves.toEqual([goalFixture]);
    await expect(client.goals.create(createGoalFixture)).resolves.toEqual(goalFixture);
    await expect(client.goals.id(asGoalId("goal-123")).update(updateGoalFixture)).resolves.toBeUndefined();
    await expect(client.goals.id(asGoalId("goal-123")).reset()).resolves.toBeUndefined();
    await expect(client.goals.voting.get()).resolves.toEqual(votingFixture);
  });

  test("templates namespace lists templates and replaces payloads", async () => {
    const { client } = createFixtureClient();
    await expect(client.templates.list()).resolves.toEqual([
      {
        id: asTemplateId("template-123"),
        type: "TIPS_GOAL",
        updatedAt: "2026-03-30T00:49:33+02:00",
        config: { title: "Goal Template", editable: true },
      },
    ]);
    await expect(
      client.templates.id(asTemplateId("template-123")).replace({
        title: "Goal Template",
        editable: true,
        elementsOptions: {
          goalName: {
            isVisible: true,
          },
        },
      }),
    ).resolves.toBeUndefined();
  });

  test("tips namespace supports read and action endpoints", async () => {
    const { client } = createFixtureClient();
    await expect(client.tips.list().limit(10).filter("default").search("").get()).resolves.toEqual([tipFixture]);
    await expect(client.tips.moderation.listQueue()).resolves.toEqual([{ id: "mod-tip-1" }]);
    await expect(client.tips.moderation.listBasket()).resolves.toEqual([{ id: "mod-tip-2" }]);
    await expect(client.tips.pending.list()).resolves.toEqual([{ id: "pending-tip-1" }]);
    await expect(client.tips.audio.toggle()).resolves.toBeUndefined();
    await expect(client.tips.sendTest({ message: "testowa wiadomosc", amount: 1500 })).resolves.toEqual({
      ok: true,
      id: "test-tip-123",
    });
  });

  test("moderators namespace supports read create remove and toggle", async () => {
    const { client } = createFixtureClient();
    await expect(client.moderators.list()).resolves.toEqual([
      {
        id: asModeratorId("moderator-123"),
        userId: asUserId("user-123"),
        moderationMode: "1",
        moderatorName: "Moderator One",
        linkTime: 100,
        link: "",
        createdAt: "2026-03-30T00:49:33+02:00",
      },
    ]);
    await expect(client.moderators.create(createModeratorFixture)).resolves.toEqual({
      id: asModeratorId("moderator-123"),
      userId: asUserId("user-123"),
      moderationMode: "1",
      moderatorName: "Moderator One",
      linkTime: 100,
      link: "",
      createdAt: "2026-03-30T00:49:33+02:00",
    });
    await expect(client.moderators.id(asModeratorId("moderator-123")).remove()).resolves.toBeUndefined();
    await expect(client.moderators.mode.toggle()).resolves.toBeUndefined();
  });

  test("media namespace reads inventory and formats", async () => {
    const { client } = createFixtureClient();
    await expect(client.media.list()).resolves.toEqual([mediaFixture]);
    await expect(client.media.usage.get()).resolves.toEqual(mediaUsageFixture);
    await expect(client.media.id(asMediaId(501)).formats.get()).resolves.toEqual(mediaFormatsFixture);
  });

  test("withdrawals namespace reads accounts methods and withdrawals", async () => {
    const { client, requests } = createFixtureClient();
    await expect(client.withdrawals.accounts.list()).resolves.toEqual([accountFixture]);
    await expect(client.withdrawals.methods.configuration.get()).resolves.toEqual(withdrawalMethodsFixture);
    await expect(client.withdrawals.latest.list()).resolves.toEqual([withdrawalFixture]);
    await expect(client.withdrawals.list().status("accepted", "transferred").limit(20).offset(0).get()).resolves.toEqual([withdrawalFixture]);

    const withdrawalsRequest = requests.find((request) => request.url.pathname === "/user/withdrawals");
    expect(withdrawalsRequest?.url.searchParams.getAll("status[]")).toEqual(["ACCEPTED", "TRANSFERRED"]);
  });

  test("reports namespace lists generated reports", async () => {
    const { client } = createFixtureClient();
    await expect(client.reports.list()).resolves.toEqual([reportFixture]);
  });

  test("public namespace reads public widget data", async () => {
    const { client } = createFixtureClient();
    const publicUser = client.public.user(asUserId("user-123"));

    await expect(publicUser.goals.templates.list()).resolves.toEqual(publicGoalTemplatesFixture);
    await expect(publicUser.goals.configuration.get()).resolves.toEqual(publicGoalConfigurationFixture);
    await expect(publicUser.goals.id(asGoalId("goal-123")).widget.get()).resolves.toEqual(publicGoalWidgetFixture);
    await expect(publicUser.widgetMessage.get()).resolves.toBe(true);
    await expect(publicUser.voting.templates.list()).resolves.toEqual(publicVotingTemplatesFixture);
    await expect(publicUser.voting.configuration.get()).resolves.toEqual(votingFixture);
  });
});
