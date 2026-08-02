# Lynx Framework Feature Matrix

Careful comparison of **ReactLynx** (official full set), **VueLynx**, and **MyReact Lynx**.

| | Meaning |
| --- | --- |
| ✅ | Supported in tree (may still need a plugin flag) |
| ◐ | Partial / stub / different mechanism / known gaps |
| ❌ | Not present |
| — | Not applicable to that framework |

## Source pins (re-audited)

| Tree | Path | Commit | Package version |
| --- | --- | --- | --- |
| ReactLynx | `tmp/lynx-family-lynx-stack` | `c1136da` (2026-07-30) | `@lynx-js/react` **0.123.1** |
| VueLynx | `tmp/Huxpro-vue-lynx` | `c17c3f7` (2026-07-30) | `vue-lynx` **0.5.1** |
| MyReact Lynx | `packages/myreact-lynx` | workspace | `@my-react/react-lynx` **0.0.9** |

Evidence is from these trees’ runtime + plugin source (not docs alone).

MyReact package layout: see [`readme.md`](./readme.md) (`background/` / `main-thread/` / `plugin/` / `shared/`).

Interactive demos for supported APIs: [`ui/lynx-example`](../../ui/lynx-example) (home hub → Gesture / Motion / Events / List / Data / Portal / CSS).

---

## Architecture (read this first)

| | How UI crosses threads | First paint |
| --- | --- | --- |
| **ReactLynx** | Compile-time **Snapshot** (default). BG commits become snapshot patches. Optional alternate backend: **Element Template** (`experimental_useElementTemplate` → `__CreateElementTemplate`). | **IFR always** on default path: MT `renderPage` → `renderMainThread()` builds real FiberElements before BG runs (`snapshot/lifecycle/render.ts`: “Implements the IFR…”). |
| **VueLynx** | BG **ShadowElement** + flat **ops** → MT `ops-apply`. Optional **Element Templates** as `INSTANTIATE_TEMPLATE` ops (JS `create()` skeleton — **not** the same as ReactLynx’s `__CreateElementTemplate` PAPI). | **IFR opt-in** (`enableIFR: true`): MT carries full Vue + app; `runIfrRender()` inside `renderPage`. Default off → empty page until BG ops (same shape as MyReact). |
| **MyReact Lynx** | BG **ShadowElement** + ops (Vue-like). Worklet SWC forces `snapshot: false`. | **IFR opt-in** (`enableIFR`, default **false**): MT sync `root.render` true mount + BG hydrate intercept. Off → empty page until BG ops (legacy). |

```
ReactLynx:  loadTemplate → MT Snapshot/ET tree (real UI) → BG hydrate → patches
VueLynx:    loadTemplate → [IFR?] MT Vue mount : empty page → BG ops (+ IFR hydrate intercept)
MyReact:    loadTemplate → [IFR?] MT sync mount : empty page → BG ops (+ IFR hydrate) → scheduleFlush
```

**Glossary (do not conflate):**

| Term | Meaning |
| --- | --- |
| **IFR** | Real UI in MT `renderPage` before Background (`enableIFR`) |
| **First-screen patch meta** | `isFirstScreen` / `endFirstScreen` — BG→MT worklet hydrate / handoff |
| **Delayed ops flush** | `scheduleFlush` microtask batching (orthogonal; kept after IFR) |

**Id stability (IFR):** Both threads must render the same deterministic first screen (same route/data). MT records ops; BG batches reconcile (skip / value-patch / structural teardown fallback). Post-seal MT Suspense updates are dropped.

**Debug map:** [IFR.md](./IFR.md) (sequence, phases, flush/worklet/HMR, checklist).

---

## 1. Dual-thread & build

| Feature | ReactLynx | VueLynx | MyReact | Notes |
| --- | :---: | :---: | :---: | --- |
| Dual-thread BG + MT | ✅ | ✅ | ✅ | All use Lynx Lepus + BG JS |
| Module layers + dual entries | ✅ `react:*` | ✅ `vue:*` | ✅ `myreact:*` | Rspack layers |
| Thread defines / DCE | ✅ | ✅ | ✅ | `__MAIN_THREAD__` / `__BACKGROUND__` |
| Rspeedy / Rsbuild plugin | ✅ `pluginReactLynx` | ✅ `pluginVueLynx` | ✅ `pluginMyReactLynx` | |
| `background-only` package alias | ✅ | ◐ / ❌ | ✅ | MyReact has `applyBackgroundOnly`; Vue not verified as first-class |
| `"background only"` / lepus-only directives | ✅ | ◐ | ◐ | ReactLynx has full directive DCE |

---

## 2. Instant First-Frame & templates

