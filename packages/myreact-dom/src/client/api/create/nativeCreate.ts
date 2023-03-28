import { isCommentStartElement, NODE_TYPE } from "@my-react/react-reconciler";

import { commentS, commentE } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const SVG = "http://www.w3.org/2000/svg";

export const nativeCreate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  if (fiber.type & NODE_TYPE.__isTextNode__) {
    fiber.nativeNode = document.createTextNode(fiber.element as string);
  } else if (fiber.type & NODE_TYPE.__isPlainNode__) {
    const typedElementType = fiber.elementType as string;

    if (isSVG) {
      fiber.nativeNode = document.createElementNS(SVG, typedElementType);
    } else {
      fiber.nativeNode = document.createElement(typedElementType);
    }
  } else if (fiber.type & NODE_TYPE.__isPortal__) {
    fiber.nativeNode = fiber.pendingProps["container"] as Element;

    if (__DEV__) (fiber.nativeNode as Element).setAttribute?.("portal", "MyReact");
  } else if (fiber.type & NODE_TYPE.__isCommentNode__) {
    if (isCommentStartElement(fiber)) {
      fiber.nativeNode = document.createComment(commentS);
    } else {
      fiber.nativeNode = document.createComment(commentE);
    }
  }
};
