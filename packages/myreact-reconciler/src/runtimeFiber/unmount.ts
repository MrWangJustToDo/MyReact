import { STATE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "./instance";

export const unmountFiberNode = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return;

  fiber.state = STATE_TYPE.__unmount__;

  const renderDispatch = fiber.container.renderDispatch;

  renderDispatch.commitUnsetRef(fiber);

  renderDispatch.patchToFiberUnmount?.(fiber);

  renderDispatch.suspenseMap.delete(fiber);

  renderDispatch.strictMap.delete(fiber);

  renderDispatch.errorBoundariesMap.delete(fiber);

  renderDispatch.effectMap.delete(fiber);

  renderDispatch.layoutEffectMap.delete(fiber);

  renderDispatch.contextMap.delete(fiber);

  renderDispatch.unmountMap.delete(fiber);

  renderDispatch.eventMap.delete(fiber);

  if (!`${__DEV__}`) {
    fiber.child = null;

    fiber.sibling = null;

    fiber.instance = null;

    fiber.hookList = null;

    fiber.container = null;

    fiber.dependence = null;

    fiber.nativeNode = null;

    fiber.updateQueue = null;
  }
};
