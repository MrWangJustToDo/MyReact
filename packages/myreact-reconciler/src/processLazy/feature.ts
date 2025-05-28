import { __my_react_internal__, createElement } from "@my-react/react";
import { isPromise, ListTree } from "@my-react/react-shared";

import { WrapperByLazyScope } from "../runtimeScope";
import { devWarnWithFiber } from "../share";

import type { PromiseWithState } from "../processPromise";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MixinMyReactFunctionComponent, lazy } from "@my-react/react";

const { currentScheduler } = __my_react_internal__;

export const loadLazy = async (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, typedElementType: ReturnType<typeof lazy>) => {
  if (typedElementType._loaded) return;

  try {
    typedElementType._loading = true;

    const loadedPromise = typedElementType.loader();

    if (__DEV__ && !isPromise(loadedPromise)) {
      devWarnWithFiber(fiber, `@my-react lazy() must return a promise`);
    }

    const loaded = await loadedPromise;

    const render = typeof loaded === "object" && (typeof loaded?.default === "function" || typeof loaded?.default === "object") ? loaded.default : loaded;

    typedElementType.render = render as ReturnType<typeof lazy>["render"];
  } catch (e) {
    typedElementType._error = e;
  } finally {
    typedElementType._loaded = true;

    typedElementType._loading = false;
  }
};

export const processLazy = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  const typedElementType = fiber.elementType as ReturnType<typeof lazy>;

  if (typedElementType._error) {
    currentScheduler.current.dispatchError?.({ fiber, error: typedElementType._error as Error });

    return null;
  }

  if (typedElementType._loaded === true) {
    const render = typedElementType.render as ReturnType<typeof lazy>["render"];

    return WrapperByLazyScope(createElement(render as MixinMyReactFunctionComponent, fiber.pendingProps));
  } else if (typedElementType._loading === false) {
    typedElementType._loading = true;

    renderDispatch.pendingAsyncLoadList = renderDispatch.pendingAsyncLoadList || new ListTree<MyReactFiberNode | PromiseWithState<any>>();

    if (!renderDispatch.runtimeFiber.visibleFiber) {
      const visibleFiber = renderDispatch.resolveSuspenseFiber(fiber);

      if (visibleFiber) {
        renderDispatch.runtimeFiber.visibleFiber = visibleFiber;

        renderDispatch.pendingAsyncLoadList.push(fiber);
      } else {
        throw new Error("[@my-react/react] lazy component should be used in a suspense boundary");
      }
    } else {
      renderDispatch.pendingAsyncLoadList.push(fiber);
    }
  }

  return null;
};
