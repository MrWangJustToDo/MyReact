# Change: Add Vue-style Instant First-Frame Rendering (IFR) for MyReact Lynx

## Why

MyReact Lynx currently paints an empty page in `renderPage` and waits for Background reconcile + ops flush before any real UI appears. VueLynx (v0.5+) and ReactLynx already provide Instant First-Frame Rendering; without IFR, MyReact Lynx loses first-paint competitiveness on content-first screens. We need an **opt-in, Vue-aligned** IFR path that reuses our ops architecture instead of adopting ReactLynx Snapshot.

## What Changes

- Add plugin option `enableIFR` (default **`false`**) on `pluginMyReactLynx`.
- When enabled, Main Thread **synchronously mounts** the app inside `renderPage` (full MyReact reconciler + app on MT — option **A**), producing a real Lynx element tree before Background JS runs.
- Background’s first patch MUST **hydrate / intercept** against the IFR tree (no blind full-tree `CREATE` replay).
- Preserve existing **microtask ops flush** (`scheduleFlush`) and **first-screen patch meta** (`isFirstScreen` / `endFirstScreen`) as the post-IFR handoff and incremental-update pipeline — they are not IFR themselves.
- Document constraints: sync-friendly first screen; network/side effects gated on MT IFR mount; larger MT bundle expected.
- **Defer** Element Templates (`INSTANTIATE_TEMPLATE`) and ReactLynx Snapshot / `firstScreenSyncTiming` / SSR to later changes.

## Capabilities

### New Capabilities

- `lynx-ifr`: Runtime contract for MT sync mount, BG hydrate handoff, and interaction with ops flush / first-screen worklet lifecycle.
- `lynx-ifr-plugin`: Build/plugin surface (`enableIFR`), MT layer packing, and thread defines needed for IFR.

### Modified Capabilities

<!-- No existing published specs — greenfield Lynx IFR capability set -->

## Impact

- Affected specs: `lynx-ifr`, `lynx-ifr-plugin` (new)
- Affected code:
  - `packages/myreact-lynx/src/plugin/rsbuild.ts` — options
  - `packages/myreact-lynx/src/plugin/apply/entry.ts` — MT packing / loaders when IFR on
  - `packages/myreact-lynx/src/plugin/loaders/worklet-loader-mt.ts` — must not strip app UI when IFR on
  - `packages/myreact-lynx/src/main-thread/entry.ts` — `renderPage` → `runIfrRender`
  - `packages/myreact-lynx/src/background/render/flush.ts` / hydrate intercept
  - `packages/myreact-lynx/src/background/first-screen/*` — handoff reuse
  - `packages/myreact-lynx/FEATURES.md` / `PLUGIN.md` — docs
  - `ui/lynx-example` — optional IFR demo / measurement
- **Not breaking** when `enableIFR` stays default `false` (current empty-`renderPage` behavior preserved).
