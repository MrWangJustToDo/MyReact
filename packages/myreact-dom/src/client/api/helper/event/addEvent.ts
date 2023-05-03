import { __my_react_shared__ } from "@my-react/react";
import { safeCallWithFiber } from "@my-react/react-reconciler";

import { enableEventSystem } from "@my-react-dom-shared";

import { getNativeEventName } from "./getEventName";

import type { MyReactFiberNodeDev, MyReactFiberNode } from "@my-react/react-reconciler";
import type { ControlledElement } from "@my-react-dom-client";
import type { DomElement } from "@my-react-dom-shared";

const { enableSyncFlush } = __my_react_shared__;

// TODO
const syncUpdateEvent = {
  click: true,
  input: true,
  chang: true,
  scroll: true,
  dblclick: true,
  mousedown: true,
};

let prev = true;

const beforeEvent = (event: string) => {
  if (syncUpdateEvent[event]) {
    prev = enableSyncFlush.current;

    enableSyncFlush.current = true;
  }
};

const afterEvent = (event: string) => {
  if (syncUpdateEvent[event]) {
    enableSyncFlush.current = prev;
  }
};

export const addEventListener = (fiber: MyReactFiberNode, dom: DomElement, key: string, isControlled: boolean) => {
  const renderContainer = fiber.renderContainer;

  const renderDispatch = renderContainer.renderDispatch;

  const typedElementType = fiber.elementType as string;

  const pendingProps = fiber.pendingProps;

  const callback = pendingProps[key] as (...args: any[]) => void;

  const { nativeName, isCapture } = getNativeEventName(key.slice(2), typedElementType, pendingProps);

  if (enableEventSystem.current) {
    const eventMap = renderDispatch.eventMap;

    const eventState = eventMap.get(fiber) || {};

    const eventName = `${nativeName}_${isCapture}`;

    if (eventState[eventName]) {
      eventState[eventName].cb?.push(callback);
    } else {
      const handler: ((...args: any[]) => void) & { cb?: any[] } = (...args: any[]) => {
        const e = args[0];

        e.nativeEvent = e;

        beforeEvent(nativeName);

        safeCallWithFiber({
          action: () => handler.cb?.forEach((cb) => typeof cb === "function" && cb.call(null, ...args)),
          fiber,
        });

        afterEvent(nativeName);

        if (isControlled) {
          requestAnimationFrame(() => {
            const pendingProps = fiber.pendingProps;

            if (typeof pendingProps["value"] !== "undefined") {
              const typedDom = dom as ControlledElement;

              typedDom["value"] = pendingProps["value"] as string;
            }
          });
        }
      };

      handler.cb = [callback];

      eventState[eventName] = handler;

      dom.addEventListener(nativeName, handler, isCapture);
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
