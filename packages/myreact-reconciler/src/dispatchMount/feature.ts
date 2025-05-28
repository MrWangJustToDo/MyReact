import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { effect, insertionEffect, layoutEffect } from "../dispatchEffect";
import { afterSyncUpdate, beforeSyncUpdate, generateFiberToMountList, resetLogScope, safeCallWithCurrentFiber, setLogScope } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { currentScheduler } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const defaultDispatchMountLegacy = (_dispatch: CustomRenderDispatch, _fiber: MyReactFiberNode) => {
  const mountInsertionEffectList = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountInsertionEffectList(_fiber.child);

    insertionEffect(_dispatch, _fiber);

    if (_fiber.sibling) mountInsertionEffectList(_fiber.sibling);
  };

  const mountCommit = (_fiber: MyReactFiberNode) => {
    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallCreateAndUpdate() {
        _dispatch.commitCreate(_fiber);
        _dispatch.commitUpdate(_fiber);
      },
    });

    if (_fiber.child) mountCommit(_fiber.child);

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallAppendAndSetRef() {
        _dispatch.commitAppend(_fiber);
        _dispatch.commitSetRef(_fiber);
      },
    });

    if (_fiber.sibling) {
      mountCommit(_fiber.sibling);
    }
  };

  const mountLayoutEffectList = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountLayoutEffectList(_fiber.child);

    layoutEffect(_dispatch, _fiber);

    if (_fiber.sibling) mountLayoutEffectList(_fiber.sibling);
  };

  const mountEffectList = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountEffectList(_fiber.child);

    effect(_dispatch, _fiber);

    if (_fiber.sibling) mountEffectList(_fiber.sibling);
  };

  const mountLoop = (_fiber: MyReactFiberNode) => {
    beforeSyncUpdate();
    mountInsertionEffectList(_fiber);
    afterSyncUpdate();

    mountCommit(_fiber);

    beforeSyncUpdate();
    mountLayoutEffectList(_fiber);
    afterSyncUpdate();

    const renderScheduler = currentScheduler.current;

    renderScheduler.microTask(function invokeEffectList() {
      __DEV__ && enableScopeTreeLog.current && setLogScope();

      mountEffectList(_fiber);

      __DEV__ && enableScopeTreeLog.current && resetLogScope();
    });
  };

  mountLoop(_fiber);
};

export const defaultDispatchMountLatest = (_dispatch: CustomRenderDispatch, _fiber: MyReactFiberNode) => {
  const _list = generateFiberToMountList(_fiber);

  beforeSyncUpdate();

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

  const renderScheduler = currentScheduler.current;

  renderScheduler.microTask(function invokeEffectListTask() {
    __DEV__ && enableScopeTreeLog.current && setLogScope();

    _list.listToFoot(function invokeEffectList(_fiber) {
      effect(_dispatch, _fiber);
    });

    __DEV__ && enableScopeTreeLog.current && resetLogScope();
  });
};

export const defaultDispatchMount = defaultDispatchMountLatest;
