import { __my_react_internal__ } from "@my-react/react";

const { currentRenderPlatform, currentRunningFiber } = __my_react_internal__;

export const originalWarn = console.warn;

export const originalError = console.error;

export const setLogScope = () => {
  if (__DEV__) {
    const renderPlatform = currentRenderPlatform.current;

    console.warn = (...args) => originalWarn.call(console, ...args.concat(renderPlatform.getFiberTree(currentRunningFiber.current)));

    console.error = (...args) => originalError.call(console, ...args.concat(renderPlatform.getFiberTree(currentRunningFiber.current)));
  }
};

export const resetLogScope = () => {
  if (__DEV__) {
    console.warn = originalWarn;

    console.error = originalError;
  }
};
