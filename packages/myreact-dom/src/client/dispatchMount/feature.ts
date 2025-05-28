import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import {
  afterSyncUpdate,
  beforeSyncUpdate,
  effect,
  generateFiberToMountList,
  insertionEffect,
  layoutEffect,
  resetLogScope,
  safeCallWithCurrentFiber,
  setLogScope,
} from "@my-react/react-reconciler";

import { fallback } from "@my-react-dom-client/api";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

const { currentScheduler } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

let currentHydratedNode: ChildNode | null = null;

export const getPreviousHydratedNode = () => currentHydratedNode;

// TODO
/**
 * @internal
 */
export const clientDispatchMount = (_dispatch: ClientDomDispatch, _fiber: MyReactFiberNode, _hydrate?: boolean) => {
  const mountCommit = (_fiber: MyReactFiberNode, _hydrate: boolean): boolean => {
    const _result = safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallCreate() {
        return _dispatch.clientCommitCreate(_fiber, _hydrate);
      },
    });

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallUpdate() {
        _dispatch.clientCommitUpdate(_fiber, _result);
      },
    });

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallAppend() {
        _dispatch.commitAppend(_fiber);
      },
    });

    let _final = _hydrate;

    if (_fiber.nativeNode) {
      currentHydratedNode = null;
    }

    if (_fiber.child) _final = mountCommit(_fiber.child, _result);

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallSetRef() {
        _dispatch.commitSetRef(_fiber);
      },
    });

    if (_fiber.nativeNode) {
      // current child have loop done, so it is safe to fallback here
      fallback(currentHydratedNode?.nextSibling);

      currentHydratedNode = _fiber.nativeNode as ChildNode;
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

  const startMountCommit = (_fiber: MyReactFiberNode, _hydrate: boolean) => {
    const _list = generateFiberToMountList(_fiber);

    beforeSyncUpdate();
    _list.listToFoot(function invokeInsertionEffectList(fiber) {
      insertionEffect(_dispatch, fiber);
    });
    afterSyncUpdate();

    mountCommit(_fiber, _hydrate);

    currentHydratedNode = null;

    beforeSyncUpdate();
    _list.listToFoot(function invokeLayoutEffectList(fiber) {
      layoutEffect(_dispatch, fiber);
    });
    afterSyncUpdate();

    const renderScheduler = currentScheduler.current;

    renderScheduler.microTask(function invokeEffectListTask() {
      __DEV__ && enableScopeTreeLog.current && setLogScope();

      _list.listToFoot(function invokeEffectList(fiber) {
        effect(_dispatch, fiber);
      });

      __DEV__ && enableScopeTreeLog.current && resetLogScope();
    });
  };

  return startMountCommit(_fiber, _hydrate);
};
