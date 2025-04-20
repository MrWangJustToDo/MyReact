import { __my_react_internal__, use } from "@my-react/react";
import { merge, STATE_TYPE } from "@my-react/react-shared";

import { defaultDeleteCurrentEffect } from "../dispatchEffect";
import { clearFiberNode, type MyReactFiberNode } from "../runtimeFiber";
import { getCurrentDispatchFromFiber } from "../share";

export type PromiseWithState<T> = Promise<T> & { state?: "fulfilled" | "rejected" | "pending"; value?: T; reason?: any };

const { currentRenderPlatform } = __my_react_internal__;

export const processPromise = (fiber: MyReactFiberNode, promise: PromiseWithState<unknown>) => {
  const renderDispatch = getCurrentDispatchFromFiber(fiber);

  defaultDeleteCurrentEffect(fiber, renderDispatch);

  if (promise.state === "fulfilled") {
    use._updater(fiber, promise.value);
  } else if (promise.state === "rejected") {
    currentRenderPlatform.current.dispatchError?.({ fiber, error: promise.reason });
  } else {
    promise.then(
      (value) => {
        promise.state = "fulfilled";

        promise.value = value;

        clearFiberNode(fiber, renderDispatch);

        fiber.state = merge(STATE_TYPE.__create__, STATE_TYPE.__promise__);

        use._updater(fiber, value);
      },
      (reason) => {
        promise.state = "rejected";

        promise.reason = reason;

        currentRenderPlatform.current.dispatchError?.({ fiber, error: reason });
      }
    );
  }
  return renderDispatch.resolveSuspense(fiber);
};
