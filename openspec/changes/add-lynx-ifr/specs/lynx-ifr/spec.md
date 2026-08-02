## ADDED Requirements

### Requirement: Instant First-Frame via Main Thread sync mount

The Lynx runtime SHALL, when IFR is enabled, produce a real Lynx element tree during Main Thread `renderPage` by synchronously mounting the application with the MyReact reconciler (true mount), and SHALL flush that tree to the host before Background JavaScript begins driving UI. This path MUST NOT be implemented as HTML/`renderToString` serialization.

#### Scenario: IFR first paint before Background

- **WHEN** IFR is enabled and the host invokes Main Thread `renderPage`
- **THEN** the page root contains application UI from a sync MyReact mount and the element tree is flushed before any Background `reactPatchUpdate` applies content ops

#### Scenario: IFR disabled keeps empty renderPage shell

- **WHEN** IFR is disabled (default)
- **THEN** `renderPage` only creates the page shell (as today) and first content UI appears only after Background ops are applied

### Requirement: Background hydrate intercept after IFR

When IFR produced a Main Thread tree, the Background first patch pipeline SHALL hydrate against the recorded Main Thread first-screen ops stream (identical batches skipped, value diffs patched, structural mismatch may tear down and apply Background ops). Incremental updates after handoff SHALL continue to use the existing ops flush path.

#### Scenario: First Background patch does not double-create IFR tree

- **WHEN** IFR is enabled and Background commits its first UI patch
- **THEN** the Main Thread apply path attaches/hydrates onto existing elements rather than creating a duplicate parallel tree for the same structure

#### Scenario: Post-handoff updates use delayed ops flush

- **WHEN** IFR handoff has completed and Background commits a later update
- **THEN** ops are still batched through the microtask `scheduleFlush` → `reactPatchUpdate` pipeline

### Requirement: First-screen worklet lifecycle remains the handoff signal

The system SHALL continue to use first-screen patch metadata (`isFirstScreen` / `endFirstScreen` and `onFirstScreenPatchFinished`) as the worklet/gesture hydrate and handoff completion signal under IFR. These markers MUST NOT be documented as Instant First-Frame Rendering itself.

#### Scenario: Handoff completes worklet first-screen phase once

- **WHEN** IFR is enabled and Background finishes the hydrate/handoff patch marked with `endFirstScreen`
- **THEN** Main Thread runs first-screen worklet finish hooks once without requiring a separate IFR-only worklet protocol in v1

### Requirement: IFR first-screen lazy constraints

Under IFR, first-screen lazy boundaries that must resolve during Main Thread sync mount SHALL use sync-resolvable loading (`__QueryComponent` / sync-then) or render a Suspense fallback. The runtime MUST NOT require Background-only async chunk completion to finish the IFR first frame.

#### Scenario: Sync-resolvable lazy on IFR mount

- **WHEN** IFR mount encounters a lazy boundary that resolves synchronously on Main Thread
- **THEN** the resolved content may appear in the IFR tree before Background starts

### Requirement: Side-effect gating helper for IFR Main Thread

The package SHALL provide a documented way for application code to detect IFR Main Thread mount (for example `isIfrMainThread()` or a compile-time define) so network and impure side effects can be skipped or deferred during sync IFR render.

#### Scenario: App skips fetch during IFR Main Thread mount

- **WHEN** application code checks the IFR Main Thread detector during sync mount
- **THEN** it can avoid starting Background-oriented network requests on the Main Thread IFR path
