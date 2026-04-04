---
title: Client Surface
description: Reference the main Tipply SDK factories, top-level exports, client methods, and the overall authenticated and public surface.
sidebar:
  order: 1
---

## Main Factories

| Factory | Description |
| --- | --- |
| `createTipplyClient(options?)` | Creates the authenticated client. |
| `createTipplyPublicClient(options?)` | Creates the public client from `tipply-sdk-ts/public`. |

## Authenticated Client Methods

| Method | Description |
| --- | --- |
| `client.withSession(session)` | Clones the client with another session strategy. |
| `client.withAuthCookie(authCookie)` | Clones the client with a static cookie value. |
| `client.close()` | Stops background refresh timers owned by the client. |

## Authenticated Namespaces

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

See [Authenticated Resources](/reference/authenticated-resources/) for the full method list.

## Public Client Surface

| Method | Returns |
| --- | --- |
| `client.user(userId)` | `PublicUserScope` |
| `client.tipAlerts.fromWidgetUrl(widgetUrl, options?)` | `TipAlertsListener` |

The per-user public methods are documented in [Public Resources](/reference/public-resources/).

`client.user(userId)` requires a previously known internal Tipply `userId`. Public profile reads by slug do not expose it anymore.

## Package Exports

The main package exports:

- `createTipplyClient`
- ID helpers such as `asUserId`, `asGoalId`, and `asTipId`
- all exported error classes
- all exported SDK types

The public entrypoint exports:

- `createTipplyPublicClient`
- the same shared ID helpers
- shared types
- shared errors
