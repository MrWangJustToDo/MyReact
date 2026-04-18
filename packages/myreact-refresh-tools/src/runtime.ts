import RefreshRuntime from "@my-react/react-refresh/runtime";
import { compareVersion } from "@my-react/react-shared";

import RefreshHelpers from "./internal/helpers";

export type RefreshRuntimeGlobals = {
  $RefreshReg$: (type: any, id: string) => void;
  $RefreshSig$: () => (...type: any) => unknown;
  $RefreshInterceptModuleExecution$: (moduleId: string) => () => void;
  $RefreshHelpers$: typeof RefreshHelpers;
  $RefreshRuntime$: typeof RefreshRuntime;
  $hasInject$?: boolean;
};

declare const globalThis: Window & RefreshRuntimeGlobals;

const initRuntime = () => {
  if (globalThis.$hasInject$) return;

  globalThis.$hasInject$ = true;

  if (!RefreshRuntime.version || !compareVersion(RefreshRuntime.version, "0.3.9")) {
    console.error(
      `[@my-react/react-refresh-tools] current RefreshRuntime version not match for the package required, please reinstall "@my-react/react-refresh" to fix this issue`
    );
  }

  // Hook into ReactDOM initialization
  RefreshRuntime.injectIntoGlobalHook(globalThis);

  // Register global helpers
  globalThis.$RefreshHelpers$ = RefreshHelpers;

  globalThis.$RefreshRuntime$ = RefreshRuntime;

  if (typeof globalThis.$RefreshReg$ !== "function") {
    console.error(`[@my-react/react-refresh-tools] expected global "$RefreshReg$" to be a function, please check your webpack configuration`);
  }

  // Register a helper for module execution interception
  globalThis.$RefreshInterceptModuleExecution$ = function (webpackModuleId) {
    const prevRefreshReg = globalThis.$RefreshReg$;
    const prevRefreshSig = globalThis.$RefreshSig$;

    globalThis.$RefreshReg$ = function (type, id) {
      RefreshRuntime.register(type, webpackModuleId + " " + id);
    };

    globalThis.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

    // Modeled after `useEffect` cleanup pattern:
    // https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
    return function () {
      globalThis.$RefreshReg$ = prevRefreshReg;
      globalThis.$RefreshSig$ = prevRefreshSig;
    };
  };
};

initRuntime();
