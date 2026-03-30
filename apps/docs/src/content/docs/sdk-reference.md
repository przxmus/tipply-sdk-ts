---
title: Referencja SDK
description: Pełna referencja aktualnie zaimplementowanego surface `tipply-sdk-ts`.
---

## Zasada tej strony

Ta referencja obejmuje wyłącznie metody, które są faktycznie zaimplementowane w obecnym SDK.

## Fabryki główne

| Fabryka | Opis |
| --- | --- |
| `createTipplyClient(options?)` | Tworzy pełny klient auth z dostępem do endpointów prywatnych i publicznych. |
| `createTipplyPublicClient(options?)` | Tworzy klient publiczny z entrypointu `tipply-sdk-ts/public`. |

## Metody instancji auth klienta

| Metoda | Opis |
| --- | --- |
| `client.withSession(session)` | Tworzy nową instancję klienta z inną konfiguracją sesji. |
| `client.withAuthCookie(authCookie)` | Skrót do stworzenia nowej instancji z podanym tokenem. |
| `client.close()` | Zatrzymuje background refresh uruchomiony przez `auth.refreshTokenEvery`. |

## Namespace'y klienta autoryzowanego

### `me`

| Metoda | Zwraca |
| --- | --- |
| `client.me.get(requestOptions?)` | `Promise<CurrentUser>` |

### `dashboard`

| Metoda | Zwraca |
| --- | --- |
| `client.dashboard.announcements.list(requestOptions?)` | `Promise<DashboardAnnouncement[]>` |
| `client.dashboard.announcements.listExtra(requestOptions?)` | `Promise<DashboardAnnouncement[]>` |
| `client.dashboard.stats.income.get(requestOptions?)` | `Promise<IncomeStatistics>` |
| `client.dashboard.stats.tips.get(requestOptions?)` | `Promise<TipStatistics>` |
| `client.dashboard.points.get(requestOptions?)` | `Promise<number>` |
| `client.dashboard.tips.recent.list(requestOptions?)` | `Promise<RecentTip[]>` |
| `client.dashboard.notifications.list(requestOptions?)` | `Promise<DashboardNotification[]>` |

### `profile`

| Metoda | Zwraca |
| --- | --- |
| `client.profile.get(requestOptions?)` | `Promise<UserProfile>` |
| `client.profile.pendingChanges.check(requestOptions?)` | `Promise<boolean>` |
| `client.profile.page.updateSettings(input, requestOptions?)` | `Promise<UserProfile>` |
| `client.profile.public(slug).socialLinks.list(requestOptions?)` | `Promise<PublicSocialMediaLink[]>` |

### `paymentMethods`

| Metoda | Zwraca |
| --- | --- |
| `client.paymentMethods.configuration.get(requestOptions?)` | `Promise<PaymentMethodsConfiguration>` |
| `client.paymentMethods.list(requestOptions?)` | `Promise<UserPaymentMethods>` |
| `client.paymentMethods.method(methodKey).update(input, requestOptions?)` | `Promise<UserPaymentMethod>` |

### `settings`

| Metoda | Zwraca |
| --- | --- |
| `client.settings.list(requestOptions?)` | `Promise<UserConfiguration[]>` |
| `client.settings.tipAlerts.update(input, requestOptions?)` | `Promise<void>` |
| `client.settings.countdown.update(input, requestOptions?)` | `Promise<void>` |
| `client.settings.alerts.toggle(disabled, requestOptions?)` | `Promise<ToggleDisabledResult>` |
| `client.settings.alertSound.toggle(disabled, requestOptions?)` | `Promise<ToggleDisabledResult>` |
| `client.settings.forbiddenWords.get(requestOptions?)` | `Promise<ForbiddenWordsSettings>` |
| `client.settings.profanityFilter.get(requestOptions?)` | `Promise<ProfanityFilterSettings>` |

### `goals`

| Metoda | Zwraca |
| --- | --- |
| `client.goals.list(requestOptions?)` | `Promise<Goal[]>` |
| `client.goals.create(input, requestOptions?)` | `Promise<Goal>` |
| `client.goals.id(goalId).update(input, requestOptions?)` | `Promise<void>` |
| `client.goals.id(goalId).reset(requestOptions?)` | `Promise<void>` |
| `client.goals.voting.get(requestOptions?)` | `Promise<GoalVotingConfiguration>` |

### `templates`

| Metoda | Zwraca |
| --- | --- |
| `client.templates.list(requestOptions?)` | `Promise<UserTemplate[]>` |
| `client.templates.id(templateId).replace(input, requestOptions?)` | `Promise<void>` |

### `tips`

| Metoda | Zwraca |
| --- | --- |
| `client.tips.list().filter(filter).search(search).limit(limit).offset(offset).get(requestOptions?)` | `Promise<Tip[]>` |
| `client.tips.sendTest(input, requestOptions?)` | `Promise<SendTestTipResult>` |
| `client.tips.id(tipId).resend(requestOptions?)` | `Promise<void>` |
| `client.tips.moderation.listQueue(requestOptions?)` | `Promise<TipModerationItem[]>` |
| `client.tips.moderation.listBasket(requestOptions?)` | `Promise<TipModerationItem[]>` |
| `client.tips.pending.list(requestOptions?)` | `Promise<PendingTip[]>` |
| `client.tips.audio.toggle(requestOptions?)` | `Promise<void>` |

Dozwolone filtry buildera:

- `"amount"`
- `"date"`
- `"paymentMethod"`

### `moderators`

