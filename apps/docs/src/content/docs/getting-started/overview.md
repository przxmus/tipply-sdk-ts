---
title: Overview
description: Install the Tipply TypeScript SDK, choose the right client, and make the first authenticated or public request.
sidebar:
  order: 1
---

## Install

```bash
bun add tipply-sdk-ts
```

## Runtime Requirements

- Bun or Node.js 18+
- a runtime with `fetch`
- an existing Tipply session if you plan to call authenticated endpoints

## Choose A Client

Use `createTipplyClient()` when you need private account data, settings, moderation, payouts, or control commands.

Use `createTipplyPublicClient()` when you only need public widget, template, voting, or realtime reads and you already know the internal `userId` used by Tipply's widget endpoints.

## First Authenticated Request

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const me = await client.me.get();

console.log(me.username);
```

## First Public Request

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});
const me = await client.me.get();

const widgetMessageEnabled = await client.public.user(me.id).widgetMessage.get();

console.log(widgetMessageEnabled);
```

Public profile payloads no longer expose `userId`, so the SDK cannot discover another user's internal ID from `client.profile.public(slug).get()`.

## What The SDK Covers

### Authenticated surface

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

### Public surface

- goal templates and configuration
- goal widget reads
- voting templates and configuration
- template font CSS
- widget message status
- realtime `TIP_ALERT`

## Realtime Quick Start

```ts
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const listener = createTipplyPublicClient().tipAlerts.fromWidgetUrl(
  "https://widgets.tipply.pl/TIP_ALERT/user-123",
);

listener.on("donation", (donation) => {
  console.log(donation.nickname, donation.amount);
});

await listener.connect();
```

## Read Next

- [Installation](/getting-started/installation/)
- [Authentication](/getting-started/authentication/)
- [Authenticated Client](/guides/authenticated-client/)
- [Public Client](/guides/public-client/)
