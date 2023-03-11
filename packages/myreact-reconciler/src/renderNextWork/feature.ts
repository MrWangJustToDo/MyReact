import { __my_react_internal__ } from "@my-react/react";
import { UPDATE_TYPE } from "@my-react/react-shared";

import { classComponentCatch } from "../runtimeComponent";
import { nextWorkCommon, runtimeNextWork, runtimeNextWorkAsync } from "../runtimeGenerate";

import type { MyReactFiberNode, RenderController } from "@my-react/react";

const { currentFunctionFiber, currentRunningFiber, currentComponentFiber } = __my_react_internal__;

export const performToNextArray = (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return [];

  if (fiber.isInvoked && !(fiber.mode & UPDATE_TYPE.__needUpdate__)) return [];

  currentRunningFiber.current = fiber;

  const children = runtimeNextWork(fiber);

  fiber.isInvoked = true;

  currentRunningFiber.current = null;

  return children;
};

export const performToNextArrayAsync = async (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return [];

  if (fiber.isInvoked && !(fiber.mode & UPDATE_TYPE.__needUpdate__)) return [];

  currentRunningFiber.current = fiber;

  const children = runtimeNextWorkAsync(fiber);

  fiber.isInvoked = true;

  currentRunningFiber.current = null;

  return children;
};

export const performToNextFiber = (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return null;

  if (!fiber.isInvoked || fiber.mode & UPDATE_TYPE.__needUpdate__) {
    currentRunningFiber.current = fiber;

    runtimeNextWork(fiber);

    fiber.isInvoked = true;

    currentRunningFiber.current = null;

    if (fiber.children.length) {
      return fiber.child;
    }
  }

  const renderController = fiber.root.renderController as RenderController;

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

    runtimeNextWorkAsync(fiber);

    fiber.isInvoked = true;

    currentRunningFiber.current = null;

    if (fiber.children.length) {
      return fiber.child;
    }
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

export const performToNextArrayOnError = (fiber: MyReactFiberNode, error: Error, targetFiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return null;

  if (fiber.isInvoked && !(fiber.mode & UPDATE_TYPE.__needUpdate__)) return [];

  currentRunningFiber.current = fiber;

  currentComponentFiber.current = fiber;

  const childrenNode = classComponentCatch(fiber, error, targetFiber);

  const children = nextWorkCommon(fiber, childrenNode);

  fiber.isInvoked = true;

  currentRunningFiber.current = null;

  currentFunctionFiber.current = null;

  currentComponentFiber.current = null;

  return children;
};

export const performToNextFiberOnError = (fiber: MyReactFiberNode, error: Error, targetFiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return null;

  if (!fiber.isInvoked || fiber.mode & UPDATE_TYPE.__needUpdate__) {
    currentRunningFiber.current = fiber;

    currentComponentFiber.current = fiber;

    const children = classComponentCatch(fiber, error, targetFiber);

    nextWorkCommon(fiber, children);

    fiber.isInvoked = true;

    currentRunningFiber.current = null;

    currentFunctionFiber.current = null;

    currentComponentFiber.current = null;

    if (fiber.children.length) {
      return fiber.child;
    }
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
