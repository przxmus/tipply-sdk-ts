---
title: Getting Started
description: Install the package and create a Tipply client.
---

## Install

```bash
bun add tipply-sdk-ts
```

## Create a client

```ts
import { TipplyClient } from "tipply-sdk-ts";

const client = new TipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE,
});
```

## What you get

The client exposes typed resource groups for:

- Identity
- Dashboard
- Profile
- Payment methods
- Configurations
- Goals
- Templates
- Tips
- Moderators
- Media
- Withdrawals
- Reports
- Public endpoints

Continue to the [SDK Reference](/sdk-reference/) for the full namespace list.
