import { __my_react_internal__ } from "@my-react/react";

import { getInstanceFieldByInstance, initInstance, initVisibleInstance, setOwnerForInstance } from "../runtimeGenerate";
import { WrapperBySuspenseScope } from "../runtimeScope";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { VisibleInstanceField } from "../runtimeGenerate";

const { MyReactInternalInstance } = __my_react_internal__;

export const processSuspense = (fiber: MyReactFiberNode) => {
  const isUpdate = !!fiber.instance;

  fiber.instance = fiber.instance || new MyReactInternalInstance();

  !isUpdate && initInstance(fiber.instance);

  !isUpdate && initVisibleInstance(fiber.instance);

  setOwnerForInstance(fiber.instance, fiber);

  const instanceField = getInstanceFieldByInstance(fiber.instance) as VisibleInstanceField;

  const children = WrapperBySuspenseScope(instanceField.isHidden ? fiber.pendingProps.fallback : fiber.pendingProps.children);

  return children;
};
