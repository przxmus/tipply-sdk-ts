---
title: Realtime TIP_ALERT
description: Listener `TIP_ALERT`, eventy i wzorce użycia w Bun, Node.js i przeglądarce.
---

## Dostępne entrypointy

### Z klienta auth

```ts
const listener = await client.tipAlerts.createListener();
```

Ten wariant najpierw odczytuje bieżącego użytkownika przez `client.me.get()`, a potem tworzy listener dla jego `userId`.

### Z klienta auth lub publicznego na podstawie widget URL

```ts
const listener = client.tipAlerts.fromWidgetUrl(
  "https://widgets.tipply.pl/TIP_ALERT/user-123",
);
```

### Z klienta publicznego i znanego `userId`

```ts
const listener = publicClient.user(asUserId("user-123")).tipAlerts.createListener();
```

## Lifecycle listenera

```ts
listener.on("ready", () => {
  console.log("Połączono z socketem");
});

listener.on("donation", (donation) => {
  console.log(donation.nickname, donation.amount);
});

listener.on("disconnect", (reason) => {
  console.log("Rozłączono:", reason);
});

listener.on("error", (error) => {
  console.error(error);
});

await listener.connect();
```

## Publiczny kontrakt listenera

```ts
interface TipAlertsListener {
  readonly userId: UserId;
  readonly connected: boolean;
  connect(): Promise<void>;
  destroy(): void;
  on(event, listener): this;
  once(event, listener): this;
  off(event, listener): this;
  removeAllListeners(event?): this;
}
```

## Dostępne eventy

- `ready`
- `donation`
- `disconnect`
- `error`

## Kształt eventu `donation`

Payload jest normalizowany do typowanego `TipAlertDonation`. Zawiera między innymi:

- `id`
- `receiverId`
- `nickname`
- `email`
- `message`
- `amount`
- `commission`
- `test`
- `resent`
- `source`
- `paymentId`
- `audioUrl`
- `goalId`
- `goalTitle`
- `createdAt`
- `moderatedAt`
- pola TTS
- `raw` z oryginalnym payloadem widgetu

## Opcje połączenia

```ts
type TipAlertsListenerOptions = {
  reconnect?: boolean;
};
```

Przykład:

```ts
const listener = publicClient.tipAlerts.fromWidgetUrl(
  "https://widgets.tipply.pl/TIP_ALERT/user-123",
  { reconnect: false },
);
```

## Domknięcie procesu

Przy dłużej działających skryptach warto jawnie niszczyć listener:

```ts
const shutdown = () => {
  listener.destroy();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
```

## Obsługiwane środowiska

- Bun
- Node.js
- przeglądarki

Edge runtime'y nie są oficjalnym targetem websocketów dla tego API.
