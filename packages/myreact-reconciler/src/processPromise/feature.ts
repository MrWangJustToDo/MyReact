import { __my_react_internal__ } from "@my-react/react";
import { ListTree } from "@my-react/react-shared";

import { defaultDeleteCurrentEffect } from "../dispatchEffect";
import { type MyReactFiberNode } from "../runtimeFiber";

import type { CustomRenderDispatch } from "../renderDispatch";

export type PromiseWithState<T> = Promise<T> & { status?: "fulfilled" | "rejected" | "pending"; value?: T; reason?: any; fiber?: MyReactFiberNode };

const { currentScheduler } = __my_react_internal__;

export const loadPromise = async (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, promise: PromiseWithState<unknown>) => {
  if (promise.status === "fulfilled" || promise.status === "rejected") return;

  try {
    promise.status = "pending";

    const value = await promise;

    promise.status = "fulfilled";

    promise.value = value;
  } catch (reason) {
    promise.status = "rejected";

    promise.reason = reason;
  }
};

export const processPromise = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, promise: PromiseWithState<unknown>) => {
  defaultDeleteCurrentEffect(renderDispatch, fiber);

  promise.fiber = fiber;

  if (promise.status === "rejected") {
    currentScheduler.current.dispatchError?.({ fiber, error: promise.reason });

    return null;
  }

  if (promise.status === "fulfilled") {
    if (__DEV__) {
      console.warn("[@my-react/react] throw a promise what has already fulfilled, this is not a valid usage");
    }
  }

  if (!promise.status) {
    promise.status = "pending";

    renderDispatch.pendingAsyncLoadList = renderDispatch.pendingAsyncLoadList || new ListTree<MyReactFiberNode | PromiseWithState<any>>();

    if (!renderDispatch.runtimeFiber.visibleFiber) {
      const visibleFiber = renderDispatch.resolveSuspenseFiber(fiber);

      if (visibleFiber) {
        renderDispatch.runtimeFiber.visibleFiber = visibleFiber;

        renderDispatch.pendingAsyncLoadList.push(promise);
      } else {
        throw new Error("[@my-react/react] the promise is not in a suspense tree");
      }
    } else {
      renderDispatch.pendingAsyncLoadList.push(promise);
    }
  }
  return null;
};
