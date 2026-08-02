# Instant First-Frame (IFR) — runtime / debug map

Opt-in (`pluginMyReactLynx({ enableIFR: true })`, default **false**).  
VueLynx-style **true mount** on Main Thread inside `renderPage`, then Background **ops-stream hydrate**.

> Not the same as first-screen patch meta (`isFirstScreen` / `endFirstScreen`) — those only tag BG→MT worklet handoff.

---

## 1. End-to-end sequence

```
loadTemplate
    │
    ▼
MT module eval
    │  root.render(<App />)  →  stash only (renderer.ts)
    │  register __MY_REACT_LYNX_RUN_IFR_RENDER__
    ▼
renderPage  (main-thread/entry.ts)
    │  __CreatePage, elements[1] = page
    │  beginIfrSession()
    │  registerLocalOpsApplier(recordAndApply)
    │  runIfrRender()  →  flushSync + flushSyncNow
    │       └─ doFlush (local): ref init → ops → delayed runOnMainThread
    │       └─ each ops batch recorded + applyOps (PAPI)
    │  sealIfrSnapshot()     phase: enabled → rendered
    │  DROP_MT_OPS = true    further MT reconciler ops discarded
    │  __FlushElementTree    ← first paint (before BG)
    ▼
BG starts
    │  root.render(<App />)  →  real reconcile
    │  scheduleFlush (microtask) → callLepusMethod('reactPatchUpdate')
    ▼
reactPatchUpdate  (entry.ts)
    │  workletRefInitValues
    │  interceptPatchUpdate(ops)   ← main-thread/ifr.ts
    │     identical batch  → skip apply (dev: hydrate skip)
    │     value diffs      → apply patch ops only
    │     structural miss  → teardown IFR tree + full apply BG (fallback)
    │  delayedRunOnMainThread
    │  endFirstScreen → onFirstScreenPatchFinished
    ▼
phase: hydrated
    │  later updates: normal applyOps (no intercept)
```

**Phases** (`main-thread/ifr.ts`): `inactive` → `enabled` (recording) → `rendered` (sealed, hydrating) → `hydrated`.

---

## 2. File map (where to look)

| Concern | File |
| --- | --- |
| Compile flag / `isIfrMainThread()` | `src/shared/ifr.ts` |
| Stash `root.render` / `runIfrRender` | `src/background/render/renderer.ts` |
| Local apply during sync mount | `src/background/render/local-ops-applier.ts` |
| Flush: local vs Lepus; DROP after seal | `src/background/render/flush.ts` |
| `renderPage` / `reactPatchUpdate` wiring | `src/main-thread/entry.ts` |
| Record / seal / intercept / teardown | `src/main-thread/ifr.ts` |
| Op frame lengths for reconcile | `src/shared/op-arity.ts` |
| MT worklet emit (IFR keeps JS + shared + register) | `src/plugin/loaders/worklet-loader-mt.ts` |
| BG worklet emit (JS only) | `src/plugin/loaders/worklet-loader.ts` |
| Refresh BG-only | `src/plugin/apply/refresh.ts`, `jsx-dev-runtime.js`, `client/` |
| Plugin option | `src/plugin/rsbuild.ts` (`enableIFR` → `__MY_REACT_LYNX_IFR__`) |

---

## 3. Flush paths (easy to confuse)

| Situation | What happens |
| --- | --- |
| IFR sync mount (`localOpsApplier` set) | **Sync** `doFlush`: `workletRefInitValues` → `recordAndApply(ops)` → delayed `runOnMainThread`. No `callLepusMethod`. |
| After `sealIfrSnapshot` on MT | `__MY_REACT_LYNX_IFR_DROP_MT_OPS__` → drain & drop (Suspense must not extend hydrate stream). |
| Normal BG | microtask `scheduleFlush` → `reactPatchUpdate` payload. |

Ordering on MT patch apply must stay: **ref init → ops → delayed worklets** (official ReactLynx order). Local IFR path mirrors that.

---

## 4. Worklet loader: BG vs MT/IFR

| | BG `worklet-loader` | MT IFR `worklet-loader-mt` | MT non-IFR |
| --- | --- | --- | --- |
| No `'main thread'` | pass-through | pass-through (keep exports) | strip to imports |
| Has `'main thread'` | `target: JS` only | `JS` (keep exports) **+** re-attach `with { runtime:'shared' }` imports **+** bare `registerWorkletInternal` | LEPUS stitch only |

**Why shared imports on MT/IFR:** JS transform stubs worklet bodies and drops those imports; registration bodies still call `motionValue` / `animate` / ….  
**Why keep exports:** package re-exports (`PanGesture`, `useMotionValueRefEvent`) must not become “module has no exports”.

---

## 5. HMR / Refresh

- Refresh loader: `issuerLayer: BACKGROUND` only.
- `jsx-dev-runtime.js`: inject refresh runtime only when `__BACKGROUND__`.
- `client/loader-internal.cjs`: skip `forceUpdate` on MT.
- `client/intercept.cjs`: layer id remap only — **does not** refresh on MT.
- Worklet HMR is weak: after editing `'main thread'` code, hard refresh if bindings go stale.

---

## 6. Dev logs (`__DEV__`)

