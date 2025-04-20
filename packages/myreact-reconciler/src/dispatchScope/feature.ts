import { include } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultResolveScope = (fiber: MyReactFiberNode) => {
  let parent = fiber.parent;

  while (parent) {
    if (include(parent.type, NODE_TYPE.__scope__) || include(parent.type, NODE_TYPE.__scopeSuspense__)) {
      return parent;
    }
    parent = parent.parent;
  }

  return null;
};
