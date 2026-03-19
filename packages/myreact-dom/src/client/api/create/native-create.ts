import { isCommentStartElement, NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { commentS, commentE } from "@my-react-dom-shared";

import type { MyReactFiberNode, MyReactFiberContainer, CustomRenderDispatch } from "@my-react/react-reconciler";
import type { DomElement } from "@my-react-dom-shared";

const SVG = "http://www.w3.org/2000/svg";

const getOwnerDocumentFromRootContainer = (rootContainerElement: Element): Document =>
  (rootContainerElement?.nodeType === Node.DOCUMENT_NODE ? (rootContainerElement as unknown as Document) : rootContainerElement?.ownerDocument) || document;

/**
 * @internal
 */
export const nativeCreate = (fiber: MyReactFiberNode, isSVG: boolean, parentItemWithDom: MyReactFiberNode | CustomRenderDispatch) => {
  const maybeContainer = parentItemWithDom as MyReactFiberContainer;

  const maybeDispatch = parentItemWithDom as CustomRenderDispatch;

  const maybeFiber = parentItemWithDom as MyReactFiberNode;

  const parentDom = (maybeFiber?.nativeNode || maybeContainer?.containerNode || maybeDispatch.rootNode) as DomElement;

  const ownerDoc = getOwnerDocumentFromRootContainer(parentDom);

  if (include(fiber.type, NODE_TYPE.__text__)) {
    fiber.nativeNode = ownerDoc.createTextNode(fiber.elementType as string);
  } else if (include(fiber.type, NODE_TYPE.__plain__)) {
    const typedElementType = fiber.elementType as string;

    if (isSVG) {
      fiber.nativeNode = ownerDoc.createElementNS(SVG, typedElementType);
    } else {
      if (typeof fiber.pendingProps?.is === "string") {
        fiber.nativeNode = ownerDoc.createElement(typedElementType, { is: fiber.pendingProps.is });
      } else {
        fiber.nativeNode = ownerDoc.createElement(typedElementType);
      }
    }
  } else if (include(fiber.type, NODE_TYPE.__portal__)) {
    const fiberContainer = fiber as MyReactFiberContainer;

    const containerNode = fiber.pendingProps["container"] as Element;

    fiberContainer.containerNode = containerNode;

    if (__DEV__) containerNode.setAttribute?.("portal", "@my-react");
  } else if (include(fiber.type, NODE_TYPE.__comment__)) {
    if (isCommentStartElement(fiber)) {
      fiber.nativeNode = ownerDoc.createComment(commentS);
    } else {
      fiber.nativeNode = ownerDoc.createComment(commentE);
    }
  }
};
