---
title: Realtime TIP_ALERT
description: Listen to Tipply TIP_ALERT events from authenticated or public clients and control the current alert when auth is available.
sidebar:
  order: 3
---

## Available Entrypoints

### From the authenticated client

```ts
const listener = await client.tipAlerts.createListener();
```

This variant resolves the current user first and then opens the realtime connection for that `userId`.

### From a widget URL

```ts
const listener = client.tipAlerts.fromWidgetUrl(
  "https://widgets.tipply.pl/TIP_ALERT/user-123",
);
```

### From the public client and a known `userId`

```ts
const me = await authenticatedClient.me.get();
const listener = publicClient.user(me.id).tipAlerts.createListener();
```

## Listener Lifecycle

```ts
listener.on("ready", () => {
  console.log("Connected");
});

listener.on("donation", (donation) => {
  console.log(donation.nickname, donation.amount);
});

listener.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

listener.on("error", (error) => {
  console.error(error);
});

await listener.connect();
```

## Listener Contract

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

## Events

- `ready`
- `donation`
- `disconnect`
- `error`

The `donation` payload is normalized to `TipAlertDonation` and includes fields such as `id`, `nickname`, `message`, `amount`, `audioUrl`, `goalId`, `createdAt`, and `raw`.

## Connection Options

```ts
type TipAlertsListenerOptions = {
  reconnect?: boolean;
};
```

Example:

```ts
const listener = publicClient.tipAlerts.fromWidgetUrl(
  "https://widgets.tipply.pl/TIP_ALERT/user-123",
  { reconnect: false },
);
```

## Skip The Current Alert

`skipCurrent()` is available only on the authenticated client:

```ts
await client.tipAlerts.skipCurrent();
```

## Clean Shutdown

```ts
const shutdown = () => {
  listener.destroy();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
```
