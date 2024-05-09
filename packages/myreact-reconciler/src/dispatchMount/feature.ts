import { __my_react_internal__ } from "@my-react/react";

import { effect, insertionEffect, layoutEffect } from "../dispatchEffect";
import { afterSyncUpdate, beforeSyncUpdate, generateFiberToMountList, safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRenderPlatform } = __my_react_internal__;

export const defaultDispatchMountLegacy = (_fiber: MyReactFiberNode, _dispatch: CustomRenderDispatch) => {
  const mountInsertionEffect = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountInsertionEffect(_fiber.child);

    insertionEffect(_fiber, _dispatch);

    if (_fiber.sibling) mountInsertionEffect(_fiber.sibling);
  };

  const mountCommit = (_fiber: MyReactFiberNode) => {
    safeCallWithFiber({
      fiber: _fiber,
      action: () => {
        _dispatch.commitCreate(_fiber);
        _dispatch.commitUpdate(_fiber);
      },
    });

    if (_fiber.child) mountCommit(_fiber.child);

    safeCallWithFiber({
      fiber: _fiber,
      action: () => {
        _dispatch.commitAppend(_fiber);
        _dispatch.commitSetRef(_fiber);
      },
    });

    if (_fiber.sibling) {
      mountCommit(_fiber.sibling);
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

  const mountLoop = (_fiber: MyReactFiberNode) => {
    beforeSyncUpdate();
    mountInsertionEffect(_fiber);
    afterSyncUpdate();

    mountCommit(_fiber);

    beforeSyncUpdate();
    mountLayoutEffect(_fiber);
    afterSyncUpdate();

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.microTask(() => mountEffect(_fiber));
  };

  mountLoop(_fiber);
};

export const defaultDispatchMount = defaultDispatchMountLegacy;

export const defaultDispatchMountLatest = (_fiber: MyReactFiberNode, _dispatch: CustomRenderDispatch) => {
  const _list = generateFiberToMountList(_fiber);

  beforeSyncUpdate();

  _list.listToFoot((_fiber) => insertionEffect(_fiber, _dispatch));

  afterSyncUpdate();

  _list.listToFoot((_fiber) => {
    safeCallWithFiber({
      fiber: _fiber,
      action: () => {
        _dispatch.commitCreate(_fiber);
        _dispatch.commitUpdate(_fiber);
      },
    });
  });

  _list.listToFoot((_fiber) =>
    safeCallWithFiber({
      fiber: _fiber,
      action: () => {
        _dispatch.commitAppend(_fiber);
        _dispatch.commitSetRef(_fiber);
      },
    })
  );

  beforeSyncUpdate();

  _list.listToFoot((_fiber) => layoutEffect(_fiber, _dispatch));

  afterSyncUpdate();

  const renderPlatform = currentRenderPlatform.current;

  renderPlatform.microTask(() => _list.listToFoot((_fiber) => effect(_fiber, _dispatch)));
};
