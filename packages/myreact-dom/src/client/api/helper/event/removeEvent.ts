import { enableEventSystem } from "@my-react-dom-shared";

import { getNativeEventName } from "./getEventName";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { DomElement } from "@my-react-dom-shared";

/**
 * @internal
 */
export const removeEventListener = (fiber: MyReactFiberNode, eventMap: ClientDomDispatch["runtimeDom"]["eventMap"], dom: DomElement, key: string) => {
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

    eventState[eventName].cb = null;
  } else {
    dom.removeEventListener(nativeName, callback, isCapture);
  }
};
