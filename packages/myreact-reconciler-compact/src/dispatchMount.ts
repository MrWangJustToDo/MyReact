import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import {
  insertionEffect,
  layoutEffect,
  effect,
  generateFiberToMountList,
  beforeSyncUpdate,
  afterSyncUpdate,
  safeCallWithCurrentFiber,
  setLogScope,
  resetLogScope,
  defaultInvokeUnmountList,
} from "@my-react/react-reconciler";

import type { ReconcilerDispatch } from "./dispatch";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { currentScheduler } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const ReconcilerDispatchMount = (_dispatch: ReconcilerDispatch, _fiber: MyReactFiberNode, config: any) => {
  const _list = generateFiberToMountList(_fiber);

  const pendingCommitFiberArray = [];

  beforeSyncUpdate();

  _list.listToFoot(function invokeUnmountPendingAndInsertionEffectList(_fiber) {
    defaultInvokeUnmountList(_dispatch, _fiber);
  });

  _list.listToFoot(function invokeInsertionEffectList(_fiber) {
    insertionEffect(_dispatch, _fiber);
  });

  afterSyncUpdate();

  _list.listToFoot(function invokeCreateAndUpdateList(_fiber) {
    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallCreateAndUpdate() {
        _dispatch.commitCreate(_fiber);
        _dispatch.commitUpdate(_fiber);
      },
    });
  });

  _list.listToFoot(function invokeAppendList(_fiber) {
    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallAppendList() {
        _dispatch.commitAppend(_fiber);
      },
    });
  });

  _list.listToFoot(function invokeSetRefList(_fiber) {
    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallSetRefList() {
        _dispatch.commitSetRef(_fiber);
      },
    });
  });

  _list.listToFoot(function invokeFinalizeInitialChildren(_fiber) {
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
    layoutEffect(_dispatch, _fiber);
  });

  afterSyncUpdate();

  const renderScheduler = currentScheduler.current;

  renderScheduler.microTask(function invokeEffectListTask() {
    __DEV__ && enableScopeTreeLog.current && setLogScope();

    _list.listToFoot(function invokeEffectList(_fiber) {
      effect(_dispatch, _fiber);
    });

    __DEV__ && enableScopeTreeLog.current && resetLogScope();
  });
};
