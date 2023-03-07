import { enableEventSystem } from "@my-react-dom-shared";

import { getNativeEventName } from "./getEventName";

import type { MyReactFiberNode } from "@my-react/react";
import type { RenderDispatch } from "@my-react/react-reconciler";
import type { DomElement } from "@my-react-dom-shared";

export const removeEventListener = (fiber: MyReactFiberNode, dom: DomElement, key: string) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const typedElementType = fiber.elementType as string;

  const currentProps = fiber.memoizedProps || {};

  const callback = currentProps[key] as (...args: any[]) => void;

  const { nativeName, isCapture } = getNativeEventName(key.slice(2), typedElementType, currentProps);

  if (enableEventSystem.current) {
    const eventMap = renderDispatch.eventMap;

    const eventState = eventMap.get(fiber);

    const eventName = `${nativeName}_${isCapture}`;

    if (!eventState[eventName]) return;

    eventState[eventName].cb = eventState[eventName].cb?.filter((c) => c !== callback || typeof c !== "function");
  } else {
    dom.removeEventListener(nativeName, callback, isCapture);
  }
};
