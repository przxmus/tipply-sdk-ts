---
title: Authentication
description: Get the Tipply auth_token from DevTools, pass it to the SDK, and understand supported session strategies.
sidebar:
  order: 3
---

## Important Constraint

`tipply-sdk-ts` does not implement login. Authenticated requests require an existing Tipply session and the value of the `auth_token` cookie.

Pass only the cookie value, not the full `Cookie` header.

## Get `auth_token` From DevTools

1. Open <a href="https://app.tipply.pl/panel-uzytkownika" target="_blank" rel="noopener noreferrer">the Tipply user panel</a> and sign in.
2. Open DevTools with `F12`.
3. Go to `Application`.
4. Open `Cookies`.
5. Select `https://app.tipply.pl`.
6. Find the row where `Name` is `auth_token`.
7. Copy the `Value` column.

## Screenshots

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;margin:1rem 0 0;">
  <figure style="margin:0;">
    <img
      src="/authentication/auth-token-1.png"
      alt="Browser DevTools opened on the Application tab"
      style="display:block;width:100%;height:auto;border:1px solid var(--sl-color-gray-5);border-radius:12px;"
    />
    <figcaption style="margin-top:0.5rem;">
      Open DevTools and switch to the Application tab.
    </figcaption>
  </figure>

  <figure style="margin:0;">
    <img
      src="/authentication/auth-token-2.png"
      alt="Cookies table for app.tipply.pl with the auth_token row visible"
      style="display:block;width:100%;height:auto;border:1px solid var(--sl-color-gray-5);border-radius:12px;"
    />
    <figcaption style="margin-top:0.5rem;">
      Open the cookies for `https://app.tipply.pl` and copy the `auth_token` value.
    </figcaption>
  </figure>
</div>

## Supported Session Strategies

### Static cookie

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});
```

### Nested session config

```ts
const client = createTipplyClient({
  session: {
    authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  },
});
```

### Dynamic cookie provider

```ts
const client = createTipplyClient({
  getAuthCookie: async () => process.env.TIPPLY_AUTH_COOKIE,
});
```

### Browser session

```ts
const client = createTipplyClient({
  session: { browserSession: true },
  transport: { includeCredentials: true },
});
```

## What The Client Does For Auth Requests

- sends authenticated requests through the proxy endpoint
- sets `Referer` to `https://app.tipply.pl/`
- sets `Origin` to `https://app.tipply.pl` for non-`GET` requests
- injects `Cookie: auth_token=<value>` when you provide a cookie manually
- can capture a refreshed `auth_token` from `Set-Cookie`
- can periodically refresh the session through `GET /user`

## Common Misconfiguration

Authenticated calls fail with `TipplyConfigurationError` if you do not provide:

- `authCookie`
- `getAuthCookie`
- `session.browserSession`

and you also disable credential forwarding.

## Security Notes

- never commit `auth_token`
- do not print it in logs
- keep it in environment variables or secret storage
- expect `TipplyAuthenticationError` when the session expires
