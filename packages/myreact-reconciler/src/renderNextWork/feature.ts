import { __my_react_internal__ } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { runtimeNextWork, runtimeNextWorkDev, runtimeNextWorkAsync } from "../runtimeGenerate";
import { currentRenderDispatch } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRunningFiber } = __my_react_internal__;

export const performToNextFiberWithSkip = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.state === STATE_TYPE.__initial__ || fiber.state & (STATE_TYPE.__inherit__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
    currentRunningFiber.current = fiber;

    currentRenderDispatch.current = renderDispatch;

    if (__DEV__) {
      runtimeNextWorkDev(fiber);
    } else {
      runtimeNextWork(fiber);
    }

    currentRenderDispatch.current = null;

    currentRunningFiber.current = null;
  }

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

export const performToNxtFiberWithTrigger = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.state === STATE_TYPE.__initial__ || fiber.state & (STATE_TYPE.__inherit__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
    currentRunningFiber.current = fiber;

    currentRenderDispatch.current = renderDispatch;

    if (__DEV__) {
      runtimeNextWorkDev(fiber);
    } else {
      runtimeNextWork(fiber);
    }

    currentRenderDispatch.current = null;

    currentRunningFiber.current = null;

    fiber.state = STATE_TYPE.__stable__;

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

export const performToNextFiberAsyncWithSkip = async (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.state === STATE_TYPE.__initial__ || fiber.state & (STATE_TYPE.__inherit__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
    currentRunningFiber.current = fiber;

    currentRenderDispatch.current = renderDispatch;

    await runtimeNextWorkAsync(fiber);

    currentRenderDispatch.current = null;

    currentRunningFiber.current = null;
  }

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

export const performToNextFiberAsyncWithTrigger = async (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.state === STATE_TYPE.__initial__ || fiber.state & (STATE_TYPE.__inherit__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
    currentRunningFiber.current = fiber;

    currentRenderDispatch.current = renderDispatch;

    await runtimeNextWorkAsync(fiber);

    currentRenderDispatch.current = null;

    currentRunningFiber.current = null;

    fiber.state = STATE_TYPE.__stable__;

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
