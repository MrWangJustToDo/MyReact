import { createElement } from "@my-react/react";
import { triggerError, WrapperByScope } from "@my-react/react-reconciler";
import { STATE_TYPE } from "@my-react/react-shared";

import type { lazy, MixinMyReactFunctionComponent } from "@my-react/react";
import type { MyReactFiberNode, CustomRenderDispatch } from "@my-react/react-reconciler";

// TODO
/**
 * @internal
 */
export const resolveLazyElementSync = (_fiber: MyReactFiberNode, _dispatch: CustomRenderDispatch) => {
  const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;
  if (typedElementType._loaded === true) {
    const render = typedElementType.render as ReturnType<typeof lazy>["render"];

    return WrapperByScope(createElement(render as MixinMyReactFunctionComponent, _fiber.pendingProps));
  } else if (typedElementType._loading === false) {
    typedElementType._loading = true;

    Promise.resolve()
      .then(() => typedElementType.loader())
      .then((re) => {
        const render = typeof re === "object" && typeof re?.default === "function" ? re.default : re;

        typedElementType._loaded = true;

        typedElementType._loading = false;

        typedElementType.render = render as ReturnType<typeof lazy>["render"];

        _fiber._update(STATE_TYPE.__triggerSync__);
      })
      .catch((e) => triggerError(_fiber, e));
  }

  return WrapperByScope(_dispatch.resolveSuspense(_fiber));
};

/**
 * @internal
 */
export const resolveLazyElementAsync = async (_fiber: MyReactFiberNode) => {
  const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

  if (typedElementType._loaded) return WrapperByScope(createElement(typedElementType.render as MixinMyReactFunctionComponent, _fiber.pendingProps));

  const loaded = await typedElementType.loader().catch((e) => triggerError(_fiber, e));

  const render = typeof loaded === "object" && typeof loaded?.default === "function" ? loaded.default : loaded;

  typedElementType.render = render as ReturnType<typeof lazy>["render"];

  typedElementType._loaded = true;

  return WrapperByScope(createElement(typedElementType.render as MixinMyReactFunctionComponent, _fiber.pendingProps));
};
