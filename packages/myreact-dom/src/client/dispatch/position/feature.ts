import { __my_react_internal__ } from "@my-react/react";

import { append } from "./append";
import { getInsertBeforeDomFromSiblingAndParent } from "./getInsertBeforeDom";
import { insertBefore } from "./insertBefore";

import type { DomFiberNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE } = __my_react_internal__;

export const position = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingPosition__) {
    const beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithDom);

    if (beforeFiberWithDom) {
      insertBefore(fiber, beforeFiberWithDom.node as DomFiberNode, parentFiberWithDom.node as DomFiberNode);
    } else {
      append(fiber, parentFiberWithDom.node as DomFiberNode);
    }

    if (fiber.patch & PATCH_TYPE.__pendingPosition__) fiber.patch ^= PATCH_TYPE.__pendingPosition__;
  }
};
