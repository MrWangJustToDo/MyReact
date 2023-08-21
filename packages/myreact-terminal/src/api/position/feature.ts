import { PATCH_TYPE, STATE_TYPE, include, remove } from "@my-react/react-shared";

import { getFiberWithNativeDom } from "../../shared";

import { append } from "./append";
import { getInsertBeforeDomFromSiblingAndParent } from "./getInsertBeforeDom";
import { insertBefore } from "./insertBefore";

import type { TerminalDispatch } from "../../renderDispatch";
import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

export const position = (fiber: MyReactFiberNode, renderDispatch: TerminalDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__position__)) {
    let parentFiberWithNode = renderDispatch.runtimeDom.elementMap.get(fiber);

    if (!parentFiberWithNode || include(parentFiberWithNode.state, STATE_TYPE.__unmount__)) {
      parentFiberWithNode = getFiberWithNativeDom(fiber.parent, (f) => f.parent) as MyReactFiberNode;

      renderDispatch.runtimeDom.elementMap.set(fiber, parentFiberWithNode);
    }

    const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

    if (!parentFiberWithNode?.nativeNode && !maybeContainer?.containerNode) throw new Error(`position error, current render node not have a container node`);

    const beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithNode);

    if (beforeFiberWithDom) {
      insertBefore(fiber, beforeFiberWithDom, parentFiberWithNode);
    } else {
      append(fiber, parentFiberWithNode);
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__position__);
  }
};
