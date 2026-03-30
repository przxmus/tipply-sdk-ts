# tipply-sdk-ts

TypeScript SDK do Tipply z pełnym typowaniem, obsługą sesji opartą o `auth_token`, publicznym klientem do widgetów oraz realtime listenerem dla `TIP_ALERT`.

## Co dostajesz

- jeden spójny klient dla endpointów wymagających sesji Tipply
- osobny klient publiczny dla widgetów i konfiguracji dostępnych bez logowania
- typowane modele odpowiedzi i wejść dla zaimplementowanego surface SDK
- wygodne buildery dla list tipów i wypłat
- realtime listener do alertów napiwków oparty o `socket.io-client`
- obsługę Node.js 18+, Bun oraz runtime'ów z dostępnym `fetch`

## Zakres SDK

SDK dokumentuje i wystawia tylko to, co jest faktycznie zaimplementowane w kodzie. Obecny surface obejmuje:

- dane bieżącego użytkownika
- dashboard, statystyki, punkty i ostatnie tipy
- profil użytkownika i publiczne linki social media
- metody płatności i ich konfigurację
- ustawienia alertów, licznika, filtrowania i forbidden words
- cele, voting, szablony, tipy, moderatorów, media, wypłaty i raporty
- publiczne endpointy widgetów, template fonts, votingu i `TIP_ALERT`

Jeżeli zmiana w SDK dodaje nowe endpointy albo zmienia zachowanie istniejących metod, trzeba zaktualizować ten README, dokumentację w `apps/docs` oraz przykłady w `apps/sdk/examples`.

## Instalacja

```bash
bun add tipply-sdk-ts
```

## Wymagania

- `bun` albo Node.js 18+
- środowisko z `fetch`
- aktywna sesja Tipply, jeśli chcesz korzystać z endpointów auth

## Szybki start

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const me = await client.me.get();
const profile = await client.profile.get();
const recentTips = await client.dashboard.tips.recent.list();

console.log(me.username, profile.link, recentTips.length);
```

## Skąd wziąć `auth_token`

SDK nie implementuje logowania. Potrzebujesz istniejącej sesji Tipply i samej wartości ciasteczka `auth_token`.

1. Zaloguj się do panelu użytkownika Tipply.
2. Otwórz DevTools skrótem `F12`.
3. Wejdź do zakładki `Network`.
4. Odśwież stronę.
5. Otwórz jedno z górnych zapytań z pomarańczową ikoną, na przykład `tips` albo `points`.
6. Wejdź w `Response Headers`.
7. Znajdź nagłówek `Set-Cookie`.
8. Skopiuj wyłącznie fragment po `auth_token=` i przed pierwszym średnikiem.

To właśnie ta wartość trafia do `authCookie` albo `TIPPLY_AUTH_COOKIE`.

## Modele uwierzytelnienia

### 1. Statyczny token

Najprostsza opcja do skryptów CLI, jobów i lokalnych narzędzi.

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});
```

### 2. Asynchroniczny provider tokena

Przydatne, gdy token pobierasz z własnego storage lub sekreta.

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  session: {
    getAuthCookie: async () => process.env.TIPPLY_AUTH_COOKIE,
  },
});
```

### 3. Sesja przeglądarkowa

Do aplikacji działającej w przeglądarce z aktywną sesją Tipply.

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  session: { browserSession: true },
  transport: { includeCredentials: true },
});
```

## Klient publiczny

Klient publiczny nie wymaga `auth_token` i nadaje się do odczytu widgetów, template fonts, konfiguracji votingu oraz `TIP_ALERT`.

```ts
import { asGoalId, asUserId } from "tipply-sdk-ts";
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const client = createTipplyPublicClient();
const user = client.user(asUserId("user-123"));

const widgetEnabled = await user.widgetMessage.get();
const goalWidget = await user.goals.id(asGoalId("goal-123")).widget.get();
const fontsCss = await user.templateFonts.get();

console.log(widgetEnabled, goalWidget.title, fontsCss.slice(0, 80));
```

## Praktyczne przykłady

### Dashboard streamera

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
});

const [me, points, income, notifications] = await Promise.all([
  client.me.get(),
  client.dashboard.points.get(),
  client.dashboard.stats.income.get(),
  client.dashboard.notifications.list(),
]);

