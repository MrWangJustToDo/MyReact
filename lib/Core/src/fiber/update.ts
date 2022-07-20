import { pushPosition, pushUpdate } from '../core';
import { isNormalEquals } from '../share';

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

  if (prevVDom !== newVDom) {
    // only need update if vdom changed
    fiber.prepareUpdate();

    if (fiber.__isMemo__) {
      const typedPrevVDom = prevVDom as Children;
      const typedNewVDom = newVDom as Children;
      if (
        !fiber.__needTrigger__ &&
        isNormalEquals(typedPrevVDom.props, typedNewVDom.props)
      ) {
        fiber.afterUpdate();
      }
    }

    if (fiber.__isContextProvider__) {
      const typedPrevVDom = prevVDom as Children;
      const typedNewVDom = newVDom as Children;
      if (
        !isNormalEquals(
          typedPrevVDom.props.value as Record<string, unknown>,
          typedNewVDom.props.value as Record<string, unknown>
        )
      ) {
        fiber.__pendingContext__ = true;
      }
    }

    if (fiber.__isPlainNode__) {
      const typedPrevVDom = prevVDom as Children;
      const typedNewVDom = newVDom as Children;
      if (!isNormalEquals(typedPrevVDom.props, typedNewVDom.props, false)) {
        pushUpdate(fiber);
      }
    }

    if (fiber.__isTextNode__) {
      pushUpdate(fiber);
    }
  }

  if (fiber !== prevFiber) {
    pushPosition(fiber);
  }

  return fiber;
};
