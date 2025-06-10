import { exclude, include, STATE_TYPE } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { PromiseWithState } from "../processPromise";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactElementNode } from "@my-react/react";

// TODO use Symbol to avoid conflict
export const defaultReadPromise = (_promise: PromiseWithState<unknown>) => {
  if (_promise.status === "fulfilled") {
    return _promise._value;
  } else if (_promise.status === "rejected") {
    throw _promise._reason;
  } else {
    throw _promise;
  }
};

export const defaultResolveSuspenseValue = (fiber: MyReactFiberNode): MyReactElementNode => {
  let parent = fiber.parent;

  while (parent) {
    if (include(parent.type, NODE_TYPE.__suspense__)) {
      return parent.pendingProps?.["fallback"];
    }
    parent = parent.parent;
  }

  return null;
};

export const defaultResolveSuspenseFiber = (fiber: MyReactFiberNode): MyReactFiberNode => {
  let parent = fiber.parent;

  while (parent) {
    if (include(parent.type, NODE_TYPE.__suspense__)) {
      return parent;
    }
    parent = parent.parent;
  }

  return null;
};

export const defaultResolveAliveSuspenseFiber = (fiber: MyReactFiberNode): MyReactFiberNode => {
  while (fiber) {
    if (include(fiber.type, NODE_TYPE.__suspense__) && exclude(fiber.state, STATE_TYPE.__unmount__)) {
      return fiber;
    }
    fiber = fiber.parent;
  }
};
