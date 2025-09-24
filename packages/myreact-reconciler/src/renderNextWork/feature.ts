import { __my_react_internal__ } from "@my-react/react";
import { STATE_TYPE, include, remove } from "@my-react/react-shared";

import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { runtimeNextWork, runtimeNextWorkDev } from "../runtimeGenerate";
import { triggerFiberUpdateListener } from "../runtimeUpdate";
import { devErrorWithFiber, safeCallWithCurrentFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRunningFiber } = __my_react_internal__;

export const mountToNextFiberFromRoot = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.state, STATE_TYPE.__unmount__) || renderDispatch.isAppCrashed) return null;

  if (__DEV__ && include(fiber.state, STATE_TYPE.__stable__) && fiber.state !== STATE_TYPE.__stable__) {
    devErrorWithFiber(fiber, `[@my-react/react] current fiber state not valid, look like a bug for @my-react`);
  }

  if (
    include(
      fiber.state,
      STATE_TYPE.__create__ |
        STATE_TYPE.__inherit__ |
        STATE_TYPE.__triggerSync__ |
        STATE_TYPE.__triggerSyncForce__ |
        STATE_TYPE.__triggerConcurrent__ |
        STATE_TYPE.__triggerConcurrentForce__ |
        STATE_TYPE.__retrigger__ |
        STATE_TYPE.__reschedule__ |
        STATE_TYPE.__recreate__
    )
  ) {
    fiber.state = remove(fiber.state, STATE_TYPE.__retrigger__);

    currentRunningFiber.current = fiber;

    if (__DEV__) {
      runtimeNextWorkDev(renderDispatch, fiber);
    } else {
      runtimeNextWork(renderDispatch, fiber);
    }

    currentRunningFiber.current = null;
  }

  if (include(fiber.state, STATE_TYPE.__suspense__)) {
    fiber.state = STATE_TYPE.__recreate__;
  } else if (!include(fiber.state, STATE_TYPE.__retrigger__)) {
    fiber.state = STATE_TYPE.__stable__;
  } else {
    fiber.state = STATE_TYPE.__triggerSync__;
  }

  if (fiber.child) return fiber.child;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderDispatch.runtimeFiber.scheduledFiber) {
    renderDispatch.generateCommitList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    // current nextFiber is all done, back to parent

    if (__DEV__) {
      safeCallWithCurrentFiber({
        fiber: nextFiber,
        action: function safeCallAfterFiberDone() {
          listenerMap.get(renderDispatch)?.afterFiberDone?.forEach((cb) => cb(nextFiber));
        },
      });
    }

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderDispatch.runtimeFiber.scheduledFiber) renderDispatch.generateCommitList(nextFiber);

  return null;
};

export const performToNextFiberFromRoot = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.state, STATE_TYPE.__unmount__) || renderDispatch.isAppCrashed) return null;

  if (__DEV__ && include(fiber.state, STATE_TYPE.__stable__) && fiber.state !== STATE_TYPE.__stable__) {
    devErrorWithFiber(fiber, `[@my-react/react] current fiber state not valid, look like a bug for @my-react`);
  }

  if (
    include(
      fiber.state,
      STATE_TYPE.__create__ |
        STATE_TYPE.__inherit__ |
        STATE_TYPE.__triggerSync__ |
        STATE_TYPE.__triggerSyncForce__ |
        STATE_TYPE.__triggerConcurrent__ |
        STATE_TYPE.__triggerConcurrentForce__ |
        STATE_TYPE.__retrigger__ |
        STATE_TYPE.__reschedule__ |
        STATE_TYPE.__recreate__
    )
  ) {
    fiber.state = remove(fiber.state, STATE_TYPE.__retrigger__);

    currentRunningFiber.current = fiber;

    if (__DEV__) {
      runtimeNextWorkDev(renderDispatch, fiber);
    } else {
      runtimeNextWork(renderDispatch, fiber);
    }

    currentRunningFiber.current = null;

    triggerFiberUpdateListener(renderDispatch, fiber);
  }

  if (include(fiber.state, STATE_TYPE.__suspense__)) {
    fiber.state = STATE_TYPE.__recreate__;
  } else if (!include(fiber.state, STATE_TYPE.__retrigger__)) {
    fiber.state = STATE_TYPE.__stable__;
  } else {
    fiber.state = STATE_TYPE.__triggerSync__;
  }

  if (fiber.child) return fiber.child;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderDispatch.runtimeFiber.scheduledFiber) {
    renderDispatch.generateCommitList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    if (__DEV__) {
      safeCallWithCurrentFiber({
        fiber: nextFiber,
        action: function safeCallAfterFiberDone() {
          listenerMap.get(renderDispatch)?.afterFiberDone?.forEach((cb) => cb(nextFiber));
        },
      });
    }

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderDispatch.runtimeFiber.scheduledFiber) renderDispatch.generateCommitList(nextFiber);

  return null;
};
