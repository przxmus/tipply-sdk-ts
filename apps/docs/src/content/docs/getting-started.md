---
title: Getting Started
description: Install the package and create a Tipply client with the vNext factory API.
---

## Install

```bash
bun add tipply-sdk-ts
```

## Create a client

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  session: {
    authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  },
});
```

## What you get

The authenticated client exposes typed resource groups for:

- Me
- Dashboard
- Profile
- Payment methods
- Settings
- Goals
- Templates
- Tips
- Moderators
- Media
- Withdrawals
- Reports
- Public endpoints

## Public-only client

```ts
import { asUserId } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const publicClient = createTipplyPublicClient();
const publicUser = publicClient.user(asUserId("user-123"));

const enabled = await publicUser.widgetMessage.get();
```

Continue to the [SDK Reference](/sdk-reference/) for the full namespace list.
