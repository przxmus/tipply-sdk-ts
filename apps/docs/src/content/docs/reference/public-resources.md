---
title: Public Resources
description: Reference the public widget, template, voting, and realtime methods available in the Tipply public client.
sidebar:
  order: 3
---

## Root Methods

| Method | Returns |
| --- | --- |
| `client.user(userId)` | `PublicUserScope` |
| `client.tipAlerts.fromWidgetUrl(widgetUrl, options?)` | `TipAlertsListener` |

`userId` here means a previously known internal Tipply identifier. Public profile payloads no longer expose another user's `id`.

## Per-User Public Scope

### Goals

| Method | Returns |
| --- | --- |
| `client.user(userId).goals.templates.list(requestOptions?)` | `Promise<PublicTemplate<"TIPS_GOAL", TipsGoalTemplateConfig>[]>` |
| `client.user(userId).goals.configuration.get(requestOptions?)` | `Promise<TipsGoalConfiguration>` |
| `client.user(userId).goals.id(goalId).widget.get(requestOptions?)` | `Promise<PublicGoalWidget>` |

### Voting

| Method | Returns |
| --- | --- |
| `client.user(userId).voting.templates.list(requestOptions?)` | `Promise<PublicTemplate<"GOAL_VOTING">[]>` |
| `client.user(userId).voting.configuration.get(requestOptions?)` | `Promise<GoalVotingConfiguration>` |

### Other Public Reads

| Method | Returns |
| --- | --- |
| `client.user(userId).templateFonts.get(requestOptions?)` | `Promise<string>` |
| `client.user(userId).widgetMessage.get(requestOptions?)` | `Promise<boolean>` |
| `client.user(userId).tipAlerts.createListener(options?)` | `TipAlertsListener` |

## Widget URL Parsing

The realtime helpers accept a full widget URL such as:

```txt
https://widgets.tipply.pl/TIP_ALERT/user-123
```

The SDK extracts the `userId` automatically before opening the websocket connection when the widget URL contains it.

## Notes

- public HTTP reads use `https://tipply.pl/api`
- `templateFonts.get()` returns raw CSS
- no authenticated session is required for any method on this page
