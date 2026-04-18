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

import { registerModuleScope } from "./bundle-registry.js";

import type { ComponentType } from "@my-react/react";

/**
 * Helper to create a sync-like then function for first-screen rendering.
 * This allows lazy components to be available synchronously on first render.
 * @internal
 */
export const makeSyncThen = function <T>(result: T): Promise<T>["then"] {
  return function <TR1 = T, TR2 = never>(
    this: Promise<T>,
    onF?: ((value: T) => TR1 | PromiseLike<TR1>) | null,
    _onR?: ((reason: unknown) => TR2 | PromiseLike<TR2>) | null
  ): Promise<TR1 | TR2> {
    if (onF) {
      let ret: TR1 | PromiseLike<TR1>;
      try {
        ret = onF(result);
      } catch (e) {
        return Promise.reject(e as Error);
      }

      if (ret && typeof (ret as PromiseLike<TR1>).then === "function") {
        return ret as Promise<TR1>;
      }

      const p = Promise.resolve(ret);
      const then = makeSyncThen(ret as TR1);
      p.then = then as Promise<Awaited<TR1>>["then"];
      return p as Promise<TR1 | TR2>;
    }

    return this as Promise<TR1 | TR2>;
  };
};

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - __QueryComponent is a Lynx PAPI
    const query = __QueryComponent(source);
    let result: T;
    try {
      result = query.evalResult as T;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // Return a never-resolving promise to avoid errors on first screen
      return new Promise(() => {});
    }
    const r: Promise<T> = Promise.resolve(result);
    r.then = makeSyncThen(result);
    return r;
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
