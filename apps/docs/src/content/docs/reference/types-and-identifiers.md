---
title: Types And Identifiers
description: Review exported Tipply SDK types, branded identifier helpers, listener events, and shared integration notes.
sidebar:
  order: 4
---

## ID Helpers

The SDK exports branded helpers for IDs returned by Tipply:

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

## Exported Type Groups

The package re-exports types from:

- `core/types`
- `domain/ids`
- `domain/shared`
- `domain/alerts`
- `domain/account`
- `domain/settings`
- `domain/goals`
- `domain/templates`
- `domain/tips`
- `domain/moderators`
- `domain/withdrawals`
- `realtime/tip-alerts`

## Realtime Events

```ts
interface TipAlertsListenerEvents {
  ready: () => void;
  donation: (donation: TipAlertDonation) => void;
  disconnect: (reason: string) => void;
  error: (error: Error) => void;
}
```

## Shared Request Types

```ts
type RequestOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
};
```

```ts
type TipplySessionOptions =
  | { authCookie: string }
  | { getAuthCookie: () => string | Promise<string | null | undefined> | null | undefined }
  | { browserSession: true };
```

## Errors

```ts
class TipplyError extends Error {}
class TipplyHttpError extends TipplyError {}
class TipplyAuthenticationError extends TipplyHttpError {}
class TipplyResponseValidationError extends TipplyError {}
class TipplyConfigurationError extends TipplyError {}
class TipplyAuthError extends TipplyAuthenticationError {}
class TipplyValidationError extends TipplyResponseValidationError {}
```

## Integration Notes

- authenticated requests use the proxy base URL by default
- public reads use the public API base URL by default
- `confirmationPdf.get()` returns `ArrayBuffer`
- response validation is enabled by default
- monetary values are returned as numbers in minor units
