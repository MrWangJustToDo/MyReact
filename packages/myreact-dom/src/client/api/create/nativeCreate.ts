import { isCommentStartElement, NODE_TYPE } from "@my-react/react-reconciler";

import { commentS, commentE } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react";

const SVG = "http://www.w3.org/2000/svg";

export const nativeCreate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  if (fiber.type & NODE_TYPE.__isTextNode__) {
    fiber.node = document.createTextNode(fiber.element as string);
  } else if (fiber.type & NODE_TYPE.__isPlainNode__) {
    const typedElementType = fiber.elementType as string;

    if (isSVG) {
      fiber.node = document.createElementNS(SVG, typedElementType);
    } else {
      fiber.node = document.createElement(typedElementType);
    }
  } else if (fiber.type & NODE_TYPE.__isPortal__) {
    fiber.node = fiber.pendingProps["container"] as Element;

    if (__DEV__) {
      (fiber.node as Element).setAttribute?.("portal", "MyReact");
    }
  } else if (fiber.type & NODE_TYPE.__isCommentNode__) {
    if (isCommentStartElement(fiber)) {
      fiber.node = document.createComment(commentS);
    } else {
      fiber.node = document.createComment(commentE);
    }
  }
};
