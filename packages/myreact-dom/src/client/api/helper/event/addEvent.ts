import { __my_react_shared__ } from "@my-react/react";
import { afterSyncUpdate, beforeSyncUpdate, callWithFiber } from "@my-react/react-reconciler";

import { clearEvent, triggerEvent } from "@my-react-dom-client/tools";
import { enableControlComponent, enableEventSystem, enableEventTrack, log } from "@my-react-dom-shared";

import { controlElementTag, generateOnChangeFun } from "../control";

import { getNativeEventName } from "./getEventName";
import { wrapperFrameworkEvent } from "./wrapper";

import type { MyReactFiberNodeDev, MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { DomElement } from "@my-react-dom-shared";

const { enableDebugFiled } = __my_react_shared__;

// TODO
const syncUpdateEvent = {
  click: true,
  input: true,
  change: true,
  keydown: true,
  keyup: true,
  scroll: true,
  dblclick: true,
  mousedown: true,
  mouseup: true,
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

  const callback = pendingProps[key] as ((...args: any[]) => void) & { _attached?: number };

  let targetCallback = callback;

  if (enableEventSystem.current && enableControlComponent.current && controlElementTag[typedElementType] && (key === "onChange" || key === "onInput")) {
    targetCallback = generateOnChangeFun(fiber);
  }

  if (!targetCallback) return;

  if (typeof targetCallback !== "function") {
    if (__DEV__) log(fiber, "warn", `current props with key '${key}' is not a valid props`);

    return;
  }

  const { nativeName, isCapture } = getNativeEventName(key.slice(2), typedElementType, pendingProps);

  if (enableEventSystem.current) {
    const eventState = eventMap.get(fiber) || {};

    const eventName = `${nativeName}_${isCapture}`;

    if (eventState[eventName]) {
      const prevCallback = eventState[eventName].cb;

      targetCallback._attached = prevCallback?._attached || Date.now();

      eventState[eventName].cb = targetCallback;
    } else {
      const eventDispatcher: ((...args: any[]) => void) & { cb?: any } = (...args: any[]) => {
        if (!eventDispatcher.cb || typeof eventDispatcher.cb !== "function") return;

        const e = args[0];

        if (!isCapture) {
          if (!e._dispatched) {
            e._dispatched = Date.now();
          } else if (e._dispatched <= eventDispatcher.cb._attached) {
            return;
          }
        }

        wrapperFrameworkEvent(e);

        beforeEvent(nativeName);

        if (enableEventTrack.current) {
          triggerEvent(eventName, fiber);
        }

        callWithFiber({
          action: function callEventCallback() {
            eventDispatcher.cb?.call?.(null, ...args);
          },
          fiber,
        });

        if (enableEventTrack.current) {
          clearEvent();
        }

        afterEvent(nativeName);
      };

      targetCallback._attached = Date.now();

      eventDispatcher.cb = targetCallback;

      eventState[eventName] = eventDispatcher;

      dom.addEventListener(nativeName, eventDispatcher, isCapture);
    }

    eventMap.set(fiber, eventState);

    if (__DEV__ && enableDebugFiled.current) {
      const typedFiber = fiber as MyReactFiberNodeDev;

      typedFiber._debugEventMap = eventState;
    }
  } else {
    dom.addEventListener(nativeName, callback, isCapture);
  }
};
