---
title: Usage Examples
description: Krótkie, praktyczne scenariusze użycia SDK.
---

## 1. Raport startowy streamera

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const [me, profile, income, points, recentTips] = await Promise.all([
  client.me.get(),
  client.profile.get(),
  client.dashboard.stats.income.get(),
  client.dashboard.points.get(),
  client.dashboard.tips.recent.list(),
]);

console.log({
  username: me.username,
  profileSlug: profile.link,
  totalIncome: income.total,
  points,
  recentTipsCount: recentTips.length,
});
```

## 2. Aktualizacja minimalnej kwoty PayPal

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const updatedPaypal = await client.paymentMethods.method("paypal").update({
  minimalAmount: 1500,
});

console.log(updatedPaypal.minimalAmount);
```

## 3. Odczyt konfiguracji i widgetu celu

```ts
import { asGoalId, asUserId } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
const user = client.user(asUserId("user-123"));

const [configuration, widget] = await Promise.all([
  user.goals.configuration.get(),
  user.goals.id(asGoalId("goal-123")).widget.get(),
]);

console.log(configuration.goalName, widget.config.title, widget.stats.amount);
```

## 4. Listener `TIP_ALERT` z widget URL

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

## Pliki przykładowe w repo

Aktualne przykłady źródłowe znajdziesz w `apps/sdk/examples`:

- `dashboard-summary.ts`
- `public-goal-widget.ts`
- `tip-alerts-listener.ts`

Te przykłady są celowo krótkie i skupione na realnych scenariuszach użycia.
