import { createElement } from "@my-react/react";
import { triggerError, WrapperByScope } from "@my-react/react-reconciler";
import { ListTree, STATE_TYPE } from "@my-react/react-shared";

import type { ClientDomDispatch } from "./instance";
import type { lazy, MixinMyReactFunctionComponent } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

// TODO
/**
 * @internal
 */
export const resolveLazyElementLegacy = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;
  if (typedElementType._loaded === true) {
    if (_dispatch.isHydrateRender) {
      Promise.resolve().then(() => {
        _fiber._update(STATE_TYPE.__triggerSync__);
      });
      return WrapperByScope(_dispatch.resolveSuspense(_fiber));
    } else {
      const render = typedElementType.render as ReturnType<typeof lazy>["render"];

      return WrapperByScope(createElement(render as MixinMyReactFunctionComponent, _fiber.pendingProps));
    }
  } else if (typedElementType._loading === false) {
    typedElementType._loading = true;

    Promise.resolve()
      .then(() => typedElementType.loader())
      .then((re) => {
        const render = typeof re === "object" && typeof re?.default === "function" ? re.default : re;

        typedElementType._loaded = true;

        typedElementType.render = render as ReturnType<typeof lazy>["render"];

        _fiber._update(STATE_TYPE.__triggerSync__);
      })
      .catch((e) => triggerError(_fiber, e))
      .finally(() => (typedElementType._loading = false));
  }

  return WrapperByScope(_dispatch.resolveSuspense(_fiber));
};

/**
 * @internal
 */
export const resolveLazyElementLatest = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

  if (typedElementType._loaded === true) {
    return WrapperByScope(createElement(typedElementType.render as MixinMyReactFunctionComponent, _fiber.pendingProps));
  } else {
    if (_dispatch.isHydrateRender) {
      _dispatch.pendingAsyncLoadFiberList = _dispatch.pendingAsyncLoadFiberList || new ListTree<MyReactFiberNode>();

      _dispatch.pendingAsyncLoadFiberList.push(_fiber);

      return null;
    } else if (typedElementType._loading === false) {
      typedElementType._loading = true;

      Promise.resolve()
        .then(() => typedElementType.loader())
        .then((re) => {
          const render = typeof re === "object" && typeof re?.default === "function" ? re.default : re;

          typedElementType._loaded = true;

          typedElementType.render = render as ReturnType<typeof lazy>["render"];

          _fiber._update(STATE_TYPE.__triggerSync__);
        })
        .catch((e) => triggerError(_fiber, e))
        .finally(() => (typedElementType._loading = false));
    }

    return WrapperByScope(_dispatch.resolveSuspense(_fiber));
  }
};
