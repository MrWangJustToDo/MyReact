import { __my_react_internal__ } from "@my-react/react";
import { STATE_TYPE, include, remove } from "@my-react/react-shared";

import { runtimeNextWork, runtimeNextWorkDev } from "../runtimeGenerate";
import { currentRenderDispatch, devErrorWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import { triggerFiberUpdateListener } from "../runtimeUpdate";

const { currentRunningFiber } = __my_react_internal__;

export const mountToNextFiberFromRoot = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
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
        STATE_TYPE.__reschedule__
    )
  ) {
    fiber.state = remove(fiber.state, STATE_TYPE.__retrigger__);

    currentRenderDispatch.current = renderDispatch;

    currentRunningFiber.current = fiber;

    if (__DEV__) {
      runtimeNextWorkDev(fiber);
    } else {
      runtimeNextWork(fiber);
    }

    currentRunningFiber.current = null;

    currentRenderDispatch.current = null;
  }

  if (!include(fiber.state, STATE_TYPE.__retrigger__)) {
    fiber.state = STATE_TYPE.__stable__;
  } else {
    fiber.state = STATE_TYPE.__inherit__;
  }

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

export const performToNextFiberFromRoot = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
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
        STATE_TYPE.__reschedule__
    )
  ) {
    fiber.state = remove(fiber.state, STATE_TYPE.__retrigger__);

    currentRenderDispatch.current = renderDispatch;

    currentRunningFiber.current = fiber;

    if (__DEV__) {
      runtimeNextWorkDev(fiber);
    } else {
      runtimeNextWork(fiber);
    }

    currentRunningFiber.current = null;

    currentRenderDispatch.current = null;

    triggerFiberUpdateListener(renderDispatch, fiber);
  }

  if (!include(fiber.state, STATE_TYPE.__retrigger__)) {
    fiber.state = STATE_TYPE.__stable__;
  } else {
    fiber.state = STATE_TYPE.__inherit__;
  }

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

export const performToNextFiberFromTrigger = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
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
        STATE_TYPE.__reschedule__
    )
  ) {
    fiber.state = remove(fiber.state, STATE_TYPE.__retrigger__);

    currentRenderDispatch.current = renderDispatch;

    currentRunningFiber.current = fiber;

    if (__DEV__) {
      runtimeNextWorkDev(fiber);
    } else {
      runtimeNextWork(fiber);
    }

    currentRunningFiber.current = null;

    currentRenderDispatch.current = null;

    if (!include(fiber.state, STATE_TYPE.__retrigger__)) {
      fiber.state = STATE_TYPE.__stable__;
    } else {
      fiber.state = STATE_TYPE.__inherit__;
    }

    triggerFiberUpdateListener(renderDispatch, fiber);

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
