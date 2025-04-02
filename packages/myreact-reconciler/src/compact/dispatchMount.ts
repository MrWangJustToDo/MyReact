import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { insertionEffect, layoutEffect, effect } from "../dispatchEffect";
import { generateFiberToMountList, beforeSyncUpdate, afterSyncUpdate, safeCallWithCurrentFiber, setLogScope, resetLogScope } from "../share";

import type { ReconcilerDispatch } from "./dispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRenderPlatform } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const defaultDispatchMount = (_fiber: MyReactFiberNode, _dispatch: ReconcilerDispatch, config: any) => {
  const _list = generateFiberToMountList(_fiber);

  const pendingCommitFiberArray = [];

  beforeSyncUpdate();

  _list.listToFoot(function invokeInsertionEffectList(_fiber) {
    insertionEffect(_fiber, _dispatch);
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

  _list.listToFoot(function invokeAppendAndSetRefList(_fiber) {
    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallAppendAndSetRef() {
        _dispatch.commitAppend(_fiber);
        _dispatch.commitSetRef(_fiber);
      },
    });
  });

  _list.listToFoot(function invokeFinalizeInitialChildren(_fiber) {
    if (_fiber.nativeNode) {
      const node = config.getPublicInstance(_fiber.nativeNode);

      const type = _fiber.elementType;

      const props = _fiber.pendingProps;

      const rootContainerInstance = config.getPublicInstance(_dispatch.rootNode);

      const hostContext = _dispatch.runtimeDom.hostContextMap.get(_fiber);

      if (config.finalizeInitialChildren(node, type, props, rootContainerInstance, hostContext)) {
        pendingCommitFiberArray.push(_fiber);
      }
    }
  });

  pendingCommitFiberArray.forEach(function invokeCommitMount(_fiber) {
    const node = config.getPublicInstance(_fiber.nativeNode);

    const type = _fiber.elementType;

    const props = _fiber.pendingProps;

    config.commitMount?.(node, type, props, _fiber);
  });

  beforeSyncUpdate();

  _list.listToFoot(function invokeLayoutEffectList(_fiber) {
    layoutEffect(_fiber, _dispatch);
  });

  afterSyncUpdate();

  const renderPlatform = currentRenderPlatform.current;

  renderPlatform.microTask(function invokeEffectListTask() {
    __DEV__ && enableScopeTreeLog.current && setLogScope();

    _list.listToFoot(function invokeEffectList(_fiber) {
      effect(_fiber, _dispatch);
    });

    __DEV__ && enableScopeTreeLog.current && resetLogScope();
  });
};
