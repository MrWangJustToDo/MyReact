import { enableEventSystem, safeCallWithFiber } from '../../../../share';

import { getNativeEventName } from './getEventName';

import type { Children } from '../../../../element';
import type { MyReactFiberNode } from '../../../../fiber';

export const addEventListener = (
  fiber: MyReactFiberNode,
  dom: Element,
  key: string
) => {
  const typedElement = fiber.element as Children;
  const callback = typedElement.props[key] as (...args: any[]) => void;
  const { nativeName, isCapture } = getNativeEventName(
    key.slice(2),
    typedElement.type as string,
    typedElement.props
  );
  if (enableEventSystem.current) {
    const eventState = fiber.__internal_node_event__;
    const eventName = `${nativeName}_${isCapture}`;
    if (eventState[eventName]) {
      eventState[eventName].cb?.push(callback);
    } else {
      const handler: ((...args: any[]) => void) & { cb?: any[] } = (
        ...args: any[]
      ) => {
        const e = args[0];
        e.nativeEvent = e;
        safeCallWithFiber({
          action: () =>
            handler.cb?.forEach(
              (cb) => typeof cb === 'function' && cb.call(null, ...args)
            ),
          fiber,
        });
      };
      handler.cb = [callback];
      eventState[eventName] = handler;
      dom.addEventListener(nativeName, handler, isCapture);
    }
  } else {
    dom.addEventListener(nativeName, callback, isCapture);
  }
};
