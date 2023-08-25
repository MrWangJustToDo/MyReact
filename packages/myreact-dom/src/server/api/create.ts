import { isCommentStartElement, NODE_TYPE } from "@my-react/react-reconciler";
import { include, PATCH_TYPE, remove } from "@my-react/react-shared";

import { escapeHtml, isSingleTag, validDomNesting, validDomTag } from "@my-react-dom-shared";

import { CommentEndElement, CommentStartElement, PlainElement, TextElement } from "./native";
import { getSerializeProps } from "./update";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ServerDomDispatch, ServerStaticStreamDispatch, ServerStreamDispatch } from "@my-react-dom-server/renderDispatch";

/**
 * @internal
 */
export const create = (fiber: MyReactFiberNode, renderDispatch: ServerDomDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__create__)) {
    if (__DEV__) validDomTag(fiber);

    if (__DEV__) validDomNesting(fiber, renderDispatch.runtimeDom.elementMap.get(fiber).parentFiberWithNode);

    if (include(fiber.type, NODE_TYPE.__text__)) {
      fiber.nativeNode = new TextElement(fiber.elementType as string);
    } else if (include(fiber.type, NODE_TYPE.__plain__)) {
      const typedElementType = fiber.elementType as string;

      fiber.nativeNode = new PlainElement(typedElementType);
    } else if (include(fiber.type, NODE_TYPE.__comment__)) {
      if (isCommentStartElement(fiber)) {
        fiber.nativeNode = new CommentStartElement();
      } else {
        fiber.nativeNode = new CommentEndElement();
      }
    } else {
      throw new Error("[@my-react/react-dom-server] createPortal() can not call on the server");
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__create__);
  }
};

/**
 * @internal
 */
export const createStartTagWithStream = (fiber: MyReactFiberNode, renderDispatch: ServerStreamDispatch | ServerStaticStreamDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__create__)) {
    const stream = renderDispatch.stream;

    const { isSVG } = renderDispatch.runtimeDom.elementMap.get(fiber) || {};

    if (include(fiber.type, NODE_TYPE.__text__)) {
      if (renderDispatch._lastIsStringNode) {
        stream.push("<!-- -->");
      }

      stream.push(escapeHtml(fiber.elementType as string));

      renderDispatch._lastIsStringNode = true;

      fiber.patch = PATCH_TYPE.__initial__;
    } else if (include(fiber.type, NODE_TYPE.__plain__)) {
      renderDispatch._lastIsStringNode = false;

      if (isSingleTag[fiber.elementType as string]) {
        stream.push(`<${fiber.elementType as string} ${getSerializeProps(fiber, isSVG)}/>`);

        // TODO
        fiber.patch = PATCH_TYPE.__initial__;
      } else {
        stream.push(`<${fiber.elementType as string} ${getSerializeProps(fiber, isSVG)}>`);

        if (fiber.pendingProps["dangerouslySetInnerHTML"]) {
          const typedProps = fiber.pendingProps["dangerouslySetInnerHTML"] as Record<string, unknown>;

          stream.push(typedProps.__html as string);
        }
      }
    } else if (include(fiber.type, NODE_TYPE.__comment__)) {
      renderDispatch._lastIsStringNode = false;

      if (isCommentStartElement(fiber)) {
        stream.push("<!-- [ -->");
      } else {
        stream.push("<!-- ] -->");
      }

      fiber.patch = PATCH_TYPE.__initial__;
    } else {
      throw new Error("[@my-react/react-dom-server] createPortal() can not call on the server");
    }
  }
};

/**
 * @internal
 */
export const createCloseTagWithStream = (fiber: MyReactFiberNode, renderDispatch: ServerStreamDispatch | ServerStaticStreamDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__create__)) {
    const stream = renderDispatch.stream;
    if (include(fiber.type, NODE_TYPE.__plain__)) {
      renderDispatch._lastIsStringNode = false;

      stream.push(`</${fiber.elementType as string}>`);

      fiber.patch = PATCH_TYPE.__initial__;
    } else {
      throw new Error("[@my-react/react-dom-server] unknown close tag for current element");
    }
  }
};
