import { createElement } from "@my-react/react";
import { WrapperByScope } from "@my-react/react-reconciler";

import type { lazy, MyReactClassComponent, MyReactElement, MyReactElementNode, MyReactFiberNode, MyReactFunctionComponent } from "@my-react/react";

// type DePromise<T> = T extends Promise<infer I> ? DePromise<I> : T;

export const defaultResolveLazyElementAsync = async (_fiber: MyReactFiberNode): Promise<MyReactElementNode> => {
  const { type, props } = _fiber.element as MyReactElement;

  const typedType = type as ReturnType<typeof lazy>;

  if (typedType._loaded) return WrapperByScope(createElement(typedType.render, props));

  const loaded = await typedType.loader();

  const render = typeof loaded === "object" && typeof loaded?.default === "function" ? loaded.default : loaded;

  typedType.render = render as MyReactClassComponent | MyReactFunctionComponent;

  typedType._loaded = true;

  return WrapperByScope(createElement(typedType.render, props));
};

export const defaultResolveLazyElement = (_fiber: MyReactFiberNode): MyReactElementNode => {
  const globalDispatch = _fiber.root.globalDispatch;

  const children = globalDispatch.resolveSuspenseElement(_fiber);

  return WrapperByScope(children);
};
