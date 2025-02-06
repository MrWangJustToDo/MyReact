import { __my_react_internal__, createElement } from "@my-react/react";
import { devWarnWithFiber, nextWorkCommon, WrapperByScope } from "@my-react/react-reconciler";
import { isPromise, ListTree } from "@my-react/react-shared";

import type { ClientDomDispatch } from "./instance";
import type { lazy, MixinMyReactFunctionComponent } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { currentRenderPlatform } = __my_react_internal__;

/**
 * @internal
 */
export const loadLazy = async (fiber: MyReactFiberNode, typedElementType: ReturnType<typeof lazy>) => {
  if (typedElementType._loaded) return;

  try {
    typedElementType._loading = true;

    const loadedPromise = typedElementType.loader();

    if (__DEV__ && !isPromise(loadedPromise)) {
      devWarnWithFiber(fiber, `@my-react lazy() must return a promise`);
    }

    const loaded = await loadedPromise;

    const render = typeof loaded === "object" && (typeof loaded?.default === "function" || typeof loaded?.default === "object") ? loaded.default : loaded;

    typedElementType._loaded = true;

    typedElementType.render = render as ReturnType<typeof lazy>["render"];
  } catch (e) {
    currentRenderPlatform.current.dispatchError?.({ fiber, error: e });
  } finally {
    typedElementType._loading = false;
  }
};

/**
 * @internal
 */
export const updateLazy = (fiber: MyReactFiberNode, typedElementType: ReturnType<typeof lazy>) => {
  typedElementType._update(fiber, typedElementType.render);
};

/**
 * @internal
 */
export const resolveLazyElementLegacy = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;
  if (typedElementType._loaded === true) {
    if (_dispatch.isHydrateRender) {
      currentRenderPlatform.current.microTask(function triggerUpdateOnFiberTask() {
        updateLazy(_fiber, typedElementType);
      });

      return WrapperByScope(_dispatch.resolveSuspense(_fiber));
    } else {
      const render = typedElementType.render as ReturnType<typeof lazy>["render"];

      return WrapperByScope(createElement(render as MixinMyReactFunctionComponent, _fiber.pendingProps));
    }
  } else if (typedElementType._loading === false) {
    loadLazy(_fiber, typedElementType).then(() => updateLazy(_fiber, typedElementType));
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
      loadLazy(_fiber, typedElementType).then(() => updateLazy(_fiber, typedElementType));
    }

    return WrapperByScope(_dispatch.resolveSuspense(_fiber));
  }
};

/**
 * @internal
 */
export const nextWorkLazy = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  if (_dispatch.enableAsyncHydrate) {
    const children = resolveLazyElementLatest(_fiber, _dispatch);

    nextWorkCommon(_fiber, children);
  } else {
    const children = resolveLazyElementLegacy(_fiber, _dispatch);

    nextWorkCommon(_fiber, children);
  }
};
