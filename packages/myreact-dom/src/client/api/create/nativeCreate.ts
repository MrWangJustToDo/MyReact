import { isCommentStartElement, NODE_TYPE } from "@my-react/react-reconciler";

import { commentS, commentE } from "@my-react-dom-shared";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

const SVG = "http://www.w3.org/2000/svg";

export const nativeCreate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  if (fiber.type & NODE_TYPE.__text__) {
    fiber.nativeNode = document.createTextNode(fiber.element as string);
  } else if (fiber.type & NODE_TYPE.__plain__) {
    const typedElementType = fiber.elementType as string;

    if (isSVG) {
      fiber.nativeNode = document.createElementNS(SVG, typedElementType);
    } else {
      fiber.nativeNode = document.createElement(typedElementType);
    }
  } else if (fiber.type & NODE_TYPE.__portal__) {
    const fiberContainer = fiber as MyReactFiberContainer;

    const containerNode = fiber.pendingProps["container"] as Element;

    fiberContainer.containerNode = containerNode;

    if (__DEV__) containerNode.setAttribute?.("portal", "@my-react");
  } else if (fiber.type & NODE_TYPE.__comment__) {
    if (isCommentStartElement(fiber)) {
      fiber.nativeNode = document.createComment(commentS);
    } else {
      fiber.nativeNode = document.createComment(commentE);
    }
  }
};
