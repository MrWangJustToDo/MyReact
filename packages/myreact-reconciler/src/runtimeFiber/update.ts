import { __my_react_shared__ } from "@my-react/react";
import { exclude, include, isNormalEquals, merge, PATCH_TYPE, remove, STATE_TYPE } from "@my-react/react-shared";

import { prepareUpdateAllDependence } from "../dispatchContext";
import { currentRenderDispatch, NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { MyReactElement, MyReactElementNode, memo } from "@my-react/react";

const { enableLoopFromRoot } = __my_react_shared__;

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

  fiber._updateElement(nextElement);

  const nextElementType = fiber.elementType;

  const nextProps = fiber.pendingProps;

  const nextRef = fiber.ref;

  if (prevElementType !== nextElementType || prevProps !== nextProps) {
    if (include(fiber.type, NODE_TYPE.__memo__)) {
      const typedElement = nextElement as MyReactElement;

      const typedElementType = typedElement.type as ReturnType<typeof memo>;

      if (
        exclude(fiber.state, STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__) &&
        typedElementType.compare(fiber.pendingProps, fiber.memoizedProps)
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
    if (include(fiber.type, NODE_TYPE.__provider__)) {
      if (!isNormalEquals(fiber.pendingProps.value as Record<string, unknown>, fiber.memoizedProps.value as Record<string, unknown>)) {
        // if current is root loop mode, should not delay context update
        if (enableLoopFromRoot.current) {
          prepareUpdateAllDependence(fiber);
        } else {
          renderDispatch.pendingContext(fiber);
        }
      }
    }

    if (include(fiber.type, NODE_TYPE.__plain__)) {
      if (!isNormalEquals(fiber.pendingProps, fiber.memoizedProps, (key: string) => key === "children")) {
        renderDispatch.pendingUpdate(fiber);
      }
    }

    if (include(fiber.type, NODE_TYPE.__text__)) {
      renderDispatch.pendingUpdate(fiber);
    }

    renderDispatch.patchToFiberUpdate?.(fiber);
  }

  if (nextRef && prevRef !== nextRef) {
    renderDispatch.pendingRef(fiber);
  }

  if (fiber !== prevFiber) {
    renderDispatch.pendingPosition(fiber);
  }

  if (exclude(fiber.patch, PATCH_TYPE.__update__)) {
    fiber.memoizedProps = fiber.pendingProps;
  }

  return fiber;
};
