---
title: SDK Reference
description: Resource groups exposed by the vNext Tipply client factories.
---

## Root factories

- `createTipplyClient(options?)` creates the authenticated unified client
- `createTipplyPublicClient(options?)` from `tipply-sdk-ts/public` creates a public-only client

## Authenticated client namespaces

The authenticated client exposes:

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
- `public`

## Common fluent scopes

- `client.goals.id(goalId).update(...)`
- `client.templates.id(templateId).replace(...)`
- `client.media.id(mediaId).formats.get()`
- `client.tips.list().filter("amount").search("abc").limit(20).get()`
- `client.withdrawals.list().status("accepted", "transferred").limit(20).get()`
- `client.public.user(userId).goals.id(goalId).widget.get()`
- `client.public.user(userId).tipAlerts.createListener(options?)`

## Realtime Tip Alerts

`client.public.user(userId).tipAlerts.createListener(options?)` returns a typed realtime listener with:

- `connect()`
- `destroy()`
- `on(...)`
- `once(...)`
- `off(...)`
- `removeAllListeners(...)`

Supported events:

- `ready`
- `donation`
- `disconnect`
- `error`

## Example

```ts
import { asUserId } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
const listener = client.user(asUserId("user-123")).tipAlerts.createListener();

listener.on("donation", (donation) => {
  console.log(donation);
});

await listener.connect();
```
