import { WrapperByScope } from "@my-react/react-reconciler";

import type { MyReactElementNode, MyReactFiberNode } from "@my-react/react";
import type { RenderDispatch } from "@my-react/react-reconciler";

// type DePromise<T> = T extends Promise<infer I> ? DePromise<I> : T;

export const defaultResolveLazyElement = (_fiber: MyReactFiberNode): MyReactElementNode => {
  const renderDispatch = _fiber.root.renderDispatch as RenderDispatch;

  const children = renderDispatch.resolveSuspense(_fiber);

  return WrapperByScope(children);
};
