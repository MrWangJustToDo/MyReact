## 1. Spec lock-in & docs baseline

- [x] 1.1 Align `FEATURES.md` / `PLUGIN.md` glossary: IFR vs first-screen patch vs delayed flush
- [x] 1.2 Record `enableIFR` default `false` and option-A (MT true mount) in PLUGIN option table
- [x] 1.3 Spike note: MT/BG element id stability approach (shared allocator vs remap)

## 2. Plugin / build (`lynx-ifr-plugin`)

- [x] 2.1 Add `enableIFR?: boolean` to `PluginMyReactLynxOptions` (default `false`)
- [x] 2.2 When `enableIFR`, thread define / flag for runtime (`__MY_REACT_LYNX_IFR__` or equivalent)
- [x] 2.3 IFR MT packing: keep app entry + reconciler on main-thread graph (fork or bypass strip-only worklet-loader-mt for UI modules)
- [x] 2.4 Ensure non-IFR path unchanged (empty `renderPage`, strip stitches as today)
- [x] 2.5 Export/document `isIfrMainThread()` (or documented define) for gating network/side effects

## 3. MT runtime (`lynx-ifr`)

- [x] 3.1 Implement `runIfrRender` (name flexible) invoked from `renderPage` after `__CreatePage` when IFR on
- [x] 3.2 Sync MyReact mount on MT producing real elements + `__FlushElementTree` before BG
- [x] 3.3 MT IFR mount MUST NOT depend on Background `reactPatchUpdate` for first paint
- [x] 3.4 Lazy on IFR first screen: sync-then / `__QueryComponent` path or Suspense fallback only — document unsupported async-only lazy

## 4. BG hydrate / intercept (`lynx-ifr`)

- [x] 4.1 Detect IFR session on BG (define/flag from plugin)
- [x] 4.2 First patches: Vue-style ops-stream hydrate (`interceptPatchUpdate`); structural mismatch → teardown fallback only
- [x] 4.3 Preserve `scheduleFlush` microtask batching for post-handoff commits
- [x] 4.4 Wire handoff completion through existing `endFirstScreen` → `onFirstScreenPatchFinished` (worklets/gestures once)
- [x] 4.5 Audit worklet/gesture double-registration under IFR + hydrate

## 5. Validation

- [x] 5.1 Unit/integration: IFR off — behavior snapshot matches pre-change empty first paint
- [x] 5.2 IFR on — MT `renderPage` yields non-empty tree before any BG patch
- [x] 5.3 IFR on — first BG flush does not duplicate-create root children (intercept)
- [x] 5.4 `ui/lynx-example` optional flag path or small IFR fixture; measure/notes for bundle size
- [x] 5.5 Rebuild `@my-react/react-lynx` and smoke lynx + web env

## 6. Follow-ups (out of this change — track only)

- [ ] 6.1 Element Templates change (separate OpenSpec) once IFR stable
- [ ] 6.2 Consider default-on only after ecosystem measurement (not in v1)
