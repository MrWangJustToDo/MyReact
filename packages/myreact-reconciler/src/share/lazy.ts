import { createElement } from "@my-react/react";

import type { lazy, MyReactClassComponent, MyReactElement, MyReactElementNode, MyReactFiberNode, MyReactFunctionComponent } from "@my-react/react";

// default lazy resolve, not work for SSR, like React17
export const defaultResolveLazyElement = (_fiber: MyReactFiberNode): MyReactElementNode => {
  const { type, props } = _fiber.element as MyReactElement;

  const globalDispatch = _fiber.root.globalDispatch;

  const typedType = type as ReturnType<typeof lazy>;

  if (typedType._loaded === true) {
    const render = typedType.render as MyReactClassComponent | MyReactFunctionComponent;

    const children = createElement(render, props);

    return children;
  } else if (typedType._loading === false) {
    if (globalDispatch.resolveLazy()) {
      typedType._loading = true;

      Promise.resolve()
        .then(() => typedType.loader())
        .then((re) => {
          const render = typeof re === "object" && typeof re?.default === "function" ? re.default : re;

          typedType._loaded = true;

          typedType._loading = false;

          typedType.render = render as MyReactClassComponent | MyReactFunctionComponent;

          _fiber.update();
        });
    }
  }

  const children = globalDispatch.resolveSuspenseElement(_fiber);

  return children;
};
