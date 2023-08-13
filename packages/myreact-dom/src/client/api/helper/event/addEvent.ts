import { afterSyncUpdate, beforeSyncUpdate, safeCallWithFiber } from "@my-react/react-reconciler";

import { enableEventSystem } from "@my-react-dom-shared";

import { getNativeEventName } from "./getEventName";

import type { MyReactFiberNodeDev, MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";
import type { DomElement } from "@my-react-dom-shared";

// TODO
const syncUpdateEvent = {
  click: true,
  input: true,
  chang: true,
  scroll: true,
  dblclick: true,
  mousedown: true,
};

const beforeEvent = (event: string) => {
  if (syncUpdateEvent[event]) {
    beforeSyncUpdate();
  }
};

const afterEvent = (event: string) => {
  if (syncUpdateEvent[event]) {
    afterSyncUpdate();
  }
};

/**
 * @internal
 */
export const addEventListener = (fiber: MyReactFiberNode, eventMap: ClientDomDispatch["runtimeMap"]["eventMap"], dom: DomElement, key: string) => {
  const typedElementType = fiber.elementType as string;

  const pendingProps = fiber.pendingProps;

  const callback = pendingProps[key] as (...args: any[]) => void;

  if (!callback) return;

  const { nativeName, isCapture } = getNativeEventName(key.slice(2), typedElementType, pendingProps);

  if (enableEventSystem.current) {
    const eventState = eventMap.get(fiber) || {};

    const eventName = `${nativeName}_${isCapture}`;

    if (eventState[eventName]) {
      eventState[eventName].cb?.push(callback);
    } else {
      const eventDispatcher: ((...args: any[]) => void) & { cb?: any[] } = (...args: any[]) => {
        const e = args[0];

        e.nativeEvent = e;

        beforeEvent(nativeName);

        safeCallWithFiber({
          action: () => eventDispatcher.cb?.forEach((cb) => typeof cb === "function" && cb.call(null, ...args)),
          fiber,
        });

        afterEvent(nativeName);
      };

      eventDispatcher.cb = [callback];

      eventState[eventName] = eventDispatcher;

      dom.addEventListener(nativeName, eventDispatcher, isCapture);
    }

    eventMap.set(fiber, eventState);

    if (__DEV__) {
      const typedFiber = fiber as MyReactFiberNodeDev;

      typedFiber._debugEventMap = eventState;
    }
  } else {
    dom.addEventListener(nativeName, callback, isCapture);
  }
};
