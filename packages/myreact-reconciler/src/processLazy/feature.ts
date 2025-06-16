import { __my_react_internal__, __my_react_shared__, createElement } from "@my-react/react";
import { isPromise, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { getInstanceFieldByInstance } from "../runtimeGenerate";
import { WrapperByLazyScope } from "../runtimeScope";
import { devWarnWithFiber } from "../share";

import type { SuspenseInstanceField } from "../processSuspense";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { LazyUpdateQueue, MixinMyReactFunctionComponent, lazy } from "@my-react/react";

const { enableSuspenseRoot } = __my_react_shared__;
const { currentScheduler } = __my_react_internal__;

export const loadLazy = async (renderDispatch: CustomRenderDispatch, typedElementType: ReturnType<typeof lazy>) => {
  if (typedElementType._loaded) return;

  try {
    typedElementType._loading = true;

    const loadedPromise = typedElementType.loader();

    if (__DEV__ && !isPromise(loadedPromise)) {
      console.warn("[@my-react/react] lazy() must return a promise, but got", loadedPromise);
    }

    const loaded = await Promise.resolve(loadedPromise);

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
  }

  typedElementType._list = typedElementType._list || new Set();

  typedElementType._list.add(fiber);

  const suspenseFiber = renderDispatch.resolveSuspenseFiber(fiber);

  if (suspenseFiber) {
    const suspenseField = getInstanceFieldByInstance(suspenseFiber.instance) as SuspenseInstanceField;

    suspenseField.asyncLoadList.uniPush(typedElementType);

    renderDispatch.pendingSuspenseFiberArray.uniPush(suspenseFiber);

    return null;
  } else {
    // TODO  update flow
    if (enableSuspenseRoot.current && !renderDispatch.isAppMounted) {
      const suspenseField = getInstanceFieldByInstance(renderDispatch) as SuspenseInstanceField;

      suspenseField.asyncLoadList.uniPush(typedElementType);

      return null;
    }

    devWarnWithFiber(fiber, "[@my-react/react] lazy() must be used inside a Suspense component, otherwise it will not work as expected");

    if (typedElementType._loading) return null;

    typedElementType._loading = true;

    const renderScheduler = currentScheduler.current;

    renderDispatch.processLazy(typedElementType).then(() => {
      fiber.state = STATE_TYPE.__recreate__;

      typedElementType._list.delete(fiber);

      const updater: LazyUpdateQueue = {
        type: UpdateQueueType.lazy,
        trigger: fiber,
        isSync: true,
        isForce: true,
        payLoad: typedElementType,
      };

      renderScheduler.dispatchState(updater);
    });

    return null;
  }
};
