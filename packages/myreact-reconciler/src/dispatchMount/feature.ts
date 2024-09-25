import { __my_react_internal__ } from "@my-react/react";

import { effect, insertionEffect, layoutEffect } from "../dispatchEffect";
import { afterSyncUpdate, beforeSyncUpdate, generateFiberToMountList, safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRenderPlatform } = __my_react_internal__;

export const defaultDispatchMountLegacy = (_fiber: MyReactFiberNode, _dispatch: CustomRenderDispatch) => {
  const mountInsertionEffectList = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountInsertionEffectList(_fiber.child);

    insertionEffect(_fiber, _dispatch);

    if (_fiber.sibling) mountInsertionEffectList(_fiber.sibling);
  };

  const mountCommit = (_fiber: MyReactFiberNode) => {
    safeCallWithFiber({
      fiber: _fiber,
      action: function safeCallCreateAndUpdate() {
        _dispatch.commitCreate(_fiber);
        _dispatch.commitUpdate(_fiber);
      },
    });

    if (_fiber.child) mountCommit(_fiber.child);

    safeCallWithFiber({
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

    layoutEffect(_fiber, _dispatch);

    if (_fiber.sibling) mountLayoutEffectList(_fiber.sibling);
  };

  const mountEffectList = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountEffectList(_fiber.child);

    effect(_fiber, _dispatch);

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

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.microTask(function invokeEffectList() {
      mountEffectList(_fiber);
    });
  };

  mountLoop(_fiber);
};

export const defaultDispatchMountLatest = (_fiber: MyReactFiberNode, _dispatch: CustomRenderDispatch) => {
  const _list = generateFiberToMountList(_fiber);

  beforeSyncUpdate();

  _list.listToFoot(function invokeInsertionEffectList(_fiber) {
    insertionEffect(_fiber, _dispatch);
  });

  afterSyncUpdate();

  _list.listToFoot(function invokeCreateAndUpdateList(_fiber) {
    safeCallWithFiber({
      fiber: _fiber,
      action: function safeCallCreateAndUpdate() {
        _dispatch.commitCreate(_fiber);
        _dispatch.commitUpdate(_fiber);
      },
    });
  });

  _list.listToFoot(function invokeAppendAndSetRefList(_fiber) {
    safeCallWithFiber({
      fiber: _fiber,
      action: function safeCallAppendAndSetRef() {
        _dispatch.commitAppend(_fiber);
        _dispatch.commitSetRef(_fiber);
      },
    });
  });

  beforeSyncUpdate();

  _list.listToFoot(function invokeLayoutEffectList(_fiber) {
    layoutEffect(_fiber, _dispatch);
  });

  afterSyncUpdate();

  const renderPlatform = currentRenderPlatform.current;

  renderPlatform.microTask(function invokeEffectListTask() {
    _list.listToFoot(function invokeEffectList(_fiber) {
      effect(_fiber, _dispatch);
    });
  });
};

export const defaultDispatchMount = defaultDispatchMountLatest;
