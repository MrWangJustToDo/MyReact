import { enableEventSystem } from "@my-react-dom-shared";

import { getNativeEventName } from "./getEventName";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";
import type { DomElement } from "@my-react-dom-shared";

/**
 * @internal
 */
export const removeEventListener = (fiber: MyReactFiberNode, eventMap: ClientDomDispatch["runtimeMap"]["eventMap"], dom: DomElement, key: string) => {
  const typedElementType = fiber.elementType as string;

  const currentProps = fiber.memoizedProps || {};

  const callback = currentProps[key] as (...args: any[]) => void;

  if (!callback) return;

  const { nativeName, isCapture } = getNativeEventName(key.slice(2), typedElementType, currentProps);

  if (enableEventSystem.current) {
    // TODO
    const eventState = eventMap.get(fiber) || {};

    const eventName = `${nativeName}_${isCapture}`;

    if (!eventState[eventName]) return;

    eventState[eventName].cb = eventState[eventName].cb?.filter((c) => c !== callback || typeof c !== "function");
  } else {
    dom.removeEventListener(nativeName, callback, isCapture);
  }
};
