import { initHMR } from "@my-react/react-reconciler";

import type { CustomRenderDispatch, CustomRenderPlatform } from "@my-react/react-reconciler";

export type DevToolRuntime = (dispatch: CustomRenderDispatch, platform: CustomRenderPlatform, hmrRuntime: typeof initHMR) => void;

export const setDevTools = (devToolRuntime: DevToolRuntime, dispatch: CustomRenderDispatch, platform: CustomRenderPlatform) => {
  try {
    devToolRuntime(dispatch, platform, initHMR);
  } catch (e) {
    if (__DEV__) {
      console.error("devToolRuntime failed:", e);
    }
    void 0;
  }
};

export const DEV_TOOL_RUNTIME_FIELD = "__MY_REACT_DEVTOOL_RUNTIME__";

export const DISPATCH_FIELD = "__@my-react/dispatch__";

const DEV_TOOL_FIELD = "__@my-react/react-devtool-inject__";

const DEV_REFRESH_FIELD = "__@my-react/react-refresh-inject__";

export const injectDevField = () => {
  if (__DEV__ && typeof globalThis !== "undefined") {
    globalThis[DEV_TOOL_FIELD] = setDevTools;
  }
};

export const addGlobalDispatch = (dispatch: CustomRenderDispatch) => {
  if (typeof globalThis !== "undefined") {
    if (Array.isArray(globalThis[DISPATCH_FIELD])) {
      globalThis[DISPATCH_FIELD] = globalThis[DISPATCH_FIELD].filter((i) => i !== dispatch);

      globalThis[DISPATCH_FIELD].push(dispatch);
    } else {
      globalThis[DISPATCH_FIELD] = [dispatch];
    }
  }
};

export const delGlobalDispatch = (dispatch: CustomRenderDispatch) => {
  if (typeof globalThis !== "undefined") {
    if (Array.isArray(globalThis[DISPATCH_FIELD])) {
      globalThis[DISPATCH_FIELD] = globalThis[DISPATCH_FIELD].filter((i) => i !== dispatch);
    }
  }
};

export const autoSetDevTools = (dispatch: CustomRenderDispatch, platform: CustomRenderPlatform) => {
  const runtime = globalThis[DEV_TOOL_RUNTIME_FIELD];

  if (runtime) {
    setDevTools(runtime, dispatch, platform);
  }

  addGlobalDispatch(dispatch);

  if (typeof globalThis !== "undefined" && globalThis[DEV_REFRESH_FIELD]) {
    try {
      globalThis[DEV_REFRESH_FIELD]?.(globalThis[DISPATCH_FIELD]);
    } catch {
      void 0;
    }
  }
};
