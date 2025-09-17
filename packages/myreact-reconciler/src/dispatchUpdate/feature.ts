import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE, exclude } from "@my-react/react-shared";

import { addEffectCallback, effect, flushEffectCallback, insertionEffect, layoutEffect } from "../dispatchEffect";
import { defaultInvokeUnmountList } from "../dispatchUnmount";
import { afterSyncUpdate, beforeSyncUpdate, resetLogScope, safeCallWithCurrentFiber, setLogScope } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { ListTree } from "@my-react/react-shared";

const { currentScheduler } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const defaultDispatchUpdate = (_dispatch: CustomRenderDispatch, _list: ListTree<MyReactFiberNode>) => {
  // TODO maybe need call `insertionEffect` in another function
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

  _list.listToFoot(function invokeCreateAndUpdateList(_fiber) {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallCreateAndUpdate() {
          _dispatch.commitCreate(_fiber);
          _dispatch.commitUpdate(_fiber);
        },
      });
    }
  });

  _list.listToHead(function invokePositionList(_fiber) {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallPosition() {
          _dispatch.commitPosition(_fiber);
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

  if (_dispatch.enableConcurrentMode) {
    renderScheduler.macroTask(function flushEffect() {
      flushEffectCallback();
    });
  } else {
    renderScheduler.microTask(function flushEffect() {
      flushEffectCallback();
    });
  }
};
