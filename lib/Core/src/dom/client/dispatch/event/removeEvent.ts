import { enableEventSystem } from '../../../../share';

import { getNativeEventName } from './getEventName';

import type { Children } from '../../../../element';
import type { MyReactFiberNode } from '../../../../fiber';

export const removeEventListener = (
  fiber: MyReactFiberNode,
  dom: Element,
  key: string
) => {
  const typedElement = fiber.__prevVdom__ as Children;
  const callback = typedElement.props[key] as (...args: any[]) => void;
  const { nativeName, isCapture } = getNativeEventName(
    key.slice(2),
    typedElement.type as string,
    typedElement.props
  );
  if (enableEventSystem.current) {
    const eventState = fiber.__internal_node_event__;
    const eventName = `${nativeName}_${isCapture}`;
    if (!eventState[eventName]) return;
    eventState[eventName].cb = eventState[eventName].cb?.filter(
      (c) => c !== callback || typeof c !== 'function'
    );
  } else {
    dom.removeEventListener(nativeName, callback, isCapture);
  }
};
