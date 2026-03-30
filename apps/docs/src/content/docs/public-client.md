---
title: Klient publiczny
description: Publiczne endpointy Tipply bez auth tokena.
---

## Kiedy używać klienta publicznego

`createTipplyPublicClient()` jest właściwym wyborem, gdy chcesz:

- czytać widget celu użytkownika
- pobierać publiczną konfigurację `TIPS_GOAL`
- pobierać publiczne szablony `TIPS_GOAL` i `GOAL_VOTING`
- pobierać CSS z template fonts
- odczytywać `widgetMessage`
- uruchomić listener `TIP_ALERT` bez sesji auth

## Utworzenie klienta

```ts
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
```

## Praca w scope użytkownika

Większość publicznych endpointów działa w scope `user(userId)`.

```ts
import { asGoalId, asUserId } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
const user = client.user(asUserId("user-123"));

const goalsTemplates = await user.goals.templates.list();
const goalsConfiguration = await user.goals.configuration.get();
const goalWidget = await user.goals.id(asGoalId("goal-123")).widget.get();
const votingTemplates = await user.voting.templates.list();
const votingConfiguration = await user.voting.configuration.get();
const templateFontsCss = await user.templateFonts.get();
const widgetMessageEnabled = await user.widgetMessage.get();
```

## Co zwraca klient publiczny

### `goals.templates.list()`

Lista publicznych szablonów typu `TIPS_GOAL`.

### `goals.configuration.get()`

Publiczna konfiguracja widgetu celu użytkownika.

### `goals.id(goalId).widget.get()`

Widok konkretnego widgetu celu.

### `voting.templates.list()`

Lista publicznych szablonów `GOAL_VOTING`.

### `voting.configuration.get()`

Konfiguracja publicznego votingu.

### `templateFonts.get()`

Surowy CSS jako `string`.

### `widgetMessage.get()`

Flaga `boolean` określająca dostępność widget message.

## Publiczne social linki profilu

To wywołanie jest wystawione na auth kliencie, ale korzysta z publicznego proxy endpointu:

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const socialLinks = await client.profile.public("streamer-link").socialLinks.list();
```

## `TIP_ALERT` bez auth tokena

Jeżeli znasz `userId`, możesz utworzyć listener bezpośrednio:

```ts
const listener = client.user(asUserId("user-123")).tipAlerts.createListener();
```

Jeżeli znasz tylko widget URL, SDK wyciągnie `userId` samo:

```ts
const listener = client.tipAlerts.fromWidgetUrl(
  "https://widgets.tipply.pl/TIP_ALERT/user-123",
);
```

Szczegóły eventów i lifecycle listenera są w [Realtime Tip Alerts](/realtime-tip-alerts/).
