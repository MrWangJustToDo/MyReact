import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import { appendChildNode, insertBeforeNode } from "../native";

import type { DOMNode, PlainElement} from "../native";
import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

export const insertBefore = (fiber: MyReactFiberNode, beforeFiberWithDom: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (!fiber) throw new Error("position error, look like a bug for @my-react");

  if (fiber.patch & PATCH_TYPE.__append__) fiber.patch ^= PATCH_TYPE.__append__;

  if (fiber.patch & PATCH_TYPE.__position__) fiber.patch ^= PATCH_TYPE.__position__;

  if (fiber.type & NODE_TYPE.__portal__) return;

  if (fiber.type & (NODE_TYPE.__plain__ | NODE_TYPE.__text__ | NODE_TYPE.__comment__)) {
    const maybeContainer = parentFiberWithDom as MyReactFiberContainer;

    const parentDOM = (parentFiberWithDom.nativeNode || maybeContainer.containerNode) as PlainElement;

    // the before dom will not have containerNode
    const beforeDOM = beforeFiberWithDom.nativeNode as DOMNode;

    if (__DEV__ && !beforeDOM) {
      console.error("not have a before dom node, look like a bug for @my-react");
    }

    const childDOM = fiber.nativeNode as DOMNode;

    try {
      insertBeforeNode(parentDOM, childDOM, beforeDOM);
    } catch {
      console.error("position error, look like a bug for @my-react");
      appendChildNode(parentDOM, childDOM)
    }

    return;
  }

  let child = fiber.child;

  while (child) {
    insertBefore(child, beforeFiberWithDom, parentFiberWithDom);

    child = child.sibling;
  }
};
