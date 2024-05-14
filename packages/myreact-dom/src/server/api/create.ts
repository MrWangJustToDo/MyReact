import { isCommentStartElement, NODE_TYPE } from "@my-react/react-reconciler";
import { include, PATCH_TYPE, remove } from "@my-react/react-shared";

import { escapeHtml, isServer, isSingleTag } from "@my-react-dom-shared";

import { CommentEndElement, CommentStartElement, PlainElement, TextElement } from "./native";
import { getSerializeProps } from "./update";

import type { CommentElementDev, PlainElementDev, TextElementDev } from "./native";
import type { MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react-reconciler";
import type { ServerDomDispatch, LegacyServerStreamDispatch } from "@my-react-dom-server/renderDispatch";

/**
 * @internal
 */
export const create = (fiber: MyReactFiberNode, _renderDispatch: ServerDomDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__create__)) {
    if (include(fiber.type, NODE_TYPE.__text__)) {
      fiber.nativeNode = new TextElement(escapeHtml(fiber.elementType.toString()));

      if (__DEV__) {
        const typedFiber = fiber as MyReactFiberNodeDev;

        const typedNativeNode = fiber.nativeNode as TextElementDev;

        typedNativeNode._debugFiber = fiber;

        typedNativeNode._debugElement = typedFiber._debugElement;
      }
    } else if (include(fiber.type, NODE_TYPE.__plain__)) {
      const typedElementType = fiber.elementType as string;

      fiber.nativeNode = new PlainElement(typedElementType);

      if (__DEV__) {
        const typedFiber = fiber as MyReactFiberNodeDev;

        const typedNativeNode = fiber.nativeNode as PlainElementDev;

        typedNativeNode._debugFiber = fiber;

        typedNativeNode._debugElement = typedFiber._debugElement;
      }
    } else if (include(fiber.type, NODE_TYPE.__comment__)) {
      if (isCommentStartElement(fiber)) {
        fiber.nativeNode = new CommentStartElement();
      } else {
        fiber.nativeNode = new CommentEndElement();
      }

      if (__DEV__) {
        const typedFiber = fiber as MyReactFiberNodeDev;

        const typedNativeNode = fiber.nativeNode as CommentElementDev;

        typedNativeNode._debugFiber = fiber;

        typedNativeNode._debugElement = typedFiber._debugElement;
      }
    } else {
      if (isServer) throw new Error("[@my-react/react-dom] createPortal() can not call on the server");
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__create__);
  }
};

/**
 * @internal
 */
export const createStartTagWithStream = (fiber: MyReactFiberNode, renderDispatch: LegacyServerStreamDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__create__)) {
    const stream = renderDispatch.stream;

    const parentFiberWithSVG = renderDispatch.runtimeDom.svgMap.get(fiber);

    const isSVG = !!parentFiberWithSVG;

    if (include(fiber.type, NODE_TYPE.__text__)) {
      if (renderDispatch._lastIsStringNode) {
        stream.push("<!-- -->");
      }

      const text = escapeHtml(fiber.elementType as string);

      stream.push(text === "" ? " " : text);

      renderDispatch._lastIsStringNode = true;

      fiber.patch = PATCH_TYPE.__initial__;
    } else if (include(fiber.type, NODE_TYPE.__plain__)) {
      renderDispatch._lastIsStringNode = false;

      // TODO
      // <!doctype html>
      if (fiber.elementType === "html" && !renderDispatch._hasSetDoctype) {
        renderDispatch._hasSetDoctype = true;
        stream.push("<!DOCTYPE html>");
      }

      if (isSingleTag[fiber.elementType as string]) {
        const serializeProps = getSerializeProps(fiber, isSVG);
        if (serializeProps) {
          stream.push(`<${fiber.elementType as string} ${getSerializeProps(fiber, isSVG)}/>`);
        } else {
          stream.push(`<${fiber.elementType as string}/>`);
        }

        // TODO
        fiber.patch = PATCH_TYPE.__initial__;
      } else {
        const serializeProps = getSerializeProps(fiber, isSVG);
        if (serializeProps) {
          stream.push(`<${fiber.elementType as string} ${getSerializeProps(fiber, isSVG)}>`);
        } else {
          stream.push(`<${fiber.elementType as string}>`);
        }

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
      if (isServer) throw new Error("[@my-react/react-dom] createPortal() can not call on the server");
    }
  }
};

/**
 * @internal
 */
export const createCloseTagWithStream = (fiber: MyReactFiberNode, renderDispatch: LegacyServerStreamDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__create__)) {
    const stream = renderDispatch.stream;
    if (include(fiber.type, NODE_TYPE.__plain__)) {
      renderDispatch._lastIsStringNode = false;

      stream.push(`</${fiber.elementType as string}>`);

      fiber.patch = PATCH_TYPE.__initial__;
    } else {
      throw new Error("[@my-react/react-dom] unknown close tag for current element");
    }
  }
};
