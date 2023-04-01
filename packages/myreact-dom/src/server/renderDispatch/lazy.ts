import { createElement } from "@my-react/react";
import { safeCallAsync, WrapperByScope } from "@my-react/react-reconciler";

import type { lazy } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const resolveLazyElement = (_fiber: MyReactFiberNode) => {
  const renderDispatch = _fiber.container.renderDispatch;

  return WrapperByScope(renderDispatch.resolveSuspense(_fiber));
};

export const resolveLazyElementAsync = async (_fiber: MyReactFiberNode) => {
  const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

  if (typedElementType._loaded) return WrapperByScope(createElement(typedElementType.render, _fiber.pendingProps));

  const loaded = await safeCallAsync(() => typedElementType.loader());

  const render = typeof loaded === "object" && typeof loaded?.default === "function" ? loaded.default : loaded;

  typedElementType.render = render as ReturnType<typeof lazy>["render"];

  typedElementType._loaded = true;

  return WrapperByScope(createElement(typedElementType.render, _fiber.pendingProps));
};
