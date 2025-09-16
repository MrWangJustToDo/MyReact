import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { addEffectCallback, effect, flushEffectCallback, insertionEffect, layoutEffect } from "../dispatchEffect";
import { defaultInvokeUnmountList } from "../dispatchUnmount";
import { afterSyncUpdate, beforeSyncUpdate, generateFiberToListWithAction, resetLogScope, safeCallWithCurrentFiber, setLogScope } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { currentScheduler } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

// TODO improve
export const defaultDispatchMountLatest = (_dispatch: CustomRenderDispatch, _fiber: MyReactFiberNode) => {
  beforeSyncUpdate();

  const _list = generateFiberToListWithAction(_fiber, function invokeUnmountPendingList(_fiber) {
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

  beforeSyncUpdate();

  _list.listToFoot(function invokeLayoutEffectList(_fiber) {
    layoutEffect(_dispatch, _fiber);
  });

  afterSyncUpdate();

  function invokeEffectListTask() {
    __DEV__ && enableScopeTreeLog.current && setLogScope();

    _list.listToFoot(function invokeEffectList(_fiber) {
      effect(_dispatch, _fiber);
    });

    __DEV__ && enableScopeTreeLog.current && resetLogScope();
  }

  addEffectCallback(invokeEffectListTask);

  const renderScheduler = currentScheduler.current;

  renderScheduler.macroTask(function flushEffect() {
    flushEffectCallback();
  });
};

export const defaultDispatchMount = defaultDispatchMountLatest;
