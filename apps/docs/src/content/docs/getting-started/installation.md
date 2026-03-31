---
title: Installation
description: Install the package, verify supported runtimes, and import the authenticated or public Tipply SDK entrypoint.
sidebar:
  order: 2
---

## Package

```bash
bun add tipply-sdk-ts
```

## Supported Runtimes

- Bun
- Node.js 18+
- browsers with `fetch`

The websocket-based realtime helpers target Bun, Node.js, and browsers. Edge runtimes are not an official target.

## Entry Points

Use the main package for the authenticated client:

```ts
import { createTipplyClient } from "tipply-sdk-ts";
```

Use the public entry point for unauthenticated access:

```ts
import { createTipplyPublicClient } from "tipply-sdk-ts/public";
```

## Type Exports

The package also exports shared types, helpers, and errors:

```ts
import {
  asGoalId,
  asUserId,
  TipplyAuthenticationError,
  type RequestOptions,
} from "tipply-sdk-ts";
```

## Local Development Commands

From the repository root:

```bash
bun run build
bun run typecheck
bun run test
```

To run the docs app locally:

```bash
cd apps/docs
bun run dev
```
