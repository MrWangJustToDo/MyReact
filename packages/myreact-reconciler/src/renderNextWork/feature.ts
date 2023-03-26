import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { UPDATE_TYPE } from "@my-react/react-shared";

import { runtimeNextWork, runtimeNextWorkAsync } from "../runtimeGenerate";

import type { MyReactFiberNode } from "@my-react/react";

const { currentRunningFiber } = __my_react_internal__;
const { enableUpdateFromRoot } = __my_react_shared__;

const performToNextFiberFromFiber = (fiber: MyReactFiberNode) => {
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

const performToNextFiberFromFiberAsync = async (fiber: MyReactFiberNode) => {
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

const performToNextFiberFromRoot = (workInProgress: MyReactFiberNode) => {
  if (!workInProgress.isMounted) return null;

  // run if needed
  if (!workInProgress.isInvoked || workInProgress.mode & UPDATE_TYPE.__needUpdate__) {
    currentRunningFiber.current = workInProgress;

    runtimeNextWork(workInProgress);

    workInProgress.isInvoked = true;

    currentRunningFiber.current = null;
  }

  if (workInProgress.child) return workInProgress.child;

  const renderController = workInProgress.root.renderController;

  let nextFiber: MyReactFiberNode | null = workInProgress;

  while (nextFiber && nextFiber !== nextFiber.root) {
    renderController.generateUpdateList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === nextFiber.root) renderController.generateUpdateList(nextFiber);

  return null;
};

const performToNextFiberFromRootAsync = async (workInProgress: MyReactFiberNode) => {
  if (!workInProgress.isMounted) return null;

  // run if needed
  if (!workInProgress.isInvoked || workInProgress.mode & UPDATE_TYPE.__needUpdate__) {
    currentRunningFiber.current = workInProgress;

    await runtimeNextWorkAsync(workInProgress);

    workInProgress.isInvoked = true;

    currentRunningFiber.current = null;
  }

  if (workInProgress.child) return workInProgress.child;

  const renderController = workInProgress.root.renderController;

  let nextFiber: MyReactFiberNode | null = workInProgress;

  while (nextFiber && nextFiber !== nextFiber.root) {
    renderController.generateUpdateList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === nextFiber.root) renderController.generateUpdateList(nextFiber);

  return null;
};

export const performToNextFiber = (fiber: MyReactFiberNode) => {
  if (enableUpdateFromRoot.current) {
    return performToNextFiberFromRoot(fiber);
  } else {
    return performToNextFiberFromFiber(fiber);
  }
};

export const performToNextFiberAsync = async (fiber: MyReactFiberNode) => {
  if (enableUpdateFromRoot.current) {
    return await performToNextFiberFromRootAsync(fiber);
  } else {
    return await performToNextFiberFromFiberAsync(fiber);
  }
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
