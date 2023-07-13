import RefreshRuntime from "@my-react/react-refresh/runtime";

import RefreshHelpers from "./internal/helpers";

export type RefreshRuntimeGlobals = {
  $RefreshReg$: (type: any, id: string) => void;
  $RefreshSig$: () => (...type: any) => unknown;
  $RefreshInterceptModuleExecution$: (moduleId: string) => () => void;
  $RefreshHelpers$: typeof RefreshHelpers;
};

declare const self: Window & RefreshRuntimeGlobals;

// Hook into ReactDOM initialization
RefreshRuntime.injectIntoGlobalHook(self);

// Register global helpers
self.$RefreshHelpers$ = RefreshHelpers;

// Register a helper for module execution interception
self.$RefreshInterceptModuleExecution$ = function (webpackModuleId) {
  const prevRefreshReg = self.$RefreshReg$;
  const prevRefreshSig = self.$RefreshSig$;

  self.$RefreshReg$ = function (type, id) {
    RefreshRuntime.register(type, webpackModuleId + " " + id);
  };
  self.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

  // Modeled after `useEffect` cleanup pattern:
  // https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
  return function () {
    self.$RefreshReg$ = prevRefreshReg;
    self.$RefreshSig$ = prevRefreshSig;
  };
};
