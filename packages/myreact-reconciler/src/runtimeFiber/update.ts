import { exclude, include, isNormalEquals, merge, remove, STATE_TYPE } from "@my-react/react-shared";

import { currentRenderDispatch, NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { MyReactElement, MyReactElementNode, memo } from "@my-react/react";

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
  const prevElementType = fiber.elementType;

  const prevProps = fiber.memoizedProps;

  const prevRef = fiber.ref;

  const renderDispatch = currentRenderDispatch.current;

  fiber.parent = parent;

  fiber.sibling = null;

  parent.child = parent.child || fiber;

  nextElement = fiber._installElement(nextElement);

  const nextElementType = fiber.elementType;

  const nextProps = fiber.pendingProps;

  const nextRef = fiber.ref;

  if (prevElementType !== nextElementType || prevProps !== nextProps) {
    if (include(fiber.type, NODE_TYPE.__memo__)) {
      const typedElement = nextElement as MyReactElement;

      const typedElementType = typedElement.type as ReturnType<typeof memo>;

      const compare = typedElementType.compare || isNormalEquals;

      if (
        exclude(
          fiber.state,
          STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__ | STATE_TYPE.__triggerSyncForce__ | STATE_TYPE.__triggerConcurrentForce__
        ) &&
        compare(fiber.pendingProps, fiber.memoizedProps)
      ) {
        fiber.state = STATE_TYPE.__stable__;
      } else {
        fiber.state = remove(fiber.state, STATE_TYPE.__stable__);

        fiber.state = merge(fiber.state, STATE_TYPE.__inherit__);
      }
    } else {
      fiber.state = remove(fiber.state, STATE_TYPE.__stable__);

      fiber.state = merge(fiber.state, STATE_TYPE.__inherit__);
    }
  }

  if (fiber.state !== STATE_TYPE.__stable__) {
    if (include(fiber.type, NODE_TYPE.__plain__)) {
      if (!isNormalEquals(fiber.pendingProps, fiber.memoizedProps, (key: string) => key === "children")) {
        renderDispatch.pendingUpdate(fiber);
      }
    }

    if (include(fiber.type, NODE_TYPE.__text__)) {
      renderDispatch.pendingUpdate(fiber);
    }
  }

  if (nextRef && prevRef !== nextRef) {
    renderDispatch.pendingRef(fiber);
  }

  if (fiber !== prevFiber) {
    renderDispatch.pendingPosition(fiber);
  }

  // if (exclude(fiber.patch, PATCH_TYPE.__update__)) {
  //   fiber.memoizedProps = fiber.pendingProps;
  // }

  return fiber;
};
