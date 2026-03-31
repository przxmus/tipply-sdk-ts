---
title: Documentation
description: English documentation for the unofficial TypeScript SDK for Tipply, with guides for auth, public endpoints, realtime TIP_ALERT, and API reference.
template: splash
hero:
  tagline: Unofficial TypeScript SDK for Tipply with authenticated APIs, public widget reads, and realtime TIP_ALERT helpers.
  actions:
    - text: Getting Started
      link: /getting-started/overview/
      icon: right-arrow
    - text: API Reference
      link: /reference/client-surface/
      variant: minimal
---

This site documents the current `tipply-sdk-ts` API surface. It is an unofficial project and is not affiliated with Tipply.

Use this SDK when you need typed access to authenticated Tipply endpoints, public goal and voting widgets, or realtime `TIP_ALERT` events from Bun, Node.js, or the browser.

## What You Will Find Here

- installation and first-request setup
- authenticated and public client guides
- realtime `TIP_ALERT` connection patterns
- transport, validation, and error handling details
- API reference split into focused pages instead of one long list

## Documentation Map

- Start with [Overview](/getting-started/overview/) for the shortest path to a working client.
- Read [Authentication](/getting-started/authentication/) if you need private endpoints.
- Use [Authenticated Client](/guides/authenticated-client/) or [Public Client](/guides/public-client/) depending on the data you need.
- Keep [Client Surface](/reference/client-surface/) and the resource reference pages open while integrating.

## Main Capabilities

- authenticated resources such as `me`, `dashboard`, `profile`, `settings`, `tips`, `withdrawals`, and `reports`
- public resources such as goal widgets, voting configuration, template fonts, and widget message flags
- realtime listeners for `TIP_ALERT`
- typed ID helpers such as `asUserId()` and `asTipId()`

## Next Steps

1. Open [Overview](/getting-started/overview/).
2. Pick [Authenticated Client](/guides/authenticated-client/) or [Public Client](/guides/public-client/).
3. Use the [Reference](/reference/client-surface/) section when wiring the full integration.