| Feature | ReactLynx | VueLynx | MyReact | Notes |
| --- | :---: | :---: | :---: | --- |
| IFR (real UI before BG) | ✅ | ✅ opt-in | ✅ opt-in | RL: Snapshot. VL/MR: `enableIFR` (default **false**). MR: Vue-style true mount |
| Compiled Snapshot / JSX→snapshot | ✅ **default** | ❌ | ❌ | MR/VL deliberately ops-based |
| Element Templates | ◐ experimental | ✅ opt-in | ❌ | **Deferred** for MR (follow-up after IFR) |
| First-screen hydrate / handoff | ✅ | ✅ with IFR | ✅ with IFR | MR: Vue-style ops-stream hydrate; teardown only on structural mismatch |
| First-screen worklet lifecycle flags | ✅ | ◐ | ✅ | MR: `isFirstScreen` / `endFirstScreen` patch meta (≠ IFR) |
| `firstScreenSyncTiming` + `markFirstScreenSyncReady` | ✅ | ❌ | ❌ | RL: `immediately` \| `jsReady` \| `manual` |
| `isIfrMainThread()` | — | ✅ | ✅ | Gate network on MT IFR mount |
| SSR (`enableSSR` / opcodes) | ✅ | ❌ | ❌ | |

**Element Templates are not interchangeable**

| | ReactLynx ET | VueLynx ET |
| --- | --- | --- |
| Flag | `experimental_useElementTemplate` (default **false**) | `enableElementTemplates` (defaults to `enableIFR`) |
| Runtime | `__CreateElementTemplate` native PAPI | `INSTANTIATE_TEMPLATE` op + JS template `create()` |
| Role | Alternate compile/runtime backend to Snapshot | Speeds ops path (esp. IFR sync cost) |

---

## 3. Main Thread Script / worklets

| Feature | ReactLynx | VueLynx | MyReact | Notes |
| --- | :---: | :---: | :---: | --- |
| `'main thread'` + SWC worklet | ✅ | ✅ | ✅ | |
| `runOnMainThread` | ✅ | ✅ | ✅ | |
| `runOnBackground` | ✅ | ✅ | ✅ | |
| `useMainThreadRef` / `MainThreadRef` | ✅ | ✅ | ✅ | |
| `with { runtime: 'shared' }` | ✅ | ✅ | ✅ | |
| Worklet HMR without full reload | ❌ stubbed | ◐ | ❌ | Hash/`_wkltId` stale map class of bug |
| npm worklet package allowlist | ◐ | ✅ `includeWorkletPackages` | ✅ `includeWorkletPackages` | MR defaults: `gesture-runtime` + `motion`; user packages merge on |

---

## 4. Gestures & motion

| Feature | ReactLynx | VueLynx | MyReact | Notes |
| --- | :---: | :---: | :---: | --- |
| Native gesture attr pipeline | ✅ | ❌ | ✅ | RL: `processGesture` in snapshot; template `enableNewGesture` |
| `enableNewGesture` default | **false** | **false** (hardcoded) | **true** (template) | RL users must opt in |
| `@lynx-js/gesture-runtime` / `useGesture` | ✅ sibling pkg | ❌ | ✅ re-export + `useGesture` | Package lives under `packages/lynx/gesture-runtime` in lynx-stack |
| `@lynx-js/motion` | ✅ sibling | ◐ via MTS + allowlist | ✅ allowlisted | VL docs mention `@vue-lynx/motion-mini` pattern |
| Hand-rolled MTS gestures | ✅ | ✅ | ✅ | |

---

## 5. CSS

| Feature | ReactLynx | VueLynx | MyReact | Notes |
| --- | :---: | :---: | :---: | --- |
| `enableCSSSelector` | ✅ | ✅ | ✅ | default true |
| `enableCSSInheritance` + custom list | ✅ | ✅ | ✅ | |
| CSS invalidation | ✅ explicit option | ◐ = selector | ◐ = selector | VL/MR set `enableCSSInvalidation: enableCSSSelector` |
| `enableRemoveCSSScope` | ✅ | ❌ / undocumented | ❌ / undocumented | RL-specific scoping control |
| Inline CSS variables option | ◐ via serializer | ✅ `enableCSSInlineVariables` | ✅ same | |
| CSS HMR | ✅ | ✅ native (not web env) | ✅ | |
| SFC scoped / `:deep` | — | ◐ gaps | — | Vue scoped limitations |

---

## 6. Events & refs

| Feature | ReactLynx | VueLynx | MyReact | Notes |
| --- | :---: | :---: | :---: | --- |
| `bind*` / `catch*` / `global-bind*` | ✅ | ✅ | ✅ | |
| `main-thread:bind*` worklet events | ✅ | ✅ | ✅ | |
| BG element ref / selector query | ✅ `NodesRef` | ✅ ShadowElement | ✅ ShadowElement | |
| `main-thread:ref` | ✅ | ✅ | ✅ | |
| `createPortal` | ✅ | — (`Teleport`) | ✅ | Vue: `<Teleport to="#id">` only |

---

## 7. List

