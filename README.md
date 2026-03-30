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

```ts
import { asTipId, createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

await client.tips.id(asTipId("tip-123")).resend();
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
