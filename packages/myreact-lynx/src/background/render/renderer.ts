import createReconciler from "@my-react/react-reconciler-compact";
import { ConcurrentRoot } from "@my-react/react-reconciler-compact/constants";

import { isIfrEnabled, isIfrMainThread } from "../../shared/ifr.js";
import { registerDataProcessors } from "../data/data-processor.js";

import { flushSyncNow, scheduleFirstScreenPatchEnd } from "./flush.js";
import { hostConfig } from "./reconciler.js";
import { createPageRoot, ShadowElement, type ShadowElement as ShadowElementType } from "./shadow-element.js";

import type { DataProcessorDefinition } from "../data/data-processor.js";
import type { NodesRef } from "@lynx-js/types";
import type { ReactNode } from "react";

export const reconciler = createReconciler(hostConfig);

let rootContainer: ReturnType<typeof reconciler.createContainer> | null = null;
let pageRoot: ShadowElementType | null = null;
let initialRenderPending = true;

/** Stashed by `root.render` on Main Thread when IFR is enabled; consumed in `runIfrRender`. */
let ifrPendingElement: ReactNode | null = null;
let ifrMounting = false;

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
    const init = globalThis.__MY_REACT_DEVTOOL_NODE__ || globalThis.__MY_REACT_DEVTOOL_BUNDLE__ || globalThis.__MY_REACT_DEVTOOL_BUNDLE_WS__;

    if (init) {
      typedReconciler.injectIntoDevToolsAuto(devToolsConfig.wsUrl, {
        rendererPackageName: devToolsConfig.rendererPackageName,
      });
      return true;
    }
    return false;
  };

  if (!tryInjectDevTools()) {
    globalThis.__MY_REACT_LYNX_DEVTOOLS_CONFIG__ = devToolsConfig;
    globalThis.__MY_REACT_LYNX_INJECT_DEVTOOLS__ = tryInjectDevTools;
  }
}

function ensureContainer(): void {
  if (!pageRoot) {
    pageRoot = createPageRoot();
    rootContainer = reconciler.createContainer(
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
  }
}

/**
 * Render a React element to the Lynx page root.
 *
 * - Background: normal reconcile → ops → scheduleFlush
 * - Main Thread + IFR: stash element for `runIfrRender()` inside `renderPage`
 * - Main Thread without IFR: no-op (worklet stitches only)
 *
 * @see packages/myreact-lynx/IFR.md
 */
export function render(element: React.ReactNode) {
  if (isIfrMainThread() && !ifrMounting) {
    ifrPendingElement = element;
    if (__DEV__) {
      console.log("[@my-react/react-lynx][IFR] Main Thread root.render stashed (sync mount in renderPage)");
    }
    return;
  }

  if (typeof __MAIN_THREAD__ !== "undefined" && __MAIN_THREAD__ && !isIfrEnabled()) {
    return;
  }

  if (__DEV__ && typeof __BACKGROUND__ !== "undefined" && __BACKGROUND__) {
    console.log("[@my-react/react-lynx] Background root.render");
  }

  ensureContainer();
  reconciler.updateContainer(element as ReactNode, rootContainer, null, () => {
    if (initialRenderPending) {
      initialRenderPending = false;
      scheduleFirstScreenPatchEnd();
    }
  });
}

/**
 * Sync Main Thread IFR mount. Called from `renderPage` after `__CreatePage`.
 * Returns true when a pending `root.render` was mounted.
 *
 * @internal
 */
export function runIfrRender(): boolean {
  if (!isIfrEnabled() || !isIfrMainThread()) {
    return false;
  }
  if (ifrPendingElement == null) {
    return false;
  }

  const element = ifrPendingElement;
  ifrMounting = true;
  ShadowElement.nextId = 2;
  initialRenderPending = true;
  // Fresh container per renderPage (hot reload / re-entry).
  pageRoot = null;
  rootContainer = null;

  try {
    ensureContainer();
    const syncReconciler = reconciler as typeof reconciler & {
      updateContainerSync?: typeof reconciler.updateContainer;
    };
    const update = syncReconciler.updateContainerSync ?? reconciler.updateContainer;
    reconciler.flushSync(() => {
      update(element, rootContainer, null, () => {
        if (initialRenderPending) {
          initialRenderPending = false;
          // IFR handoff end is still driven by BG's first-screen patch meta.
        }
      });
    });
    // Drain any ops that were scheduled during sync mount.
    flushSyncNow();
    return true;
  } finally {
    ifrMounting = false;
  }
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

export const createPortal = reconciler.createPortal as unknown as (element: ReactNode, container: NodesRef) => React.ReactPortal;

export const flushSync = reconciler.flushSync;

// IFR: expose sync mount to main-thread/entry without a static import cycle
// that would pull the reconciler into non-IFR MT bundles.
if (typeof __MAIN_THREAD__ !== "undefined" && __MAIN_THREAD__ && isIfrEnabled()) {
  globalThis.__MY_REACT_LYNX_RUN_IFR_RENDER__ = runIfrRender;
}
