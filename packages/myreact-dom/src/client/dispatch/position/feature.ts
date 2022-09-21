import { __my_react_internal__ } from "@my-react/react";

import { getFiberWithDom } from "@my-react-dom-shared";

import { append } from "./append";
import { getInsertBeforeDomFromSiblingAndParent } from "./getInsertBeforeDom";
import { insertBefore } from "./insertBefore";

import type { MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE } = __my_react_internal__;

export const position = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingPosition__) {
    const parentFiberWithDom = getFiberWithDom(fiber.parent, (f) => f.parent) as MyReactFiberNode;

    if (!parentFiberWithDom.node) throw new Error("position error, dom not exist");

    const beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithDom);

    if (beforeFiberWithDom) {
      insertBefore(fiber, beforeFiberWithDom, parentFiberWithDom);
    } else {
      append(fiber, parentFiberWithDom);
    }

    if (fiber.patch & PATCH_TYPE.__pendingPosition__) fiber.patch ^= PATCH_TYPE.__pendingPosition__;
  }
};
