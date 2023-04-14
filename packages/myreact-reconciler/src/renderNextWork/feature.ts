import { __my_react_internal__ } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { runtimeNextWork, runtimeNextWorkAsync } from "../runtimeGenerate";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRunningFiber } = __my_react_internal__;

export const performToNextFiberWithSkip = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.state === STATE_TYPE.__initial__ || fiber.state & (STATE_TYPE.__inherit__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
    currentRunningFiber.current = fiber;

    runtimeNextWork(fiber);

    currentRunningFiber.current = null;
  }

  fiber.state = STATE_TYPE.__stable__;

  if (fiber.child) return fiber.child;

  const renderContainer = fiber.renderContainer;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderContainer.scheduledFiber) {
    renderContainer._generateCommitList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderContainer.scheduledFiber) renderContainer._generateCommitList(nextFiber);

  return null;
};

export const performToNxtFiberWithTrigger = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.state === STATE_TYPE.__initial__ || fiber.state & (STATE_TYPE.__inherit__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
    currentRunningFiber.current = fiber;

    runtimeNextWork(fiber);

    currentRunningFiber.current = null;

    fiber.state = STATE_TYPE.__stable__;

    if (fiber.child) return fiber.child;
  }

  const renderContainer = fiber.renderContainer;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderContainer.scheduledFiber) {
    renderContainer._generateCommitList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderContainer.scheduledFiber) renderContainer._generateCommitList(nextFiber);

  return null;
};

export const performToNextFiberAsyncWithSkip = async (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.state === STATE_TYPE.__initial__ || fiber.state & (STATE_TYPE.__inherit__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
    currentRunningFiber.current = fiber;

    await runtimeNextWorkAsync(fiber);

    currentRunningFiber.current = null;
  }

  fiber.state = STATE_TYPE.__stable__;

  if (fiber.child) return fiber.child;

  const renderContainer = fiber.renderContainer;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderContainer.scheduledFiber) {
    renderContainer._generateCommitList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderContainer.scheduledFiber) renderContainer._generateCommitList(nextFiber);

  return null;
};

export const performToNextFiberAsyncWithTrigger = async (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.state === STATE_TYPE.__initial__ || fiber.state & (STATE_TYPE.__inherit__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
    currentRunningFiber.current = fiber;

    await runtimeNextWorkAsync(fiber);

    currentRunningFiber.current = null;

    fiber.state = STATE_TYPE.__stable__;

    if (fiber.child) return fiber.child;
  }

  const renderContainer = fiber.renderContainer;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderContainer.scheduledFiber) {
    renderContainer._generateCommitList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderContainer.scheduledFiber) renderContainer._generateCommitList(nextFiber);

  return null;
};
