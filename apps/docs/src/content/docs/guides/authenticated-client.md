---
title: Authenticated Client
description: Use the full Tipply client for private endpoints, token refresh behavior, common account workflows, and session cloning.
sidebar:
  order: 1
---

## When To Use It

Use `createTipplyClient()` when you need private account data or actions such as:

- dashboard and account reads
- profile and settings updates
- tip moderation and resend actions
- payout and report access
- realtime control commands such as `skipCurrent()`

## Create A Client

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});
```

## Auth Token Lifecycle

The authenticated client can keep the session usable across longer scripts:

- `auth.refreshTokenOnRequests`: defaults to `true`; stores new `auth_token` values returned in `Set-Cookie`
- `auth.refreshTokenEvery`: disabled by default; when enabled, periodically refreshes the session through `/user`
- `auth.reconnectTries`: defaults to `3`; retries selected auth and transport failures

```ts
const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  auth: {
    refreshTokenOnRequests: true,
    refreshTokenEvery: { intervalMs: 60_000 },
    reconnectTries: 3,
  },
});
```

Call `client.close()` if you enabled background refresh and no longer need the client.

## Common Workflows

### Current user and profile

```ts
const me = await client.me.get();
const profile = await client.profile.get();
const hasPendingChanges = await client.profile.pendingChanges.check();
```

### Dashboard summary

```ts
const [income, tipStats, points, recentTips] = await Promise.all([
  client.dashboard.stats.income.get(),
  client.dashboard.stats.tips.get(),
  client.dashboard.points.get(),
  client.dashboard.tips.recent.list(),
]);
```

### Tips and moderation

```ts
const tips = await client.tips
  .list()
  .filter("amount")
  .search("microphone")
  .limit(10)
  .offset(0)
  .get();

await client.tips.sendTest({
  message: "SDK test tip",
  amount: 1500,
});
```

### Goal management

```ts
import { asTemplateId } from "tipply-sdk-ts";

const goal = await client.goals.create({
  title: "New microphone",
  target: 50_000,
  initialValue: 0,
  withoutCommission: false,
  templateId: asTemplateId("template-123"),
});

await client.goals.id(goal.id).reset();
```

### Alert control

```ts
import { asTipId } from "tipply-sdk-ts";

await client.tips.id(asTipId("tip-123")).resend();
await client.tipAlerts.skipCurrent();
```

## Clone The Client For Another Session

```ts
const baseClient = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const anotherClient = baseClient.withAuthCookie(process.env.OTHER_TIPPLY_AUTH_COOKIE!);
```

You can also replace the whole session strategy:

```ts
const anotherClient = baseClient.withSession({
  getAuthCookie: async () => process.env.OTHER_TIPPLY_AUTH_COOKIE,
});
```

## Namespaces

- `me`
- `dashboard`
- `profile`
- `paymentMethods`
- `settings`
- `goals`
- `templates`
- `tips`
- `moderators`
- `media`
- `withdrawals`
- `reports`
- `tipAlerts`
- `public`
