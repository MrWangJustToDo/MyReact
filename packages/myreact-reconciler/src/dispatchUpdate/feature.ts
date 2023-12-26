import { __my_react_internal__ } from "@my-react/react";
import { STATE_TYPE, exclude } from "@my-react/react-shared";

import { context } from "../dispatchContext";
import { effect, insertionEffect, layoutEffect } from "../dispatchEffect";
import { unmount } from "../dispatchUnmount";
import { afterSyncUpdate, beforeSyncUpdate, safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { ListTree } from "@my-react/react-shared";

const { currentRenderPlatform } = __my_react_internal__;

export const defaultDispatchUpdate = (_list: ListTree<MyReactFiberNode>, _dispatch: CustomRenderDispatch) => {
  // TODO maybe need call `insertionEffect` in another function
  beforeSyncUpdate();

  _list.listToFoot((_fiber) => {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      unmount(_fiber, _dispatch);
      insertionEffect(_fiber, _dispatch);
    }
  });

  afterSyncUpdate();

  _list.listToFoot((_fiber) => {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      safeCallWithFiber({
        fiber: _fiber,
        action: () => _dispatch.commitCreate(_fiber),
      });
    }
  });

  _list.listToHead((_fiber) => {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      safeCallWithFiber({
        fiber: _fiber,
        action: () => {
          _dispatch.commitPosition(_fiber);
          _dispatch.commitUpdate(_fiber);
        },
      });
    }
  });

  _list.listToFoot((_fiber) => {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      safeCallWithFiber({
        fiber: _fiber,
        action: () => {
          _dispatch.commitAppend(_fiber);
          // _dispatch.commitUpdate(_fiber);
          _dispatch.commitSetRef(_fiber);
        },
      });
    }
  });

  beforeSyncUpdate();

  _list.listToFoot((_fiber) => {
    if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
      context(_fiber, _dispatch);
      layoutEffect(_fiber, _dispatch);
    }
  });

  afterSyncUpdate();

  currentRenderPlatform.current.microTask(() =>
    _list.listToFoot((_fiber) => {
      if (exclude(_fiber.state, STATE_TYPE.__unmount__) && !_dispatch.isAppUnmounted) {
        effect(_fiber, _dispatch);
      }
    })
  );
};
