import { __my_react_internal__ } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { runtimeNextWork, runtimeNextWorkAsync } from "../runtimeGenerate";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRunningFiber } = __my_react_internal__;

export const performToNextFiber = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.state & (STATE_TYPE.__initial__ | STATE_TYPE.__inherit__ | STATE_TYPE.__trigger__)) {
    currentRunningFiber.current = fiber;

    runtimeNextWork(fiber);

    currentRunningFiber.current = null;
  }

  fiber.state = STATE_TYPE.__stable__;

  if (fiber.child) return fiber.child;

  const renderContainer = fiber.container;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderContainer.triggeredFiber) {
    renderContainer._generateCommitList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderContainer.triggeredFiber) {
    renderContainer._generateCommitList(nextFiber);
  }

  return null;
};

export const performToNextFiberAsync = async (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.state & (STATE_TYPE.__initial__ | STATE_TYPE.__inherit__ | STATE_TYPE.__trigger__)) {
    currentRunningFiber.current = fiber;

    await runtimeNextWorkAsync(fiber);

    currentRunningFiber.current = null;
  }

  fiber.state = STATE_TYPE.__stable__;

  if (fiber.child) return fiber.child;

  const renderContainer = fiber.container;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderContainer.triggeredFiber) {
    renderContainer._generateCommitList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderContainer.triggeredFiber) {
    renderContainer._generateCommitList(nextFiber);
  }

  return null;
};
