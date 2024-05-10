import { NODE_TYPE, type MyReactFiberNode } from "@my-react/react-reconciler";
import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { validDomNesting, validDomTag } from "../../shared";
import { PlainBoxType, PlainElement, PlainTextType, PlainVirtualTextType, TextElement } from "../native";

import type { TerminalDispatch } from "../../renderDispatch";

const getValidElementTag = (elementTag: string) => {
  switch (elementTag) {
    case PlainTextType:
      return PlainTextType;
    case PlainBoxType:
      return PlainBoxType;
    case PlainVirtualTextType:
    default:
      return PlainVirtualTextType;
  }
};

export const create = (fiber: MyReactFiberNode, dispatch: TerminalDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__create__)) {
    if (__DEV__) validDomTag(fiber);

    if (__DEV__) validDomNesting(fiber, dispatch.runtimeDom.elementMap.get(fiber));

    if (include(fiber.type, NODE_TYPE.__text__)) {
      fiber.nativeNode = new TextElement(fiber.elementType.toString());
    } else if (include(fiber.type, NODE_TYPE.__plain__)) {
      const typedElementType = fiber.elementType as string;

      fiber.nativeNode = new PlainElement(getValidElementTag(typedElementType));
    } else {
      throw new Error(`unsupported element type, ${fiber.elementType?.toString()}`);
    }

    if (__DEV__) {
      fiber.nativeNode.__fiber__ = fiber;
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__create__);
  }
};
