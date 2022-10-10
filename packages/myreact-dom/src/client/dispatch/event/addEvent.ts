import { __my_react_shared__ } from "@my-react/react";

import { enableControlComponent, enableEventSystem } from "@my-react-dom-shared";

import { getNativeEventName } from "./getEventName";

import type { DomFiberNode } from "@my-react-dom-shared";
import type { MyReactElement, MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react";

const { safeCallWithFiber } = __my_react_shared__;

const controlElementTag: Record<string, boolean> = {
  input: true,
  // textarea: true,
  // select: true,
};

type ControlledElement = HTMLInputElement & {
  __isControlled__: boolean;
};

export const addEventListener = (fiber: MyReactFiberNode, node: DomFiberNode, key: string) => {
  const globalDispatch = fiber.root.root_dispatch;

  const typedElement = fiber.element as MyReactElement;

  const pendingProps = fiber.pendingProps;

  const callback = pendingProps[key] as (...args: any[]) => void;

  const { element: dom } = node;

  const { nativeName, isCapture } = getNativeEventName(key.slice(2), typedElement.type as string, typedElement.props);

  if (enableEventSystem.current) {
    const eventMap = globalDispatch.eventMap;

    const eventState = eventMap[fiber.uid] || {};

    const eventName = `${nativeName}_${isCapture}`;

    if (eventState[eventName]) {
      eventState[eventName].cb?.push(callback);
    } else {
      const handler: ((...args: any[]) => void) & { cb?: any[] } = (...args: any[]) => {
        const e = args[0];

        e.nativeEvent = e;

        safeCallWithFiber({
          action: () => handler.cb?.forEach((cb) => typeof cb === "function" && cb.call(null, ...args)),
          fiber,
        });

        if (enableControlComponent.current) {
          const pendingProps = fiber.pendingProps;
          if (controlElementTag[typedElement.type as string] && typeof pendingProps["value"] !== "undefined") {
            const typedDom = dom as ControlledElement;
            typedDom.__isControlled__ = true;
            typedDom["value"] = pendingProps["value"] as string;
          }
        }
      };

      handler.cb = [callback];

      eventState[eventName] = handler;

      dom.addEventListener(nativeName, handler, isCapture);
    }

    eventMap[fiber.uid] = eventState;

    if (__DEV__) {
      const typedFiber = fiber as MyReactFiberNodeDev;

      typedFiber._debugEventMap = eventState;
    }
  } else {
    dom.addEventListener(nativeName, callback, isCapture);
  }
};
