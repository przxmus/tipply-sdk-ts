---
title: Authenticated Resources
description: Reference every authenticated Tipply SDK namespace, including dashboard, profile, settings, goals, tips, withdrawals, and reports.
sidebar:
  order: 2
---

## `me`

| Method | Returns |
| --- | --- |
| `client.me.get(requestOptions?)` | `Promise<CurrentUser>` |

## `dashboard`

| Method | Returns |
| --- | --- |
| `client.dashboard.announcements.list(requestOptions?)` | `Promise<DashboardAnnouncement[]>` |
| `client.dashboard.announcements.listExtra(requestOptions?)` | `Promise<DashboardAnnouncement[]>` |
| `client.dashboard.stats.income.get(requestOptions?)` | `Promise<IncomeStatistics>` |
| `client.dashboard.stats.tips.get(requestOptions?)` | `Promise<TipStatistics>` |
| `client.dashboard.points.get(requestOptions?)` | `Promise<number>` |
| `client.dashboard.tips.recent.list(requestOptions?)` | `Promise<RecentTip[]>` |
| `client.dashboard.notifications.list(requestOptions?)` | `Promise<DashboardNotification[]>` |

## `profile`

| Method | Returns |
| --- | --- |
| `client.profile.get(requestOptions?)` | `Promise<UserProfile>` |
| `client.profile.pendingChanges.check(requestOptions?)` | `Promise<boolean>` |
| `client.profile.page.updateSettings(input, requestOptions?)` | `Promise<UserProfile>` |
| `client.profile.public(slug).socialLinks.list(requestOptions?)` | `Promise<PublicSocialMediaLink[]>` |

## `paymentMethods`

| Method | Returns |
| --- | --- |
| `client.paymentMethods.configuration.get(requestOptions?)` | `Promise<PaymentMethodsConfiguration>` |
| `client.paymentMethods.list(requestOptions?)` | `Promise<UserPaymentMethods>` |
| `client.paymentMethods.method(methodKey).update(input, requestOptions?)` | `Promise<UserPaymentMethod>` |

## `settings`

| Method | Returns |
| --- | --- |
| `client.settings.list(requestOptions?)` | `Promise<UserConfiguration[]>` |
| `client.settings.tipAlerts.update(input, requestOptions?)` | `Promise<void>` |
| `client.settings.countdown.update(input, requestOptions?)` | `Promise<void>` |
| `client.settings.alerts.toggle(disabled, requestOptions?)` | `Promise<ToggleDisabledResult>` |
| `client.settings.alertSound.toggle(disabled, requestOptions?)` | `Promise<ToggleDisabledResult>` |
| `client.settings.forbiddenWords.get(requestOptions?)` | `Promise<ForbiddenWordsSettings>` |
| `client.settings.profanityFilter.get(requestOptions?)` | `Promise<ProfanityFilterSettings>` |

## `goals`

| Method | Returns |
| --- | --- |
| `client.goals.list(requestOptions?)` | `Promise<Goal[]>` |
| `client.goals.create(input, requestOptions?)` | `Promise<Goal>` |
| `client.goals.id(goalId).update(input, requestOptions?)` | `Promise<void>` |
| `client.goals.id(goalId).reset(requestOptions?)` | `Promise<void>` |
| `client.goals.voting.get(requestOptions?)` | `Promise<GoalVotingConfiguration>` |

## `templates`

| Method | Returns |
| --- | --- |
| `client.templates.list(requestOptions?)` | `Promise<UserTemplate[]>` |
| `client.templates.id(templateId).replace(input, requestOptions?)` | `Promise<void>` |

## `tips`

| Method | Returns |
| --- | --- |
| `client.tips.list().filter(filter).search(search).limit(limit).offset(offset).get(requestOptions?)` | `Promise<Tip[]>` |
| `client.tips.sendTest(input, requestOptions?)` | `Promise<SendTestTipResult>` |
| `client.tips.id(tipId).resend(requestOptions?)` | `Promise<void>` |
| `client.tips.moderation.listQueue(requestOptions?)` | `Promise<TipModerationItem[]>` |
| `client.tips.moderation.listBasket(requestOptions?)` | `Promise<TipModerationItem[]>` |
| `client.tips.pending.list(requestOptions?)` | `Promise<PendingTip[]>` |
| `client.tips.audio.toggle(requestOptions?)` | `Promise<void>` |

Allowed list filters:

- `"default"`
- `"amount"`
- `"paymentMethod"`

## `moderators`

| Method | Returns |
| --- | --- |
| `client.moderators.list(requestOptions?)` | `Promise<Moderator[]>` |
| `client.moderators.create(input, requestOptions?)` | `Promise<Moderator>` |
| `client.moderators.id(moderatorId).remove(requestOptions?)` | `Promise<void>` |
| `client.moderators.mode.toggle(requestOptions?)` | `Promise<void>` |

## `media`

| Method | Returns |
| --- | --- |
| `client.media.list(requestOptions?)` | `Promise<MediaItem[]>` |
| `client.media.usage.get(requestOptions?)` | `Promise<MediaUsage>` |
| `client.media.id(mediaId).formats.get(requestOptions?)` | `Promise<MediaFormats>` |

## `withdrawals`

| Method | Returns |
| --- | --- |
| `client.withdrawals.accounts.list(requestOptions?)` | `Promise<Account[]>` |
| `client.withdrawals.methods.configuration.get(requestOptions?)` | `Promise<WithdrawalMethodsConfiguration>` |
| `client.withdrawals.latest.list(requestOptions?)` | `Promise<Withdrawal[]>` |
| `client.withdrawals.list().status(...statuses).limit(limit).offset(offset).get(requestOptions?)` | `Promise<Withdrawal[]>` |
| `client.withdrawals.id(withdrawalId).confirmationPdf.get(requestOptions?)` | `Promise<ArrayBuffer>` |

Allowed withdrawal statuses:

- `"pending"`
- `"accepted"`
- `"rejected"`
- `"transferred"`

## `reports`

| Method | Returns |
| --- | --- |
| `client.reports.list(requestOptions?)` | `Promise<Report[]>` |

## `tipAlerts`

| Method | Returns |
| --- | --- |
| `client.tipAlerts.createListener(options?)` | `Promise<TipAlertsListener>` |
| `client.tipAlerts.skipCurrent()` | `Promise<void>` |
| `client.tipAlerts.fromWidgetUrl(widgetUrl, options?)` | `TipAlertsListener` |

## `public`

| Method | Returns |
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
