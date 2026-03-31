---
title: Examples
description: Run maintained Tipply SDK examples for dashboard reads, public widgets, alert listeners, and tip control flows.
sidebar:
  order: 5
---

## Repository Examples

Maintained runnable examples live in `apps/sdk/examples`:

- `dashboard-summary.ts`
- `public-goal-widget.ts`
- `tip-controls.ts`
- `tip-alerts-listener.ts`
- `playground.local.ts`

## Dashboard Summary

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const [me, income, points, recentTips] = await Promise.all([
  client.me.get(),
  client.dashboard.stats.income.get(),
  client.dashboard.points.get(),
  client.dashboard.tips.recent.list(),
]);

console.log(me.username, income.total, points, recentTips.length);
```

## Public Goal Widget

```ts
import { asGoalId, asUserId } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
const user = client.user(asUserId("user-123"));

const widget = await user.goals.id(asGoalId("goal-123")).widget.get();

console.log(widget.config.title, widget.stats.amount);
```

## `TIP_ALERT` Listener

```ts
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const listener = createTipplyPublicClient().tipAlerts.fromWidgetUrl(
  "https://widgets.tipply.pl/TIP_ALERT/user-123",
);

listener.on("donation", (donation) => {
  console.log(`${donation.nickname}: ${donation.amount}`);
});

await listener.connect();
```

## Tip Controls

```ts
import { asTipId, createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

await client.tips.id(asTipId("tip-123")).resend();
await client.tipAlerts.skipCurrent();
```
