import { globalDispatch, isNormalEquals } from "../share";

import { NODE_TYPE, UPDATE_TYPE } from "./symbol";

import type { MyReactElement, MyReactElementNode } from "../element";
import type { MyReactFiberNode } from "./instance";

export const updateFiberNode = (
  {
    fiber,
    parent,
    prevFiber,
  }: {
    fiber: MyReactFiberNode;
    parent: MyReactFiberNode;
    prevFiber: MyReactFiberNode;
  },
  nextElement: MyReactElementNode
) => {
  fiber.installParent(parent);

  const prevElement = fiber.element;

  fiber.installElement(nextElement);

  if (__DEV__) {
    fiber.checkElement();
  }

  if (prevElement !== nextElement) {
    if (fiber.type & NODE_TYPE.__isMemo__) {
      const typedPrevElement = prevElement as MyReactElement;
      const typedNextElement = nextElement as MyReactElement;
      if (!(fiber.mode & UPDATE_TYPE.__trigger__) && isNormalEquals(typedPrevElement.props, typedNextElement.props)) {
        fiber.afterUpdate();
      } else {
        fiber.prepareUpdate();
      }
    } else {
      fiber.prepareUpdate();

      if (fiber.type & NODE_TYPE.__isContextProvider__) {
        const typedPrevElement = prevElement as MyReactElement;
        const typedNextElement = nextElement as MyReactElement;
        if (
          !isNormalEquals(
            typedPrevElement.props.value as Record<string, unknown>,
            typedNextElement.props.value as Record<string, unknown>
          )
        ) {
          globalDispatch.current.pendingContext(fiber);
        }
      }

      if (fiber.type & NODE_TYPE.__isPlainNode__) {
        const typedPrevElement = prevElement as MyReactElement;
        const typedNextElement = nextElement as MyReactElement;
        if (!isNormalEquals(typedPrevElement.props, typedNextElement.props, false)) {
          globalDispatch.current.pendingUpdate(fiber);
        }
      }

      if (fiber.type & NODE_TYPE.__isTextNode__) {
        globalDispatch.current.pendingUpdate(fiber);
      }
    }
  }

  if (fiber !== prevFiber) {
    globalDispatch.current.pendingPosition(fiber);
  }

  return fiber;
};
