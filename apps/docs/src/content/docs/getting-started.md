---
title: Getting Started
description: Instalacja, pierwszy klient i najszybsza ścieżka do pierwszego działającego requestu.
---

## Instalacja

```bash
bun add tipply-sdk-ts
```

## Wymagania

- `bun` albo Node.js 18+
- środowisko z `fetch`
- aktywna sesja Tipply, jeśli chcesz wykonywać requesty auth

## Najprostszy klient auth

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const me = await client.me.get();

console.log(me.username);
```

## Najprostszy klient publiczny

```ts
import { asUserId } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
const user = client.user(asUserId("user-123"));

const widgetMessageEnabled = await user.widgetMessage.get();

console.log(widgetMessageEnabled);
```

## Co dostajesz po stronie auth

- Me
- Dashboard
- Profile
- Payment methods
- Settings
- Goals
- Templates
- Tips
- Moderators
- Media
- Withdrawals
- Reports
- Public endpoints

## Co dostajesz po stronie publicznej

- widget celu użytkownika
- konfigurację celów
- szablony `TIPS_GOAL`
- konfigurację i szablony `GOAL_VOTING`
- CSS z fontami szablonów
- flagę `widgetMessage`
- realtime `TIP_ALERT`

## Realtime `TIP_ALERT`

```ts
import { createTipplyClient } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const listener = process.env.TIPPLY_AUTH_COOKIE
  ? await createTipplyClient({
      session: {
        authCookie: process.env.TIPPLY_AUTH_COOKIE,
      },
    }).tipAlerts.createListener()
  : createTipplyPublicClient().tipAlerts.fromWidgetUrl(
      "https://widgets.tipply.pl/TIP_ALERT/user-123",
    );

listener.on("ready", () => {
  console.log("Connected");
});

listener.on("donation", (donation) => {
  console.log(donation);
});

listener.on("error", console.error);

await listener.connect();
```

Realtime `TIP_ALERT` działa oficjalnie w Bun, Node.js i przeglądarkach. Jeżeli masz tylko widget URL, SDK potrafi sam wyciągnąć `userId` z linku `TIP_ALERT`.

## Co przeczytać dalej

- [Authentication](/authentication/) jeżeli nie masz jeszcze `auth_token`
- [Authenticated Client](/authenticated-client/) jeżeli pracujesz na prywatnych endpointach
- [Public Client](/public-client/) jeżeli korzystasz z widgetów i publicznych danych
- [SDK Reference](/sdk-reference/) dla pełnej listy metod