| Feature | ReactLynx | VueLynx | MyReact | Notes |
| --- | :---: | :---: | :---: | --- |
| Native `<list>` / `<list-item>` | ✅ | ✅ | ✅ | `__CreateList` + `componentAtIndex` |
| `item-key` / `reuse-identifier` | ✅ | ✅ | ✅ | platform-info attrs |
| Cell **recycle pool** (`enqueueComponent` real) | ✅ `gRecycleMap` | ◐ **noop** enqueue | ◐ **noop** enqueue | VL/MR attach callbacks but `enqueueComponent = noop` |
| `defer` / DeferredListItem compile | ✅ | ❌ / undocumented | ❌ / undocumented | RL-only |

---

## 8. Data & app APIs

| Feature | ReactLynx | VueLynx | MyReact | Notes |
| --- | :---: | :---: | :---: | --- |
| `processData` Lepus hook | ✅ | ◐ passthrough stub | ✅ | VL comment: “no data processors” |
| `registerDataProcessors` / named processors | ✅ | ❌ | ✅ | |
| `useInitData` / `useInitDataChanged` | ✅ | ❌ | ✅ | |
| `withInitDataInState` | ✅ | — | ✅ | |
| `useGlobalProps` / changed | ✅ | ❌ | ✅ | |
| Framework ecosystem | React | Vue Router / Pinia / Query | React + MyReact | |

---

## 9. Code split / HMR / DevTools / test

| Feature | ReactLynx | VueLynx | MyReact | Notes |
| --- | :---: | :---: | :---: | --- |
| Lazy / Suspense | ✅ Lynx-adapted | ✅ Vue Suspense / async | ✅ `React.lazy` + Suspense | |
| Standalone lazy bundle + `lynx.fetchBundle` | ✅ | ❌ | ◐ standard chunks only | RL: `experimental_isLazyBundle` |
| `__dynamicImport` transform | ✅ | — | ❌ off on purpose | MR uses webpack dynamic import |
| Component HMR / Refresh | ✅ | ✅ | ✅ | |
| Framework DevTools | ✅ | ◐ `__VUE_PROD_DEVTOOLS__` + Lynx DevTool | ◐ myreact-devtools WS | |
| Official testing-library package | ✅ | ✅ `packages/testing-library` | ❌ | |

---

## 10. Plugin options (high-signal)

| Option | ReactLynx | VueLynx | MyReact |
| --- | :---: | :---: | :---: |
| CSS engine flags | ✅ rich | ✅ | ✅ |
| IFR toggle | — (Snapshot IFR always) | ✅ `enableIFR` | ✅ `enableIFR` (default false) |
| Element Templates | ✅ experimental | ✅ (follows IFR) | ❌ deferred |
| `firstScreenSyncTiming` / SSR | ✅ | ❌ | ❌ |
| `enableNewGesture` | ✅ default false | hardcoded false | hardcoded true |
| Worklet package include | ◐ | ✅ `includeWorkletPackages` | ✅ merge onto defaults |
| Compat / shake / extractStr / optimizeBundleSize | ✅ | — | ❌ |
| React→MyReact aliases | — | — | ✅ |

---

## Corrected takeaways (vs earlier draft)

1. **List recycle**: MyReact is **not** ahead of Vue — both use **noop** `enqueueComponent`. Only ReactLynx has a real recycle map.  
2. **Gestures**: ReactLynx has the full pipeline but **defaults `enableNewGesture: false`**; MyReact forces **true** and re-exports the runtime. Vue has **no** gesture-runtime integration.  
3. **Element Templates**: Vue ✅ and React ◐ are **different mechanisms**; do not treat as the same feature.  
4. **IFR**: ReactLynx = always (Snapshot). VueLynx = opt-in since 0.5. MyReact = opt-in `enableIFR` (true mount); first-screen **patch flags ≠ IFR**.  
5. **initData**: MyReact ≈ ReactLynx API surface; Vue only stubs `processData`.  
6. Package version: MyReact Lynx is **0.0.9**.

---

## Gaps vs ReactLynx (MyReact priority)

| Priority | Gap |
| --- | --- |
| P0 | **IFR** (Snapshot path and/or Vue-style MT sync render) |
| P0 | Decide ET strategy (RL PAPI vs Vue `INSTANTIATE_TEMPLATE`) if pursuing IFR |
| P1 | List **recycle pool** (replace noop `enqueueComponent`) |
| P1 | SSR / `firstScreenSyncTiming` if host needs it |
| P2 | Standalone lazy bundle / `fetchBundle` |
| P2 | DevTools + testing-library |
| P3 | Worklet HMR (unsolved in all three) |

```
ReactLynx 0.123 = Snapshot IFR (default) + optional ET backend + fullest Lynx React surface
VueLynx   0.5.1 = Ops + opt-in IFR/ET − gesture API − initData − real list recycle
MyReact   0.0.9 = Ops + gestures/initData + opt-in IFR − Snapshot/ET − real list recycle
```

Refresh:

```bash
git -C tmp/lynx-family-lynx-stack pull --ff-only origin main
git -C tmp/Huxpro-vue-lynx pull --ff-only origin main
```
