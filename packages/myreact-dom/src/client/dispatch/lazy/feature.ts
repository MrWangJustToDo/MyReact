import { createElement, __my_react_shared__ } from "@my-react/react";
import { WrapperByScope } from "@my-react/react-reconciler";

import type { lazy, MyReactClassComponent, MyReactElement, MyReactFiberNode, MyReactFunctionComponent } from "@my-react/react";

const { enableLazySSRHydrate } = __my_react_shared__;

export const defaultResolveLazyElement = (_fiber: MyReactFiberNode) => {
  const { type, props } = _fiber.element as MyReactElement;

  const globalDispatch = _fiber.root.globalDispatch;

  const typedType = type as ReturnType<typeof lazy>;

  if (typedType._loaded === true) {
    const render = typedType.render as MyReactClassComponent | MyReactFunctionComponent;

    const children = createElement(render, props);

    if (enableLazySSRHydrate.current) {
      return WrapperByScope(children);
    }

    return children;
  } else if (typedType._loading === false) {
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

  const children = globalDispatch.resolveSuspenseElement(_fiber);

  if (enableLazySSRHydrate.current) {
    return WrapperByScope(children);
  }

  return children;
};
