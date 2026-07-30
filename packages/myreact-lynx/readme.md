# `@my-react/react-lynx`

MyReact renderer for Lynx dual-thread architecture (Background reconciler + Main Thread / LEPUS).

## Docs

- **[FEATURES.md](./FEATURES.md)** — feature matrix vs ReactLynx (full set) and VueLynx
- **[PLUGIN.md](./PLUGIN.md)** — plugin pipeline, key invariants (layers / worklets), common failures and causes.

## Package layout

```
src/
  background/     # BG reconciler + public API (package ".")
    entry.ts      # BG bootstrap (export "./background")
    render/       # host config, ops, flush
    worklet/      # MainThreadRef, runOnMainThread / runOnBackground
    first-screen/ # first-screen patch phase (≠ IFR); end flush in render/flush.ts
    data/         # initData / globalProps / data processors
    gesture/      # serialize + useGesture
    lazy/         # loadLazyBundle / dynamic import
  main-thread/    # LEPUS PAPI apply + worklet apply (export "./main-thread")
  plugin/         # Rsbuild plugin (export "./plugin")
    apply/        # entry / css / refresh wiring
    rspack-plugins/
    loaders/
  shared/         # op protocol, patch payload, worklet bindings
  shims/          # @lynx-js/react/internal overrides
```

## Notes

- Dev-tool runtime currently copied from [myreact-devtools](https://github.com/MrWangJustToDo/myreact-devtools); improve later.
- Historical reference: [vue-lynx](https://github.com/Huxpro/vue-lynx).
