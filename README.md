# tipply-sdk-ts

Unofficial TypeScript SDK for Tipply with authenticated resources, public widget reads, and realtime `TIP_ALERT` helpers.

## Installation

```bash
bun add tipply-sdk-ts
```

## Authenticated Quick Start

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const me = await client.me.get();
const recentTips = await client.dashboard.tips.recent.list();
const publicProfile = await client.profile.public("przxmus").get();

console.log(me.username, recentTips.length, publicProfile.nickName);
```

## Public Quick Start

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});
const me = await client.me.get();

const widgetMessageEnabled = await client.public.user(me.id).widgetMessage.get();

console.log(widgetMessageEnabled);
```

Tipply no longer exposes other users' internal `userId` values on public endpoints. Public widget reads still accept a `userId`, but in practice you usually get it from your own authenticated session or from a previously stored widget identifier.

## Auth Lifecycle

The authenticated client can keep `auth_token` usable across longer runs:

- `auth.refreshTokenOnRequests`: defaults to `true`; stores new `auth_token` values returned in `Set-Cookie`
- `auth.refreshTokenEvery`: disabled by default; `true` uses a 5 minute interval and `{ intervalMs }` lets you choose a custom one
- `auth.reconnectTries`: defaults to `3`; retries selected auth and transport failures

```ts
const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  auth: {
    refreshTokenOnRequests: true,
    refreshTokenEvery: { intervalMs: 60_000 },
    reconnectTries: 3,
  },
});
```

If you enable `auth.refreshTokenEvery`, stop the background timer with `client.close()` when you are done.

```ts
import { asTipId, createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

await client.tips.id(asTipId("tip-123")).resend();
await client.tips.sendTest({
  message: "SDK test tip",
  amount: 1500,
});
await client.tipAlerts.skipCurrent();
```

## Examples

Maintained examples live in `apps/sdk/examples`:

- `dashboard-summary.ts`
- `public-profile.ts`
- `public-goal-widget.ts`
- `tip-controls.ts`
- `tip-alerts-listener.ts`
- `playground.local.ts`

## Authentication

The SDK does not implement login. Authenticated requests require an existing Tipply session and the value of the `auth_token` cookie.

Get it from browser DevTools after signing in to the Tipply user panel:

1. Open `https://app.tipply.pl/panel-uzytkownika`.
2. Sign in.
3. Open DevTools with `F12`.
4. Go to `Application` -> `Cookies` -> `https://app.tipply.pl`.
5. Copy the `Value` for `auth_token`.

## Workspace Commands

```bash
bun run build
bun run typecheck
bun run test
```

Full documentation is available at `https://tipply-sdk.przxmus.dev`.

This project is unofficial and is not affiliated with Tipply.
