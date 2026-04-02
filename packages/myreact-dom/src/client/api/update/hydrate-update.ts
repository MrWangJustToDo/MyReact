import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { enableControlComponent, enableEventSystem, getValidParentFiberWithSVG, isEvent, isProperty, isStyle } from "@my-react-dom-shared";

import { addEventListener, controlElementTag, hydrateAttribute, hydrateInnerHtml, hydrateStyle, hydrateTextContent, initSelect } from "../helper";

import { mountControl } from "./control";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { DomElement, DomNode } from "@my-react-dom-shared";

const domContentHydrate = hydrateTextContent;

const domPropsHydrate = hydrateAttribute;

const domStyleHydrate = (fiber: MyReactFiberNode, _key: string, value: Record<string, unknown>) => {
  const node = fiber.nativeNode as HTMLElement;

  Object.keys(value).forEach((styleName) => hydrateStyle(fiber, node, styleName, value[styleName] as string | number | null | undefined));
};

const domEventHydrate = (renderDispatch: ClientDomDispatch, fiber: MyReactFiberNode, key: string) => {
  const node = fiber.nativeNode;

  addEventListener(fiber, renderDispatch.runtimeDom.eventMap, node as DomElement, key);
};

const domInnerHTMLHydrate = hydrateInnerHtml;

/**
 * @internal
 */
export const hydrateUpdate = (renderDispatch: ClientDomDispatch, fiber: MyReactFiberNode) => {
  const node = fiber.nativeNode as DomElement | DomNode;

  if (node) {
    const parentFiberWithSVG = getValidParentFiberWithSVG(renderDispatch, fiber);

    const isSVG = !!parentFiberWithSVG;

    if (include(fiber.type, NODE_TYPE.__plain__)) {
      const props = fiber.pendingProps;

      const dom = node as HTMLElement;

      Object.keys(props).forEach(function hydrateUpdateProps(key) {
        if (isEvent(key)) {
          domEventHydrate(renderDispatch, fiber, key);
        } else if (isStyle(key)) {
          domStyleHydrate(fiber, key, (props[key] as Record<string, unknown>) || {});
        } else if (isProperty(key)) {
          try {
            domPropsHydrate(fiber, dom, key, isSVG, props[key]);
          } catch {
            void 0;
          }
        }
      });

      if (enableEventSystem.current && enableControlComponent.current && controlElementTag[fiber.elementType as string]) {
        mountControl(renderDispatch, fiber);
        if (fiber.elementType === "select") {
          requestAnimationFrame(() => initSelect(fiber));
        }
      }

      domInnerHTMLHydrate(fiber);
    }

    if (include(fiber.type, NODE_TYPE.__text__)) {
      domContentHydrate(fiber);
    }
  }

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__update__);

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__position__);
};
