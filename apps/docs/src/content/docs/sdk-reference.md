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

## Example

```ts
import { asGoalId, asUserId, createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  session: {
    authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  },
});

const profile = await client.profile.get();
const widget = await client.public.user(asUserId("user-123")).goals.id(asGoalId("goal-123")).widget.get();
```
