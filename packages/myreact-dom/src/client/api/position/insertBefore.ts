import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";
import type { DomElement, DomNode } from "@my-react-dom-shared";

export const insertBefore = (fiber: MyReactFiberNode, beforeFiberWithDom: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (!fiber) throw new Error("position error, look like a bug");

  if (fiber.patch & PATCH_TYPE.__append__) fiber.patch ^= PATCH_TYPE.__append__;

  if (fiber.patch & PATCH_TYPE.__position__) fiber.patch ^= PATCH_TYPE.__position__;

  if (fiber.type & NODE_TYPE.__portal__) return;

  if (fiber.type & (NODE_TYPE.__plain__ | NODE_TYPE.__text__ | NODE_TYPE.__comment__)) {
    const maybeContainer = parentFiberWithDom as MyReactFiberContainer;

    const parentDOM = (parentFiberWithDom.nativeNode || maybeContainer.containerNode) as DomElement;

    // the before dom will not have containerNode
    const beforeDOM = beforeFiberWithDom.nativeNode as DomNode;

    if (__DEV__ && !beforeDOM) {
      console.error("not have a before dom node");
    }

    const childDOM = fiber.nativeNode as DomNode;

    parentDOM.insertBefore(childDOM, beforeDOM);

    return;
  }

  let child = fiber.child;

  while (child) {
    insertBefore(child, beforeFiberWithDom, parentFiberWithDom);

    child = child.sibling;
  }
};
