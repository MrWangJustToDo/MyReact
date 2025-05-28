import { __my_react_internal__, createElement, lazy } from "@my-react/react";
import { merge, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { processState } from "../processState";
import { getInstanceFieldByInstance } from "../runtimeGenerate";
import { WrapperByLazyScope } from "../runtimeScope";
import { fiberToDispatchMap } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { VisibleInstanceField } from "../runtimeGenerate";
import type { LazyUpdateQueue, MixinMyReactFunctionComponent } from "@my-react/react";

const { currentScheduler } = __my_react_internal__;

export const processLazy = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  const typedElementType = fiber.elementType as ReturnType<typeof lazy>;

  if (typedElementType._loaded === true) {
    const render = typedElementType.render as ReturnType<typeof lazy>["render"];

    return WrapperByLazyScope(createElement(render as MixinMyReactFunctionComponent, fiber.pendingProps));
  } else if (typedElementType._loading === false) {
    typedElementType._loading = true;

    const visibleFiber = renderDispatch.resolveSuspenseFiber(fiber);

    if (visibleFiber) {
      const updateQueue: LazyUpdateQueue = {
        type: UpdateQueueType.lazy,
        trigger: visibleFiber,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        payLoad: typedElementType,
        isSync: true,
        isForce: true,
        isRetrigger: true,
        isImmediate: true,
      };

      // collect all the sibling lazy component, so that we can update them all at once

      const visibleField = getInstanceFieldByInstance(visibleFiber.instance) as VisibleInstanceField;

      visibleField.isHidden = true;

      visibleFiber.state = merge(visibleFiber.state, STATE_TYPE.__create__);

      processState(renderDispatch, updateQueue);

      Promise.resolve(typedElementType.loader())
        .then((loaded) => {
          const render = typeof loaded === "object" && (typeof loaded?.default === "function" || typeof loaded?.default === "object") ? loaded.default : loaded;

          typedElementType._loaded = true;

          typedElementType._loading = false;

          typedElementType.render = render as ReturnType<typeof lazy>["render"];

          visibleField.isHidden = false;

          lazy._updater(visibleFiber, typedElementType.render);
        })
        .catch((reason) => {
          typedElementType._loading = false;

          fiberToDispatchMap.set(fiber, renderDispatch);

          currentScheduler.current?.dispatchError({ fiber, error: reason });

          fiberToDispatchMap.delete(fiber);
        });
    } else {
      throw new Error("[@my-react/react] lazy component should be used in a suspense boundary");
    }
  }

  return null;
};
