import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { enableMoveBefore, type DomElement, type DomNode } from "@my-react-dom-shared";

import type { MyReactFiberNode, MyReactFiberContainer, CustomRenderDispatch } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const append = (fiber: MyReactFiberNode, parentItemWithDom: MyReactFiberNode | CustomRenderDispatch) => {
  if (!fiber) throw new Error("[@my-react/react-dom] position error, look like a bug for @my-react");

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__position__);

  if (include(fiber.type, NODE_TYPE.__portal__)) return;

  if (include(fiber.type, NODE_TYPE.__plain__ | NODE_TYPE.__text__ | NODE_TYPE.__comment__)) {
    const maybeContainer = parentItemWithDom as MyReactFiberContainer;

    const maybeDispatch = parentItemWithDom as CustomRenderDispatch;

    const maybeFiber = parentItemWithDom as MyReactFiberNode;

    const parentDOM = (maybeFiber?.nativeNode || maybeContainer?.containerNode || maybeDispatch.rootNode) as DomElement;

    const childDOM = fiber.nativeNode as DomNode;

    if (enableMoveBefore.current && childDOM.parentNode !== null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      parentDOM.moveBefore(childDOM, null);
    } else {
      parentDOM.appendChild(childDOM);
    }

    return;
  }

  let child = fiber.child;

  while (child) {
    append(child, parentItemWithDom);

    child = child.sibling;
  }
};
