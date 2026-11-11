/**
 * Main-thread API entry (worklet-only facade).
 *
 * The MT layer must never resolve the package root: `dist/background/index.js`
 * owns the reconciler, renderer, devtool and background-only hooks.  Resolving
 * that barrel from a `'main thread'` module (including transform-injected
 * imports such as `captureMainThreadObject`) pulls the whole background graph
 * into `main-thread.js`.
 *
 * Keep this file limited to APIs that are meaningful while running on MT:
 * - MainThreadObject helpers used by transformed worklet captures
 * - `runOnBackground`
 * - Lynx worklet runtime accessors
 *
 * Do **not** re-export `root`, `render`, `reconciler`, `createPortal`, or
 * background hooks here.  IFR keeps its own entry because it intentionally
 * runs a main-thread root.
 *
 * @see packages/myreact-lynx/PLUGIN.md § Main-thread entry isolation
 */

export { captureMainThreadObject } from "../background/worklet/main-thread-object.js";
export { getLynxWorkletImpl } from "../shared/lynx-worklet-impl.js";

export { registerMainThreadObjectType } from "@lynx-js/react/worklet-runtime/bindings";
export { runOnBackground } from "./run-on-background.js";
