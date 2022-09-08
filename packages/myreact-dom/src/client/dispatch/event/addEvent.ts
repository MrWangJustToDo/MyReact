import { __my_react_shared__, __my_react_internal__ } from "@my-react/react";

import { enableControlComponent, enableEventSystem } from "@ReactDOM_shared";

import { getNativeEventName } from "./getEventName";

import type { MyReactElement, MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react";

const { safeCallWithFiber } = __my_react_shared__;

const { globalDispatch } = __my_react_internal__;

const controlElementTag: Record<string, boolean> = {
  input: true,
  // textarea: true,
  // select: true,
};

export const addEventListener = (fiber: MyReactFiberNode, dom: Element, key: string) => {
  const typedElement = fiber.element as MyReactElement;
  const callback = typedElement.props[key] as (...args: any[]) => void;
  const { nativeName, isCapture } = getNativeEventName(key.slice(2), typedElement.type as string, typedElement.props);
  if (enableEventSystem.current) {
    const eventMap = globalDispatch.current.eventMap;
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
          if (controlElementTag[typedElement.type as string] && typeof typedElement.props["value"] !== "undefined") {
            (dom as unknown as HTMLInputElement)["value"] = typedElement.props["value"] as string;
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
