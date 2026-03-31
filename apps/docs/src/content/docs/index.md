---
title: Tipply SDK TS
template: splash
hero:
  tagline: Typowane SDK do pracy z Tipply, publicznymi widgetami i realtime alertami.
  actions:
    - text: Start
      link: /getting-started/
      icon: right-arrow
    - text: Pełna Referencja
      link: /sdk-reference/
      variant: minimal
---

Dokumentacja online jest dostępna pod adresem https://tipply-sdk.przxmus.dev.
To nie jest oficjalna dokumentacja Tipply.pl i ten projekt nie jest z nim w żaden sposób powiązany.

Dokumentacja obejmuje cały aktualnie zaimplementowany surface `tipply-sdk-ts`: konfigurację klienta, sposób pobrania `auth_token`, przykłady użycia, realtime `TIP_ALERT` oraz pełną referencję metod.

## Co znajdziesz w środku

- szybki start z `bun add tipply-sdk-ts`
- dokładny opis zdobycia `auth_token` po zalogowaniu do panelu użytkownika Tipply i użyciu DevToolsów
- przewodniki dla klienta auth i klienta publicznego
- pełny opis `TIP_ALERT` listenera
- dokumentację błędów, transportu i opcji klienta
- kompletną listę wszystkich metod wystawianych przez SDK

## Dla kogo jest to SDK

`tipply-sdk-ts` sprawdza się, gdy:

- piszesz własne narzędzie dla streamera
- budujesz integrację z Tipply w aplikacji Node.js, Bun albo webowej
- chcesz czytać publiczne widgety bez logowania
- chcesz nasłuchiwać napiwków w czasie rzeczywistym przez `TIP_ALERT`

## Następne kroki

1. Przejdź do [Getting Started](/getting-started/).
2. Jeżeli potrzebujesz sesji auth, przeczytaj [Authentication](/authentication/).
3. Potem wybierz [Authenticated Client](/authenticated-client/) albo [Public Client](/public-client/).
