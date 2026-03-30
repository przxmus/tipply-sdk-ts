---
title: SDK Reference
description: Resource namespaces exposed by the Tipply client.
---

## Client namespaces

The `TipplyClient` exposes the following namespaces:

- `identity`
- `dashboard`
- `profile`
- `paymentMethods`
- `configurations`
- `goals`
- `templates`
- `tips`
- `moderators`
- `media`
- `withdrawals`
- `reports`
- `public`

## Example

```ts
import { TipplyClient } from "tipply-sdk-ts";

const client = new TipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE,
});

const profile = await client.profile.get();
```
