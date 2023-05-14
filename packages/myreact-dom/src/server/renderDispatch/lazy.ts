import { createElement } from "@my-react/react";
import { WrapperByScope } from "@my-react/react-reconciler";

import type { lazy , MixinMyReactFunctionComponent } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const resolveLazyElementSync = (_fiber: MyReactFiberNode) => {
  const renderContainer = _fiber.renderContainer;

  const renderDispatch = renderContainer.renderDispatch;

  return WrapperByScope(renderDispatch.resolveSuspense(_fiber));
};

export const resolveLazyElementAsync = async (_fiber: MyReactFiberNode) => {
  const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

  if (typedElementType._loaded) return WrapperByScope(createElement(typedElementType.render as MixinMyReactFunctionComponent, _fiber.pendingProps));

  const loaded = await typedElementType.loader();

  const render = typeof loaded === "object" && typeof loaded?.default === "function" ? loaded.default : loaded;

  typedElementType.render = render as ReturnType<typeof lazy>["render"];

  typedElementType._loaded = true;

  return WrapperByScope(createElement(typedElementType.render as MixinMyReactFunctionComponent, _fiber.pendingProps));
};
