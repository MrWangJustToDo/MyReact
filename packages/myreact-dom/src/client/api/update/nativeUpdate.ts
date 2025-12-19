import { NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { enableControlComponent, enableEventSystem, isEvent, isProperty, isStyle } from "@my-react-dom-shared";

import {
  addEventListener,
  controlElementTag,
  initSelect,
  removeEventListener,
  setAttribute,
  setInnerHtml,
  setStyle,
  setTextContent,
  updateSelect,
} from "../helper";

import { mountControl, updateControl } from "./control";
import { getAllKeys } from "./tool";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { DomElement, DomNode } from "@my-react-dom-shared";

const isFalse = (v: any) => v === null || v === undefined;

/**
 * @internal
 */
export const nativeUpdate = (renderDispatch: ClientDomDispatch, fiber: MyReactFiberNode, isMount: boolean) => {
  if (!fiber.nativeNode) throw new Error("[@my-react/react-dom] update error, dom not exist");

  const node = fiber.nativeNode as DomElement | DomNode;

  const parentFiberWithSVG = renderDispatch.runtimeDom.svgMap.get(fiber);

  const isSVG = !!parentFiberWithSVG;

  if (include(fiber.type, NODE_TYPE.__text__)) {
    setTextContent(fiber);
  } else if (include(fiber.type, NODE_TYPE.__plain__)) {
    const dom = node as HTMLElement;

    const oldProps = fiber.memoizedProps || {};

    const newProps = fiber.pendingProps || {};

    const allKeys = getAllKeys(oldProps, newProps);

    allKeys.forEach(function nativeUpdateProps(key) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (!Object.is(oldValue, newValue) && !(isFalse(newValue) && isFalse(oldValue))) {
        if (isEvent(key)) {
          removeEventListener(fiber, renderDispatch.runtimeDom.eventMap, node as DomElement, key);
          addEventListener(fiber, renderDispatch.runtimeDom.eventMap, node as DomElement, key);
        } else if (isStyle(key)) {
          const typedNewValue = (newValue as Record<string, unknown>) || {};
          const typedOldValue = (oldValue as Record<string, unknown>) || {};
          const allStyleKeys = getAllKeys(typedOldValue, typedNewValue);
          const arrayStyleKeys = Array.from(allStyleKeys);
          arrayStyleKeys
            .filter((key) => !Object.is(typedOldValue[key], typedNewValue[key]))
            .forEach((key) => setStyle(fiber, dom, key, typedNewValue[key] as string | number | null | undefined));
        } else if (isProperty(key)) {
          try {
            setAttribute(fiber, dom, key, isSVG, newValue);
          } catch {
            void 0;
          }
        }
      }
    });

    if (enableEventSystem.current && enableControlComponent.current && controlElementTag[fiber.elementType as string]) {
      if (isMount) {
        mountControl(renderDispatch, fiber);
        if (fiber.elementType === "select") {
          requestAnimationFrame(() => initSelect(fiber));
        }
      } else {
        updateControl(renderDispatch, fiber);
        if (fiber.elementType === "select") {
          requestAnimationFrame(() => updateSelect(fiber));
        }
      }
    }

    setInnerHtml(fiber);
  }
};
