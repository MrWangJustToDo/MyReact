import { __my_react_shared__ } from "@my-react/react";
import { HOOK_TYPE } from "@my-react/react-shared";

import { currentRenderDispatch } from "../share";

import { checkHookValid } from "./check";
import { MyReactHookNode } from "./instance";
import { MyReactSignal } from "./signal";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { Action, Reducer, RenderHookParams } from "@my-react/react";

const { enableDebugLog } = __my_react_shared__;

const defaultReducer: Reducer = (state?: unknown, action?: Action) => {
  return typeof action === "function" ? action(state) : action;
};

export const createHookNode = ({ type, value, reducer, deps }: RenderHookParams, fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const hookNode = new MyReactHookNode(type, value, reducer || defaultReducer, deps);

  hookNode._setOwner(fiber);

  fiber.hookList.push(hookNode);

  if (__DEV__) checkHookValid(hookNode);

  if (hookNode.type === HOOK_TYPE.useMemo || hookNode.type === HOOK_TYPE.useState || hookNode.type === HOOK_TYPE.useReducer) {
    hookNode.result = hookNode.value.call(null);
  }

  if (
    hookNode.type === HOOK_TYPE.useEffect ||
    hookNode.type === HOOK_TYPE.useLayoutEffect ||
    hookNode.type === HOOK_TYPE.useInsertionEffect ||
    hookNode.type === HOOK_TYPE.useImperativeHandle
  ) {
    hookNode.effect = true;
  }

  if (hookNode.type === HOOK_TYPE.useRef || hookNode.type === HOOK_TYPE.useCallback || hookNode.type === HOOK_TYPE.useDeferredValue) {
    hookNode.result = hookNode.value;
  }

  if (hookNode.type === HOOK_TYPE.useId) {
    hookNode.result = `:-${renderDispatch.uniqueIdCount++}-:`;
    hookNode.cancel = () => renderDispatch.uniqueIdCount--;
  }

  if (hookNode.type === HOOK_TYPE.useDebugValue) {
    if (enableDebugLog.current) {
      console.warn(`[@my-react/react]-[debug-log]`, ...hookNode.value);
    }
  }

  if (hookNode.type === HOOK_TYPE.useContext) {
    const ProviderFiber = renderDispatch.resolveContextFiber(hookNode._ownerFiber as MyReactFiberNode, hookNode.value);

    const context = renderDispatch.resolveContextValue(ProviderFiber, hookNode.value);

    hookNode._setContext(ProviderFiber);

    hookNode.result = context;

    hookNode.context = context;
  }

  if (hookNode.type === HOOK_TYPE.useSyncExternalStore) {
    const storeApi = hookNode.value;

    hookNode.result = storeApi.getServerSnapshot ? storeApi.getServerSnapshot?.call(null) : storeApi.getSnapshot.call(null);

    hookNode.effect = true;
  }

  if (hookNode.type === HOOK_TYPE.useSignal) {
    hookNode.result = new MyReactSignal(hookNode.value.call(null), renderDispatch);
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugHookTypes = typedFiber._debugHookTypes || [];

    typedFiber._debugHookTypes.push(hookNode.type);
  }

  return hookNode;
};
