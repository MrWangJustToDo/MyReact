import { isValidElement } from "@my-react/react";
import { isNormalEquals, PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { debugWithNode, getTypeFromElementNode, NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { MyReactFiberNodeDev } from "./interface";
import type { MyReactElementNode, memo, MyReactElement } from "@my-react/react";

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

  fiber.parent = parent;

  fiber.sibling = null;

  fiber.element = nextElement;

  fiber.renderContainer = parent.renderContainer;

  parent.child = parent.child || fiber;

  const { pendingProps, ref } = getTypeFromElementNode(nextElement);

  fiber.ref = ref;

  fiber.pendingProps = pendingProps;

  const renderContainer = fiber.renderContainer;

  const renderDispatch = renderContainer.renderDispatch;

  if (prevElement !== nextElement) {
    if (fiber.type & NODE_TYPE.__memo__) {
      const typedElement = fiber.element as MyReactElement;

      const typedElementType = typedElement.type as ReturnType<typeof memo>;

      if (
        !(fiber.state & (STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) &&
        typedElementType.compare(fiber.pendingProps, fiber.memoizedProps)
      ) {
        fiber.state = STATE_TYPE.__stable__;
      } else {
        fiber.state |= STATE_TYPE.__inherit__;

        renderDispatch.patchToFiberUpdate?.(fiber);
      }
    } else {
      fiber.state |= STATE_TYPE.__inherit__;

      if (fiber.type & NODE_TYPE.__provider__) {
        if (!isNormalEquals(fiber.pendingProps.value as Record<string, unknown>, fiber.memoizedProps.value as Record<string, unknown>)) {
          renderDispatch.pendingContext(fiber);
        }
      }

      if (fiber.type & NODE_TYPE.__plain__) {
        if (!isNormalEquals(fiber.pendingProps, fiber.memoizedProps, (key: string) => key === "children")) {
          renderDispatch.pendingUpdate(fiber);
        }
      }

      if (fiber.type & NODE_TYPE.__text__) {
        renderDispatch.pendingUpdate(fiber);
      }

      renderDispatch.patchToFiberUpdate?.(fiber);
    }
  }

  if (isValidElement(prevElement) && isValidElement(nextElement) && prevElement.ref !== nextElement.ref) {
    renderDispatch.pendingRef(fiber);
  }

  if (fiber !== prevFiber) {
    renderDispatch.pendingPosition(fiber);
  }

  if (!(fiber.patch & PATCH_TYPE.__update__)) {
    fiber.memoizedProps = fiber.pendingProps;
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const timeNow = Date.now();

    const prevRenderState = Object.assign({}, typedFiber._debugRenderState);

    typedFiber._debugRenderState = {
      renderCount: prevRenderState.renderCount + 1,
      mountTime: prevRenderState.mountTime,
      prevUpdateTime: prevRenderState.currentUpdateTime,
      currentUpdateTime: timeNow,
    };

    if (typedFiber.type & renderDispatch.typeForHasNode) {
      renderDispatch.pendingLayoutEffect(typedFiber, () => debugWithNode(typedFiber));
    }
  }

  return fiber;
};
