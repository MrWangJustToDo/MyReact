import { __my_react_internal__, type createRef } from "@my-react/react";

import { hmr } from "../runtimeFiber";

import { setRefreshHandler, getCurrentDispatchFromType, getCurrentFibersFromType, typeToFibersMap, getCurrentDispatchFromFiber } from "./refresh";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentComponentFiber } = __my_react_internal__;

export type HMR = {
  hmr: typeof hmr;
  typeToFibersMap: typeof typeToFibersMap;
  setRefreshHandler: typeof setRefreshHandler;
  currentComponentFiber: ReturnType<typeof createRef<MyReactFiberNode>>;
  getCurrentFibersFromType: typeof getCurrentFibersFromType;
  getCurrentDispatchFromType: typeof getCurrentDispatchFromType;
  getCurrentDispatchFromFiber: typeof getCurrentDispatchFromFiber;
};

export const initHMR = (env: Record<string, any>) => {
  if (__DEV__) {
    if (env["hmr"] || env["setRefreshHandler"] || env["currentComponentFiber"] || env["getCurrentFibersFromType"] || env["getCurrentDispatchFromType"]) {
      console.error(`[@my-react/react] current HMR environment is invalid`);
      return;
    }
    try {
      env["hmr"] = hmr;
      env["typeToFibersMap"] = typeToFibersMap;
      env["setRefreshHandler"] = setRefreshHandler;
      env["currentComponentFiber"] = currentComponentFiber;
      env["getCurrentFibersFromType"] = getCurrentFibersFromType;
      env["getCurrentDispatchFromType"] = getCurrentDispatchFromType;
      env["getCurrentDispatchFromFiber"] = getCurrentDispatchFromFiber;
    } catch (e) {
      console.error(`[@my-react/react] init HMR for current environment failed, ${(e as Error).message}`);
    }
  }
};
