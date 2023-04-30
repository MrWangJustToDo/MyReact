import { __my_react_internal__ } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { context } from "../dispatchContext";
import { effect, insertionEffect, layoutEffect } from "../dispatchEffect";
import { unmount } from "../dispatchUnmount";
import { safeCallWithFiber } from "../share";

import type { RenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { ListTree} from "@my-react/react-shared";

const { currentRenderPlatform } = __my_react_internal__;

export const defaultDispatchUpdate = (_dispatch: RenderDispatch, _list: ListTree<MyReactFiberNode>) => {
  // TODO maybe need call `insertionEffect` in another function
  _list.listToFoot((_fiber) => {
    if (!(_fiber.state & STATE_TYPE.__unmount__)) {
      unmount(_fiber);
      insertionEffect(_fiber);
    }
  });
  _list.listToFoot((_fiber) => {
    if (!(_fiber.state & STATE_TYPE.__unmount__)) {
      safeCallWithFiber({
        fiber: _fiber,
        action: () => _dispatch.commitCreate(_fiber),
      });
    }
  });
  _list.listToHead((_fiber) => {
    if (!(_fiber.state & STATE_TYPE.__unmount__)) {
      safeCallWithFiber({
        fiber: _fiber,
        action: () => _dispatch.commitPosition(_fiber),
      });
    }
  });
  _list.listToFoot((_fiber) => {
    if (!(_fiber.state & STATE_TYPE.__unmount__)) {
      safeCallWithFiber({
        fiber: _fiber,
        action: () => {
          _dispatch.commitAppend(_fiber);
          _dispatch.commitUpdate(_fiber);
          _dispatch.commitSetRef(_fiber);
        },
      });
    }
  });
  _list.listToFoot((_fiber) => {
    if (!(_fiber.state & STATE_TYPE.__unmount__)) {
      context(_fiber);
      layoutEffect(_fiber);
    }
  });
  currentRenderPlatform.current.microTask(() => _list.listToFoot((_fiber) => effect(_fiber)));
};
