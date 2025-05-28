import { __my_react_internal__, use } from "@my-react/react";
import { merge, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { defaultDeleteChildEffect, defaultDeleteCurrentEffect } from "../dispatchEffect";
import { processState } from "../processState";
import { type MyReactFiberNode } from "../runtimeFiber";
import { getInstanceFieldByInstance } from "../runtimeGenerate";
import { fiberToDispatchMap } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { VisibleInstanceField } from "../runtimeGenerate";
import type { PromiseUpdateQueue } from "@my-react/react";

export type PromiseWithState<T> = Promise<T> & { status?: "fulfilled" | "rejected" | "pending"; value?: T; reason?: any };

const { currentScheduler } = __my_react_internal__;

export const processPromise = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, promise: PromiseWithState<unknown>) => {
  const visibleFiber = renderDispatch.resolveSuspenseFiber(fiber);

  defaultDeleteCurrentEffect(renderDispatch, fiber);

  if (promise.status === "rejected") {
    currentScheduler.current.dispatchError?.({ fiber, error: promise.reason });

    return null;
  }

  if (promise.status === "fulfilled") {
    if (__DEV__) {
      console.warn("[@my-react/react] throw a promise what has already fulfilled, this is not a valid usage");
    }
  }

  // collect all the sibling lazy component, so that we can update them all at once

  if (visibleFiber) {
    defaultDeleteChildEffect(renderDispatch, visibleFiber);

    const updateQueue: PromiseUpdateQueue = {
      type: UpdateQueueType.promise,
      // fiber / visibleFiber
      trigger: visibleFiber,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      payLoad: promise,
      isSync: true,
      isForce: true,
      isRetrigger: true,
      isImmediate: true,
    };

    const visibleField = getInstanceFieldByInstance(visibleFiber.instance) as VisibleInstanceField;

    visibleField.isHidden = true;

    visibleFiber.state = merge(visibleFiber.state, STATE_TYPE.__create__);

    processState(renderDispatch, updateQueue);

    promise
      .then((value) => {
        promise.status = "fulfilled";

        promise.value = value;

        visibleField.isHidden = false;

        use._updater(visibleFiber, value);
      })
      .catch((reason) => {
        promise.status = "rejected";

        promise.reason = reason;

        fiberToDispatchMap.set(fiber, renderDispatch);

        currentScheduler.current.dispatchError?.({ fiber, error: reason });

        fiberToDispatchMap.delete(fiber);
      });
  } else {
    throw new Error("[@my-react/react] the promise is not in a suspense tree");
  }
  return null;
};
