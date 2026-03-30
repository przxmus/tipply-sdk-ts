---
title: Authenticated Client
description: Jak pracować z pełnym klientem Tipply dla endpointów wymagających sesji.
---

## Tworzenie klienta

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});
```

## Najczęstsze scenariusze

### Bieżący użytkownik i profil

```ts
const me = await client.me.get();
const profile = await client.profile.get();
const hasPendingProfileChanges = await client.profile.pendingChanges.check();
```

### Dashboard i statystyki

```ts
const [announcements, extraAnnouncements, incomeStats, tipStats, points] = await Promise.all([
  client.dashboard.announcements.list(),
  client.dashboard.announcements.listExtra(),
  client.dashboard.stats.income.get(),
  client.dashboard.stats.tips.get(),
  client.dashboard.points.get(),
]);
```

### Ostatnie tipy i filtrowanie listy

```ts
const recentTips = await client.dashboard.tips.recent.list();

const filteredTips = await client.tips
  .list()
  .filter("amount")
  .search("mikrofon")
  .limit(10)
  .offset(0)
  .get();
```

### Metody płatności

```ts
const configuration = await client.paymentMethods.configuration.get();
const methods = await client.paymentMethods.list();

const updatedPaypal = await client.paymentMethods.method("paypal").update({
  minimalAmount: 1500,
});
```

### Ustawienia alertów i profilu

```ts
await client.settings.alerts.toggle(false);
await client.settings.alertSound.toggle(false);

await client.profile.page.updateSettings({
  description: "Streamer variety, speedrunning i live coding.",
});
```

### Cele i voting

```ts
const goals = await client.goals.list();

const createdGoal = await client.goals.create({
  title: "Nowy mikrofon",
  amount: 50000,
});

await client.goals.id(createdGoal.id).update({
  title: "Nowy mikrofon XLR",
  amount: 70000,
});

await client.goals.id(createdGoal.id).reset();

const voting = await client.goals.voting.get();
```

### Moderatorzy, media i wypłaty

```ts
const moderators = await client.moderators.list();
const media = await client.media.list();
const usage = await client.media.usage.get();
const latestWithdrawals = await client.withdrawals.latest.list();
```

### PDF potwierdzenia wypłaty

```ts
import { asWithdrawalId } from "tipply-sdk-ts";

const pdf = await client.withdrawals
  .id(asWithdrawalId("withdrawal-123"))
  .confirmationPdf
  .get();
```

## Praca z wieloma sesjami

Auth client pozwala łatwo stworzyć drugi klient z inną sesją:

```ts
const baseClient = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const anotherClient = baseClient.withAuthCookie(process.env.OTHER_TIPPLY_AUTH_COOKIE!);
```

Możesz też przekazać pełny obiekt sesji:

```ts
const impersonatedClient = baseClient.withSession({
  getAuthCookie: async () => process.env.OTHER_TIPPLY_AUTH_COOKIE,
});
```

## Dostępne namespace'y

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

Szczegółowa lista wszystkich metod jest w [SDK Reference](/sdk-reference/).
