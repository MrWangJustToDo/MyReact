/**
 * Lazy bundle loading for MyReact Lynx.
 *
 * This provides a MyReact-compatible implementation of loadLazyBundle
 * that works with Lynx's dynamic component loading system.
 *
 * For CSS scoping:
 * 1. loadLazyBundle registers moduleId -> bundleUrl in registry
 * 2. scope-inject-loader reads scope from registry using __webpack_module__.id
 * 3. Loader sets `defaultProps.__lynxScope` on the component
 */

import { loadLazyBundleSync } from "../shared/load-lazy-bundle-sync.js";
import { makeSyncThen } from "../shared/make-sync-then.js";

import { registerModuleScope } from "./bundle-registry.js";

import type { ComponentType } from "@my-react/react";

export { makeSyncThen };

interface SyncResolver<T> {
  result: T | null;
  error: Error | null;
  resolve(result: T): void;
  reject(error: Error): void;
}

function withSyncResolvers<T>(): SyncResolver<T> {
  const resolver: SyncResolver<T> = {
    resolve: (result: T): void => {
      resolver.result = result;
    },
    reject: (error: Error): void => {
      resolver.error = error;
    },
    result: null,
    error: null,
  };

  return resolver;
}

// eslint-disable-next-line no-var
declare var lynxCoreInject:
  | {
      tt?: {
        getDynamicComponentExports?: (schema: string) => unknown;
        [key: string]: unknown;
      };
    }
  | null
  | undefined;

/**
 * Load a dynamic component from a lazy bundle source.
 * Designed to be used with React.lazy().
 *
 * @param source - The URL or path where the dynamic component bundle is located
 * @returns A Promise that resolves to the module with a default export
 *
 * @example
 * ```tsx
 * import { lazy } from 'react';
 * import { loadLazyBundle } from '@my-react/react-lynx';
 *
 * const LazyComponent = lazy(() => loadLazyBundle('./lazy-component.js'));
 * ```
 *
 * @public
 */
export function loadLazyBundle<T extends { default: ComponentType<unknown> }>(source: string): Promise<T> {
  // Main Thread (LEPUS) path - use __QueryComponent for synchronous loading
  if (__LEPUS__) {
    return loadLazyBundleSync<T>(source);
  }

  // Background Thread path - use QueryComponent callback API
  const resolver = withSyncResolvers<T>();

  const callback = (result: { code: number; detail: { schema: string } }): void => {
    const { code, detail } = result;
    if (code === 0) {
      const { schema } = detail;
      const exports = typeof lynxCoreInject !== "undefined" ? lynxCoreInject?.tt?.getDynamicComponentExports?.(schema) : undefined;
      if (exports) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Object.keys(exports.modules || {}).forEach((key) => registerModuleScope(key, source));
        resolver.resolve(exports as T);
        return;
      }
    }
    const e = new Error("Lazy bundle load failed, schema: " + result.detail.schema);
    (e as Error & { cause?: string }).cause = JSON.stringify(result);
    resolver.reject(e);
  };

  if (typeof lynx !== "undefined") {
    if (typeof lynx.QueryComponent === "function") {
      lynx.QueryComponent(source, callback);
    } else if (typeof lynx.getNativeLynx === "function") {
      lynx.getNativeLynx()?.QueryComponent?.(source, callback);
    }
  }

  if (resolver.result !== null) {
    const p = Promise.resolve(resolver.result);
    p.then = makeSyncThen(resolver.result) as Promise<Awaited<T>>["then"];
    return p;
  } else if (resolver.error === null) {
    return new Promise((_resolve, _reject) => {
      resolver.resolve = _resolve;
      resolver.reject = _reject;
    });
  } else {
    return Promise.reject(resolver.error);
  }
}
