import { exclude, include, STATE_TYPE } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { PromiseWithState } from "../processPromise";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactElementNode } from "@my-react/react/type";

// TODO use Symbol to avoid conflict
export function defaultReadPromise(_promise: PromiseWithState<unknown>) {
  if (_promise.status === "fulfilled") {
    // @lazarv/rsc and React 19 thenables expose `value`; MyReact's internal
    // promises use `_value`. Support both shapes.
    return _promise._value !== undefined ? _promise._value : _promise.value;
  } else if (_promise.status === "rejected") {
    throw _promise._reason !== undefined ? _promise._reason : _promise.reason;
  } else {
    throw _promise;
  }
}

export function defaultResolveSuspenseValue(fiber: MyReactFiberNode): MyReactElementNode {
  let parent = fiber.parent;

  while (parent) {
    if (include(parent.type, NODE_TYPE.__suspense__)) {
      return parent.pendingProps?.["fallback"];
    }
    parent = parent.parent;
  }

  return null;
}

export function defaultResolveSuspenseFiber(fiber: MyReactFiberNode): MyReactFiberNode | null {
  let parent = fiber.parent;

  while (parent) {
    if (include(parent.type, NODE_TYPE.__suspense__)) {
      return parent;
    }
    parent = parent.parent;
  }

  return null;
}

export function defaultResolveAliveSuspenseFiber(fiber?: MyReactFiberNode | null): MyReactFiberNode | null | undefined {
  while (fiber) {
    if (include(fiber.type, NODE_TYPE.__suspense__) && exclude(fiber.state, STATE_TYPE.__unmount__)) {
      return fiber;
    }
    fiber = fiber.parent;
  }
}
