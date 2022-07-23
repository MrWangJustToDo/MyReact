import { globalDispatch, isNormalEquals } from '../share';

import type { Children, ChildrenNode } from '../vdom';
import type { MyReactFiberNode } from './instance';

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
  newChild: ChildrenNode
) => {
  fiber.installParent(parent);

  const prevVDom = fiber.__vdom__;

  fiber.installVDom(newChild);

  const newVDom = fiber.__vdom__;

  fiber.checkVDom();

  if (prevVDom !== newVDom) {
    if (fiber.__isMemo__) {
      const typedPrevVDom = prevVDom as Children;
      const typedNewVDom = newVDom as Children;
      if (
        !fiber.__needTrigger__ &&
        isNormalEquals(typedPrevVDom.props, typedNewVDom.props)
      ) {
        if (fiber.__needReconcile__) {
          fiber.afterUpdate();
        } else {
          fiber.stopUpdate();
        }
      } else {
        fiber.prepareUpdate();
      }
    } else {
      fiber.prepareUpdate();

      if (fiber.__isContextProvider__) {
        const typedPrevVDom = prevVDom as Children;
        const typedNewVDom = newVDom as Children;
        if (
          !isNormalEquals(
            typedPrevVDom.props.value as Record<string, unknown>,
            typedNewVDom.props.value as Record<string, unknown>
          )
        ) {
          globalDispatch.current.pendingContext(fiber);
        }
      }

      if (fiber.__isPlainNode__) {
        const typedPrevVDom = prevVDom as Children;
        const typedNewVDom = newVDom as Children;
        if (!isNormalEquals(typedPrevVDom.props, typedNewVDom.props, false)) {
          globalDispatch.current.pendingUpdate(fiber);
        }
      }

      if (fiber.__isTextNode__) {
        globalDispatch.current.pendingUpdate(fiber);
      }
    }
  }

  if (fiber !== prevFiber) {
    globalDispatch.current.pendingPosition(fiber);
  }

  return fiber;
};
