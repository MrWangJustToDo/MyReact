import { __my_react_internal__ } from "@my-react/react";
import { STATE_TYPE, include } from "@my-react/react-shared";

import { runtimeNextWork, runtimeNextWorkDev } from "../runtimeGenerate";
import { currentRenderDispatch, devError } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRunningFiber } = __my_react_internal__;

export const performToNextFiberWithAll = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (include(fiber.state, STATE_TYPE.__unmount__) || renderDispatch.isAppCrashed) return null;

  if (__DEV__) currentRunningFiber.current = fiber;

  if (__DEV__ && include(fiber.state, STATE_TYPE.__stable__) && fiber.state !== STATE_TYPE.__stable__) {
    devError(`[@my-react/react] current fiber state not valid, look like a bug for @my-react`);
  }

  if (include(fiber.state, STATE_TYPE.__create__ | STATE_TYPE.__inherit__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
    currentRenderDispatch.current = renderDispatch;

    if (__DEV__) {
      runtimeNextWorkDev(fiber);
    } else {
      runtimeNextWork(fiber);
    }

    currentRenderDispatch.current = null;
  }

  if (__DEV__) currentRunningFiber.current = null;

  fiber.state = STATE_TYPE.__stable__;

  if (fiber.child) return fiber.child;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderDispatch.runtimeFiber.scheduledFiber) {
    renderDispatch.generateCommitList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderDispatch.runtimeFiber.scheduledFiber) renderDispatch.generateCommitList(nextFiber);

  return null;
};

export const performToNextFiberWithTrigger = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (include(fiber.state, STATE_TYPE.__unmount__) || renderDispatch.isAppCrashed) return null;

  if (__DEV__) currentRunningFiber.current = fiber;

  if (__DEV__ && include(fiber.state, STATE_TYPE.__stable__) && fiber.state !== STATE_TYPE.__stable__) {
    devError(`[@my-react/react] current fiber state not valid, look like a bug for @my-react`);
  }

  if (include(fiber.state, STATE_TYPE.__create__ | STATE_TYPE.__inherit__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
    currentRenderDispatch.current = renderDispatch;

    if (__DEV__) {
      runtimeNextWorkDev(fiber);
    } else {
      runtimeNextWork(fiber);
    }

    currentRenderDispatch.current = null;

    fiber.state = STATE_TYPE.__stable__;

    if (__DEV__) currentRunningFiber.current = null;

    if (fiber.child) return fiber.child;
  }

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderDispatch.runtimeFiber.scheduledFiber) {
    renderDispatch.generateCommitList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderDispatch.runtimeFiber.scheduledFiber) renderDispatch.generateCommitList(nextFiber);

  return null;
};
