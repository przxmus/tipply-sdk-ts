# Tipply SDK TS

TypeScript SDK for the Tipply API built from the provided Postman collection and `API.md`.

## Status

- ESM-first package for Node 18+, Bun, and fetch-enabled browser/edge runtimes
- Covers the documented `proxy.tipply.pl` and `tipply.pl/api` endpoints that make sense for SDK usage
- Excludes Socket.IO realtime and Google reCAPTCHA / login reverse engineering
- Auth is based on an access token or async token provider

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

### Static access token

```ts
import { TipplyClient } from "tipply-sdk-ts";

const client = new TipplyClient({
  accessToken: process.env.TIPPLY_ACCESS_TOKEN,
});

const currentUser = await client.identity.getCurrentUser();
const profile = await client.profile.get();
const tips = await client.tips.list({ limit: 10, filter: "default", search: "" });
```

### Async token provider

```ts
import { TipplyClient } from "tipply-sdk-ts";

const client = new TipplyClient({
  getAccessToken: async () => {
    return process.env.TIPPLY_ACCESS_TOKEN;
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

The source material documents authenticated requests, but it does not document the OAuth2 token issuance flow. For that reason:

- the SDK accepts `accessToken`
- or `getAccessToken`
- but it does not implement login or token refresh against Tipply directly

Use `client.withAccessToken(token)` when you need an isolated client instance with a different token.

## Runtime Validation

Set `validateResponses: true` to enable response guards for the supported contract checks:

```ts
const client = new TipplyClient({
  accessToken: process.env.TIPPLY_ACCESS_TOKEN,
  validateResponses: true,
});
```

This keeps runtime validation opt-in while preserving strict compile-time types by default.

## Live Tests

Live tests are opt-in:

```bash
TIPPLY_ACCESS_TOKEN=your-token bun run test:live
```

Mutation smoke tests stay disabled unless you explicitly opt in:

```bash
TIPPLY_ACCESS_TOKEN=your-token TIPPLY_ALLOW_MUTATIONS=true bun run test:live
```

The live suite only performs authenticated reads by default and discovers `userId` / `goalId` dynamically from live API data.

## Notes

- Monetary values are represented as minor units.
- Dates are returned as ISO 8601 strings.
- Template updates are modeled as full payload replacement for `PUT /templates/{uuid}`.
- `filter=undefined&search=undefined` from the recorded frontend traffic is intentionally not part of the SDK contract.
