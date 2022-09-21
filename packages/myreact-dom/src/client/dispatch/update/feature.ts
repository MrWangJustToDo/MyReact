import { __my_react_internal__ } from "@my-react/react";

import { hydrateUpdate } from "./hydrateUpdate";
import { nativeUpdate } from "./nativeUpdate";

import type { DomFiberNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE } = __my_react_internal__;

export const update = (fiber: MyReactFiberNode, hydrate: boolean, isSVG: boolean) => {
  if (fiber.patch & PATCH_TYPE.__pendingUpdate__) {
    if (hydrate) {
      hydrateUpdate(fiber, isSVG);
    } else {
      nativeUpdate(fiber, isSVG);
    }

    const typedNode = fiber.node as DomFiberNode;

    typedNode.memoizedProps = fiber.pendingProps;

    if (fiber.patch & PATCH_TYPE.__pendingUpdate__) fiber.patch ^= PATCH_TYPE.__pendingUpdate__;
  }
};
