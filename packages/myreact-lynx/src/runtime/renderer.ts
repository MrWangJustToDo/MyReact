import createReconciler from "@my-react/react-reconciler-compact";
import { LegacyRoot } from "@my-react/react-reconciler-compact/constants";

import { hostConfig } from "./reconciler";
import { createPageRoot, type ShadowElement } from "./shadow-element";

import type { ReactNode } from "react";

export const reconciler = createReconciler(hostConfig);

if (__DEVTOOL__) {
  const wsUrl = typeof __DEVTOOL__ === "object" ? __DEVTOOL__.wsUrl : "ws://localhost:3002/ws";

  const injectIntoDevTools = async (url: string, config: any) => {
    const typedReconciler = reconciler as typeof reconciler & {
      injectIntoDevToolsAuto: (url: string, config: any) => Promise<void>;
    };
    typedReconciler.injectIntoDevToolsAuto(url, config);
  };

  injectIntoDevTools(wsUrl, {
    rendererPackageName: "@my-react/react-lynx",
  });
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
  const container = reconciler.createContainer(pageRoot, LegacyRoot, null, false, null, "", console.error, console.error, console.error, console.error, null);
  reconciler.updateContainer(element, container, null, () => {});
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
export const root = {
  render(element: React.ReactNode) {
    render(element);
  },
};

export const createPortal = reconciler.createPortal as unknown as (element: ReactNode, container: ShadowElement) => React.ReactPortal;

export const flushSync = reconciler.flushSync;
