import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE, exclude } from "@my-react/react-shared";

import { effect, insertionEffect, layoutEffect } from "../dispatchEffect";
import { defaultInvokeUnmountList } from "../dispatchUnmount";
import { afterSyncUpdate, beforeSyncUpdate, resetLogScope, safeCallWithCurrentFiber, setLogScope } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { ListTree } from "@my-react/react-shared";

const { currentScheduler } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const defaultDispatchUpdate = (_list: ListTree<MyReactFiberNode>, _dispatch: CustomRenderDispatch) => {
  // TODO maybe need call `insertionEffect` in another function
  beforeSyncUpdate();

  _list.listToFoot(function invokeUnmountPendingAndInsertionEffectList(_fiber) {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      defaultInvokeUnmountList(_fiber, _dispatch);
      insertionEffect(_fiber, _dispatch);
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
      layoutEffect(_fiber, _dispatch);
    }
  });

  afterSyncUpdate();

  const renderScheduler = currentScheduler.current;

  // TODO before next update flow, make sure all the effect has done
  renderScheduler.microTask(function invokeEffectListTask() {
    __DEV__ && enableScopeTreeLog.current && setLogScope();

    _list.listToFoot(function invokeEffectList(_fiber) {
      if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
        effect(_fiber, _dispatch);
      }
    });

    __DEV__ && enableScopeTreeLog.current && resetLogScope();
  });
};
