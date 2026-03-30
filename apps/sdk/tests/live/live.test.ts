import { describe, expect, test } from "bun:test";

import { createTipplyClient } from "../../src";

const authCookie = process.env.TIPPLY_AUTH_COOKIE;
const allowMutations = process.env.TIPPLY_ALLOW_MUTATIONS === "true";

const liveDescribe = authCookie ? describe : describe.skip;
const liveMutationDescribe = authCookie && allowMutations ? describe : describe.skip;

function createLiveClient() {
  if (!authCookie) {
    throw new Error("TIPPLY_AUTH_COOKIE is required for live tests.");
  }

  return createTipplyClient({
    authCookie,
    validation: false,
  });
}

liveDescribe("live smoke tests", () => {
  test("reads core authenticated and public endpoints", async () => {
    const client = createLiveClient();
    const currentUser = await client.me.get();
    expect(currentUser.id).toBeTruthy();

    const profile = await client.profile.get();
    expect(profile.link).toBeTruthy();

    const goals = await client.goals.list();
    const primaryGoal = goals[0];

    await expect(client.dashboard.stats.income.get()).resolves.toBeDefined();
    await expect(client.dashboard.tips.recent.list()).resolves.toBeDefined();
    await expect(client.settings.list()).resolves.toBeDefined();
    await expect(client.withdrawals.accounts.list()).resolves.toBeDefined();
    await expect(client.reports.list()).resolves.toBeDefined();
    await expect(client.public.user(currentUser.id).widgetMessage.get()).resolves.toEqual(expect.any(Boolean));

    if (primaryGoal) {
      const publicUser = client.public.user(currentUser.id);
      await expect(publicUser.goals.id(primaryGoal.id).widget.get()).resolves.toBeDefined();
      await expect(publicUser.goals.templates.list()).resolves.toBeDefined();
      await expect(publicUser.goals.configuration.get()).resolves.toBeDefined();
    }
  });
});

liveMutationDescribe("live mutation tests", () => {
  test("replays safe idempotent updates", async () => {
    const client = createLiveClient();
    const profile = await client.profile.get();
    await expect(client.profile.page.updateSettings({ description: profile.description })).resolves.toBeDefined();

    const paymentMethods = await client.paymentMethods.list();
    const paypal = paymentMethods.paypal;

    if (paypal) {
      await expect(client.paymentMethods.method("paypal").update({ minimalAmount: paypal.minimalAmount })).resolves.toBeDefined();
    }
  });
});
