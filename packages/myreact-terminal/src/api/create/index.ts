import { NODE_TYPE, type MyReactFiberNode } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import { validDomNesting, validDomTag } from "../../shared";
import { PlainBoxType, PlainElement, PlainTextType, PlainVirtualTextType, TextElement } from "../native";

import type { TerminalDispatch } from "../../renderDispatch";

const getValidElementTag = (elementTag: string) => {
  switch(elementTag) {
    case PlainTextType:
      return PlainTextType;
    case PlainBoxType:
      return PlainBoxType;
    case PlainVirtualTextType:
    default:
      return PlainVirtualTextType;
  }
}

export const create = (fiber: MyReactFiberNode, dispatch: TerminalDispatch) => {
  if (fiber.patch & PATCH_TYPE.__create__) {
    if (__DEV__) validDomTag(fiber);

    if (__DEV__) validDomNesting(fiber, dispatch.runtimeDom.elementMap.get(fiber));

    if (fiber.type & NODE_TYPE.__text__) {
      fiber.nativeNode = new TextElement(fiber.element as string);
    } else if (fiber.type & NODE_TYPE.__plain__) {
      const typedElementType = fiber.elementType as string;

      fiber.nativeNode = new PlainElement(getValidElementTag(typedElementType));
    } else {
      throw new Error(`unSupport element type, ${fiber.elementType?.toString()}`)
    }

    if (fiber.patch & PATCH_TYPE.__create__) fiber.patch ^= PATCH_TYPE.__create__;
  }
};
