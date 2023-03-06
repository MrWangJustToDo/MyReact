import { isCommentStartElement } from "@my-react/react-reconciler";
import { NODE_TYPE } from "@my-react/react-shared";

import { commentS, commentE } from "@my-react-dom-shared";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

const SVG = "http://www.w3.org/2000/svg";

export const nativeCreate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  if (fiber.type & NODE_TYPE.__isTextNode__) {
    fiber.node = document.createTextNode(fiber.element as string);
  } else if (fiber.type & NODE_TYPE.__isPlainNode__) {
    const typedElement = fiber.element as MyReactElement;

    if (isSVG) {
      fiber.node = document.createElementNS(SVG, typedElement.type as string);
    } else {
      fiber.node = document.createElement(typedElement.type as string);
    }
  } else if (fiber.type & NODE_TYPE.__isPortal__) {
    const typedElement = fiber.element as MyReactElement;

    fiber.node = typedElement.props["container"] as Element;

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
