import { __my_react_internal__, type createRef } from "@my-react/react";

import { hmr } from "../runtimeFiber";

import { setRefreshHandler, getCurrentDispatchFromType, getCurrentFibersFromType } from "./refresh";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentComponentFiber } = __my_react_internal__;

export type HMR = {
  hmr: typeof hmr;
  setRefreshHandler: typeof setRefreshHandler;
  currentComponentFiber: ReturnType<typeof createRef<MyReactFiberNode>>;
  getCurrentFibersFromType: typeof getCurrentFibersFromType;
  getCurrentDispatchFromType: typeof getCurrentDispatchFromType;
};

export const initHMR = (env: Record<string, any>) => {
  if (__DEV__) {
    try {
      env["hmr"] = hmr;
      env["setRefreshHandler"] = setRefreshHandler;
      env["currentComponentFiber"] = currentComponentFiber;
      env["getCurrentFibersFromType"] = getCurrentFibersFromType;
      env["getCurrentDispatchFromType"] = getCurrentDispatchFromType;
    } catch (e) {
      console.error(`[@my-react/react-reconciler] init HMR for current environment failed, ${(e as Error).message}`);
    }
  }
};
