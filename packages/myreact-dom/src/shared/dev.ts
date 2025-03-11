import { initHMR } from "@my-react/react-reconciler";

import type { CustomRenderDispatch, CustomRenderPlatform } from "@my-react/react-reconciler";

type DevToolRuntime = (dispatch: CustomRenderDispatch, platform: CustomRenderPlatform, hmrRuntime: typeof initHMR) => void;

type RefreshRuntime = (dispatch: CustomRenderDispatch) => void;

const pendingDevTool: Array<[dispatch: CustomRenderDispatch, platform: CustomRenderPlatform, hmrRuntime: typeof initHMR]> = [];

const pendingRefresh: Array<CustomRenderDispatch> = [];

const DISPATCH_FIELD = "__@my-react/dispatch__";

// const DEV_TOOL_FIELD = "__MY_REACT_DEVTOOL_RUNTIME__";
const DEV_TOOL_FIELD = "__@my-react/react-devtool-inject__";

const PENDING_DEV_TOOL_FIELD = "__@my-react/react-devtool-inject-pending__";

const DEV_REFRESH_FIELD = "__@my-react/react-refresh-inject__";

const PENDING_DEV_REFRESH_FIELD = "__@my-react/react-refresh-inject-pending__";

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
  addGlobalDispatch(dispatch);

  if (typeof globalThis !== "undefined" && globalThis[DEV_TOOL_FIELD]) {
    try {
      const typedRuntimeField = globalThis[DEV_TOOL_FIELD] as DevToolRuntime;

      typedRuntimeField?.(dispatch, platform, initHMR);
    } catch {
      void 0;
    }
  } else {
    pendingDevTool.push([dispatch, platform, initHMR]);
  }
};

export const autoSetDevHMR = (dispatch: CustomRenderDispatch) => {
  if (__DEV__) {
    if (typeof globalThis !== "undefined" && globalThis[DEV_REFRESH_FIELD]) {
      try {
        const typedRuntimeField = globalThis[DEV_REFRESH_FIELD] as RefreshRuntime;

        typedRuntimeField?.(dispatch);
      } catch {
        void 0;
      }
    } else {
      pendingRefresh.push(dispatch);
    }
  }
};

const injectDevTool = () => {
  if (typeof globalThis !== "undefined" && globalThis[DEV_TOOL_FIELD]) {
    try {
      const typedRuntimeField = globalThis[DEV_TOOL_FIELD] as DevToolRuntime;

      pendingDevTool.forEach(([dispatch, platform, initHMR]) => typedRuntimeField(dispatch, platform, initHMR));

      pendingDevTool.length = 0;
    } catch {
      void 0;
    }
  } else {
    console.warn(`[@my-react/react-dom] Devtool runtime not found, SEE https://github.com/MrWangJustToDo/myreact-devtools`);
  }
};

const injectDevRefresh = () => {
  if (__DEV__) {
    if (typeof globalThis !== "undefined" && globalThis[DEV_REFRESH_FIELD]) {
      try {
        const typedRuntimeField = globalThis[DEV_REFRESH_FIELD] as RefreshRuntime;

        pendingRefresh.forEach(typedRuntimeField);

        pendingRefresh.length = 0;
      } catch {
        void 0;
      }
    } else {
      console.warn(`[@my-react/react-dom] Refresh runtime not found, please check your configuration`);
    }
  }
};

globalThis[PENDING_DEV_TOOL_FIELD] = injectDevTool;

globalThis[PENDING_DEV_REFRESH_FIELD] = injectDevRefresh;
