import { __my_react_internal__ } from "@my-react/react";
import { UPDATE_TYPE } from "@my-react/react-shared";

import { runtimeNextWork, runtimeNextWorkAsync } from "../runtimeGenerate";

import type { MyReactFiberNode } from "@my-react/react";

const { currentRunningFiber } = __my_react_internal__;

export const performToNextFiber = (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return null;

  if (!fiber.isInvoked || fiber.mode & UPDATE_TYPE.__needUpdate__) {
    currentRunningFiber.current = fiber;

    runtimeNextWork(fiber);

    fiber.isInvoked = true;

    currentRunningFiber.current = null;

    if (fiber.child) return fiber.child;
  }

  const renderController = fiber.root.renderController;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderController.getTopLevelFiber()) {
    renderController.generateUpdateList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderController.getTopLevelFiber()) {
    renderController.generateUpdateList(nextFiber);
  }

  return null;
};

export const performToNextFiberAsync = async (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return null;

  if (!fiber.isInvoked || fiber.mode & UPDATE_TYPE.__needUpdate__) {
    currentRunningFiber.current = fiber;

    await runtimeNextWorkAsync(fiber);

    fiber.isInvoked = true;

    currentRunningFiber.current = null;

    if (fiber.child) return fiber.child;
  }

  const renderController = fiber.root.renderController;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderController.getTopLevelFiber()) {
    renderController.generateUpdateList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderController.getTopLevelFiber()) {
    renderController.generateUpdateList(nextFiber);
  }

  return null;
};

export const performToNextFiberOnMount = (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return null;

  if (!fiber.isInvoked || fiber.mode & UPDATE_TYPE.__needUpdate__) {
    currentRunningFiber.current = fiber;

    runtimeNextWork(fiber);

    fiber.isInvoked = true;

    currentRunningFiber.current = null;

    if (fiber.child) return fiber.child;
  }

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  return null;
};

export const performToNextFiberOnMountAsync = async (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return null;

  if (!fiber.isInvoked || fiber.mode & UPDATE_TYPE.__needUpdate__) {
    currentRunningFiber.current = fiber;

    await runtimeNextWorkAsync(fiber);

    fiber.isInvoked = true;

    currentRunningFiber.current = null;

    if (fiber.child) return fiber.child;
  }

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  return null;
};
