import { PATCH_TYPE } from "@my-react/react-shared";

import { hydrateUpdate } from "./hydrateUpdate";
import { nativeUpdate } from "./nativeUpdate";

import type { DomFiberNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

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
