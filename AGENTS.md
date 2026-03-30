# Repository Guidelines

- Use `bun` and `bunx` for installs, scripts, checks, and local tooling unless a task explicitly requires something else.
- Keep commits small, focused, and frequent. Do not batch unrelated work together.
- Never revert unrelated user changes in the working tree.
- If a change affects public usage, always review and update all relevant docs before finishing:
  `apps/sdk/README.md`, `apps/docs`, and `apps/sdk/examples`.
- Treat examples as supported entry points, not throwaway snippets. Keep them runnable and aligned with the current API surface.
- For SDK changes, verify the package still builds, typechecks, and passes tests before wrapping up.
- For docs changes, make sure the docs app still builds and the navigation stays coherent.
- Always add docstrings to everything new or changed in the SDK, and update existing ones if they become inaccurate.
- README.md equals apps/sdk/README.md.