console.log({
  username: me.username,
  points,
  totalIncome: income.total,
  unreadNotifications: notifications.length,
});
```

### Praca na tipach z builderem

```ts
const tips = await client.tips
  .list()
  .filter("amount")
  .search("mikrofon")
  .limit(10)
  .offset(0)
  .get();
```

### Aktualizacja wybranej metody płatności

```ts
const updatedPaypal = await client.paymentMethods.method("paypal").update({
  minimalAmount: 1500,
});

console.log(updatedPaypal.minimalAmount);
```

### Nasłuchiwanie `TIP_ALERT`

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const listener = await createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
}).tipAlerts.createListener();

listener.on("ready", () => {
  console.log(`Nasłuchiwanie alertów dla ${listener.userId}`);
});

listener.on("donation", (donation) => {
  console.log(`${donation.nickname}: ${donation.amount}`);
});

listener.on("error", (error) => {
  console.error(error);
});

await listener.connect();
```

Jeżeli masz tylko publiczny URL widgetu, możesz utworzyć listener bez znajomości `userId`:

```ts
import { createTipplyPublicClient } from "tipply-sdk-ts/public";

const listener = createTipplyPublicClient().tipAlerts.fromWidgetUrl(
  "https://widgets.tipply.pl/TIP_ALERT/user-123",
);
```

## Surface klienta

### Root factories

- `createTipplyClient(options?)`
- `createTipplyPublicClient(options?)` z `tipply-sdk-ts/public`

### Authenticated client

#### `me`

- `client.me.get()`

#### `dashboard`

- `client.dashboard.announcements.list()`
- `client.dashboard.announcements.listExtra()`
- `client.dashboard.stats.income.get()`
- `client.dashboard.stats.tips.get()`
- `client.dashboard.points.get()`
- `client.dashboard.tips.recent.list()`
- `client.dashboard.notifications.list()`

#### `profile`

- `client.profile.get()`
- `client.profile.pendingChanges.check()`
- `client.profile.page.updateSettings(input)`
- `client.profile.public(slug).socialLinks.list()`

#### `paymentMethods`

- `client.paymentMethods.configuration.get()`
- `client.paymentMethods.list()`
- `client.paymentMethods.method(methodKey).update(input)`

#### `settings`

- `client.settings.list()`
- `client.settings.tipAlerts.update(input)`
- `client.settings.countdown.update(input)`
- `client.settings.alerts.toggle(disabled)`
- `client.settings.alertSound.toggle(disabled)`
- `client.settings.forbiddenWords.get()`
- `client.settings.profanityFilter.get()`

#### `goals`

- `client.goals.list()`
- `client.goals.create(input)`
- `client.goals.id(goalId).update(input)`
- `client.goals.id(goalId).reset()`
- `client.goals.voting.get()`

#### `templates`

- `client.templates.list()`
- `client.templates.id(templateId).replace(input)`

#### `tips`

- `client.tips.list().filter(filter).search(search).limit(limit).offset(offset).get()`
- `client.tips.moderation.listQueue()`
- `client.tips.moderation.listBasket()`
- `client.tips.pending.list()`
- `client.tips.audio.toggle()`

#### `moderators`

- `client.moderators.list()`
- `client.moderators.create(input)`
- `client.moderators.id(moderatorId).remove()`
- `client.moderators.mode.toggle()`

#### `media`

- `client.media.list()`
- `client.media.usage.get()`
- `client.media.id(mediaId).formats.get()`

#### `withdrawals`

- `client.withdrawals.accounts.list()`
- `client.withdrawals.methods.configuration.get()`
- `client.withdrawals.latest.list()`
- `client.withdrawals.list().status(...statuses).limit(limit).offset(offset).get()`
- `client.withdrawals.id(withdrawalId).confirmationPdf.get()`

#### `reports`

- `client.reports.list()`

#### `tipAlerts`

- `await client.tipAlerts.createListener(options?)`
- `client.tipAlerts.fromWidgetUrl(widgetUrl, options?)`

#### `public`

