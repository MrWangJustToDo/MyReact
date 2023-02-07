import { enableControlComponent, enableEventSystem, safeCallWithFiber } from "@my-react-dom-shared";

import { getNativeEventName } from "./getEventName";

import type { MyReactElement, MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react";
import type { DomElement } from "@my-react-dom-shared";

const controlElementTag: Record<string, boolean> = {
  input: true,
  // textarea: true,
  // select: true,
};

type ControlledElement = HTMLInputElement & {
  __isControlled__: boolean;
  __isReadonly__: boolean;
};

export const addEventListener = (fiber: MyReactFiberNode, dom: DomElement, key: string) => {
  const globalDispatch = fiber.root.globalDispatch;

  const typedElement = fiber.element as MyReactElement;

  const pendingProps = fiber.pendingProps;

  const callback = pendingProps[key] as (...args: any[]) => void;

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

            typedDom["value"] = pendingProps["value"] as string;
          }
        }
      };

      if (enableControlComponent.current) {
        if (controlElementTag[typedElement.type as string]) {
          if ("value" in typedElement.props) {
            const typedDom = dom as ControlledElement;
            if ("onChange" in typedElement.props) {
              typedDom.__isControlled__ = true;
            } else {
              typedDom.__isReadonly__ = true;
            }
          }
        }
      }

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
