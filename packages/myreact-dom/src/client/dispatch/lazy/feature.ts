import { createElement } from "@my-react/react";
import { WrapperByScope } from "@my-react/react-reconciler";

import type { lazy, MyReactClassComponent, MyReactElement, MyReactFiberNode, MyReactFunctionComponent, MyReactElementNode } from "@my-react/react";

// TODO same as server side
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

export const defaultResolveLazyElement = (_fiber: MyReactFiberNode) => {
  const { type, props } = _fiber.element as MyReactElement;

  const globalDispatch = _fiber.root.globalDispatch;

  const typedType = type as ReturnType<typeof lazy>;

  if (typedType._loaded === true) {
    const render = typedType.render as MyReactClassComponent | MyReactFunctionComponent;

    const children = createElement(render, props);

    return WrapperByScope(children);
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

  return WrapperByScope(children);
};
