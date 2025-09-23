import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { defaultDeleteCurrentEffect } from "../dispatchEffect";
import { getInstanceFieldByInstance } from "../runtimeGenerate";
import { devWarnWithFiber } from "../share";

import type { SuspenseInstanceField } from "../processSuspense";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { PromiseUpdateQueue } from "@my-react/react";

export type PromiseWithState<T> = Promise<T> & {
  status?: "fulfilled" | "rejected" | "pending";
  _value?: T;
  _reason?: any;
  _loading?: boolean;
  _list?: Set<MyReactFiberNode>;
};

const { enableSuspenseRoot } = __my_react_shared__;
const { currentScheduler } = __my_react_internal__;

export const loadPromise = async (renderDispatch: CustomRenderDispatch, promise: PromiseWithState<unknown>) => {
  if (promise.status === "fulfilled" || promise.status === "rejected") return;

  try {
    promise.status = "pending";

    const value = await Promise.resolve(promise);

    promise.status = "fulfilled";

    promise._value = value;
  } catch (reason) {
    promise.status = "rejected";

    promise._reason = reason;
  }
};

export const processPromise = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, promise: PromiseWithState<unknown>) => {
  defaultDeleteCurrentEffect(renderDispatch, fiber);

  if (promise.status === "rejected") {
    currentScheduler.current.dispatchError?.({ fiber, error: promise._reason });

    return null;
  }

  if (promise.status === "fulfilled") {
    if (__DEV__) {
      console.warn("[@my-react/react] throw a promise what has already fulfilled, this is not a valid usage");
    }
  }

  promise._list = promise._list || new Set();

  promise._list.add(fiber);

  const suspenseFiber = renderDispatch.resolveSuspenseFiber(fiber);

  if (suspenseFiber) {
    const suspenseField = getInstanceFieldByInstance(suspenseFiber.instance) as SuspenseInstanceField;

    suspenseField.asyncLoadList.uniPush(promise);

    renderDispatch.pendingSuspenseFiberArray.uniPush(suspenseFiber);

    return null;
  } else {
    // TODO update flow
    if (enableSuspenseRoot.current && !renderDispatch.isAppMounted) {
      const suspenseField = getInstanceFieldByInstance(renderDispatch) as SuspenseInstanceField;

      suspenseField.asyncLoadList.uniPush(promise);

      return null;
    }

    devWarnWithFiber(fiber, "[@my-react/react] promise must be used inside a Suspense component, otherwise it will not work as expected");

    if (promise._loading) return null;

    promise._loading = true;

    promise.status = "pending";

    const renderScheduler = currentScheduler.current;

    renderDispatch
      .processPromise(promise)
      .then(() => {
        fiber.state = STATE_TYPE.__recreate__;

        promise._list.delete(fiber);

        promise._loading = false;

        const updater: PromiseUpdateQueue = {
          type: UpdateQueueType.promise,
          trigger: fiber,
          isSync: true,
          isForce: true,
          payLoad: promise,
        };

        renderScheduler.dispatchState(updater);
      })
      .catch((e) => renderScheduler.dispatchError({ fiber, error: e }));

    return null;
  }
};
