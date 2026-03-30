import { describe, expect, test } from "bun:test";

import type { TemplateUpdateRequest } from "../../src";
import { TipplyClient } from "../../src";
import {
  accountFixture,
  configurationsFixture,
  countdownConfigurationFixture,
  createModeratorFixture,
  currentUserFixture,
  forbiddenWordsFixture,
  goalFixture,
  mediaUsageFixture,
  mediumFixture,
  mediumFormatsFixture,
  moderatorFixture,
  notificationFixture,
  paymentMethodsConfigurationFixture,
  profileFixture,
  profanityFilterFixture,
  publicGoalConfigurationFixture,
  publicGoalTemplatesFixture,
  publicGoalWidgetFixture,
  publicVotingTemplatesFixture,
  reportFixture,
  templateFixture,
  tipAlertConfigurationFixture,
  tipFixture,
  toggleDisabledFixture,
  userPaymentMethodFixture,
  userPaymentMethodsFixture,
  votingFixture,
  withdrawalFixture,
  withdrawalMethodsFixture,
} from "../fixtures/sanitized";
import { createMockFetch, emptyResponse, jsonResponse } from "../support/mock-fetch";

function createFixtureClient() {
  const { fetch, requests } = createMockFetch((request) => {
    const { method, url, body } = request;
    const pathname = url.pathname;

    if (method === "GET" && pathname === "/user") return jsonResponse(currentUserFixture);
    if (method === "GET" && pathname === "/announcements") return jsonResponse([{ id: "announcement-1" }]);
    if (method === "GET" && pathname === "/extraannouncements") return jsonResponse([{ id: "announcement-2" }]);
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
    if (method === "GET" && pathname === "/user/points") return jsonResponse(10);
    if (method === "GET" && pathname === "/user/tips") return jsonResponse([tipFixture]);
    if (method === "GET" && pathname === "/user/notifications") return jsonResponse([notificationFixture]);
    if (method === "GET" && pathname === "/user/profile") return jsonResponse(profileFixture);
    if (method === "PATCH" && pathname === "/user/profile/page_settings") {
      expect(body).toEqual({ description: "Updated profile" });
      return jsonResponse(profileFixture);
    }
    if (method === "GET" && pathname === "/public/profile/streamer/social-media") {
      return jsonResponse([{ label: "Twitch", url: "https://twitch.tv/streamer" }]);
    }
    if (method === "GET" && pathname === "/payment-methods-configuration") return jsonResponse(paymentMethodsConfigurationFixture);
    if (method === "GET" && pathname === "/user/payment-methods") return jsonResponse(userPaymentMethodsFixture);
    if (method === "POST" && pathname === "/user/payment-methods/paypal") {
      expect(body).toEqual({ minimalAmount: 1500 });
      return jsonResponse(userPaymentMethodFixture);
    }
    if (method === "GET" && pathname === "/user/configuration") return jsonResponse(configurationsFixture);
    if (method === "PUT" && pathname === "/user/configuration/TIP_ALERT") {
      expect(body).toEqual(tipAlertConfigurationFixture);
      return emptyResponse(204);
    }
    if (method === "PUT" && pathname === "/user/configuration/COUNTER_TO_END_LIVE") {
      expect(body).toEqual(countdownConfigurationFixture);
      return emptyResponse(204);
    }
    if (method === "PATCH" && pathname === "/user/configuration/toggle-alerts") {
      expect(body).toEqual({ disabled: false });
      return jsonResponse(toggleDisabledFixture);
    }
    if (method === "PATCH" && pathname === "/user/configuration/toggle-alerts-sound") {
      expect(body).toEqual({ disabled: false });
      return jsonResponse(toggleDisabledFixture);
    }
    if (method === "GET" && pathname === "/user/configuration/global/forbidden_words") return jsonResponse(forbiddenWordsFixture);
    if (method === "GET" && pathname === "/user/configuration/global/profanity_filter") return jsonResponse(profanityFilterFixture);
    if (method === "GET" && pathname === "/user/goals") return jsonResponse([goalFixture]);
    if (method === "POST" && pathname === "/user/goals") return jsonResponse(goalFixture, { status: 201 });
    if (method === "PATCH" && pathname === `/user/goals/${goalFixture.id}`) return emptyResponse(204);
    if (method === "PATCH" && pathname === `/user/goals/${goalFixture.id}/reset`) return emptyResponse(204);
    if (method === "GET" && pathname === "/user/voting") return jsonResponse(votingFixture);
    if (method === "GET" && pathname === "/user/templates") return jsonResponse([templateFixture]);
    if (method === "PUT" && pathname === `/templates/${templateFixture.id}`) return emptyResponse(204);
    if (method === "GET" && pathname === "/user/tipsmoderation") return jsonResponse([{ id: "moderation-1" }]);
    if (method === "GET" && pathname === "/user/tipsmoderation/basket") return jsonResponse([{ id: "basket-1" }]);
    if (method === "GET" && pathname === "/user/tipspending") return jsonResponse([{ id: "pending-1" }]);
    if (method === "POST" && pathname === "/user/toggle-message-audio") return emptyResponse(204);
    if (method === "GET" && pathname === "/moderators") return jsonResponse([moderatorFixture]);
    if (method === "POST" && pathname === "/moderators") {
      expect(body).toEqual(createModeratorFixture);
      return jsonResponse(moderatorFixture, { status: 201 });
    }
    if (method === "DELETE" && pathname === `/moderators/${moderatorFixture.id}`) return emptyResponse(204);
    if (method === "POST" && pathname === "/user/toggle-moderator") return emptyResponse(204);
    if (method === "GET" && pathname === "/user/media") return jsonResponse([mediumFixture]);
    if (method === "GET" && pathname === "/user/media/usage") return jsonResponse(mediaUsageFixture);
    if (method === "GET" && pathname === `/medium/${mediumFixture.id}/formats`) return jsonResponse(mediumFormatsFixture);
    if (method === "GET" && pathname === "/user/accounts") return jsonResponse([accountFixture]);
    if (method === "GET" && pathname === "/withdrawal-methods-configuration") return jsonResponse(withdrawalMethodsFixture);
    if (method === "GET" && pathname === "/user/withdrawals/latest") return jsonResponse([withdrawalFixture]);
    if (method === "GET" && pathname === "/user/withdrawals") return jsonResponse([withdrawalFixture]);
    if (method === "GET" && pathname === "/user/reports") return jsonResponse([reportFixture]);
    if (method === "GET" && pathname === "/api/templates/TIPS_GOAL/user-123") return jsonResponse(publicGoalTemplatesFixture);
    if (method === "GET" && pathname === "/api/configuration/TIPS_GOAL/user-123") return jsonResponse(publicGoalConfigurationFixture);
    if (method === "GET" && pathname === "/api/widget/goal/goal-123/user-123") return jsonResponse(publicGoalWidgetFixture);
    if (method === "GET" && pathname === "/api/widgetmessage/user-123") return jsonResponse(true);
    if (method === "GET" && pathname === "/api/templates/GOAL_VOTING/user-123") return jsonResponse(publicVotingTemplatesFixture);
    if (method === "GET" && pathname === "/api/configuration/GOAL_VOTING/user-123") return jsonResponse(votingFixture);

    throw new Error(`Unhandled request: ${method} ${pathname}`);
  });

  const client = new TipplyClient({
    authCookie: "cookie-123",
    fetch,
    validateResponses: true,
  });

  return { client, requests };
}

