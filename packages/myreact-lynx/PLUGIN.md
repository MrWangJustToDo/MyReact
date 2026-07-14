# `@my-react/react-lynx` Plugin Guide

Rsbuild / Rspeedy plugin for Lynx dual-thread apps (Background reconciler + Main Thread / LEPUS).

Entry: `pluginMyReactLynx()` from `@my-react/react-lynx/plugin`.

---

## 1. Pipeline (`setup` order)

Order matters — especially thread-defines vs worklet loaders.

```
pluginMyReactLynx.setup
├── modifyRsbuildConfig
│   ├── source.include (compile nm JS + @lynx-js JSX when unset)
│   ├── defines: __DEV__ / __HMR__ / __DEVTOOL__ / auto-pixel
│   └── SWC JSX (importSource=@my-react/react-lynx, throwIfNamespace:false)
├── modifyBundlerChain
│   ├── alias @my-react/react-lynx, @lynx-js/react/internal → shim
│   ├── optional React → MyReact aliases
│   ├── @lynx-js/*.jsx SWC rule
│   └── lynx env: ChunkLoadingWebpackPlugin + chunkLoading:'lynx'
├── applyCSS
├── applyThreadDefines          ← register BEFORE worklet loaders
├── applyEntry                  ← dual entries + template + worklet loaders
├── applyBackgroundOnly
└── applyRefresh (dev)
```

`applyEntry` also wires:

| Piece | Role |
| --- | --- |
| BG entry | user app + `dist/runtime/entry-background.js` |
| MT entry | `entry-main` + `@lynx-js/react/worklet-runtime` + user imports |
| Layers | `LAYERS.BACKGROUND` / `LAYERS.MAIN_THREAD` on entries |
| Worklet loaders | BG JS transform / MT registration stitch (`issuerLayer`) |
| Template plugins | LynxTemplatePlugin, RuntimeWrapper, mark-main-thread |

Rspack 2 enables **module layers by default** (no `experiments.layers`). Same file path becomes two modules, e.g. `(myreact:background)/…` vs `(myreact:main-thread)/…`.

---

## 2. Runtime model (what ships)

```
┌─────────────────────────────┐     patch ops / refs / delayed worklets
│ Background (JS)             │ ──────────────────────────────────────►
│  MyReact reconciler         │
│  worklet contexts {_wkltId} │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Main Thread (LEPUS)         │
│  PAPI applyOps              │
│  registerWorkletInternal    │
│  lynxWorkletImpl._workletMap│
└─────────────────────────────┘
```

Patch order on MT (`reactPatchUpdate`): **ref init → ops → delayed `runOnMainThread`**.

---

## 3. Key invariants (do not break lightly)

### Layers

- Entry sets `layer`; loaders use `issuerLayer`.
- MT stitch may drop npm package exports; BG copy is untouched because layers duplicate modules.

### Worklet transform order

- Both thread-defines and worklet loaders use `enforce: "pre"`.
- **Register `applyThreadDefines` before `applyEntry` (worklet loaders)** so worklet hashing sees unsubstituted `__BACKGROUND__` / `__MAIN_THREAD__`. If macros are substituted first, BG/MT `_wkltId`s diverge → bind / “not registered” failures.

### MT worklet-loader stitch

For app sources and allowlisted npm worklet packages (`WORKLET_NODE_MODULES_PACKAGES` in `worklet-packages.ts`):

1. Keep relative imports (graph walk).
2. Keep allowlisted package imports as side-effect stitches (`import '@lynx-js/motion'`).
3. Run SWC LEPUS transform, then emit **bare** `registerWorkletInternal(...)` only.

**Do not** ship full SWC LEPUS for those npm packages: it gates register with `loadWorkletRuntime() && …`, and `loadWorkletRuntime` returns `false` when `__LoadLepusChunk` is undefined (runtime already bundled in MT entry) → registrations never run.

### Allowlist (internal, not a plugin option)

`gesture-runtime` and `motion` are allowlisted so they:

- pass the `node_modules` exclude on worklet loaders;
- get `sideEffects: true` (packages often declare `sideEffects: false`);
- stay on the MT graph via side-effect stitches after component bodies are stripped.

App code should **import the worklet package directly** (not only via `@my-react/react-lynx` re-exports) when its registration must land on MT. No MT entry force-entry.

### Polyfill / scheduler

- MT/BG bootstrap installs Promise-based `globalThis.queueMicrotask` when missing.
- Do **not** assign `lynx.queueMicrotask` onto `globalThis` (breaks `queueMicrotask.bind(globalThis)` in `@my-react/react`).
- Framework scheduling uses `installLynxScheduler` (call host `lynx.queueMicrotask` with correct `this`).

