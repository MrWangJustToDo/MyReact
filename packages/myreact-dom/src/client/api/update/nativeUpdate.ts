import { emptyProps, NODE_TYPE } from "@my-react/react-reconciler";

import { enableControlComponent, enableHighlight, isEvent, isProperty, isStyle } from "@my-react-dom-shared";

import { addEventListener, removeEventListener, setAttribute, setStyle } from "../helper";

import { controlElementTag, mountControlElement, prepareControlProp, updateControlElement } from "./controlled";
import { HighLight } from "./highlight";
import { getAllKeys } from "./tool";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";
import type { DomElement, DomNode } from "@my-react-dom-shared";

export const nativeUpdate = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch) => {
  if (!fiber.nativeNode) throw new Error("update error, dom not exist");

  const node = fiber.nativeNode as DomElement | DomNode;

  const { isSVG } = renderDispatch.runtimeDom.elementMap.get(fiber) || {};

  if (fiber.type & NODE_TYPE.__text__) {
    node.textContent = fiber.elementType as string;
  } else if (fiber.type & NODE_TYPE.__plain__) {
    const dom = node as HTMLElement;

    const isCanControlledElement = enableControlComponent.current && controlElementTag[fiber.elementType as string];

    if (isCanControlledElement) {
      prepareControlProp(fiber);
    }

    if (isCanControlledElement) {
      if (fiber.memoizedProps === emptyProps) {
        mountControlElement(fiber);
      } else {
        updateControlElement(fiber);
      }
    }

    const oldProps = fiber.memoizedProps || {};

    const newProps = fiber.pendingProps || {};

    const allKeys = getAllKeys(oldProps, newProps);

    allKeys.forEach((key) => {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (!Object.is(oldValue, newValue)) {
        if (isEvent(key)) {
          removeEventListener(fiber, renderDispatch.runtimeMap.eventMap, node as DomElement, key);
          addEventListener(fiber, renderDispatch.runtimeMap.eventMap, node as DomElement, key, isCanControlledElement);
        } else if (isStyle(key)) {
          const typedNewValue = (newValue as Record<string, unknown>) || {};
          const typedOldValue = (oldValue as Record<string, unknown>) || {};
          const allStyleKeys = getAllKeys(typedOldValue, typedNewValue);
          allStyleKeys.forEach((key) => setStyle(dom, key, typedNewValue[key] as string | number | null | undefined));
        } else if (isProperty(key)) {
          setAttribute(fiber, dom, key, isSVG, newValue);
        }
      }
    });

    if (
      newProps["dangerouslySetInnerHTML"] &&
      newProps["dangerouslySetInnerHTML"] !== oldProps["dangerouslySetInnerHTML"] &&
      newProps["dangerouslySetInnerHTML"].__html !== oldProps["dangerouslySetInnerHTML"]?.__html
    ) {
      const typedProps = newProps["dangerouslySetInnerHTML"] as Record<string, unknown>;
      dom.innerHTML = typedProps.__html as string;
    }
  }

  if (
    renderDispatch.isAppMounted &&
    !renderDispatch.isHydrateRender &&
    !renderDispatch.isServerRender &&
    (enableHighlight.current || (window as any).__highlight__)
  ) {
    HighLight.getHighLightInstance().highLight(fiber);
  }
};
