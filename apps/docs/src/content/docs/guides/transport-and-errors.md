---
title: Transport And Errors
description: Understand Tipply SDK transport options, session settings, validation behavior, request overrides, and exported error classes.
sidebar:
  order: 4
---

## Error Classes

The SDK exports these error classes:

- `TipplyError`
- `TipplyHttpError`
- `TipplyAuthenticationError`
- `TipplyResponseValidationError`
- `TipplyConfigurationError`
- `TipplyAuthError`
- `TipplyValidationError`

All errors derived from `TipplyError` include:

- `code`
- `method`
- `url`
- `status`
- `headers`
- `body`

## Typical Handling Pattern

```ts
import {
  TipplyAuthenticationError,
  TipplyConfigurationError,
  createTipplyClient,
} from "tipply-sdk-ts";

try {
  const client = createTipplyClient({
    authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  });

  await client.me.get();
} catch (error) {
  if (error instanceof TipplyAuthenticationError) {
    console.error("The Tipply session is missing or expired.");
    throw error;
  }

  if (error instanceof TipplyConfigurationError) {
    console.error("The client configuration is inconsistent.");
    throw error;
  }

  throw error;
}
```

## `TipplyClientOptions`

```ts
type TipplyClientOptions = {
  session?: TipplySessionOptions;
  transport?: TipplyTransportOptions;
  auth?: TipplyAuthLifecycleOptions;
  validation?: boolean;
  authCookie?: string;
  getAuthCookie?: () => string | Promise<string | null | undefined> | null | undefined;
  cookieName?: string;
  includeCredentials?: boolean;
  appOrigin?: string;
  fetch?: typeof fetch;
  proxyBaseUrl?: string;
  publicBaseUrl?: string;
  validateResponses?: boolean;
};
```

## `TipplySessionOptions`

```ts
type TipplySessionOptions =
  | { authCookie: string }
  | { getAuthCookie: () => string | Promise<string | null | undefined> | null | undefined }
  | { browserSession: true };
```

## `TipplyAuthLifecycleOptions`

```ts
type TipplyAuthLifecycleOptions = {
  refreshTokenOnRequests?: boolean;
  refreshTokenEvery?: boolean | { intervalMs?: number };
  reconnectTries?: number | false;
};
```

Default behavior:

- `refreshTokenOnRequests`: `true`
- `refreshTokenEvery`: `false`
- `refreshTokenEvery: true`: refreshes through `/user` every `300000` ms
- `reconnectTries`: `3`

## `TipplyTransportOptions`

```ts
type TipplyTransportOptions = {
  fetch?: typeof fetch;
  proxyBaseUrl?: string;
  publicBaseUrl?: string;
  alertSocketBaseUrl?: string;
  commandsSocketBaseUrl?: string;
  appOrigin?: string;
  cookieName?: string;
  includeCredentials?: boolean;
  timeoutMs?: number;
};
```

Default endpoints:

- `proxyBaseUrl`: `https://proxy.tipply.pl`
- `publicBaseUrl`: `https://tipply.pl/api`
- `alertSocketBaseUrl`: `https://alert-ws.tipply.pl`
- `commandsSocketBaseUrl`: `https://ws.tipply.pl`
- `appOrigin`: `https://app.tipply.pl`
- `cookieName`: `auth_token`
- `includeCredentials`: `true`
- `timeoutMs`: `30000`

## Per-Request Overrides

Most resource methods accept:

```ts
type RequestOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
};
```

```ts
const abortController = new AbortController();

const tips = await client.tips.list().limit(20).get({
  signal: abortController.signal,
  timeoutMs: 5_000,
});
```

## Validation

Response validation is enabled by default.

```ts
const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  validation: false,
});
```

Leave validation enabled unless you have a strong reason to bypass schema checks.

## Closing Background Work

If you enable periodic refreshes with `auth.refreshTokenEvery`, stop the timer when the client is no longer needed:

```ts
client.close();
```
