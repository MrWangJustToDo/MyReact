## Context

MyReact Lynx is dual-thread and **ops-based** (BG `ShadowElement` → flat ops → MT `applyOps`), matching VueLynx more than ReactLynx Snapshot. Today:

```
loadTemplate → MT renderPage (__CreatePage only) → empty UI
            → BG root.render → scheduleFlush (microtask) → reactPatchUpdate → applyOps → first paint
```

Existing “first-screen” flags (`isFirstScreen` / `endFirstScreen`) tag the **BG→MT patch phase for worklet hydrate**, not Instant First Render. Delayed ops flush (`scheduleFlush` / `scheduleFirstScreenPatchEnd`) batches that path.

VueLynx IFR (v0.5+, `enableIFR`): MT runs full Vue inside `renderPage`, then BG ops hydrate with intercept. Chosen product decision for MyReact: **same model (option A — MT true mount)**, not lightweight fake tree / string SSR.

## Goals / Non-Goals

**Goals:**

- Opt-in IFR: real UI visible from `renderPage` before Background starts.
- MT sync `root.render` (or equivalent) using MyReact reconciler + host config → native elements.
- BG first commit hydrates / intercepts so the IFR tree is not destroyed by a full CREATE replay.
- Keep microtask `scheduleFlush` for incremental updates after handoff.
- Reuse first-screen worklet lifecycle markers as hydrate/handoff completion signals where possible.
- Default off; document size and sync-data constraints.

**Non-Goals (this change):**

- ReactLynx Snapshot IFR / compile-time snapshot pipeline.
- Element Templates (`INSTANTIATE_TEMPLATE`) — follow-up optimization (Vue often pairs ET with IFR; we defer).
- Making IFR default-on.
- `firstScreenSyncTiming` / SSR / `lynx.fetchBundle`-only lazy redesign.
- Changing non-IFR empty-`renderPage` behavior.

## Decisions

### Decision 1: Vue-style MT true mount (option A), not SSR-string or skeleton tree

**Choice:** Pack reconciler + app on MT; `renderPage` calls sync mount that builds real Lynx nodes via PAPI/host config.

**Alternatives considered:**

1. **Lightweight / skeleton MT tree + BG hydrate** — smaller bundle, lower fidelity, dual build rules, easy flicker.
2. **MT `renderToString`-like serialization then apply** — SSR-shaped, extra format, worse fidelity than true mount.
3. **ReactLynx Snapshot IFR** — fights `snapshot: false` worklet pipeline; huge rewrite.

**Rationale:** Best first-frame fidelity and one semantic model; cost is MT bundle size (acceptable behind `enableIFR`).

### Decision 2: Delayed ops flush stays; IFR plugs in *before* it

**Choice:** Do **not** replace `scheduleFlush` with IFR. Sequence:

```
[IFR on]  renderPage → MT sync mount → FlushElementTree   // first paint
          BG starts → root.render → first flush → hydrate/intercept → handoff end
          later commits → scheduleFlush as today
[IFR off] unchanged empty renderPage → BG → scheduleFlush → first paint
```

**Rationale:** Delayed flush is orthogonal batching. Naive first BG flush **conflicts** with IFR unless intercept exists; with intercept, flush remains the common incremental pipeline.

### Decision 3: Reuse first-screen patch meta for handoff, do not rename to “IFR” in v1

**Choice:** Keep `isFirstScreen` / `endFirstScreen` / `onFirstScreenPatchFinished` as the worklet hydrate + “BG has caught up” signal. IFR-specific APIs (e.g. `isIfrMainThread()`) are additive.

**Rationale:** Avoid a breaking rename; docs already say first-screen ≠ IFR — clarify that under IFR these markers mean **hydrate/handoff**, under non-IFR they mean **first content patch phase**.

### Decision 4: Hydrate = VueLynx ops-stream reconcile (not always-replace)

**Choice:** Record MT first-screen ops batches; seal after sync mount; BG batches go through `interceptPatchUpdate` (identical skip / value patch / structural teardown fallback). Post-seal MT ops are dropped.

**Alternatives:** Always tear down IFR tree on BG arrival (safe but flashes; not Vue). Skip CREATE/INSERT by id only (broke on Suspense/lazy drift).

**Rationale:** Matches `vue-lynx/main-thread/ifr.ts`. Requires deterministic same-page first screen on both threads (SSR-like).

**Implemented debug map:** `packages/myreact-lynx/IFR.md` (sequence, file map, flush/worklet/HMR, checklist).

### Decision 5: Plugin default `enableIFR: false`; ET deferred

**Choice:** Match VueLynx defaults. Element Templates are a separate follow-up change to reduce MT sync cost once IFR works.

## Risks / Trade-offs

| Risk | Mitigation |
| --- | --- |
| MT bundle size / Lepus startup | Opt-in only; document measurement; ET later |
| First BG flush double-creates or flickers | Mandatory hydrate intercept before enabling demos |
| Async `React.lazy` on IFR path hangs / incomplete frame | Require sync-resolvable lazy (`loadLazyBundleSync` / sync-then) or Suspense fallback for IFR first screen |
| Worklet/gesture double-bind | Single handoff through `endFirstScreen` → `onFirstScreenPatchFinished`; audit SET_WORKLET_EVENT / gestures |
| MT loader strips component bodies today | IFR build path must keep app + reconciler on MT (loader/layer fork) |
| Side effects / network on MT mount | Provide `isIfrMainThread()` (or define) and docs to gate fetches |

## Migration Plan

1. Ship with `enableIFR: false` — no behavior change.
2. Apps opt in via `pluginMyReactLynx({ enableIFR: true })`.
3. Validate content-first screens with sync init data; measure FCP vs bundle.
4. Rollback = turn flag off (no protocol migration required for non-IFR apps).

## Open Questions

- Exact id-stability strategy between MT IFR mount and BG first ops (shared id allocator vs remap table) — resolve in implementation spike, document in code + FEATURES.
- Whether IFR MT mount shares one host-config module with BG or a MT-trimmed variant — prefer shared for fidelity; trim only if Lepus limits force it.
