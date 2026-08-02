/**
 * Bundle registry for lazy component CSS scoping.
 *
 * In Lynx, CSS from lazy bundles is scoped using the `l-e-name` attribute.
 * Elements created from lazy components must have this attribute set to
 * the bundle URL for CSS selectors to match.
 *
 * The scoping flow:
 * 1. `loadLazyBundle(url)` registers all chunk moduleIds with the bundleUrl
 * 2. scope-inject-loader reads scope from registry using `__webpack_module__.id`
 * 3. Sets `Component.defaultProps.__lynxScope = bundleUrl`
 * 4. When component renders, `pathHostContext` reads `__lynxScope` from props
 * 5. All child elements inherit scope via host context
 * 6. `createInstance` includes scope in CREATE ops
 * 7. Main thread uses scope in `__SetCSSId(el, 0, scope)`
 */

/**
 * Get the scope registry (moduleId -> bundleUrl map).
 */
function getRegistry(): Record<string, string> {
  if (!globalThis.__MYREACT_LYNX_SCOPE_REGISTRY__) {
    globalThis.__MYREACT_LYNX_SCOPE_REGISTRY__ = {};
  }
  return globalThis.__MYREACT_LYNX_SCOPE_REGISTRY__;
}

/**
 * Register a module's bundle URL.
 * Called by loadLazyBundle when a chunk loads.
 */
export function registerModuleScope(moduleId: string, bundleUrl: string): void {
  getRegistry()[moduleId] = bundleUrl;
}

/**
 * Get the bundle URL for a module.
 * Called by scope-inject-loader's injected code.
 */
export function getModuleScope(moduleId: string): string | undefined {
  return getRegistry()[moduleId];
}

/**
 * Internal prop name for passing scope through element tree.
 * Set by scope-inject-loader on lazy component's defaultProps.
 * Read by reconciler's getChildHostContext.
 */
export const SCOPE_PROP = "__lynxScope";
