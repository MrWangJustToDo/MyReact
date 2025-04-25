import { __my_react_internal__, createElement, lazy } from "@my-react/react";
import { isPromise } from "@my-react/react-shared";

import { WrapperByLazyScope } from "../runtimeScope";
import { currentRenderDispatch, devWarnWithFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MixinMyReactFunctionComponent } from "@my-react/react";

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
  lazy._updater(fiber, typedElementType.render);
};

export const nextWorkLazy = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const typedElementType = fiber.elementType as ReturnType<typeof lazy>;

  if (typedElementType._loaded === true) {
    const render = typedElementType.render as ReturnType<typeof lazy>["render"];

    return WrapperByLazyScope(createElement(render as MixinMyReactFunctionComponent, fiber.pendingProps));
  } else if (typedElementType._loading === false) {
    loadLazy(fiber, typedElementType).then(() => updateLazy(fiber, typedElementType));
  }

  return WrapperByLazyScope(renderDispatch.resolveSuspense(fiber));
};
