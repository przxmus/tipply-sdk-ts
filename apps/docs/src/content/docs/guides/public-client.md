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

## Create A Client

```ts
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
```

## Work In A User Scope

Most public methods live under `client.user(userId)`.

```ts
import { asGoalId, asUserId } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
const user = client.user(asUserId("user-123"));

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

If you know the user ID:

```ts
const listener = client.user(asUserId("user-123")).tipAlerts.createListener();
```

If you only know the widget URL:

```ts
const listener = client.tipAlerts.fromWidgetUrl(
  "https://widgets.tipply.pl/TIP_ALERT/user-123",
);
```

## Public Profile Social Links

The social links helper is exposed on the authenticated client, but it reads a public proxy endpoint:

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const socialLinks = await client.profile.public("streamer-link").socialLinks.list();
```
