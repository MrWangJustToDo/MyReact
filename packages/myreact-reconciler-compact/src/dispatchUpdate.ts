import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import {
  insertionEffect,
  layoutEffect,
  effect,
  beforeSyncUpdate,
  afterSyncUpdate,
  safeCallWithCurrentFiber,
  setLogScope,
  resetLogScope,
  defaultInvokeUnmountList,
  addEffectCallback,
  flushEffectCallback,
} from "@my-react/react-reconciler";
import { exclude, STATE_TYPE } from "@my-react/react-shared";

import { getValidParentFiberWithNode } from "./dispatchMap";

import type { ReconcilerDispatch } from "./dispatch";
import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ListTree } from "@my-react/react-shared";

const { currentScheduler } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const ReconcilerDispatchUpdate = (_dispatch: ReconcilerDispatch, _list: ListTree<MyReactFiberNode>, config: any) => {
  beforeSyncUpdate();

  _list.listToFoot(function invokeUnmountPendingAndInsertionEffectList(_fiber) {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      defaultInvokeUnmountList(_dispatch, _fiber);
    }
  });

  _list.listToFoot(function invokeUnmountPendingAndInsertionEffectList(_fiber) {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      insertionEffect(_dispatch, _fiber);
    }
  });

  afterSyncUpdate();

  const pendingFinalizeInitialChildrenFiberSet = new Set<MyReactFiberNode>();
  const pendingCommitFiberArray = [];

  _list.listToFoot(function invokeCreateAndUpdateList(_fiber) {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      const beforeHasNode = _fiber.nativeNode;

      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallCreateAndUpdate() {
          _dispatch.commitCreate(_fiber);
          _dispatch.commitUpdate(_fiber);
        },
      });

      const afterHasNode = _fiber.nativeNode;

      if (!beforeHasNode && afterHasNode) {
        pendingFinalizeInitialChildrenFiberSet.add(_fiber);
      }
    }
  });

  _list.listToHead(function invokePositionList(_fiber) {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallPosition() {
          _dispatch.commitPosition(_fiber);

          const parentFiber = getValidParentFiberWithNode(_dispatch, _fiber);

          parentFiber && pendingFinalizeInitialChildrenFiberSet.add(parentFiber);
        },
      });
    }
  });

  _list.listToFoot(function invokeAppendList(_fiber) {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallAppendList() {
          _dispatch.commitAppend(_fiber);

          const parentFiber = getValidParentFiberWithNode(_dispatch, _fiber);

          parentFiber && pendingFinalizeInitialChildrenFiberSet.add(parentFiber);
        },
      });
    }
  });

  _list.listToFoot(function invokeSetRefList(_fiber) {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallSetRefList() {
          _dispatch.commitSetRef(_fiber);
        },
      });
    }
  });

  pendingFinalizeInitialChildrenFiberSet.forEach(function invokeFinalizeInitialChildren(_fiber) {
    if (_fiber.nativeNode) {
      const node = config.getPublicInstance(_fiber.nativeNode);

      const type = _fiber.elementType;

      const props = _fiber.pendingProps;

      const rootContainerInstance = config.getPublicInstance(_dispatch.rootNode);

      const hostContext = _dispatch.runtimeDom.hostContextMap.get(_fiber.parent || _fiber);

      if (config.finalizeInitialChildren(node, type, props, rootContainerInstance, hostContext)) {
        pendingCommitFiberArray.push(_fiber);
      }
    }
  });

  pendingCommitFiberArray.forEach(function invokeCommitMount(_fiber) {
    const node = config.getPublicInstance(_fiber.nativeNode);

    const type = _fiber.elementType;

    const props = _fiber.pendingProps;

    config.commitMount?.(node, type, props, _fiber);
  });

  beforeSyncUpdate();

  _list.listToFoot(function invokeLayoutEffectList(_fiber) {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      layoutEffect(_dispatch, _fiber);
    }
  });

  afterSyncUpdate();

  function invokeEffectListTask() {
    __DEV__ && enableScopeTreeLog.current && setLogScope();

    _list.listToFoot(function invokeEffectList(_fiber) {
      if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
        effect(_dispatch, _fiber);
      }
    });

    __DEV__ && enableScopeTreeLog.current && resetLogScope();
  }

  addEffectCallback(invokeEffectListTask);

  const renderScheduler = currentScheduler.current;

  renderScheduler.macroTask(function flushEffect() {
    flushEffectCallback();
  });
};
