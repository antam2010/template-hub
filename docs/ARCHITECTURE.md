# Architecture

## Isolation and dependencies

Showcase uses React Router declarative routing and a shared semantic token sheet compiled by Tailwind v4's Vite plugin. Cloudscape is compiled through a separate HTML input; it imports only Cloudscape's global styles. Templates appear inside iframes so CSS selectors, portals, global resets and color-scheme cannot cross document boundaries. The independent full-screen pages also work directly.

The template iframe receives `theme=light|dark`; changing the showcase theme reloads the preview. This intentionally resets preview Mock state. PC uses available container width, tablet targets 768px and mobile targets 390px, capped by available width. Fullscreen opens a new document. The responsive layout belongs to each template.

The root Vite build uses shared chunks for React/UI where safe and separate Cloudscape CSS/JS. Workspace packages export source; there is no separate publish step. Template code is imported as raw strings only for inspection and the generator. No runtime evaluation occurs.

## Generator pipeline

1. Validate a short safe project slug and supported template ID.
2. Read selected App and necessary shared source entries from an explicit source map supplied by the showcase.
3. Rewrite the target layout to `src/App.tsx`, `src/ui-core/*`, `src/patterns/index.ts` and a local token stylesheet.
4. Write exact dependency versions, local Vite/TypeScript aliases and optional theme/test code.
5. Return a ZIP of files to download; there is no backend.

Cloudscape projects exclude Tailwind/Radix. Admin/Analytics projects exclude Cloudscape. Optional tests and theme toggle are genuinely omitted when unselected. Missing sources fail with a visible error. Name validation and fixed output paths prevent path traversal. `verify:generated` extracts six ZIP fixtures under a disposable directory and verifies installations, builds and optional tests without parent-workspace imports.

## Reuse

`ui-core` exports Button, Input, Select, Checkbox, Modal, Table, Pagination, Filter, Search, Sidebar, Navbar, Tabs, Breadcrumb, Toast, Alert, Badge, Loading, Card, Chart, Form and FileUpload. Table is generic over row shape. UI navigation demos accept a controlled callback instead of assuming application routes. Large application forms can compose the input primitives; the Form export is a small validated name-form pattern.

The component inspector shows edited usage snippets, full interactive demo code and all UI implementation sources. Storybook provides Button variants and a selector for every interactive demo. The next expansion should add deeper per-component controls and independently authored stories without importing the showcase's demo view.

## Data and persistence

CMS and Cloud Console mutate React state; Analytics derives deterministic period/channel data. No external API, analytics collector, identity provider or persistence layer is configured. Only the showcase theme and optional generated-project theme use localStorage. CSV output quotes fields and neutralizes formula prefixes. FileUpload reads names and validates size without uploading contents.
