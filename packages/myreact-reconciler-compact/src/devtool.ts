import type { CustomRenderDispatch } from "@my-react/react-reconciler";

export const DISPATCH_FIELD = "__@my-react/dispatch__";

export const DEV_TOOL_FIELD = "__@my-react/react-devtool-inject__";

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

export const autoSetDevTools = (dispatch: CustomRenderDispatch) => {
  addGlobalDispatch(dispatch);

  if (typeof globalThis !== "undefined" && globalThis[DEV_TOOL_FIELD]) {
    try {
      const typedRuntimeField = globalThis[DEV_TOOL_FIELD];

      typedRuntimeField?.(dispatch);
    } catch {
      void 0;
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
