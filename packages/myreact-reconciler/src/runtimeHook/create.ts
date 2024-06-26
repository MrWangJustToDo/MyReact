import { __my_react_internal__, __my_react_shared__, startTransition } from "@my-react/react";
import { HOOK_TYPE } from "@my-react/react-shared";

import { initInstance, setContextForInstance, setOwnerForInstance } from "../runtimeGenerate";
import { currentRenderDispatch, safeCallWithFiber } from "../share";

import { checkHookValid } from "./check";
import { MyReactHookNode } from "./instance";
import { MyReactSignal } from "./signal";

import type { MyReactHookNodeDev } from "./instance";
import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { Action, Reducer, RenderHookParams } from "@my-react/react";

const { enableDebugLog, enableDebugFiled } = __my_react_shared__;

const { currentHookTreeNode, currentHookNodeIndex } = __my_react_internal__;

const defaultReducer: Reducer = (state?: unknown, action?: Action) => {
  return typeof action === "function" ? action(state) : action;
};

export const createHookNode = ({ type, value, reducer, deps }: RenderHookParams, fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const currentHook = currentHookTreeNode.current?.value as MyReactHookNode;

  const currentHookIndex = currentHookNodeIndex.current;

  if (currentHook) {
    throw new Error(`[@my-react/react] should not have a hookList for current node, this is a bug for @my-react`);
  }

  const hookNode = new MyReactHookNode(type, value, reducer || defaultReducer, deps);

  initInstance(hookNode);

  setOwnerForInstance(hookNode, fiber);

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
    hookNode.result = hookNode.value;
    hookNode.hasEffect = true;
  }

  if (hookNode.type === HOOK_TYPE.useRef || hookNode.type === HOOK_TYPE.useCallback || hookNode.type === HOOK_TYPE.useDeferredValue) {
    hookNode.result = hookNode.value;
  }

  if (hookNode.type === HOOK_TYPE.useId) {
    hookNode.result = `:-${currentHookIndex}-${renderDispatch.uniqueIdCount++}-:`;
    hookNode.cancel = () => renderDispatch.uniqueIdCount--;
  }

  if (hookNode.type === HOOK_TYPE.useDebugValue) {
    hookNode.result = hookNode.value;
    if (enableDebugLog.current) {
      console.warn(`[debug]`, ...hookNode.value);
    }
  }

  if (hookNode.type === HOOK_TYPE.useContext) {
    const providerFiber = renderDispatch.resolveContextFiber(fiber, hookNode.value);

    const context = renderDispatch.resolveContextValue(providerFiber, hookNode.value);

    setContextForInstance(hookNode, providerFiber);

    hookNode.result = context;
  }

  if (hookNode.type === HOOK_TYPE.useSyncExternalStore) {
    const storeApi = hookNode.value;

    hookNode.result = safeCallWithFiber({
      fiber,
      action: () =>
        renderDispatch.isAppMounted
          ? storeApi.getSnapshot.call(null)
          : storeApi.getServerSnapshot
            ? storeApi.getServerSnapshot?.call(null)
            : storeApi.getSnapshot.call(null),
    });

    hookNode.hasEffect = true;
  }

  if (hookNode.type === HOOK_TYPE.useSignal) {
    hookNode.result = new MyReactSignal(hookNode.value.call(null), renderDispatch);
  }

  if (hookNode.type === HOOK_TYPE.useTransition) {
    hookNode.result = [
      false,
      (cb: () => void) => {
        const loadingCallback = (cb: () => void) => {
          startTransition(() => {
            hookNode.result[0] = true;
            hookNode._update({ isForce: true, callback: cb });
          });
        };

        const loadedCallback = () => {
          startTransition(() => {
            hookNode.result[0] = false;
            hookNode._update({ isForce: true });
          });
        };

        const taskCallback = () => {
          startTransition(() => {
            safeCallWithFiber({ fiber, action: cb });
            loadedCallback();
          });
        };

        loadingCallback(taskCallback);
      },
    ];
  }

  if (__DEV__ && enableDebugFiled.current) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugHookTypes = typedFiber._debugHookTypes || [];

    typedFiber._debugHookTypes.push(HOOK_TYPE[hookNode.type]);

    const typedHook = hookNode as MyReactHookNodeDev;

    typedHook._debugType = HOOK_TYPE[hookNode.type];

    typedHook._debugIndex = currentHookIndex;
  }

  return hookNode;
};
