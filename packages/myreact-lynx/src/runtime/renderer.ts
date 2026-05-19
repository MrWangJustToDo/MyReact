import createReconciler from "@my-react/react-reconciler-compact";
import { ConcurrentRoot } from "@my-react/react-reconciler-compact/constants";

import { registerDataProcessors } from "./data-processor";
import { hostConfig } from "./reconciler";
import { createPageRoot, type ShadowElement } from "./shadow-element";

import type { DataProcessorDefinition } from "./data-processor";
import type { ReactNode } from "react";

export const reconciler = createReconciler(hostConfig);

if (__DEVTOOL__) {
  const wsUrl = typeof __DEVTOOL__ === "object" ? __DEVTOOL__.wsUrl : "ws://localhost:3002/ws";

  const devToolsConfig = {
    wsUrl,
    rendererPackageName: "@my-react/react-lynx",
  };

  const typedReconciler = reconciler as typeof reconciler & {
    injectIntoDevToolsAuto: (url: string, config: Record<string, unknown>) => Promise<void>;
  };

  const tryInjectDevTools = () => {
    const init =
      globalThis["__MY_REACT_DEVTOOL_NODE__" as keyof typeof globalThis] ||
      globalThis["__MY_REACT_DEVTOOL_BUNDLE__" as keyof typeof globalThis] ||
      globalThis["__MY_REACT_DEVTOOL_BUNDLE_WS__" as keyof typeof globalThis];

    if (init) {
      typedReconciler.injectIntoDevToolsAuto(devToolsConfig.wsUrl, {
        rendererPackageName: devToolsConfig.rendererPackageName,
      });
      return true;
    }
    return false;
  };

  if (!tryInjectDevTools()) {
    (globalThis as Record<string, unknown>).__MY_REACT_LYNX_DEVTOOLS_CONFIG__ = devToolsConfig;
    (globalThis as Record<string, unknown>).__MY_REACT_LYNX_INJECT_DEVTOOLS__ = tryInjectDevTools;
  }
}

/**
 * Render a React element to the Lynx page root.
 * This is the main entry point for MyReact Lynx apps.
 *
 * Only executes on the background thread. On the main thread (when worklet
 * transform is enabled and user code is bundled there), this is a no-op
 * to prevent double-rendering and errors from calling Lepus methods.
 */
export function render(element: React.ReactNode) {
  const pageRoot = createPageRoot();
  const container = reconciler.createContainer(
    pageRoot,
    ConcurrentRoot,
    null,
    false,
    null,
    "",
    console.error,
    console.error,
    console.error,
    console.error,
    null
  );
  reconciler.updateContainer(element, container, null, () => {});
}

/**
 * The default root exported by `@my-react/react-lynx` for you to render a JSX.
 *
 * @public
 */
export interface Root {
  /**
   * Use this API to pass in your JSX to render.
   *
   * @example
   * ```tsx
   * import { root } from '@my-react/react-lynx';
   *
   * function App() {
   *   return <view>...</view>;
   * }
   *
   * root.render(<App />);
   * ```
   *
   * @public
   */
  render: (jsx: ReactNode) => void;

  /**
   * Register DataProcessors. You MUST call this before `root.render()`.
   *
   * @deprecated Use {@link registerDataProcessors} or `lynx.registerDataProcessors` instead.
   *
   * @public
   */
  registerDataProcessors: (dataProcessorDefinition?: DataProcessorDefinition) => void;
}

/**
 * The default root for MyReact Lynx apps.
 * Compatible with ReactLynx's `root.render()` API.
 *
 * @example
 * ```tsx
 * import { root } from '@my-react/react-lynx';
 * import { App } from './App';
 *
 * root.render(<App />);
 * ```
 */
export const root: Root = {
  render(element: React.ReactNode) {
    render(element);
  },
  registerDataProcessors(dataProcessorDefinition?: DataProcessorDefinition) {
    registerDataProcessors(dataProcessorDefinition);
  },
};

export const createPortal = reconciler.createPortal as unknown as (element: ReactNode, container: ShadowElement) => React.ReactPortal;

export const flushSync = reconciler.flushSync;
