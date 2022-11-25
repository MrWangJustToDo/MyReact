import { createElement, Fragment } from "@my-react/react";

import type { lazy, MyReactClassComponent, MyReactElement, MyReactElementNode, MyReactFiberNode, MyReactFunctionComponent } from "@my-react/react";

// type DePromise<T> = T extends Promise<infer I> ? DePromise<I> : T;

// server side lazy
export const defaultResolveLazyElement = async (_fiber: MyReactFiberNode): Promise<MyReactElementNode> => {
  const { type, props } = _fiber.element as MyReactElement;

  const typedType = type as ReturnType<typeof lazy>;

  const loaded = await typedType.loader();

  const render = typeof loaded === "object" && typeof loaded?.default === "function" ? loaded.default : loaded;

  typedType.render = render as MyReactClassComponent | MyReactFunctionComponent;

  return createElement(Fragment, null, [`<!-- [ -->`, createElement(typedType.render, props), `<!-- ] -->`]);
};