| Log / warn | Meaning |
| --- | --- |
| `[IFR] Main Thread root.render stashed` | MT stash OK; waiting for `renderPage`. |
| `[IFR] Main Thread sync mount sealed — awaiting BG hydrate` | Snapshot sealed. |
| `Background root.render` | BG mount started. |
| `[IFR] hydrate skip identical batch N` | Batch matched; no apply. |
| `[IFR] hydration complete` | All recorded batches consumed. |
| `[IFR] hydration structural mismatch — tearing down…` | Fallback: IFR tree cleared, BG ops win. |
| `[IFR] Dropping Main Thread ops after first-screen snapshot` | Post-seal MT update ignored (often Suspense). |
| `motionValue is not defined` | MT registration missing shared import (loader bug / stale build). |
| `module has no exports` (`PanGesture` / motion re-exports) | MT stitch stripped exports (IFR must keep JS exports). |
| `runOnMainThread timed out` | Often follow-on after MT worklet throw / stale `_wkltId` after HMR. |

---

## 7. Constraints & common pitfalls

1. **Same first screen on MT + BG** (route / init data). Prefer sync data; gate fetches with `isIfrMainThread()`.
2. **Batch granularity:** MT sync flush may record multiple batches; BG microtask may coalesce → mismatch → teardown (expected fallback, possible flash).
3. Navigating to Motion/Gesture after home is **not** IFR first-screen; those pages rely on BG ops + MT worklet registrations.
4. Rebuild `@my-react/react-lynx` after loader/runtime changes; restart rspeedy; hard refresh device/simulator.
5. Element Templates are **not** part of IFR yet.

---

## 8. Quick debug checklist

1. Confirm `enableIFR: true` and define `__MY_REACT_LYNX_IFR__` in bundle.
2. Soft reload → expect stashed → sealed → BG render → hydrate skip/complete (or mismatch warn).
3. If UI blank until BG: IFR path not running (`runIfrRender` missing / `root.render` not module-scope).
4. If flicker then OK: likely structural mismatch fallback — compare first-screen trees / batch counts.
5. Motion/gesture break: check MT bundle still has `registerWorkletInternal` + `!!builtin:swc-loader!…` shared imports for `@lynx-js/motion`.
6. After HMR only: hard refresh before chasing worklet timeouts.

---

## 9. Package layout (no forced restructure)

IFR makes the reconciler run on **both** threads, but the on-disk layout stays entry-oriented:

| Directory | Role (IFR off) | Role (IFR on) |
| --- | --- | --- |
| `src/background/` | Sole reconciler + flush + public API | Same modules also execute on MT during sync mount |
| `src/main-thread/` | PAPI `applyOps` + worklet register | + `ifr.ts` record / seal / hydrate |
| `src/shared/` | op protocol, patch payload | + `ifr.ts` compile-time helpers |
| `src/plugin/` | dual entries, worklet stitch | MT loader adds IFR JS+shared+register branch |

**Naming debt (acceptable for now):** `background/render/{renderer,flush,local-ops-applier}` is not “BG-only” when IFR is on — treat it as **shared reconciler / flush**, living under `background/` because that is still the package’s primary runtime and `exports["."]`.

**Decision:**

- **v1 (now):** do **not** rename/move trees. Document dual-use here; keep `./background` / `./main-thread` package exports stable.
- **Later (optional):** after IFR is stable, extract reconciler+flush to a neutral folder (e.g. `src/runtime/` or `src/reconciler/`) and leave thin `background/entry` + `main-thread/entry`. High churn; defer until needed.

Do **not** split public exports solely for IFR — dual-entry packaging must stay aligned with Lynx layers.

---

## 10. `enableIFR: false` — impact surface (must stay legacy)

Default is **off**. Compile define: `__MY_REACT_LYNX_IFR__ = false`. Off-path must match pre-IFR behavior.

| Gate | Off behavior |
| --- | --- |
| `isIfrEnabled()` / `isIfrMainThread()` | always false |
| `render()` on MT | early `return` (no stash, no container) |
| `__MY_REACT_LYNX_RUN_IFR_RENDER__` | not registered |
| `renderPage` IFR block | skipped → empty page + `__FlushElementTree` only |
| `interceptPatchUpdate` | not called |
| `localOpsApplier` | stays `null` → flush only via `callLepusMethod` |
| `__MY_REACT_LYNX_IFR_DROP_MT_OPS__` | never sealed/set true |
| `worklet-loader-mt` | LEPUS **stitch** path only (no IFR JS keep-body) |
| React Refresh | unchanged (BG `issuerLayer` only; independent of IFR) |

**Residual when off (intentionally tiny):**

- MT entry still imports `main-thread/ifr.ts` and calls `resetIfrState()` on each `renderPage` (idempotent clear).
- Dead IFR branches should DCE under the compile-time define where the bundler allows.

**Regression check:** `pluginMyReactLynx({ enableIFR: false })` (or omit) + lynx-example — first paint only after BG ops; no `[IFR] … sealed` / `hydrate skip` logs; Motion/Gesture/worklets behave as before IFR landed.

**On-path risk surface** (only when `enableIFR: true`): larger MT bundle, deterministic first screen required, hydrate batch mismatch → teardown fallback. That cost must not leak into the off path.
