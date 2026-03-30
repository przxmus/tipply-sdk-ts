# Tipply SDK TS

TypeScript SDK for the Tipply API built from the provided Postman collection and `API.md`.

## Status

- ESM-first package for Node 18+, Bun, and fetch-enabled browser/edge runtimes
- Covers the documented `proxy.tipply.pl` and `tipply.pl/api` endpoints that make sense for SDK usage
- Excludes Socket.IO realtime and Google reCAPTCHA / login reverse engineering
- Auth is based on Tipply session cookies, with browser credentials or explicit `auth_token` injection

## Install

```bash
bun install
```

## Scripts

```bash
bun run build
bun run typecheck
bun run test
bun run test:live
```

## Usage

### Explicit `auth_token` cookie

```ts
import { TipplyClient } from "tipply-sdk-ts";

const client = new TipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE,
});

const currentUser = await client.identity.getCurrentUser();
const profile = await client.profile.get();
const tips = await client.tips.list({ limit: 10, filter: "default", search: "" });
```

### Async cookie provider

```ts
import { TipplyClient } from "tipply-sdk-ts";

const client = new TipplyClient({
  getAuthCookie: async () => {
    return process.env.TIPPLY_AUTH_COOKIE;
  },
});

const notifications = await client.dashboard.getNotifications();
```

### Public-only usage

```ts
import { TipplyClient } from "tipply-sdk-ts";

const client = new TipplyClient();

const widget = await client.public.getGoalWidget("goal-123", "user-123");
const isWidgetMessageEnabled = await client.public.getWidgetMessage("user-123");
```

### Payment method update

```ts
await client.paymentMethods.update("paypal", {
  minimalAmount: 1500,
});
```

## Client Surface

The main export is `TipplyClient`. It exposes the following namespaces:

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

## Auth Model

The recorded browser traffic for Tipply panel requests uses an `auth_token` cookie. For that reason the SDK is now cookie-first:

- use `authCookie` when you want to inject the raw cookie value in Node/Bun
- or `getAuthCookie` when the cookie has to be fetched lazily
- or rely on `includeCredentials: true` when running in a browser with an already established Tipply session

The SDK does not implement login or cookie acquisition against Tipply directly.

Use `client.withAuthCookie(cookie)` when you need an isolated client instance with a different Tipply session.

## Runtime Validation

Set `validateResponses: true` to enable response guards for the supported contract checks:

```ts
const client = new TipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE,
  validateResponses: true,
});
```

This keeps runtime validation opt-in while preserving strict compile-time types by default.

## Live Tests

Live tests are opt-in:

```bash
TIPPLY_AUTH_COOKIE=your-cookie bun run test:live
```

Mutation smoke tests stay disabled unless you explicitly opt in:

```bash
TIPPLY_AUTH_COOKIE=your-cookie TIPPLY_ALLOW_MUTATIONS=true bun run test:live
```

The live suite only performs authenticated reads by default and discovers `userId` / `goalId` dynamically from live API data.

## Notes

- Monetary values are represented as minor units.
- Dates are returned as ISO 8601 strings.
- Template updates are modeled as full payload replacement for `PUT /templates/{uuid}`.
- `filter=undefined&search=undefined` from the recorded frontend traffic is intentionally not part of the SDK contract.
### Browser session cookies

```ts
import { TipplyClient } from "tipply-sdk-ts";

const client = new TipplyClient({
  includeCredentials: true,
});

const me = await client.identity.getCurrentUser();
```
