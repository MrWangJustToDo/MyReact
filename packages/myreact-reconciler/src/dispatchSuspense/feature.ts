import { include } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { PromiseWithState } from "../processPromise";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactElementNode } from "@my-react/react";

export const defaultReadPromise = (_promise: PromiseWithState<unknown>) => {
  if (_promise.state === 'fulfilled') {
    return _promise.value;
  } else if (_promise.state === 'rejected') {
    throw _promise.reason;
  } else {
    throw _promise;
  }
};

export const defaultResolveSuspense = (fiber: MyReactFiberNode): MyReactElementNode => {
  let parent = fiber.parent;

  while (parent) {
    if (include(parent.type, NODE_TYPE.__suspense__)) {
      return parent.pendingProps?.["fallback"];
    }
    parent = parent.parent;
  }

  return null;
};
