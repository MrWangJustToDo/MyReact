import type { RenderDispatch } from "../renderDispatch";
import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactFiberNode } from "@my-react/react";

export const unmountFiberNode = (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return;

  fiber.isMounted = false;

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

  renderPlatform.patchToFiberUnmount?.(fiber);

  renderDispatch.suspenseMap.delete(fiber);

  renderDispatch.strictMap.delete(fiber);

  renderDispatch.errorBoundariesMap.delete(fiber);

  renderDispatch.effectMap.delete(fiber);

  renderDispatch.layoutEffectMap.delete(fiber);

  renderDispatch.contextMap.delete(fiber);

  renderDispatch.unmountMap.delete(fiber);

  renderDispatch.eventMap.delete(fiber);

  if (!`${__DEV__}`) {
    fiber.node = null;

    fiber.child = null;

    fiber.sibling = null;

    fiber.instance = null;

    fiber.hookList = null;

    fiber.dependence = null;
  }
};