### SystemInfo

Passthrough `lynx.SystemInfo` only. Do not hardcode `lynxSdkVersion` — hosts differ; worklet-runtime gates rAF on SDK version.

---

## 4. Common issues → cause → fix

| Symptom | Likely cause | What to check / do |
| --- | --- | --- |
| `.bind is not a function` / `reading 'bind'` (cold start) | Worklet id missing from `_workletMap` | MT missed bare `registerWorkletInternal`; package not on MT graph; or full LEPUS guard skipped register. Rebuild plugin; confirm app imports `@lynx-js/gesture-runtime` / `@lynx-js/motion`; hard refresh. |
| Same bind error **after HMR** | BG `_wkltId` changed; MT map still old | Architectural limitation — full refresh (not a loader bug). |
| `delayed runOnMainThread: worklet "…" is not registered` | BG/MT hash mismatch or MT stitch missed file | Thread-defines registered after worklets; or file excluded from MT loader. |
| `BaseGesture` / `module has no exports` on BG | MT empty stitch leaked into BG module identity | Broad nm allowlist + stripping exports without layer isolation historically. Keep layers + MT-only stitch; don’t process all `@lynx-js/*` as worklets. |
| Gesture events dropped (dev warning about `wrapCallback`) | `gesture-runtime` not worklet-transformed on BG | Allowlist / loader exclude; ensure package under `WORKLET_NODE_MODULES_PACKAGES`. |
| `getNativeLynx` / microtask blowups | Bound `lynx.queueMicrotask` on `globalThis` | Use polyfill + `installLynxScheduler`; don’t prepend motion’s BG shim that assigns host microtask globally. |
| iOS indicator / transform no-op | Host inline `transform` / `scaleY` unreliable | Prefer `%` height (or other layout props) for indicators; `styleEffect`+scale still OK for some cases. |
| `ReferenceError: exports` on native | Missing RuntimeWrapper on BG JS | Wrap all `.js` except `main-thread.js`. |
| `__JS__ is not defined` | Prebuilt `@lynx-js/react/internal` | Alias to `shims/lynx-react-internal`. |
| Lazy chunk / CSS / empty `lepusCode` | Dynamic import / chunk naming / MT async | See long notes in `src/plugin/entry.ts` (Issues 1–10). |
| JSX namespace error for `main-thread:…` | SWC `throwIfNamespace` | Keep `false` in plugin SWC config. |
| Worklets “work in web, fail on iOS” | Bundle stale / HMR / host style APIs | Rebuild `@my-react/react-lynx`, restart `dev:lynx`, hard refresh device. |

---

## 5. Debug checklist

1. Rebuild package: `pnpm --filter @my-react/react-lynx build`
2. Restart rspeedy / hard refresh LynxExplorer (worklet HMR is weak).
3. Dev intermediate (when present): `ui/lynx-example/dist/<entry>/main-thread.js` vs `background.js`
   - BG `_wkltId` set ≈ MT `registerWorkletInternal("main-thread", id, …)` set
   - Prefer **zero** `__workletRuntimeLoaded && registerWorkletInternal` on MT
4. Confirm allowlisted packages appear under `(myreact:main-thread)/…` when the screen uses them.
5. For new worklet libraries: extend `WORKLET_NODE_MODULES_PACKAGES` and import that package from app code.

---

## 6. File map

| Path | Responsibility |
| --- | --- |
| `src/plugin/rsbuild.ts` | Plugin options, aliases, SWC, setup order |
| `src/plugin/layers.ts` | Layer name constants + layering notes |
| `src/plugin/entry.ts` | Dual entries, template, worklet loader rules; historical lazy-load issues |
| `src/plugin/worklet-packages.ts` | Builtin allowlist + exclude / sideEffects helpers |
| `src/plugin/loaders/worklet-loader.ts` | BG SWC target=`JS` |
| `src/plugin/loaders/worklet-loader-mt.ts` | MT stitch + bare register |
| `src/plugin/loaders/worklet-utils.ts` | Import / registration extractors |
| `src/plugin/loaders/thread-defines-loader.ts` | `__BACKGROUND__` / `__MAIN_THREAD__` |
| `src/main-thread/entry-main.ts` | MT bootstrap, patch order |
| `src/runtime/entry-background.ts` | BG bootstrap, polyfill, loadLazyBundle |
| `src/shared/lynx-globals-polyfill.ts` | Safe `queueMicrotask` |
| `src/runtime/install-lynx-scheduler.ts` | Framework microTask via host |

Longer lazy-loading narratives live in the file header of `src/plugin/entry.ts`.
