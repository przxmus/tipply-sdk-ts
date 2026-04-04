---
title: Public Client
description: Access Tipply public widgets, templates, voting configuration, template fonts, widget messages, and realtime alerts without auth.
sidebar:
  order: 2
---

## When To Use It

Use `createTipplyPublicClient()` when you only need public data:

- goal templates
- goal configuration
- goal widget reads
- voting templates
- voting configuration
- template font CSS
- widget message status
- realtime `TIP_ALERT`

The public widget endpoints still require an internal `userId`. Tipply no longer returns another user's `userId` from public profile endpoints, so this client is most practical when you already know that identifier, for example from your own authenticated session or a stored widget configuration.

## Create A Client

```ts
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
```

## Work In A User Scope

Most public methods live under `client.user(userId)`, where `userId` is a previously known internal Tipply ID.

```ts
import { asGoalId, createTipplyClient } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const authenticated = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});
const me = await authenticated.me.get();

const client = createTipplyPublicClient();
const user = client.user(me.id);

const [templates, configuration, widget, fontsCss, widgetMessageEnabled] = await Promise.all([
  user.goals.templates.list(),
  user.goals.configuration.get(),
  user.goals.id(asGoalId("goal-123")).widget.get(),
  user.templateFonts.get(),
  user.widgetMessage.get(),
]);
```

## Available Reads

### Goals

- `user.goals.templates.list()`
- `user.goals.configuration.get()`
- `user.goals.id(goalId).widget.get()`

### Voting

- `user.voting.templates.list()`
- `user.voting.configuration.get()`

### Miscellaneous

- `user.templateFonts.get()`
- `user.widgetMessage.get()`

## Realtime Without Authentication

If you already know the internal `userId`:

```ts
const listener = client.user(me.id).tipAlerts.createListener();
```

If you only know the widget URL:

```ts
const listener = client.tipAlerts.fromWidgetUrl(
  "https://widgets.tipply.pl/TIP_ALERT/user-123",
);
```

## Public Profile By Slug

The public profile helper is exposed on the authenticated client, but it reads public proxy endpoints addressed by slug:

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const profile = await client.profile.public("streamer-link").get();
const socialLinks = await client.profile.public("streamer-link").socialLinks.list();
```

That public profile payload no longer includes the user's internal `id`.
