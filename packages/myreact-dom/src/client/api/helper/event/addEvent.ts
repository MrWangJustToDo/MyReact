import { __my_react_shared__ } from "@my-react/react";
import { afterSyncUpdate, beforeSyncUpdate, safeCallWithFiber } from "@my-react/react-reconciler";

import { clearEvent, enableControlComponent, enableEventSystem, enableEventTrack, log, triggerEvent } from "@my-react-dom-shared";

import { controlElementTag, generateOnChangeFun } from "../control";

import { getNativeEventName } from "./getEventName";

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
      eventState[eventName].cb = targetCallback;
    } else {
      const eventDispatcher: ((...args: any[]) => void) & { cb?: any } = (...args: any[]) => {
        const e = args[0];

        e.nativeEvent = e;

        beforeEvent(nativeName);

        if (enableEventTrack.current) {
          triggerEvent(nativeName, fiber);
        }

        safeCallWithFiber({
          action: () => eventDispatcher.cb?.call?.(null, ...args),
          fiber,
        });

        if (enableEventTrack.current) {
          clearEvent();
        }

        afterEvent(nativeName);
      };

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
