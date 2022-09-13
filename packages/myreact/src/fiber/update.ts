import { isNormalEquals } from "../share";

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
  const prevElement = fiber.element;

  // make sure invoke `installParent` after `installElement`
  fiber.installElement(nextElement);

  fiber.installParent(parent);

  const globalDispatch = fiber.root.dispatch;

  if (__DEV__) {
    fiber.checkElement();
  }

  // TODO
  if (!(fiber.type & NODE_TYPE.__isPlainNode__) && !(fiber.type & NODE_TYPE.__isTextNode__)) {
    fiber.applyElement();
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
          globalDispatch.pendingContext(fiber);
        }
      }

      if (fiber.type & NODE_TYPE.__isPlainNode__) {
        const typedPrevElement = prevElement as MyReactElement;
        const typedNextElement = nextElement as MyReactElement;
        if (!isNormalEquals(typedPrevElement.props, typedNextElement.props, false)) {
          globalDispatch.pendingUpdate(fiber);
        }
      }

      if (fiber.type & NODE_TYPE.__isTextNode__) {
        globalDispatch.pendingUpdate(fiber);
      }
    }
  }

  if (fiber !== prevFiber) {
    globalDispatch.pendingPosition(fiber);
  }

  return fiber;
};
