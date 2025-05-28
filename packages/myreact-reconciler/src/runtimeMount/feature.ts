import { exclude, isPromise, merge, remove, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { defaultDeleteChildEffect } from "../dispatchEffect";
import { processState } from "../processState";
import { mountToNextFiberFromRoot } from "../renderNextWork";
import { checkIsMyReactFiberNode, triggerUpdateOnFiber, type MyReactFiberNode } from "../runtimeFiber";
import { getInstanceFieldByInstance } from "../runtimeGenerate";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { VisibleInstanceField } from "../runtimeGenerate";
import type { SuspenseUpdateQueue, TriggerUpdateQueue } from "@my-react/react";

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
  let loopCount = 0;

  while (renderDispatch.pendingAsyncLoadList?.length) {
    const beforeLength = renderDispatch.pendingAsyncLoadList.length;

    const node = renderDispatch.pendingAsyncLoadList.shift();

    if (checkIsMyReactFiberNode(node)) {
      await renderDispatch.processFiber(node);

      node.state = remove(node.state, STATE_TYPE.__stable__);

      node.state = merge(node.state, STATE_TYPE.__create__);

      mountLoopAll(renderDispatch, node);
    } else if (isPromise(node)) {
      await renderDispatch.processPromise(node);
    }

    const afterLength = renderDispatch.pendingAsyncLoadList.length;

    if (beforeLength <= afterLength) {
      loopCount++;
      if (loopCount > 5) {
        throw new Error("async load loop count is too much");
      }
    }
  }
};

export const processAsyncLoadListOnSyncMount = (renderDispatch: CustomRenderDispatch) => {
  if (renderDispatch.pendingAsyncLoadList?.length) {
    const visibleFiber = renderDispatch.runtimeFiber.visibleFiber;

    const asyncLoadList = renderDispatch.pendingAsyncLoadList.toArray();

    renderDispatch.pendingAsyncLoadList.clear();

    if (renderDispatch.enableAsyncLoad) {
      Promise.all(
        asyncLoadList.map(async (node) => {
          if (checkIsMyReactFiberNode(node)) {
            await renderDispatch.processFiber(node);

            node.state = remove(node.state, STATE_TYPE.__stable__);

            node.state = merge(node.state, STATE_TYPE.__create__);

            mountLoopAll(renderDispatch, node);
          } else if (isPromise(node)) {
            await renderDispatch.processPromise(node);
          }
        })
      ).then(() => {
        if (visibleFiber && exclude(visibleFiber.state, STATE_TYPE.__unmount__)) {
          const updateQueue: SuspenseUpdateQueue = {
            type: UpdateQueueType.suspense,
            trigger: visibleFiber,
            payLoad: asyncLoadList,
            isSync: true,
            isForce: true,
            callback: function invokeAsyncLoadListCallback() {
              renderDispatch.runtimeFiber.visibleFiber = null;
            },
          };

          const visibleField = getInstanceFieldByInstance(visibleFiber.instance) as VisibleInstanceField;

          visibleField.isHidden = false;

          processState(renderDispatch, updateQueue);
        } else {
          triggerUpdateOnFiber(renderDispatch.rootFiber, STATE_TYPE.__triggerSyncForce__, function invokeAsyncLoadListCallback() {
            renderDispatch.runtimeFiber.visibleFiber = null;
          });
        }
      });

      if (visibleFiber) {
        defaultDeleteChildEffect(renderDispatch, visibleFiber);

        const visibleField = getInstanceFieldByInstance(visibleFiber.instance) as VisibleInstanceField;

        visibleField.isHidden = true;

        visibleFiber.state = merge(visibleFiber.state, STATE_TYPE.__create__);

        const updateQueue: TriggerUpdateQueue = {
          type: UpdateQueueType.trigger,
          trigger: visibleFiber,
          isRetrigger: true,
          isImmediate: true,
          isSync: true,
          isForce: true,
          isSkip: false,
          callback: null,
        };

        processState(renderDispatch, updateQueue);
      } else {
        return null;
      }
    } else {
      console.error(
        "[@my-react/reconciler] should not process async load list on sync mount without enableAsyncLoad, you may use a wrong renderDispatch instance"
      );
    }
  }
};
