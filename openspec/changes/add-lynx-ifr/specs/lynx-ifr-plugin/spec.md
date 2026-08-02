## ADDED Requirements

### Requirement: enableIFR plugin option

`pluginMyReactLynx` SHALL accept an `enableIFR` option. The default value MUST be `false`. When `false`, build and runtime behavior for first paint MUST match the pre-IFR empty-`renderPage` model.

#### Scenario: Default disables IFR

- **WHEN** a project uses `pluginMyReactLynx()` without `enableIFR`
- **THEN** IFR Main Thread app mount is not activated and first content UI waits for Background ops

#### Scenario: Opt-in enables IFR packing and runtime

- **WHEN** a project sets `pluginMyReactLynx({ enableIFR: true })`
- **THEN** the build emits the IFR Main Thread mount path and runtime defines/flags required by the `lynx-ifr` capability

### Requirement: Main Thread packing for IFR true mount

When `enableIFR` is true, the bundler pipeline SHALL include on the Main Thread layer the application UI entry and MyReact reconciler (or equivalent true-mount stack) needed for sync mount inside `renderPage`. The IFR-off pipeline MAY continue to strip Main Thread modules down to worklet registration stitches.

#### Scenario: IFR-on Main Thread retains app mount code

- **WHEN** `enableIFR` is true
- **THEN** Main Thread bundles contain executable application mount code rather than only worklet `registerWorkletInternal` stitches for the UI entry

#### Scenario: IFR-off Main Thread keeps stitch-oriented stripping

- **WHEN** `enableIFR` is false
- **THEN** Main Thread worklet loader behavior for npm/app modules remains the non-IFR strip/stitch model

### Requirement: Document size and sync-data trade-offs

Plugin documentation SHALL state that enabling IFR increases Main Thread bundle size and is intended for content-first screens with synchronous initial data, and SHALL point to side-effect gating for Main Thread IFR mount.

#### Scenario: PLUGIN docs describe enableIFR

- **WHEN** a developer reads the MyReact Lynx plugin guide after this change
- **THEN** they can find `enableIFR`, its default, the true-mount model, and the deferred status of Element Templates
