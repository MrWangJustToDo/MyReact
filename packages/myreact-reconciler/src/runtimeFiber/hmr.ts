import { __my_react_internal__, createElement } from "@my-react/react";
import { STATE_TYPE, UpdateQueueType, include, merge } from "@my-react/react-shared";

import { listenerMap } from "../renderDispatch";
import { triggerRevert } from "../renderUpdate";
import { getCurrentDispatchFromFiber, safeCallWithCurrentFiber, setRefreshTypeMap } from "../share";

import { clearFiberNode } from "./clear";

import type { MyReactFiberNode } from "./instance";
import type { HMRUpdateQueue, MyReactComponentType } from "@my-react/react";

const { currentScheduler } = __my_react_internal__;

export const hmr = (fiber: MyReactFiberNode, nextType: MyReactComponentType, forceRefresh?: boolean) => {
  if (__DEV__) {
    if (include(fiber.state, STATE_TYPE.__unmount__)) return;

    const renderDispatch = getCurrentDispatchFromFiber(fiber);

    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallHMR() {
        // keep the type
        const nodeType = fiber.type;

        const element = createElement(nextType, { ...fiber.pendingProps, key: fiber.key ?? undefined, ref: fiber.ref ?? undefined });

        fiber._installElement(element);

        fiber.type = nodeType;
      },
    });

    setRefreshTypeMap(fiber);

    if (forceRefresh) {
      clearFiberNode(renderDispatch, fiber);

      fiber.state = merge(STATE_TYPE.__create__, STATE_TYPE.__hmr__);
    } else {
      fiber.state = merge(STATE_TYPE.__triggerSync__, STATE_TYPE.__hmr__);
    }

    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallFiberHMRListener() {
        listenerMap.get(renderDispatch)?.fiberHMR?.forEach((cb) => cb(fiber, forceRefresh));
      },
    });

    return fiber;
  } else {
    throw new Error(`[@my-react/react] can not try to dev refresh this app in prod env!`);
  }
};

export function hmrRevert(this: MyReactFiberNode, cb?: () => void) {
  if (include(this.state, STATE_TYPE.__unmount__)) return;

  const renderDispatch = getCurrentDispatchFromFiber(this);

  triggerRevert(renderDispatch, this, cb);
}

export function hmrUpdate(this: MyReactFiberNode, state?: STATE_TYPE, cb?: () => void) {
  if (include(this.state, STATE_TYPE.__unmount__)) return;

  const renderScheduler = currentScheduler.current;

  const updater: HMRUpdateQueue = {
    type: UpdateQueueType.hmr,
    trigger: this,
    isSync: true,
    isForce: false,
    isSkip: include(state, STATE_TYPE.__skippedSync__ | STATE_TYPE.__skippedConcurrent__),
    isImmediate: true,
    isRetrigger: false,
    callback: cb,
  };

  renderScheduler.dispatchState(updater);
}
