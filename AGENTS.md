# Architecture and development rules

## Workspace boundaries

- `apps/showcase` owns routing, browsing, props controls, previews and source inspection.
- `packages/ui-core` owns reusable presentation components. Runtime code must never import apps or templates.
- `packages/design-tokens` owns semantic CSS variables, theme and Tailwind v4 configuration. Do not scatter hard-coded theme colors in components. Thumbnail illustrations may use fixed colors.
- `packages/patterns` owns registries, mock data and pure selectors. Keep it free of DOM/browser dependencies.
- `packages/project-generator` is a pure source-to-files-to-ZIP service. It receives sources, never reads arbitrary disk paths, and has no server dependency.
- `templates/*` must work in isolation. Cloudscape has its own document and global stylesheet. Never load Cloudscape global CSS into the showcase or Tailwind templates.
- Use explicit workspace dependencies in package manifests. Root dependencies also support the unified Vite build and source tests.

## Implementation

- Strict TypeScript; avoid `any`, unsafe HTML injection, hidden placeholder actions, and unimplemented controls.
- shadcn/ui is source-owned, not a runtime package. Button uses the Radix Slot/CVA/cn pattern; preserve source inspectability and Radix keyboard behavior.
- Use Radix for dialogs, tabs, checkbox semantics. Keep labels, focus outlines, disabled and loading states.
- Basic CRUD is local state with deterministic starting data. Explain refresh reset, sample metrics and local-only uploads in the UI/docs.
- Use semantic tokens and responsive layouts. Respect reduced motion.
- New templates require a registry entry, standalone HTML/entry, Vite input, generator source-map entry and browser tests.
- Source snippets must compile and reflect edited props. Escape user strings with JSON.stringify for source generation. Never evaluate arbitrary user code.
- Validate project names before writing ZIP entries. Keep dependency sets separate for Cloudscape and the UI-core templates. Export actual template App sources, not substitute demos.

## Required checks

For each implemented phase, run `pnpm typecheck` and `pnpm build`; fix regressions before proceeding. Run `pnpm test` for selectors/generator changes. For interactive changes, run relevant `pnpm test:e2e` scenarios. Run `pnpm build-storybook` for story changes. Re-run `pnpm test && pnpm verify:generated` after changing generated sources/config: all three templates with options on/off must install and build independently. Do not report a blocked or unexecuted check as passing.

Use `pnpm install --frozen-lockfile` in CI. Do not commit generated output, browser traces, node_modules or .generated. Keep README and docs/IMPLEMENTATION.md accurate. Do not add a backend, database, authentication, or network-dependent demo data without scope agreement.
