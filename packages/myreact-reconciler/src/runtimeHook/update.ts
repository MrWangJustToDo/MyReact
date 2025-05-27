import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { HOOK_TYPE, STATE_TYPE, include, isArrayEquals, isNormalEquals } from "@my-react/react-shared";

import { getInstanceContextFiber, setContextForInstance, setOwnerForInstance } from "../runtimeGenerate";
import { currentRenderDispatch, getCurrentDispatchFromFiber, getHookTree, safeCallWithCurrentFiber } from "../share";

import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { RenderHookParams } from "@my-react/react";
import type { ListTreeNode } from "@my-react/react-shared";

const { enableDebugLog } = __my_react_shared__;

const { currentHookTreeNode, currentScheduler } = __my_react_internal__;

export const updateHookNode = ({ type, value, reducer, deps }: RenderHookParams, fiber: MyReactFiberNode, isHMR?: boolean) => {
  const renderDispatch = currentRenderDispatch.current || getCurrentDispatchFromFiber(fiber);

  const renderScheduler = currentScheduler.current;

  const currentHook = currentHookTreeNode.current?.value as MyReactHookNode;

  if (!currentHook) {
    throw new Error(`[@my-react/react] should have a hookList for current node, this is a bug for @my-react`);
  }

  if (type !== currentHook?.type) {
    throw new Error(
      getHookTree(currentHookTreeNode.current.prev as ListTreeNode<MyReactHookNode>, {
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

  if (currentHook.type === HOOK_TYPE.useEffect || currentHook.type === HOOK_TYPE.useLayoutEffect || currentHook.type === HOOK_TYPE.useInsertionEffect) {
    if (isHMR || !deps || !isArrayEquals(currentHook.deps, deps)) {
      currentHook.value = value;

      currentHook.result = value;

      currentHook.reducer = reducer || currentHook.reducer;

      currentHook.deps = deps;

      currentHook.hasEffect = true;
    }
    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useImperativeHandle) {
    let depsChanged = false;
    // ref changed also need to trigger effect
    if (isHMR || !deps || !isNormalEquals(currentHook.value, value) || ((depsChanged = !isArrayEquals(currentHook.deps, deps)), depsChanged)) {
      currentHook.value = value;

      currentHook.result = value;

      currentHook.reducer = depsChanged ? reducer || currentHook.reducer : currentHook.reducer;

      currentHook.deps = deps;

      currentHook.hasEffect = true;
    }
    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useSyncExternalStore) {
    const storeApi = currentHook.value;

    const newStoreApi = value;

    const prevResult = storeApi.result;

    const nextResult = safeCallWithCurrentFiber({
      fiber,
      action: function safeCallGetSnapshot() {
        return newStoreApi.getSnapshot.call(null);
      },
    });

    if (!Object.is(nextResult, newStoreApi.getSnapshot.call(null))) {
      throw new Error(`[@my-react/react] syncExternalStore getSnapshot not stable!`);
    }

    currentHook.result = nextResult;

    const checkResultUpdate = function checkResultUpdate() {
      const prevResult = storeApi.result;

      let nextResult = null;

      let hasChange = true;

      try {
        nextResult = storeApi.getSnapshot.call(null);
        hasChange = !Object.is(prevResult, nextResult);
      } catch {
        hasChange = true;
      }

      if (hasChange) {
        currentHook._update({ isForce: true, isSync: true, payLoad: () => nextResult });
      }
    };

    if (
      !Object.is(prevResult, nextResult) ||
      !Object.is(storeApi.getSnapshot, newStoreApi.getSnapshot) ||
      !Object.is(storeApi.subscribe, newStoreApi.subscribe)
    ) {
      renderDispatch.pendingLayoutEffect(fiber, function invokeLayoutEffectOnHook() {
        storeApi.result = nextResult;

        storeApi.getSnapshot = newStoreApi.getSnapshot;

        checkResultUpdate();
      });
    }

    if (isHMR || !Object.is(storeApi.subscribe, newStoreApi.subscribe)) {
      renderDispatch.pendingEffect(fiber, function invokeEffectOnHook() {
        currentHook.cancel && currentHook.cancel();

        checkResultUpdate();

        currentHook.cancel = storeApi.subscribe(checkResultUpdate);
      });
    }

    return currentHook;
  }

  // if (currentHook.type === HOOK_TYPE.useSyncExternalStore) {
  //   const storeApi = currentHook.value;

  //   const newStoreApi = value;

  //   const nextResult = safeCallWithCurrentFiber({
  //     fiber,
  //     action: function safeCallGetSnapshot() {
  //       return newStoreApi.getSnapshot.call(null);
  //     },
  //   });

  //   if (!Object.is(nextResult, newStoreApi.getSnapshot.call(null))) {
  //     throw new Error(`[@my-react/react] syncExternalStore getSnapshot not stable!`);
  //   }

  //   currentHook.result = nextResult;

  //   if (isHMR || !Object.is(storeApi.subscribe, newStoreApi.subscribe)) {
  //     storeApi.subscribe = newStoreApi.subscribe;

  //     currentHook.hasEffect = true;
  //   }

  //   storeApi.getSnapshot = newStoreApi.getSnapshot;

  //   return currentHook;
  // }

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

      currentHook.result = safeCallWithCurrentFiber({
        fiber,
        action: function safeCallMemoOnHook() {
          return (value as () => unknown).call(null);
        },
      });

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
      currentHook.cancel = renderScheduler.yieldTask(function triggerHookUpdate() {
        currentHook.result = currentHook.value;

        currentHook._update({ isForce: true });

        currentHook.cancel = null;
      });
    }
  }

  if (currentHook.type === HOOK_TYPE.useDebugValue) {
    if (!isArrayEquals(currentHook.value, value)) {
      currentHook.value = value;

      currentHook.result = value;

      if (enableDebugLog.current) {
        console.warn(`[debug]`, ...currentHook.value);
      }
    }
  }

  return currentHook;
};
