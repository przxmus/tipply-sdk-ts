import { describe, expect, test } from "bun:test";

import { TipplyClient } from "../../src";

const accessToken = process.env.TIPPLY_ACCESS_TOKEN;
const allowMutations = process.env.TIPPLY_ALLOW_MUTATIONS === "true";

const liveDescribe = accessToken ? describe : describe.skip;
const liveMutationDescribe = accessToken && allowMutations ? describe : describe.skip;

function createLiveClient(): TipplyClient {
  if (!accessToken) {
    throw new Error("TIPPLY_ACCESS_TOKEN is required for live tests.");
  }

  return new TipplyClient({
    accessToken,
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