describe("resource namespaces", () => {
  test("identity namespace reads current user", async () => {
    const { client } = createFixtureClient();
    await expect(client.identity.getCurrentUser()).resolves.toEqual(currentUserFixture);
  });

  test("dashboard namespace reads announcements, stats, tips and notifications", async () => {
    const { client } = createFixtureClient();

    await expect(client.dashboard.getAnnouncements()).resolves.toHaveLength(1);
    await expect(client.dashboard.getExtraAnnouncements()).resolves.toHaveLength(1);
    await expect(client.dashboard.getIncomeStatistics()).resolves.toHaveProperty("total", 5000);
    await expect(client.dashboard.getTipStatistics()).resolves.toHaveProperty("count", 5);
    await expect(client.dashboard.getPoints()).resolves.toBe(10);
    await expect(client.dashboard.getRecentTips()).resolves.toEqual([tipFixture]);
    await expect(client.dashboard.getNotifications()).resolves.toEqual([notificationFixture]);
  });

  test("profile namespace supports reads and writes", async () => {
    const { client } = createFixtureClient();

    await expect(client.profile.get()).resolves.toEqual(profileFixture);
    await expect(client.profile.updatePageSettings({ description: "Updated profile" })).resolves.toEqual(profileFixture);
    await expect(client.profile.getPublicSocialMedia("streamer")).resolves.toHaveLength(1);
  });

  test("payment methods namespace reads config and updates method", async () => {
    const { client } = createFixtureClient();

    await expect(client.paymentMethods.getConfiguration()).resolves.toEqual(paymentMethodsConfigurationFixture);
    await expect(client.paymentMethods.getUserMethods()).resolves.toEqual(userPaymentMethodsFixture);
    await expect(client.paymentMethods.update("paypal", { minimalAmount: 1500 })).resolves.toEqual(userPaymentMethodFixture);
  });

  test("configurations namespace reads and writes configuration payloads", async () => {
    const { client } = createFixtureClient();

    await expect(client.configurations.list()).resolves.toEqual(configurationsFixture);
    await expect(client.configurations.updateTipAlert(tipAlertConfigurationFixture)).resolves.toBeUndefined();
    await expect(client.configurations.updateCountdown(countdownConfigurationFixture)).resolves.toBeUndefined();
    await expect(client.configurations.toggleAlerts(false)).resolves.toEqual(toggleDisabledFixture);
    await expect(client.configurations.toggleAlertSound(false)).resolves.toEqual(toggleDisabledFixture);
    await expect(client.configurations.getForbiddenWords()).resolves.toEqual(forbiddenWordsFixture);
    await expect(client.configurations.getProfanityFilter()).resolves.toEqual(profanityFilterFixture);
  });

  test("goals namespace supports list/create/update/reset and voting", async () => {
    const { client } = createFixtureClient();

    await expect(client.goals.list()).resolves.toEqual([goalFixture]);
    await expect(
      client.goals.create({
        title: goalFixture.title,
        target: goalFixture.target,
        initial_value: goalFixture.initial_value,
        without_commission: goalFixture.without_commission,
        template_id: goalFixture.template_id,
      }),
    ).resolves.toEqual(goalFixture);
    await expect(client.goals.update(goalFixture.id, goalFixture)).resolves.toBeUndefined();
    await expect(client.goals.reset(goalFixture.id)).resolves.toBeUndefined();
    await expect(client.goals.getVoting()).resolves.toEqual(votingFixture);
  });

  test("templates namespace lists user templates and writes full replacement payloads", async () => {
    const { client } = createFixtureClient();
    const payload: TemplateUpdateRequest = {
      title: "Goal Template",
      editable: true,
      elementsOptions: {
        goalName: {
          isVisible: true,
        },
      },
    };

    await expect(client.templates.listUserTemplates()).resolves.toEqual([templateFixture]);
    await expect(client.templates.updateTemplate(templateFixture.id, payload)).resolves.toBeUndefined();
  });

  test("tips namespace supports read and action endpoints", async () => {
    const { client } = createFixtureClient();

    await expect(client.tips.list({ limit: 10, filter: "default", search: "" })).resolves.toEqual([tipFixture]);
    await expect(client.tips.listModerationQueue()).resolves.toHaveLength(1);
    await expect(client.tips.listModerationBasket()).resolves.toHaveLength(1);
    await expect(client.tips.listPending()).resolves.toHaveLength(1);
    await expect(client.tips.toggleMessageAudio()).resolves.toBeUndefined();
  });

  test("moderators namespace supports read, create, remove and toggle", async () => {
    const { client } = createFixtureClient();

    await expect(client.moderators.list()).resolves.toEqual([moderatorFixture]);
    await expect(client.moderators.create(createModeratorFixture)).resolves.toEqual(moderatorFixture);
    await expect(client.moderators.remove(moderatorFixture.id)).resolves.toBeUndefined();
    await expect(client.moderators.toggleMode()).resolves.toBeUndefined();
  });

  test("media namespace reads media inventory and formats", async () => {
    const { client } = createFixtureClient();

    await expect(client.media.list()).resolves.toEqual([mediumFixture]);
    await expect(client.media.getUsage()).resolves.toEqual(mediaUsageFixture);
    await expect(client.media.getFormats(mediumFixture.id)).resolves.toEqual(mediumFormatsFixture);
  });

  test("withdrawals namespace reads accounts, methods and withdrawals", async () => {
    const { client, requests } = createFixtureClient();

    await expect(client.withdrawals.getAccounts()).resolves.toEqual([accountFixture]);
    await expect(client.withdrawals.getMethodsConfiguration()).resolves.toEqual(withdrawalMethodsFixture);
    await expect(client.withdrawals.getLatest()).resolves.toEqual([withdrawalFixture]);
    await expect(
      client.withdrawals.list({
        statuses: ["ACCEPTED", "TRANSFERRED"],
        limit: 20,
        offset: 0,
      }),
    ).resolves.toEqual([withdrawalFixture]);

    const withdrawalRequest = requests.find((request) => request.url.pathname === "/user/withdrawals");
    expect(withdrawalRequest?.url.searchParams.getAll("status[]")).toEqual(["ACCEPTED", "TRANSFERRED"]);
  });

  test("reports namespace lists generated reports", async () => {
    const { client } = createFixtureClient();
    await expect(client.reports.list()).resolves.toEqual([reportFixture]);
  });

  test("public namespace reads public widget data", async () => {
    const { client } = createFixtureClient();

    await expect(client.public.getGoalTemplates("user-123")).resolves.toEqual(publicGoalTemplatesFixture);
    await expect(client.public.getGoalConfiguration("user-123")).resolves.toEqual(publicGoalConfigurationFixture);
    await expect(client.public.getGoalWidget("goal-123", "user-123")).resolves.toEqual(publicGoalWidgetFixture);
    await expect(client.public.getWidgetMessage("user-123")).resolves.toBe(true);
    await expect(client.public.getVotingTemplates("user-123")).resolves.toEqual(publicVotingTemplatesFixture);
    await expect(client.public.getVotingConfiguration("user-123")).resolves.toEqual(votingFixture);
  });
});
