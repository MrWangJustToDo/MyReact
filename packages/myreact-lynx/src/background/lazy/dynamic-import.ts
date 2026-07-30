/**
 * Dynamic import handling for MyReact Lynx.
 *
 * Provides MyReact-compatible implementations of __dynamicImport and loadDynamicJS
 * that work with Lynx's module loading system.
 */

import { loadLazyBundle } from "./lazy-bundle.js";

import type { ComponentType } from "react";

/**
 * Load a dynamic JavaScript module.
 *
 * In Lynx environment, this uses lynx.requireModuleAsync.
 * This function should NOT be used for standard React.lazy() imports -
 * those should use webpack's normal dynamic import mechanism.
 *
 * @param url - The URL of the module to load
 * @returns A Promise that resolves to the module exports
 *
 * @public
 */
export function loadDynamicJS<T>(url: string): Promise<T> {
  if (__LEPUS__) {
    console.error(`[@my-react/react-lynx] A dynamic import (to "${url}") is leaked to Lepus bundle.`);
    return Promise.reject(new Error(`Dynamic import to "${url}" is not supported on main thread.`));
  }

  return new Promise((resolve, reject) => {
    if (typeof lynx !== "undefined" && typeof lynx.requireModuleAsync === "function") {
      lynx.requireModuleAsync<T>(url, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data as T);
        }
      });
    } else {
      // In non-Lynx environments (like web simulator), reject with a clear error
      reject(new Error(`[@my-react/react-lynx] loadDynamicJS requires lynx.requireModuleAsync. Use standard import() for web environments.`));
    }
  });
}

/**
 * Dynamic import function used by the ReactLynx transform.
 *
 * This function is called when code is transformed by the ReactLynx SWC plugin
 * with dynamic imports. It handles both component imports (which use loadLazyBundle)
 * and regular JS imports (which use loadDynamicJS).
 *
 * @param url - The URL or path of the module to import
 * @param options - Import options including the type hint
 * @returns A Promise that resolves to the module exports
 *
 * @internal
 */
export function __dynamicImport<T extends { default: ComponentType<unknown> }>(
  url: string,
  options?: { with?: { type?: "component" | "tsx" | "jsx" } }
): Promise<T> {
  const t = options?.with?.type;
  if (t === "component" || t === "tsx" || t === "jsx") {
    return loadLazyBundle<T>(url);
  } else {
    return loadDynamicJS<T>(url);
  }
}
