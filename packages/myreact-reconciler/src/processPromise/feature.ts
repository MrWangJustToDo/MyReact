import { __my_react_internal__, use } from "@my-react/react";
import { merge, STATE_TYPE } from "@my-react/react-shared";

import { deleteEffect } from "../dispatchEffect";
import { hookListUnmount } from "../runtimeHook";
import { getCurrentDispatchFromFiber } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";

export type PromiseWithState<T> = Promise<T> & { state?: "fulfilled" | "rejected" | "pending"; value?: T; reason?: any };

const { currentRenderPlatform } = __my_react_internal__;

export const processPromise = (fiber: MyReactFiberNode, promise: PromiseWithState<unknown>) => {
  if (promise.state === "fulfilled") {
    use._updater(fiber, promise.value);
  } else if (promise.state === "rejected") {
    currentRenderPlatform.current.dispatchError?.({ fiber, error: promise.reason });
  } else {
    // unmount state
    const renderDispatch = getCurrentDispatchFromFiber(fiber);

    hookListUnmount(fiber, renderDispatch);

    fiber.hookList = null;

    fiber.updateQueue = null;

    if (__DEV__) {
      const typedFiber = fiber as MyReactFiberNodeDev;

      typedFiber._debugHookTypes = [];
    }

    deleteEffect(fiber, renderDispatch);

    fiber.state = merge(STATE_TYPE.__create__, STATE_TYPE.__promise__);

    promise.then(
      (value) => {
        promise.state = "fulfilled";
        promise.value = value;

        use._updater(fiber, value);
      },
      (reason) => {
        promise.state = "rejected";
        promise.reason = reason;

        currentRenderPlatform.current.dispatchError?.({ fiber, error: reason });
      }
    );
  }
};
