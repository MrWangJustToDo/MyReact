import { __my_react_internal__ } from "@my-react/react";

import { effect, insertionEffect, layoutEffect } from "../dispatchEffect";
import { afterSyncUpdate, beforeSyncUpdate, safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRenderPlatform } = __my_react_internal__;

export const defaultDispatchMount = (_fiber: MyReactFiberNode, _dispatch: CustomRenderDispatch, _hydrate?: boolean) => {
  const mountInsertionEffect = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountInsertionEffect(_fiber.child);

    insertionEffect(_fiber, _dispatch);

    if (_fiber.sibling) mountInsertionEffect(_fiber.sibling);
  };

  const mountCommit = (_fiber: MyReactFiberNode, _hydrate: boolean) => {
    const _result = safeCallWithFiber({
      fiber: _fiber,
      action: () => _dispatch.commitCreate(_fiber, _hydrate),
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => _dispatch.commitUpdate(_fiber, _result),
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => _dispatch.commitAppend(_fiber),
    });

    let _final = _hydrate;

    if (_fiber.child) _final = mountCommit(_fiber.child, _result);

    safeCallWithFiber({ fiber: _fiber, action: () => _dispatch.commitSetRef(_fiber) });

    if (_fiber.sibling) {
      mountCommit(_fiber.sibling, _fiber.nativeNode ? _result : _final);
    }

    if (_fiber.nativeNode) {
      return _result;
    } else {
      return _final;
    }
  };

  const mountLayoutEffect = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountLayoutEffect(_fiber.child);

    layoutEffect(_fiber, _dispatch);

    if (_fiber.sibling) mountLayoutEffect(_fiber.sibling);
  };

  const mountEffect = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountEffect(_fiber.child);

    effect(_fiber, _dispatch);

    if (_fiber.sibling) mountEffect(_fiber.sibling);
  };

  const mountLoop = (_fiber: MyReactFiberNode, _hydrate: boolean) => {
    beforeSyncUpdate();
    mountInsertionEffect(_fiber);
    afterSyncUpdate();

    const re = mountCommit(_fiber, _hydrate);

    beforeSyncUpdate();
    mountLayoutEffect(_fiber);
    afterSyncUpdate();

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.microTask(() => mountEffect(_fiber));

    return re;
  };

  return mountLoop(_fiber, _hydrate);
};
