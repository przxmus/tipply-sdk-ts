# tipply-sdk-ts

TypeScript SDK do Tipply z klientem auth, klientem publicznym i realtime listenerem dla `TIP_ALERT`.

## Instalacja

```bash
bun add tipply-sdk-ts
```

## Szybki start

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const me = await client.me.get();
const recentTips = await client.dashboard.tips.recent.list();

console.log(me.username, recentTips.length);
```

## Automatyczne odświeżanie `auth_token`

Auth client potrafi sam utrzymywać świeży `auth_token`:

- `auth.refreshTokenOnRequests`: domyślnie `true`, przechwytuje `Set-Cookie` z odpowiedzi i podmienia token używany przez kolejne requesty
- `auth.refreshTokenEvery`: domyślnie wyłączone, po włączeniu wysyła cykliczny request do `/user`; `true` oznacza domyślne `5` minut, a `{ intervalMs }` pozwala ustawić własny interwał
- `auth.reconnectTries`: domyślnie `3`; przy błędach auth, timeoutach i wybranych błędach transportu klient ponawia request, a przed ostatnią próbą najpierw odświeża sesję przez `/user`

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

Jeżeli włączysz `auth.refreshTokenEvery`, możesz zatrzymać background refresh przez `client.close()`.

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

## Klient publiczny

```ts
import { asUserId } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
const user = client.user(asUserId("user-123"));

const widgetMessageEnabled = await user.widgetMessage.get();

console.log(widgetMessageEnabled);
```

## Dokumentacja

Pełna dokumentacja jest dostępna online pod adresem https://tipply-sdk.przxmus.dev.
To nie jest oficjalna dokumentacja Tipply.pl i ten projekt nie jest z nim w żaden sposób powiązany.

Lokalnie możesz ją uruchomić z aplikacji `apps/docs`, która zawiera:

- pobieranie `auth_token` z DevToolsów Tipply
- konfigurację klienta auth i klienta publicznego
- przykłady użycia
- realtime `TIP_ALERT`
- błędy, transport i pełną referencję API

Lokalnie:

```bash
cd apps/docs
bun run dev
```

## Przykłady

Aktualne przykłady znajdziesz w `apps/sdk/examples`:

- `dashboard-summary.ts`
- `public-goal-widget.ts`
- `tip-controls.ts`
- `tip-alerts-listener.ts`

## Skrypty workspace

```bash
bun run typecheck
bun run test
bun run build
```

## Auth token

SDK nie implementuje logowania. Potrzebujesz aktywnej sesji Tipply i wartości ciasteczka `auth_token`. Szczegółowy opis pobrania tokena jest w dokumentacji strony docs.
