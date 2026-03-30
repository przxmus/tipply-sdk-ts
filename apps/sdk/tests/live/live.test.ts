import { describe, expect, test } from "bun:test";

import { TipplyClient } from "../../src";

const authCookie = process.env.TIPPLY_AUTH_COOKIE;
const allowMutations = process.env.TIPPLY_ALLOW_MUTATIONS === "true";

const liveDescribe = authCookie ? describe : describe.skip;
const liveMutationDescribe = authCookie && allowMutations ? describe : describe.skip;

function createLiveClient(): TipplyClient {
  if (!authCookie) {
    throw new Error("TIPPLY_AUTH_COOKIE is required for live tests.");
  }

  return new TipplyClient({
    authCookie,
    validateResponses: false,
  });
}

liveDescribe("live smoke tests", () => {
  test("reads core authenticated and public endpoints", async () => {
    const client = createLiveClient();
    const currentUser = await client.identity.getCurrentUser();
    expect(currentUser.id).toBeTruthy();

    const profile = await client.profile.get();
    expect(profile.link).toBeTruthy();

    const goals = await client.goals.list();
    const primaryGoal = goals[0];

    await expect(client.dashboard.getIncomeStatistics()).resolves.toBeDefined();
    await expect(client.dashboard.getRecentTips()).resolves.toBeDefined();
    await expect(client.configurations.list()).resolves.toBeDefined();
    await expect(client.withdrawals.getAccounts()).resolves.toBeDefined();
    await expect(client.reports.list()).resolves.toBeDefined();
    await expect(client.public.getWidgetMessage(currentUser.id)).resolves.toEqual(expect.any(Boolean));

    if (primaryGoal) {
      await expect(client.public.getGoalWidget(primaryGoal.id, currentUser.id)).resolves.toBeDefined();
      await expect(client.public.getGoalTemplates(currentUser.id)).resolves.toBeDefined();
      await expect(client.public.getGoalConfiguration(currentUser.id)).resolves.toBeDefined();
    }
  });
});

liveMutationDescribe("live mutation tests", () => {
  test("replays safe idempotent updates", async () => {
    const client = createLiveClient();
    const profile = await client.profile.get();
    await expect(client.profile.updatePageSettings({ description: profile.description })).resolves.toBeDefined();

    const paymentMethods = await client.paymentMethods.getUserMethods();
    const paypal = paymentMethods.paypal;

    if (paypal) {
      await expect(client.paymentMethods.update("paypal", { minimalAmount: paypal.minimal_amount })).resolves.toBeDefined();
    }
  });
});
