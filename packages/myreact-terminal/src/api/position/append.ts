import { NODE_TYPE } from "@my-react/react-reconciler";
import { include, PATCH_TYPE, remove } from "@my-react/react-shared";

import { appendChildNode, type DOMNode, type PlainElement } from "../native";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

export const append = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (!fiber) throw new Error("position error, look like a bug for @my-react");

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__position__);

  if (include(fiber.type, NODE_TYPE.__portal__)) return;

  if (include(fiber.type, NODE_TYPE.__plain__ | NODE_TYPE.__text__ | NODE_TYPE.__comment__)) {
    const maybeContainer = parentFiberWithDom as MyReactFiberContainer;

    const parentDOM = (parentFiberWithDom.nativeNode || maybeContainer.containerNode) as PlainElement;

    const childDOM = fiber.nativeNode as DOMNode;

    appendChildNode(parentDOM, childDOM);
    return;
  }

  let child = fiber.child;

  while (child) {
    append(child, parentFiberWithDom);

    child = child.sibling;
  }
};
