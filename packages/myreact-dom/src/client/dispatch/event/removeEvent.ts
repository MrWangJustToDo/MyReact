import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { enableEventSystem } from "@ReactDOM_shared";

import { getNativeEventName } from "./getEventName";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

const { globalDispatch } = __my_react_internal__;

const { log } = __my_react_shared__;

export const removeEventListener = (fiber: MyReactFiberNode, dom: Element, key: string) => {
  const typedElement = fiber.element as MyReactElement;
  const currentProps = fiber.memoizedProps || {};
  const callback = currentProps[key] as (...args: any[]) => void;
  const { nativeName, isCapture } = getNativeEventName(key.slice(2), typedElement.type as string, currentProps);
  if (__DEV__) {
    if (typeof callback !== "function") {
      log({ fiber, message: `invalid callback, look like a bug`, level: "warn" });
    }
  }
  if (enableEventSystem.current) {
    const eventMap = globalDispatch.current.eventMap;
    const eventState = eventMap[fiber.uid];
    const eventName = `${nativeName}_${isCapture}`;
    if (!eventState[eventName]) return;
    eventState[eventName].cb = eventState[eventName].cb?.filter((c) => c !== callback || typeof c !== "function");
  } else {
    dom.removeEventListener(nativeName, callback, isCapture);
  }
};
