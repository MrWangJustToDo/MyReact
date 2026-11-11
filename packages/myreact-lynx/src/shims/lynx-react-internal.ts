/* eslint-disable import/export -- intentional re-export overrides */
/**
 * Shim for @lynx-js/react/internal
 *
 * Re-exports everything from the original module but overrides loadLazyBundle
 * and __dynamicImport with our MyReact-compatible implementations.
 *
 * `captureMainThreadObject` is implemented by the MyReact MainThreadObject
 * module so handles created by `useMainThreadObject` are recognized.
 */

// Re-export everything from the original module
export * from "@lynx-js/react/internal";

export { captureMainThreadObject } from "../background/worklet/main-thread-object.js";

// Override loadLazyBundle with our implementation
export { loadLazyBundle, makeSyncThen } from "../background/lazy/lazy-bundle.js";

// Override __dynamicImport with our implementation
export { __dynamicImport, loadDynamicJS } from "../background/lazy/dynamic-import.js";
