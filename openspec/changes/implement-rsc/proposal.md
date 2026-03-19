## Why

MyReact currently supports SSR but lacks React Server Components (RSC), a key feature that enables components to render exclusively on the server with zero client-side JavaScript. This prevents MyReact from competing with modern frameworks like Next.js 14+ and limits adoption for applications requiring optimal performance and SEO. Implementing RSC will complete MyReact's server rendering story and enable the "use client"/"use server" directive patterns that developers expect.

## What Changes

- **New package `@my-react/react-server`**: Core RSC implementation with Flight protocol support via `@lazarv/rsc`
- **New fiber type `NODE_TYPE.__serverComponent__`**: Reconciler support for async server components
- **Server-side rendering enhancements**: `renderToFlightStream()` for RSC payload generation
- **Client hydration**: Flight stream consumption and module loading for client components
- **Directive support**: "use client" and "use server" directive detection and transformation
- **Server Actions**: Full support for server-side mutations with form actions and `useActionState`
- **Vite plugin enhancement**: RSC-aware build transformations in `@my-react/react-vite`
- **React 19 API compatibility**: `use()`, `cache()`, async components, and streaming Suspense

## Capabilities

### New Capabilities

- `rsc-server-rendering`: Server-side RSC rendering with Flight protocol serialization, async component execution, and streaming output
- `rsc-client-hydration`: Client-side Flight stream consumption, module loading, and hydration with client component boundaries
- `rsc-directives`: Detection and transformation of "use client" and "use server" directives in source code
- `rsc-server-actions`: Server action registration, execution, form integration, and client-server RPC
- `rsc-vite-plugin`: Vite plugin enhancements for RSC builds including directive detection, client/server splitting, and manifest generation

### Modified Capabilities

<!-- No existing specs to modify - this is a new feature set -->

## Impact

### New Packages

- `packages/myreact-server/` - New package for RSC implementation

### Modified Packages

- `packages/myreact-shared/` - Add `NODE_TYPE.__serverComponent__` fiber type
- `packages/myreact-reconciler/` - Add server component processing and async component support
- `packages/myreact-dom/` - Integrate Flight rendering with existing SSR
- `packages/myreact-vite/` - Add RSC-aware transforms and build configuration
- `packages/myreact/` - Add React 19 compatible APIs (`use`, `cache`)

### Dependencies

- Add `@lazarv/rsc` as dependency for Flight protocol implementation

### Build System

- Update `pnpm-workspace.yaml` to include new package
- Add RSC-specific build configuration in `scripts/`

### Breaking Changes

- None - RSC is additive and opt-in via directives
