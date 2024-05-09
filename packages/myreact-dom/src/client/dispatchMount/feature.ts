import { __my_react_internal__ } from "@my-react/react";
import {
  afterSyncUpdate,
  beforeSyncUpdate,
  effect,
  generateFiberToMountList,
  insertionEffect,
  layoutEffect,
  safeCallWithFiber,
} from "@my-react/react-reconciler";

import { fallback } from "@my-react-dom-client/api";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

const { currentRenderPlatform } = __my_react_internal__;

// TODO
/**
 * @internal
 */
export const clientDispatchMount = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch, _hydrate?: boolean) => {
  // const mountInsertionEffect = (_fiber: MyReactFiberNode) => {
  //   if (_fiber.child) mountInsertionEffect(_fiber.child);

  //   insertionEffect(_fiber, _dispatch);

  //   if (_fiber.sibling) mountInsertionEffect(_fiber.sibling);
  // };

  // const mountLayoutEffect = (_fiber: MyReactFiberNode) => {
  //   if (_fiber.child) mountLayoutEffect(_fiber.child);

  //   layoutEffect(_fiber, _dispatch);

  //   if (_fiber.sibling) mountLayoutEffect(_fiber.sibling);
  // };

  // const mountEffect = (_fiber: MyReactFiberNode) => {
  //   if (_fiber.child) mountEffect(_fiber.child);

  //   effect(_fiber, _dispatch);

  //   if (_fiber.sibling) mountEffect(_fiber.sibling);
  // };

  const mountCommit = (_fiber: MyReactFiberNode, _hydrate: boolean): boolean => {
    const _result = safeCallWithFiber({
      fiber: _fiber,
      action: () => _dispatch._commitCreate(_fiber, _hydrate),
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => _dispatch._commitUpdate(_fiber, _result),
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => _dispatch.commitAppend(_fiber),
    });

    let _final = _hydrate;

    if (_fiber.nativeNode) {
      _dispatch._previousNativeNode = null;
    }

    if (_fiber.child) _final = mountCommit(_fiber.child, _result);

    safeCallWithFiber({ fiber: _fiber, action: () => _dispatch.commitSetRef(_fiber) });

    if (_fiber.nativeNode) {
      // current child have loop done, so it is safe to fallback here
      fallback(_dispatch._previousNativeNode?.nextSibling);

      _dispatch._previousNativeNode = _fiber.nativeNode as ChildNode;
    }

    if (_fiber.sibling) {
      mountCommit(_fiber.sibling, _fiber.nativeNode ? _result : _final);
    }

    if (_fiber.nativeNode) {
      return _result;
    } else {
      return _final;
    }
  };

  const mountLoop = (_fiber: MyReactFiberNode, _hydrate: boolean) => {
    const _list = generateFiberToMountList(_fiber);

    beforeSyncUpdate();
    _list.listToFoot((fiber) => insertionEffect(fiber, _dispatch));
    afterSyncUpdate();

    mountCommit(_fiber, _hydrate);

    delete _dispatch._previousNativeNode;

    beforeSyncUpdate();
    _list.listToFoot((fiber) => layoutEffect(fiber, _dispatch));
    afterSyncUpdate();

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.microTask(() => _list.listToFoot((fiber) => effect(fiber, _dispatch)));
  };

  return mountLoop(_fiber, _hydrate);
};
