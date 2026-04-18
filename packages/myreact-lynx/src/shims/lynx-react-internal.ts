/* eslint-disable import/export */
/**
 * Shim for @lynx-js/react/internal
 *
 * Re-exports everything from the original module but overrides loadLazyBundle
 * and __dynamicImport with our MyReact-compatible implementations.
 */

// Re-export everything from the original module
export * from "@lynx-js/react/internal";

// Override loadLazyBundle with our implementation
export { loadLazyBundle, makeSyncThen } from "../runtime/lazy-bundle.js";

// Override __dynamicImport with our implementation
export { __dynamicImport, loadDynamicJS } from "../runtime/dynamic-import.js";
