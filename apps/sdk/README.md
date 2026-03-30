# Tipply SDK TS

TypeScript SDK for the Tipply API with a factory-based, fully typed vNext surface.

## Status

- ESM-first package for Node 18+, Bun, and fetch-enabled browser/edge runtimes
- Covers the current `proxy.tipply.pl` and `tipply.pl/api` endpoints exposed by this SDK
- Unified client for authenticated and public flows
- Tipply responses are mapped best-effort and do not throw schema validation errors
- Public models are camelCase and use branded IDs for user, goal, template, media, moderator, withdrawal, and report identifiers

## Install

```bash
bun install
```

## Scripts

```bash
bun run build
bun run typecheck
bun run test
bun run test:types
bun run test:live
```

## Usage

### Authenticated client

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  session: {
    authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  },
});

const currentUser = await client.me.get();
const profile = await client.profile.get();
const tips = await client.tips.list().filter("amount").search("microphone").limit(10).get();
```

### Async cookie provider

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  session: {
    getAuthCookie: async () => process.env.TIPPLY_AUTH_COOKIE,
  },
});

const notifications = await client.dashboard.notifications.list();
```

### Public-only usage

```ts
import { asGoalId, asUserId } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
const user = client.user(asUserId("user-123"));

const widget = await user.goals.id(asGoalId("goal-123")).widget.get();
const isWidgetMessageEnabled = await user.widgetMessage.get();
const templateFontsCss = await user.templateFonts.get();
```

### Payment method update

```ts
await client.paymentMethods.method("paypal").update({
  minimalAmount: 1500,
});
```

### Withdrawal confirmation PDF

```ts
import { asWithdrawalId, createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  session: {
    authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  },
});

const pdf = await client.withdrawals.id(asWithdrawalId("withdrawal-123")).confirmationPdf.get();
```

## Client Surface

`createTipplyClient()` returns a client with the following namespaces:

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

Public user scope additions:

- `client.public.user(userId).templateFonts.get()`
- `client.public.user(userId).goals.configuration.get()` parses both legacy raw config payloads and the wrapped `{ type, config }` response documented in `tipply_new_openapi.yaml`

## Auth Model

The SDK is session-cookie based:

- use `session.authCookie` when you want to inject a raw cookie value in Node/Bun
- or `session.getAuthCookie` when the cookie has to be fetched lazily
- or use `session.browserSession` with `transport.includeCredentials: true` when running in a browser with an existing Tipply session

The SDK does not implement login or cookie acquisition against Tipply directly.

Use `client.withSession({ authCookie })` or `client.withAuthCookie(cookie)` when you need an isolated client instance with a different Tipply session.

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
- Response schemas tolerate additional unknown fields returned by Tipply.

### Browser session cookies

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  session: { browserSession: true },
  transport: { includeCredentials: true },
});

const me = await client.me.get();
```
