import { __my_react_internal__, __my_react_shared__, type SuspenseUpdateQueue } from "@my-react/react";
import { isPromise, merge, remove, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { defaultDeleteChildEffect, defaultDeleteCurrentEffect } from "../dispatchEffect";
import { defaultResolveAliveSuspenseFiber } from "../dispatchSuspense";
import { mountToNextFiberFromRoot } from "../renderNextWork";
import { getInstanceFieldByInstance } from "../runtimeGenerate";

import type { SuspenseInstanceField } from "../processSuspense";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { enableSuspenseRoot } = __my_react_shared__;
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

    const list = suspenseField.asyncLoadList.getAll();

    await Promise.all(
      list.map(async (item) => {
        if (isPromise(item)) {
          await renderDispatch.processPromise(item);
        } else {
          await renderDispatch.processLazy(item);
        }

        const set = new Set(item._list);

        item._list.clear();

        set.forEach((node: MyReactFiberNode) => {
          node.state = remove(node.state, STATE_TYPE.__stable__);

          node.state = merge(node.state, STATE_TYPE.__create__);

          mountLoopAll(renderDispatch, node);
        });

        suspenseField.asyncLoadList.uniDelete(item);
      })
    );
  }

  if (enableSuspenseRoot.current) {
    const suspenseField = getInstanceFieldByInstance(renderDispatch) as SuspenseInstanceField;

    const list = suspenseField.asyncLoadList.getAll();

    if (list.length === 0) return;

    await Promise.all(
      list.map(async (item) => {
        if (isPromise(item)) {
          await renderDispatch.processPromise(item);
        } else {
          await renderDispatch.processLazy(item);
        }

        const set = new Set(item._list);

        item._list.clear();

        set.forEach((node: MyReactFiberNode) => {
          node.state = remove(node.state, STATE_TYPE.__stable__);

          node.state = merge(node.state, STATE_TYPE.__create__);

          mountLoopAll(renderDispatch, node);
        });

        suspenseField.asyncLoadList.uniDelete(item);
      })
    );

    processAsyncLoadListOnAsyncMount(renderDispatch);
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
      // defaultDeleteCurrentEffect(renderDispatch, renderDispatch.rootFiber);

      // defaultDeleteChildEffect(renderDispatch, renderDispatch.rootFiber);

      const allPendingLoadArray = list.filter((item) => {
        if (isPromise(item)) {
          return typeof item.status !== "string";
        } else {
          return !item._loading && !item._loaded && !item._error;
        }
      });

      if (allPendingLoadArray.length) {
        allPendingLoadArray.forEach((item) => item._list?.forEach((node: MyReactFiberNode) => defaultDeleteCurrentEffect(renderDispatch, node)));

        Promise.all(
          allPendingLoadArray.map(async (item) => {
            if (isPromise(item)) {
              await renderDispatch.processPromise(item);
            } else {
              await renderDispatch.processLazy(item);
            }

            const allFiber = new Set(item._list);

            item._list?.clear();

            allFiber.forEach((node: MyReactFiberNode) => {
              node.state = STATE_TYPE.__recreate__;

              const renderScheduler = currentScheduler.current;

              const updater: SuspenseUpdateQueue = {
                type: UpdateQueueType.suspense,
                trigger: node,
                isSync: true,
                isForce: true,
                payLoad: [item],
              };

              renderScheduler.dispatchState(updater);
            });

            suspenseField.asyncLoadList.uniDelete(item);
          })
        );
      }

      // suspenseField.isHidden = true;

      // const root = renderDispatch.rootFiber;

      // root.state = remove(root.state, STATE_TYPE.__stable__);

      // root.state = merge(root.state, STATE_TYPE.__retrigger__);

      // // TODO use hide tree to improve
      // mountLoopAll(renderDispatch, root);

      // suspenseField.isHidden = false;
    } else {
      throw new Error(
        "[@my-react/reconciler] should not process async load list on sync mount without enableAsyncLoad, you may use a wrong renderDispatch instance"
      );
    }
  }
};
