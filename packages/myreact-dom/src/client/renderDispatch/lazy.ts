import { __my_react_internal__, createElement } from "@my-react/react";
import { devWarnWithFiber, fiberToDispatchMap, getCurrentDispatchFromFiber, nextWorkCommon, processLazy, WrapperByLazyScope } from "@my-react/react-reconciler";
import { isPromise, ListTree } from "@my-react/react-shared";

import type { ClientDomDispatch } from "./instance";
import type { MixinMyReactFunctionComponent , lazy } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { currentRenderPlatform } = __my_react_internal__;

/**
 * @internal
 */
export const loadLazy = async (fiber: MyReactFiberNode, typedElementType: ReturnType<typeof lazy>) => {
  if (typedElementType._loaded) return;

  const dispatch = getCurrentDispatchFromFiber(fiber);

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
    fiberToDispatchMap.set(fiber, dispatch);
    
    currentRenderPlatform.current.dispatchError?.({ fiber, error: e });
  } finally {
    typedElementType._loading = false;
  }
};

/**
 * @internal
 */
export const resolveLazyElementLegacy = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  return processLazy(_fiber);
};

/**
 * @internal
 */
export const resolveLazyElementLatest = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  if (_dispatch.isHydrateRender) {
    const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;
    if (typedElementType._loaded === true) {
      return WrapperByLazyScope(createElement(typedElementType.render as MixinMyReactFunctionComponent, _fiber.pendingProps));
    } else {
      _dispatch.pendingAsyncLoadFiberList = _dispatch.pendingAsyncLoadFiberList || new ListTree<MyReactFiberNode>();

      _dispatch.pendingAsyncLoadFiberList.push(_fiber);

      return null;
    }
  } else {
    return processLazy(_fiber);
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
