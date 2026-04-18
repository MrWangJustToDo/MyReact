/**
 * Background Thread bootstrap entry.
 *
 * Lynx routes native events via lynxCoreInject.tt.publishEvent (not
 * globalThis.publishEvent), so we must assign to both to cover all versions.
 */

import { publishEvent } from "./event-registry.js";
import { loadLazyBundle } from "./lazy-bundle.js";

// `lynxCoreInject` is injected by RuntimeWrapperWebpackPlugin as a parameter
// of the outer __init_card_bundle__ function – it is available as a bare
// identifier inside every module that runs in the AMD callback.
// eslint-disable-next-line no-var
declare var lynxCoreInject:
  | {
      tt?: {
        publishEvent?: (handlerName: string, data: unknown) => void;
        [key: string]: unknown;
      };
    }
  | null
  | undefined;

const g = globalThis as Record<string, unknown>;

// Set runtime thread identification globals
// These can be used for runtime checks when compile-time defines aren't available
g["__BACKGROUND_RUNTIME__"] = true;
g["__MAIN_THREAD_RUNTIME__"] = false;

// Register loadLazyBundle on lynx global BEFORE any chunk loading happens
// This is required for React.lazy() with dynamic imports to work
// The chunk loading runtime uses lynx.loadLazyBundle() to load async template bundles
if (typeof lynx !== "undefined") {
  (lynx as unknown as { loadLazyBundle: typeof loadLazyBundle }).loadLazyBundle = loadLazyBundle;
}

// Primary path: lynxCoreInject.tt.publishEvent (used by modern Lynx)
if (typeof lynxCoreInject !== "undefined" && lynxCoreInject?.tt) {
  lynxCoreInject.tt.publishEvent = publishEvent;
  lynxCoreInject.tt["publicComponentEvent"] = (_cid: string, sign: string, data: unknown) => {
    publishEvent(sign, data);
  };
}

// Fallback: some older Lynx SDKs call globalThis.publishEvent directly
g["publishEvent"] = publishEvent;

g["updatePage"] = function (_data: unknown): void {
  console.log("updatePage", _data);
  // no-op for MVP
};
