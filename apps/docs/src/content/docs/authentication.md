---
title: Uwierzytelnienie
description: Jak zdobyć auth token Tipply i jak poprawnie przekazać go do SDK.
---

## Co musisz wiedzieć

`tipply-sdk-ts` nie implementuje logowania. SDK zakłada, że masz już aktywną sesję Tipply i potrafisz przekazać wartość `auth_token`.

W praktyce do klienta przekazujesz samą wartość tokena, nie cały nagłówek `Cookie`.

Auth client może potem sam aktualizować ten token na podstawie kolejnych nagłówków `Set-Cookie`.

## Jak pobrać `auth_token` z DevTools

1. Otwórz <a href="https://app.tipply.pl/panel-uzytkownika" target="_blank" rel="noopener noreferrer">panel użytkownika Tipply</a> i zaloguj się.
2. Otwórz DevTools skrótem `F12`.
3. Przejdź do zakładki `Application`.
4. W lewym panelu rozwiń `Storage`, a potem `Cookies`.
5. Wybierz domenę `https://app.tipply.pl`.
6. W tabeli cookies znajdź wiersz, w którym kolumna `Name` ma wartość `auth_token`.
7. Skopiuj wartość z kolumny `Value` z tego wiersza.

To właśnie ta jedna wartość jest potrzebna SDK. Nie kopiuj całego wiersza, `auth_token=...` ani żadnych średników.

Przykład:

```txt
Cookie: auth_token=twoj-token-tutaj
```

Do SDK trafia wyłącznie:

```txt
twoj-token-tutaj
```

## Sposoby przekazania sesji

### `authCookie`

Najkrótsza i najczytelniejsza forma dla skryptów, CLI i testów live.

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});
```

### `session.authCookie`

Równoważna forma, jeśli chcesz trzymać pełną konfigurację sesji w `session`.

```ts
const client = createTipplyClient({
  session: {
    authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  },
});
```

### `getAuthCookie`

Przydatne, gdy token pobierasz dynamicznie.

```ts
const client = createTipplyClient({
  getAuthCookie: async () => process.env.TIPPLY_AUTH_COOKIE,
});
```

Możesz też użyć wariantu z `session`:

```ts
const client = createTipplyClient({
  session: {
    getAuthCookie: async () => process.env.TIPPLY_AUTH_COOKIE,
  },
});
```

### `browserSession`

Do środowiska przeglądarkowego, kiedy sesja Tipply już istnieje po stronie przeglądarki.

```ts
const client = createTipplyClient({
  session: { browserSession: true },
  transport: { includeCredentials: true },
});
```

## Co dzieje się pod spodem

Dla endpointów auth SDK:

- ustawia `Referer` na `https://app.tipply.pl/`
- dla metod innych niż `GET` ustawia `Origin` na `https://app.tipply.pl`
- wstrzykuje `Cookie: auth_token=<wartosc>` jeśli podasz token ręcznie
- używa `credentials: "include"` przy requestach auth, jeśli `includeCredentials` jest włączone
- domyślnie przechwytuje nowy `auth_token` z `Set-Cookie` i używa go dla kolejnych requestów
- opcjonalnie może robić cykliczny refresh przez `GET /user`

## Kiedy dostaniesz błąd konfiguracji

Jeśli wywołasz endpoint auth bez:

- `authCookie`
- `getAuthCookie`
- `session.browserSession`

i jednocześnie wyłączysz `includeCredentials`, SDK rzuci `TipplyConfigurationError`.

## Bezpieczeństwo

- nie commituj `auth_token` do repo
- nie wrzucaj tokena do publicznych logów
- najlepiej trzymaj go w zmiennych środowiskowych albo secret storage
- przy wygaśnięciu sesji spodziewaj się `TipplyAuthenticationError`
