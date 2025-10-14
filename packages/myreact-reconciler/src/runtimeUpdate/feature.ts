import { __my_react_internal__, __my_react_shared__, type SuspenseUpdateQueue } from "@my-react/react";
import { include, isPromise, merge, remove, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { defaultDeleteChildEffect } from "../dispatchEffect";
import { defaultResolveAliveSuspenseFiber } from "../dispatchSuspense";
import { type CustomRenderDispatch } from "../renderDispatch";
import { performToNextFiberFromRoot } from "../renderNextWork";
import { getInstanceFieldByInstance } from "../runtimeGenerate";
import { mountLoopAll } from "../runtimeMount";
import { safeCallWithCurrentFiber } from "../share";

import type { SuspenseInstanceField } from "../processSuspense";
import type { MyReactFiberNode } from "../runtimeFiber";

const { enableSuspenseRoot } = __my_react_shared__;
const { currentScheduler } = __my_react_internal__;

export enum updateTypeEnum {
  syncFromRoot,
  syncFromTrigger,
  concurrentFromRoot,
  concurrentFromTrigger,
}

export const triggerFiberUpdateListener = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallPatchToFiberUpdate() {
      renderDispatch.patchToFiberUpdate?.(fiber);
    },
  });

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallFiberUpdateListener() {
      renderDispatch.callOnFiberUpdate(fiber);
    },
  });
};

export const updateLoopSyncFromRoot = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderDispatch.runtimeFiber.retriggerFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = performToNextFiberFromRoot(renderDispatch, currentFiber);

    const retriggerFiber = renderDispatch.runtimeFiber.retriggerFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = retriggerFiber || nextFiber;

    renderDispatch.runtimeFiber.retriggerFiber = null;
  }
};

export const updateLoopConcurrentFromRoot = (renderDispatch: CustomRenderDispatch) => {
  let hasSync = false;

  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    renderDispatch.runtimeFiber.retriggerFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    hasSync = hasSync || include(currentFiber.state, STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerSyncForce__);

    const nextFiber = performToNextFiberFromRoot(renderDispatch, currentFiber);

    const retriggerFiber = renderDispatch.runtimeFiber.retriggerFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = retriggerFiber || nextFiber;

    renderDispatch.runtimeFiber.retriggerFiber = null;
  }

  return hasSync;
};

export const processAsyncLoadListOnUpdate = (renderDispatch: CustomRenderDispatch) => {
  if (renderDispatch.pendingSuspenseFiberArray?.length) {
    const allPendingSuspenseFiberArray = renderDispatch.pendingSuspenseFiberArray.getAll();

    if (renderDispatch.enableAsyncLoad) {
      const allField: SuspenseInstanceField[] = [];

      allPendingSuspenseFiberArray.forEach((node) => {
        defaultDeleteChildEffect(renderDispatch, node);

        const field = getInstanceFieldByInstance(node.instance) as SuspenseInstanceField;

        const allPendingLoadArray = field.asyncLoadList.getAll().filter((item) => {
          if (isPromise(item)) {
            return typeof item.status !== "string";
          } else {
            return !item._loading && !item._loaded && !item._error;
          }
        });

        if (allPendingLoadArray.length) {
          Promise.all(
            allPendingLoadArray.map(async (item) => {
              if (isPromise(item)) {
                await renderDispatch.processPromise(item);
              } else {
                await renderDispatch.processLazy(item);
              }

              item._list?.clear();

              field.asyncLoadList.uniDelete(item);
            })
          ).then(() => {
            const aliveNode = defaultResolveAliveSuspenseFiber(node) || renderDispatch.rootFiber;

            aliveNode.state = STATE_TYPE.__triggerSyncForce__;

            const renderScheduler = currentScheduler.current;

            const updater: SuspenseUpdateQueue = {
              type: UpdateQueueType.suspense,
              trigger: aliveNode,
              isSync: true,
              isForce: true,
              payLoad: allPendingLoadArray,
            };

            renderScheduler.dispatchState(updater);
          });
        }

        // fix hmr
        node.state = STATE_TYPE.__reschedule__;

        field.isHidden = true;

        allField.push(field);
      });

      const root = renderDispatch.rootFiber;

      root.state = remove(root.state, STATE_TYPE.__stable__);

      root.state = merge(root.state, STATE_TYPE.__retrigger__);

      // TODO use hide tree to improve
      mountLoopAll(renderDispatch, root);

      allField.forEach((field) => (field.isHidden = false));

      renderDispatch.pendingSuspenseFiberArray.clear();
    } else {
      throw new Error(
        "[@my-react/reconciler] should not process async load list on sync mount without enableAsyncLoad, you may use a wrong renderDispatch instance"
      );
    }
  }

  // TODO update flow
  if (enableSuspenseRoot.current) {
    const suspenseField = getInstanceFieldByInstance(renderDispatch) as SuspenseInstanceField;

    const list = suspenseField.asyncLoadList.getAll();

    if (list.length === 0) return;

    if (renderDispatch.enableAsyncLoad) {
      throw new Error("[@my-react/reconciler] not implemented yet");
    } else {
      throw new Error(
        "[@my-react/reconciler] should not process async load list on sync mount without enableAsyncLoad, you may use a wrong renderDispatch instance"
      );
    }
  }
};
