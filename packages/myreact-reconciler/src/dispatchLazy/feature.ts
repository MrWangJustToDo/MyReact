import { WrapperByScope } from "../runtimeScope";

import type { MyReactElementNode, MyReactFiberNode } from "@my-react/react";

export const defaultResolveLazyElementAsync = async (_fiber: MyReactFiberNode): Promise<MyReactElementNode> => {
  const renderPlatform = _fiber.root.renderPlatform;

  const element = await renderPlatform.resolveLazyAsync(_fiber);

  return WrapperByScope(element);

  // const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

  // if (typedElementType._loaded) return WrapperByScope(createElement(typedElementType.render, _fiber.pendingProps));

  // const loaded = await typedElementType.loader();

  // const render = typeof loaded === "object" && typeof loaded?.default === "function" ? loaded.default : loaded;

  // typedElementType.render = render as MyReactClassComponent | MyReactFunctionComponent;

  // typedElementType._loaded = true;

  // return WrapperByScope(createElement(typedElementType.render, _fiber.pendingProps));
};

export const defaultResolveLazyElement = (_fiber: MyReactFiberNode) => {
  const renderPlatform = _fiber.root.renderPlatform;

  const element = renderPlatform.resolveLazy(_fiber);

  return WrapperByScope(element);

  // const renderDispatch = _fiber.root.renderDispatch as RenderDispatch;
  // const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;
  // if (typedElementType._loaded === true) {
  //   const render = typedElementType.render as MyReactClassComponent | MyReactFunctionComponent;
  //   const children = createElement(render, _fiber.pendingProps);
  //   return WrapperByScope(children);
  // } else if (typedElementType._loading === false) {
  //   typedElementType._loading = true;
  //   Promise.resolve()
  //     .then(() => typedElementType.loader())
  //     .then((re) => {
  //       const render = typeof re === "object" && typeof re?.default === "function" ? re.default : re;
  //       typedElementType._loaded = true;
  //       typedElementType._loading = false;
  //       typedElementType.render = render as MyReactClassComponent | MyReactFunctionComponent;
  //       _fiber.update();
  //     });
  // }
  // const children = renderDispatch.resolveSuspense(_fiber);
  // return WrapperByScope(children);
};
