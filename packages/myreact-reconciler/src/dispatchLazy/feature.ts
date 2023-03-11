import { WrapperByScope } from "../runtimeScope";

import type { MyReactElementNode, MyReactFiberNode } from "@my-react/react";

export const defaultResolveLazyElementAsync = async (_fiber: MyReactFiberNode): Promise<MyReactElementNode> => {
  const renderPlatform = _fiber.root.renderPlatform;

  const element = await renderPlatform.resolveLazyAsync(_fiber);

  return WrapperByScope(element);
};

export const defaultResolveLazyElement = (_fiber: MyReactFiberNode) => {
  const renderPlatform = _fiber.root.renderPlatform;

  const element = renderPlatform.resolveLazy(_fiber);

  return WrapperByScope(element);
};
