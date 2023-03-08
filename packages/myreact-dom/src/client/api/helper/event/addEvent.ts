import { safeCallWithFiber } from "@my-react/react-reconciler";

import { enableControlComponent, enableEventSystem } from "@my-react-dom-shared";

import { getNativeEventName } from "./getEventName";

import type { MyReactFiberNode } from "@my-react/react";
import type { MyReactFiberNodeDev, RenderDispatch } from "@my-react/react-reconciler";
import type { DomElement } from "@my-react-dom-shared";

export const controlElementTag: Record<string, boolean> = {
  input: true,
  // textarea: true,
  // select: true,
};

type ControlledElement = HTMLInputElement & {
  __isControlled__: boolean;
  __isReadonly__: boolean;
};

export const addEventListener = (fiber: MyReactFiberNode, dom: DomElement, key: string) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

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

        safeCallWithFiber({
          action: () => handler.cb?.forEach((cb) => typeof cb === "function" && cb.call(null, ...args)),
          fiber,
        });

        if (enableControlComponent.current) {
          requestAnimationFrame(() => {
            const pendingProps = fiber.pendingProps;

            if (controlElementTag[typedElementType] && typeof pendingProps["value"] !== "undefined") {
              const typedDom = dom as ControlledElement;

              typedDom["value"] = pendingProps["value"] as string;

              if (typedDom.__isControlled__) {
                typedDom.setAttribute("my_react_controlled_value", String(pendingProps["value"]));
              }
              if (typedDom.__isReadonly__) {
                typedDom.setAttribute("my_react_readonly_value", String(pendingProps["value"]));
              }
            }
          });
        }
      };

      if (enableControlComponent.current) {
        if (controlElementTag[typedElementType]) {
          if ("value" in pendingProps) {
            const typedDom = dom as ControlledElement;
            if ("onChange" in pendingProps) {
              typedDom.__isControlled__ = true;
              typedDom.setAttribute("my_react_input", "controlled");
            } else {
              typedDom.__isReadonly__ = true;
              typedDom.setAttribute("my_react_input", "readonly");
            }
          }
        }
      }

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