- `client.public.user(userId).goals.templates.list()`
- `client.public.user(userId).goals.configuration.get()`
- `client.public.user(userId).goals.id(goalId).widget.get()`
- `client.public.user(userId).voting.templates.list()`
- `client.public.user(userId).voting.configuration.get()`
- `client.public.user(userId).templateFonts.get()`
- `client.public.user(userId).widgetMessage.get()`
- `client.public.user(userId).tipAlerts.createListener(options?)`
- `client.public.tipAlerts.fromWidgetUrl(widgetUrl, options?)`

### Public client

- `client.user(userId).goals.templates.list()`
- `client.user(userId).goals.configuration.get()`
- `client.user(userId).goals.id(goalId).widget.get()`
- `client.user(userId).voting.templates.list()`
- `client.user(userId).voting.configuration.get()`
- `client.user(userId).templateFonts.get()`
- `client.user(userId).widgetMessage.get()`
- `client.user(userId).tipAlerts.createListener(options?)`
- `client.tipAlerts.fromWidgetUrl(widgetUrl, options?)`

## Realtime `TIP_ALERT`

Listener zwraca typowany obiekt z API:

- `userId`
- `connected`
- `connect()`
- `destroy()`
- `on(...)`
- `once(...)`
- `off(...)`
- `removeAllListeners(...)`

Dostępne eventy:

- `ready`
- `donation`
- `disconnect`
- `error`

Opcje listenera:

```ts
type TipAlertsListenerOptions = {
  reconnect?: boolean;
};
```

## Konfiguracja transportu

Domyślne adresy i zachowanie możesz nadpisać przez `transport`:

```ts
import { createTipplyClient } from "tipply-sdk-ts";

const client = createTipplyClient({
  authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  transport: {
    proxyBaseUrl: "https://proxy.tipply.pl",
    publicBaseUrl: "https://tipply.pl/api",
    alertSocketBaseUrl: "https://alert-ws.tipply.pl",
    appOrigin: "https://app.tipply.pl",
    cookieName: "auth_token",
    includeCredentials: true,
    timeoutMs: 30_000,
  },
});
```

Możesz też podmienić `fetch`, co ułatwia testy i własne runtime'y.

## Błędy

SDK rzuca własne klasy błędów:

- `TipplyError`
- `TipplyHttpError`
- `TipplyAuthenticationError`
- `TipplyResponseValidationError`
- `TipplyConfigurationError`

Przykład obsługi:

```ts
import { TipplyAuthenticationError, createTipplyClient } from "tipply-sdk-ts";

try {
  const client = createTipplyClient({
    authCookie: process.env.TIPPLY_AUTH_COOKIE!,
  });

  await client.me.get();
} catch (error) {
  if (error instanceof TipplyAuthenticationError) {
    console.error("Sesja Tipply jest nieważna albo token wygasł.");
  }

  throw error;
}
```

## ID helpers i typy

SDK eksportuje helpery do brandowanych identyfikatorów:

- `asAccountId`
- `asGoalId`
- `asMediaId`
- `asModeratorId`
- `asPaymentId`
- `asReportId`
- `asTemplateId`
- `asTipId`
- `asUserId`
- `asWithdrawalId`

Typy są eksportowane z głównego entrypointu oraz z `tipply-sdk-ts/public`.

## Skrypty deweloperskie

W katalogu `apps/sdk`:

```bash
bun run build
bun run typecheck
bun run test
bun run test:types
bun run test:live
```

Live testy są opt-in:

```bash
TIPPLY_AUTH_COOKIE=twoj-token bun run test:live
```

Mutacje live pozostają wyłączone, dopóki nie ustawisz:

```bash
TIPPLY_AUTH_COOKIE=twoj-token TIPPLY_ALLOW_MUTATIONS=true bun run test:live
```

## Ograniczenia i uwagi

- `authCookie` oznacza samą wartość tokena, nie cały nagłówek `Cookie`.
- wartości pieniężne są reprezentowane jako minor units
- daty są zwracane jako stringi ISO 8601
- walidacja odpowiedzi jest włączona domyślnie
- SDK nie implementuje procesu logowania do Tipply
- realtime `TIP_ALERT` jest oficjalnie wspierany w Bun, Node.js i przeglądarkach
- edge runtime'y nie są oficjalnym targetem websocketów dla tego API

## Dokumentacja aplikacji docs

Pełniejsza dokumentacja dla użytkownika końcowego znajduje się w `apps/docs`, razem z opisem auth tokena, scenariuszami użycia i pełną referencją metod.
