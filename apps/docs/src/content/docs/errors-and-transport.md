---
title: Błędy i transport
description: Klasy błędów, opcje klienta i nadpisywanie transportu.
---

## Klasy błędów

SDK eksportuje pięć głównych klas błędów:

- `TipplyError`
- `TipplyHttpError`
- `TipplyAuthenticationError`
- `TipplyResponseValidationError`
- `TipplyConfigurationError`

## Co zawiera błąd

Każdy błąd dziedziczący po `TipplyError` niesie kontekst requestu:

- `code`
- `method`
- `url`
- `status`
- `headers`
- `body`

## Typowy wzorzec obsługi

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
    console.error("Token jest nieważny albo wygasł.");
    throw error;
  }

  if (error instanceof TipplyConfigurationError) {
    console.error("Klient jest źle skonfigurowany.");
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

Najważniejsze informacje:

- `authCookie` i `getAuthCookie` są skrótami dla konfiguracji sesji
- `validation` i `validateResponses` sterują walidacją odpowiedzi
- `transport` pozwala nadpisać bazowe URL-e, timeout i `fetch`

## `TipplySessionOptions`

```ts
type TipplySessionOptions =
  | { authCookie: string }
  | { getAuthCookie: () => string | Promise<string | null | undefined> | null | undefined }
  | { browserSession: true };
```

## `TipplyTransportOptions`

```ts
type TipplyTransportOptions = {
  fetch?: typeof fetch;
  proxyBaseUrl?: string;
  publicBaseUrl?: string;
  alertSocketBaseUrl?: string;
  appOrigin?: string;
  cookieName?: string;
  includeCredentials?: boolean;
  timeoutMs?: number;
};
```

Domyślne wartości:

- `proxyBaseUrl`: `https://proxy.tipply.pl`
- `publicBaseUrl`: `https://tipply.pl/api`
- `alertSocketBaseUrl`: `https://alert-ws.tipply.pl`
- `appOrigin`: `https://app.tipply.pl`
- `cookieName`: `auth_token`
- `includeCredentials`: `true`
- `timeoutMs`: `30000`

## Nadpisanie transportu

```ts
const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  transport: {
    timeoutMs: 10_000,
    fetch: customFetch,
  },
});
```

To jest przydatne w:

- testach
- własnych runtime'ach
- środowiskach z niestandardowym `fetch`

## `RequestOptions`

Większość metod przyjmuje opcjonalny drugi argument:

```ts
type RequestOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
};
```

Przykład:

```ts
const abortController = new AbortController();

const tips = await client.tips
  .list()
  .limit(20)
  .get({
    signal: abortController.signal,
    timeoutMs: 5_000,
  });
```

## Walidacja odpowiedzi

Walidacja odpowiedzi jest domyślnie włączona. Możesz ją wyłączyć:

```ts
const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  validation: false,
});
```

W praktyce warto zostawić walidację aktywną, zwłaszcza jeśli SDK jest częścią większej integracji.