| Metoda | Zwraca |
| --- | --- |
| `client.moderators.list(requestOptions?)` | `Promise<Moderator[]>` |
| `client.moderators.create(input, requestOptions?)` | `Promise<Moderator>` |
| `client.moderators.id(moderatorId).remove(requestOptions?)` | `Promise<void>` |
| `client.moderators.mode.toggle(requestOptions?)` | `Promise<void>` |

### `media`

| Metoda | Zwraca |
| --- | --- |
| `client.media.list(requestOptions?)` | `Promise<MediaItem[]>` |
| `client.media.usage.get(requestOptions?)` | `Promise<MediaUsage>` |
| `client.media.id(mediaId).formats.get(requestOptions?)` | `Promise<MediaFormats>` |

### `withdrawals`

| Metoda | Zwraca |
| --- | --- |
| `client.withdrawals.accounts.list(requestOptions?)` | `Promise<Account[]>` |
| `client.withdrawals.methods.configuration.get(requestOptions?)` | `Promise<WithdrawalMethodsConfiguration>` |
| `client.withdrawals.latest.list(requestOptions?)` | `Promise<Withdrawal[]>` |
| `client.withdrawals.list().status(...statuses).limit(limit).offset(offset).get(requestOptions?)` | `Promise<Withdrawal[]>` |
| `client.withdrawals.id(withdrawalId).confirmationPdf.get(requestOptions?)` | `Promise<ArrayBuffer>` |

Dozwolone statusy buildera:

- `"pending"`
- `"accepted"`
- `"rejected"`
- `"transferred"`

### `reports`

| Metoda | Zwraca |
| --- | --- |
| `client.reports.list(requestOptions?)` | `Promise<Report[]>` |

### `tipAlerts`

| Metoda | Zwraca |
| --- | --- |
| `client.tipAlerts.createListener(options?)` | `Promise<TipAlertsListener>` |
| `client.tipAlerts.skipCurrent()` | `Promise<void>` |
| `client.tipAlerts.fromWidgetUrl(widgetUrl, options?)` | `TipAlertsListener` |

### `public`

| Metoda | Zwraca |
| --- | --- |
| `client.public.user(userId).goals.templates.list(requestOptions?)` | `Promise<PublicTemplate<"TIPS_GOAL", TipsGoalTemplateConfig>[]>` |
| `client.public.user(userId).goals.configuration.get(requestOptions?)` | `Promise<TipsGoalConfiguration>` |
| `client.public.user(userId).goals.id(goalId).widget.get(requestOptions?)` | `Promise<PublicGoalWidget>` |
| `client.public.user(userId).voting.templates.list(requestOptions?)` | `Promise<PublicTemplate<"GOAL_VOTING">[]>` |
| `client.public.user(userId).voting.configuration.get(requestOptions?)` | `Promise<GoalVotingConfiguration>` |
| `client.public.user(userId).templateFonts.get(requestOptions?)` | `Promise<string>` |
| `client.public.user(userId).widgetMessage.get(requestOptions?)` | `Promise<boolean>` |
| `client.public.user(userId).tipAlerts.createListener(options?)` | `TipAlertsListener` |
| `client.public.tipAlerts.fromWidgetUrl(widgetUrl, options?)` | `TipAlertsListener` |

## Klient publiczny

| Metoda | Zwraca |
| --- | --- |
| `client.user(userId)` | `PublicUserScope` |
| `client.tipAlerts.fromWidgetUrl(widgetUrl, options?)` | `TipAlertsListener` |

W scope użytkownika:

| Metoda | Zwraca |
| --- | --- |
| `client.user(userId).goals.templates.list(requestOptions?)` | `Promise<PublicTemplate<"TIPS_GOAL", TipsGoalTemplateConfig>[]>` |
| `client.user(userId).goals.configuration.get(requestOptions?)` | `Promise<TipsGoalConfiguration>` |
| `client.user(userId).goals.id(goalId).widget.get(requestOptions?)` | `Promise<PublicGoalWidget>` |
| `client.user(userId).voting.templates.list(requestOptions?)` | `Promise<PublicTemplate<"GOAL_VOTING">[]>` |
| `client.user(userId).voting.configuration.get(requestOptions?)` | `Promise<GoalVotingConfiguration>` |
| `client.user(userId).templateFonts.get(requestOptions?)` | `Promise<string>` |
| `client.user(userId).widgetMessage.get(requestOptions?)` | `Promise<boolean>` |
| `client.user(userId).tipAlerts.createListener(options?)` | `TipAlertsListener` |

## Typy pomocnicze

### ID helpers

- `asAccountId`
- `asGoalId`
- `asMediaId`
- `asModeratorId`
- `asPaymentId`
- `asReportId`
- `asTemplateId`
- `asTipId`
- `asUserId`
- `asWithdrawalId`

### Listener eventy

```ts
interface TipAlertsListenerEvents {
  ready: () => void;
  donation: (donation: TipAlertDonation) => void;
  disconnect: (reason: string) => void;
  error: (error: Error) => void;
}
```

### Request options

```ts
type RequestOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
};
```

## Uwagi implementacyjne

- `authCookie` to sama wartość `auth_token`
- `auth.refreshTokenOnRequests` jest domyślnie włączone
- `auth.refreshTokenEvery: true` oznacza refresh przez `/user` co 5 minut
- `auth.reconnectTries` jest domyślnie ustawione na `3`
- publiczne endpointy korzystają z `https://tipply.pl/api`
- endpointy auth korzystają z `https://proxy.tipply.pl`
- listener `TIP_ALERT` korzysta z `https://alert-ws.tipply.pl`
- komendy realtime dla `skipCurrent()` korzystają z `https://ws.tipply.pl`
- `templateFonts.get()` zwraca surowy CSS
- `confirmationPdf.get()` zwraca `ArrayBuffer`
- walidacja odpowiedzi jest domyślnie włączona
