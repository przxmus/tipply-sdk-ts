# Contributing

Thanks for your interest in contributing to `tipply-sdk-ts`.

This repository is a Bun-first monorepo. Keep changes focused, small, and easy to review.

## Project layout

- `apps/sdk` contains the TypeScript SDK, its tests, and runnable examples.
- `apps/docs` contains the public documentation site.
- `.github` contains CI and pull request templates.

## Local setup

Use Bun for installs and workspace scripts:

```bash
bun install
bun run typecheck
bun run test
bun run build
```

Run the docs site locally when you touch public-facing behavior or documentation:

```bash
cd apps/docs
bun run dev
```

The docs server runs on `http://localhost:4321`.

## What to change where

- SDK code belongs in `apps/sdk/src`.
- Unit, contract, and live tests belong in `apps/sdk/tests`.
- Public examples belong in `apps/sdk/examples`.
- Docs content belongs in `apps/docs/src/content/docs`.

If you change the public API, transport behavior, error handling, or example usage, update the docs and examples in the same change.

## Contribution guidelines

- Keep changes narrowly scoped.
- Prefer small commits and small pull requests.
- Do not introduce unrelated cleanup in the same change.
- Keep examples runnable and aligned with the current SDK surface.
- Use `localhost` in local documentation and developer instructions.
- Follow the existing code style and avoid unnecessary refactors.

## Before opening a pull request

Run the relevant checks for your change:

- `bun run typecheck`
- `bun run test`
- `bun run build`
- `cd apps/docs && bun run build`

If your change affects published behavior, verify the docs build and the examples still make sense together.

## Pull request expectations

- Explain what changed and why.
- Call out any API, docs, or example updates.
- Link related issues or context when available.
- Mention any follow-up work that should happen after merge.
