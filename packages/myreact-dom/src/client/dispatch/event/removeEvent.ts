import { enableEventSystem } from "@ReactDOM_shared";

import { getNativeEventName } from "./getEventName";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

export const removeEventListener = (fiber: MyReactFiberNode, dom: Element, key: string) => {
  const globalDispatch = fiber.root.dispatch;

  const typedElement = fiber.element as MyReactElement;

  const currentProps = fiber.memoizedProps || {};

  const callback = currentProps[key] as (...args: any[]) => void;

  const { nativeName, isCapture } = getNativeEventName(key.slice(2), typedElement.type as string, currentProps);

  if (enableEventSystem.current) {
    const eventMap = globalDispatch.eventMap;

    const eventState = eventMap[fiber.uid];

    const eventName = `${nativeName}_${isCapture}`;

    if (!eventState[eventName]) return;

    eventState[eventName].cb = eventState[eventName].cb?.filter((c) => c !== callback || typeof c !== "function");
  } else {
    dom.removeEventListener(nativeName, callback, isCapture);
  }
};
