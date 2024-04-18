import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { HOOK_TYPE, STATE_TYPE, include, isArrayEquals } from "@my-react/react-shared";

import { getInstanceContextFiber, setContextForInstance, setOwnerForInstance } from "../runtimeGenerate";
import { currentRenderDispatch, safeCallWithFiber } from "../share";

import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { RenderHookParams } from "@my-react/react";
import type { ListTreeNode } from "@my-react/react-shared";

const { enableDebugLog } = __my_react_shared__;

const { currentHookTreeNode, currentRenderPlatform } = __my_react_internal__;

export const updateHookNode = ({ type, value, reducer, deps }: RenderHookParams, fiber: MyReactFiberNode, isHMR?: boolean) => {
  const renderDispatch = currentRenderDispatch.current;

  const renderPlatform = currentRenderPlatform.current;

  const currentHook = currentHookTreeNode.current?.value as MyReactHookNode;

  if (!currentHook) {
    throw new Error(`[@my-react/react] should have a hookList for current node, this is a bug for @my-react`);
  }

  if (type !== currentHook?.type) {
    throw new Error(
      renderPlatform.getHookTree(currentHookTreeNode.current.prev as ListTreeNode<MyReactHookNode>, {
        lastRender: currentHook?.type,
        nextRender: type,
      })
    );
  }

  setOwnerForInstance(currentHook, fiber);

  currentHookTreeNode.current = currentHookTreeNode.current.next;

  if (
    currentHook.type === HOOK_TYPE.useMemo ||
    currentHook.type === HOOK_TYPE.useEffect ||
    currentHook.type === HOOK_TYPE.useCallback ||
    currentHook.type === HOOK_TYPE.useLayoutEffect ||
    currentHook.type === HOOK_TYPE.useInsertionEffect ||
    currentHook.type === HOOK_TYPE.useImperativeHandle
  ) {
    if (deps && !currentHook.deps) {
      throw new Error("[@my-react/react] deps state change");
    }
    if (!deps && currentHook.deps) {
      throw new Error("[@my-react/react] deps state change");
    }
  }

  if (
    currentHook.type === HOOK_TYPE.useEffect ||
    currentHook.type === HOOK_TYPE.useLayoutEffect ||
    currentHook.type === HOOK_TYPE.useInsertionEffect ||
    currentHook.type === HOOK_TYPE.useImperativeHandle
  ) {
    if (isHMR || !deps || !isArrayEquals(currentHook.deps, deps)) {
      currentHook.value = value;

      currentHook.reducer = reducer || currentHook.reducer;

      currentHook.deps = deps;

      currentHook.hasEffect = true;
    }
    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useSyncExternalStore) {
    const storeApi = currentHook.value;

    const newStoreApi = value;

    if (isHMR || !Object.is(storeApi.subscribe, newStoreApi.subscribe)) {
      storeApi.subscribe = newStoreApi.subscribe;

      currentHook.hasEffect = true;
    }

    storeApi.getSnapshot = newStoreApi.getSnapshot;

    currentHook.result = safeCallWithFiber({ fiber, action: () => storeApi.getSnapshot.call(null) });

    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useCallback) {
    if (isHMR || !deps || !isArrayEquals(currentHook.deps, deps)) {
      currentHook.value = value;

      currentHook.result = value;

      currentHook.deps = deps;
    }
    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useMemo) {
    if (isHMR || !deps || !isArrayEquals(currentHook.deps, deps)) {
      currentHook.value = value;

      currentHook.result = safeCallWithFiber({ fiber, action: () => (value as () => unknown).call(null) });

      currentHook.deps = deps;
    }
    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useContext) {
    const contextFiber = getInstanceContextFiber(currentHook);

    if (!contextFiber || include(contextFiber.state, STATE_TYPE.__unmount__) || !Object.is(currentHook.value, value)) {
      currentHook.value = value;

      const providerFiber = renderDispatch.resolveContextFiber(fiber, currentHook.value);

      const context = renderDispatch.resolveContextValue(providerFiber, currentHook.value);

      setContextForInstance(currentHook, providerFiber);

      currentHook.result = context;
    } else {
      const context = renderDispatch.resolveContextValue(contextFiber, currentHook.value);

      currentHook.result = context;
    }
    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useReducer) {
    currentHook.value = value;

    currentHook.reducer = reducer;

    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useDeferredValue) {
    currentHook.cancel?.();

    currentHook.value = value;

    if (!Object.is(currentHook.value, currentHook.result)) {
      currentHook.cancel = renderPlatform.yieldTask(() => {
        currentHook.result = currentHook.value;

        currentHook._update({ isForce: true });

        currentHook.cancel = null;
      });
    }
  }

  if (currentHook.type === HOOK_TYPE.useDebugValue) {
    if (!isArrayEquals(currentHook.value, value)) {
      currentHook.value = value;

      if (enableDebugLog.current) {
        console.warn(`[debug]`, ...currentHook.value);
      }
    }
  }

  return currentHook;
};
