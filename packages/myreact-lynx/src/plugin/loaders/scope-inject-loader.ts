/**
 * Scope injection loader for lazy component CSS scoping.
 *
 * This loader transforms modules to inject `__lynxScope` into all exported
 * components' `defaultProps`. This enables CSS scoping via the `pathHostContext`
 * mechanism in the reconciler.
 *
 * The flow:
 * 1. Registry is populated with moduleId -> bundleUrl mappings (by loadLazyBundle)
 * 2. Chunk code evaluates (this loader's injected code runs)
 * 3. Injected code reads bundleUrl from registry using __webpack_module__.id
 * 4. Injected code sets `defaultProps.__lynxScope` on all exported functions
 * 5. The reconciler's `pathHostContext` reads `__lynxScope` from props
 * 6. All child elements inherit the scope via host context
 */

import type { Rspack } from "@rsbuild/core";

const SCOPE_PROP = "__lynxScope";
const REGISTRY_KEY = "__MYREACT_LYNX_SCOPE_REGISTRY__";

export default function scopeInjectLoader(this: Rspack.LoaderContext, source: string): string {
  // Only process files that have a default export (likely components)
  if (!source.includes("export default") && !source.includes("export { default")) {
    return source;
  }

  // Skip if already processed
  if (source.includes("__MYREACT_SCOPE_INJECTED__")) {
    return source;
  }

  // Inject scope assignment at the end of the module
  // This runs when the module evaluates
  const injection = `
;(function __injectScope__() {
  // Marker to prevent double injection
  var __MYREACT_SCOPE_INJECTED__ = true;

  var getExports = (m) => m.exports || m.__proto__.exports;

  var _g = typeof globalThis !== "undefined" ? globalThis : {};
  var _moduleId = typeof __webpack_module__ !== "undefined" ? __webpack_module__.id : null;
  
  // Get scope from registry using module.id
  var _registry = _g["${REGISTRY_KEY}"];
  var _scope = _registry && _moduleId && _registry[_moduleId];

  if (_scope) {
    // Get the default export and inject scope into defaultProps
    var _all = getExports(module);

    for (let key in _all) {
      var item = _all[key];
      if (item && typeof item === "function") {
        item.defaultProps = item.defaultProps || {};
        item.defaultProps["${SCOPE_PROP}"] = _scope;
      }
    }
  }
})();
`;

  return source + injection;
}

export const raw = false;
