import { isCommentStartElement, NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import { getSerializeProps } from "@my-react-dom-server";
import { IS_SINGLE_ELEMENT } from "@my-react-dom-shared";

import { CommentEndElement, CommentStartElement, PlainElement, TextElement } from "./native";

import type { MyReactFiberNode } from "@my-react/react";
import type { ServerStreamPlatform } from "@my-react-dom-server";

export const create = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingCreate__) {
    if (fiber.type & NODE_TYPE.__isTextNode__) {
      fiber.node = new TextElement(fiber.element as string);
    } else if (fiber.type & NODE_TYPE.__isPlainNode__) {
      const typedElementType = fiber.elementType as string;

      fiber.node = new PlainElement(typedElementType);
    } else if (fiber.type & NODE_TYPE.__isCommentNode__) {
      if (isCommentStartElement(fiber)) {
        fiber.node = new CommentStartElement();
      } else {
        fiber.node = new CommentEndElement();
      }
    } else {
      throw new Error("createPortal() can not call on the server");
    }

    if (fiber.patch & PATCH_TYPE.__pendingCreate__) fiber.patch ^= PATCH_TYPE.__pendingCreate__;
  }
};

export const createStartTagWithStream = (fiber: MyReactFiberNode, isSVG?: boolean) => {
  if (fiber.patch & PATCH_TYPE.__pendingCreate__) {
    const renderPlatform = fiber.root.renderPlatform as ServerStreamPlatform;

    const stream = renderPlatform.stream;
    if (fiber.type & NODE_TYPE.__isTextNode__) {
      if (renderPlatform.lastIsStringNode) {
        stream.push("<!-- -->");
      }
      stream.push(fiber.element as string);

      renderPlatform.lastIsStringNode = true;

      fiber.patch = PATCH_TYPE.__initial__;
    } else if (fiber.type & NODE_TYPE.__isPlainNode__) {
      renderPlatform.lastIsStringNode = false;

      if (Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, fiber.elementType as string)) {
        stream.push(`<${fiber.elementType as string} ${getSerializeProps(fiber, isSVG)}/>`);

        fiber.patch = PATCH_TYPE.__initial__;
      } else {
        stream.push(`<${fiber.elementType as string} ${getSerializeProps(fiber, isSVG)}>`);

        if (fiber.pendingProps["dangerouslySetInnerHTML"]) {
          const typedProps = fiber.pendingProps["dangerouslySetInnerHTML"] as Record<string, unknown>;

          stream.push(typedProps.__html as string);
        }
      }
    } else if (fiber.type & NODE_TYPE.__isCommentNode__) {
      renderPlatform.lastIsStringNode = false;

      if (isCommentStartElement(fiber)) {
        stream.push("<!-- [ -->");
      } else {
        stream.push("<!-- ] -->");
      }

      fiber.patch = PATCH_TYPE.__initial__;
    } else {
      throw new Error("createPortal() can not call on the server");
    }
  }
};

export const createCloseTagWithStream = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingCreate__) {
    const renderPlatform = fiber.root.renderPlatform as ServerStreamPlatform;

    const stream = renderPlatform.stream;
    if (fiber.type & NODE_TYPE.__isPlainNode__) {
      renderPlatform.lastIsStringNode = false;

      stream.push(`</${fiber.elementType as string}>`);

      fiber.patch = PATCH_TYPE.__initial__;
    } else {
      throw new Error("unknown close tag for current element");
    }
  }
};
