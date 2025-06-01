import { __my_react_internal__, type SuspenseUpdateQueue } from "@my-react/react";
import { isPromise, merge, remove, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { defaultDeleteChildEffect } from "../dispatchEffect";
import { defaultResolveAliveSuspenseFiber } from "../dispatchSuspense";
import { mountToNextFiberFromRoot } from "../renderNextWork";
import { getInstanceFieldByInstance } from "../runtimeGenerate";

import type { SuspenseInstanceField } from "../processSuspense";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { currentScheduler } = __my_react_internal__;

export const mountLoopAllFromScheduler = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderDispatch.runtimeFiber.retriggerFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = mountToNextFiberFromRoot(renderDispatch, currentFiber);

    const retriggerFiber = renderDispatch.runtimeFiber.retriggerFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = retriggerFiber || nextFiber;

    renderDispatch.runtimeFiber.retriggerFiber = null;
  }
};

export const mountLoopAll = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  renderDispatch.runtimeFiber.scheduledFiber = fiber;

  renderDispatch.runtimeFiber.nextWorkingFiber = fiber;

  mountLoopAllFromScheduler(renderDispatch);
};

export const processAsyncLoadListOnAsyncMount = async (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.pendingSuspenseFiberArray.length) {
    const node = renderDispatch.pendingSuspenseFiberArray.uniShift();

    const suspenseField = getInstanceFieldByInstance(node.instance) as SuspenseInstanceField;

    renderDispatch.pendingSuspenseFiberArray.clear();

    await Promise.all(
      suspenseField.asyncLoadList.getAll().map(async (item) => {
        if (isPromise(item)) {
          await renderDispatch.processPromise(item);
        } else {
          await renderDispatch.processLazy(item);
        }

        item._list.forEach((node: MyReactFiberNode) => {
          node.state = remove(node.state, STATE_TYPE.__stable__);

          node.state = merge(node.state, STATE_TYPE.__create__);

          mountLoopAll(renderDispatch, node);
        });

        item._list.clear();

        suspenseField.asyncLoadList.uniDelete(item);
      })
    );
  }

  if (renderDispatch.pendingSuspenseFiberArray.length) {
    // If there are still pending async loads, we need to continue processing them
    await processAsyncLoadListOnAsyncMount(renderDispatch);
  }
};

export const processAsyncLoadListOnSyncMount = (renderDispatch: CustomRenderDispatch) => {
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
            const aliveNode = defaultResolveAliveSuspenseFiber(node);

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

        node.state = STATE_TYPE.__create__;

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
};
