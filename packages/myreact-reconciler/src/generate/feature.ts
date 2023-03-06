import { __my_react_internal__ } from "@my-react/react";
import { NODE_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import { classComponentCatch } from "../component";

import { nextWorkCommon, nextWorkComponent, nextWorkLazySync, nextWorkNormal, nextWorkObject } from "./invoke";

import type { MyReactFiberNode } from "@my-react/react";

const { currentFunctionFiber, currentRunningFiber, currentComponentFiber } = __my_react_internal__;

export const performToNextArray = (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return [];

  if (fiber.isInvoked && !(fiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__))) return [];

  currentRunningFiber.current = fiber;

  let children: MyReactFiberNode[] = [];

  if (fiber.type & NODE_TYPE.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.type & NODE_TYPE.__isObjectNode__) children = nextWorkObject(fiber);
  else children = nextWorkNormal(fiber);

  fiber.isInvoked = true;

  currentRunningFiber.current = null;

  return children;
};

export const performToNextArrayAsync = async (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return [];

  if (fiber.isInvoked && !(fiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__))) return [];

  currentRunningFiber.current = fiber;

  let children: MyReactFiberNode[] = [];

  if (fiber.type & NODE_TYPE.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.type & NODE_TYPE.__isLazy__) children = await nextWorkLazySync(fiber);
  else if (fiber.type & NODE_TYPE.__isObjectNode__) children = nextWorkObject(fiber);
  else children = nextWorkNormal(fiber);

  fiber.isInvoked = true;

  currentRunningFiber.current = null;

  return children;
};

export const performToNextFiber = (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return null;

  if (!fiber.isInvoked || fiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__)) {
    currentRunningFiber.current = fiber;

    if (fiber.type & NODE_TYPE.__isDynamicNode__) nextWorkComponent(fiber);
    else if (fiber.type & NODE_TYPE.__isObjectNode__) nextWorkObject(fiber);
    else nextWorkNormal(fiber);

    fiber.isInvoked = true;

    currentRunningFiber.current = null;

    if (fiber.children.length) {
      return fiber.child;
    }
  }

  const renderController = fiber.root.renderController;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderController.getTopLevel()) {
    renderController.getUpdateList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderController.getTopLevel()) {
    renderController.getUpdateList(nextFiber);
  }

  return null;
};

export const performToNextFiberAsync = async (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return null;

  if (!fiber.isInvoked || fiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__)) {
    currentRunningFiber.current = fiber;

    if (fiber.type & NODE_TYPE.__isDynamicNode__) nextWorkComponent(fiber);
    else if (fiber.type & NODE_TYPE.__isLazy__) await nextWorkLazySync(fiber);
    else if (fiber.type & NODE_TYPE.__isObjectNode__) nextWorkObject(fiber);
    else nextWorkNormal(fiber);

    fiber.isInvoked = true;

    currentRunningFiber.current = null;

    if (fiber.children.length) {
      return fiber.child;
    }
  }

  const renderController = fiber.root.renderController;

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== renderController.getTopLevel()) {
    renderController.getUpdateList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderController.getTopLevel()) {
    renderController.getUpdateList(nextFiber);
  }

  return null;
};

export const performToNextArrayOnError = (fiber: MyReactFiberNode, error: Error, targetFiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return null;

  if (fiber.isInvoked && !(fiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__))) return [];

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

  if (!fiber.isInvoked || fiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__)) {
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

  while (nextFiber && nextFiber !== renderController.getTopLevel()) {
    renderController.getUpdateList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === renderController.getTopLevel()) {
    renderController.getUpdateList(nextFiber);
  }

  return null;
};
