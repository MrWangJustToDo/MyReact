import { __my_react_internal__, __my_react_shared__, startTransition } from "@my-react/react";
import { HOOK_TYPE } from "@my-react/react-shared";

import { initInstance, setContextForInstance, setOwnerForInstance } from "../runtimeGenerate";
import { safeCallWithCurrentFiber } from "../share";

import { checkHookValid } from "./check";
import { initHookInstance, MyReactHookNode } from "./instance";
import { MyReactSignal } from "./signal";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactHookNodeDev } from "./instance";
import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { Action, Reducer, RenderHookParams } from "@my-react/react";

const { enableDebugLog, enableDebugFiled } = __my_react_shared__;

const { currentHookTreeNode, currentHookNodeIndex } = __my_react_internal__;

const defaultReducer: Reducer = (state?: unknown, action?: Action) => {
  return typeof action === "function" ? action(state) : action;
};

export const createHookNode = (renderDispatch: CustomRenderDispatch, { type, value, reducer, deps }: RenderHookParams, fiber: MyReactFiberNode) => {
  const currentHook = currentHookTreeNode.current?.value as MyReactHookNode;

  const currentHookIndex = currentHookNodeIndex.current;

  if (currentHook) {
    throw new Error(`[@my-react/react] should not have a hookList for current node, this is a bug for @my-react`);
  }

  const hookNode = new MyReactHookNode(type, value, reducer || defaultReducer, deps);

  initInstance(hookNode);

  initHookInstance(hookNode);

  setOwnerForInstance(hookNode, fiber);

  fiber.hookList.push(hookNode);

  if (__DEV__) checkHookValid(hookNode);

  if (hookNode.type === HOOK_TYPE.useMemo || hookNode.type === HOOK_TYPE.useState || hookNode.type === HOOK_TYPE.useReducer) {
    hookNode.result = hookNode.value.call(null);
    // 兼容极端情况的hack code
    const a = function () {
      void 0;
    };
    a.bind(null, fiber);
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
    hookNode.result = `_-${currentHookIndex}-${renderDispatch.uniqueIdCount++}-_`;
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

    const getNextResult = () =>
      safeCallWithCurrentFiber({
        fiber,
        action: function safeCallGetSnapshot() {
          return renderDispatch.isAppMounted
            ? storeApi.getSnapshot.call(null)
            : storeApi.getServerSnapshot
              ? storeApi.getServerSnapshot?.call(null)
              : storeApi.getSnapshot.call(null);
        },
      });

    const nextResult = getNextResult();

    if (!Object.is(nextResult, getNextResult())) {
      throw new Error(`[@my-react/react] syncExternalStore getSnapshot not stable!`);
    }

    storeApi.result = nextResult;

    hookNode.result = nextResult;

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
        hookNode._update({ isForce: true, isSync: true, payLoad: () => nextResult });
      }
    };

    renderDispatch.pendingLayoutEffect(fiber, function invokeLayoutEffectOnHook() {
      checkResultUpdate();
    });

    renderDispatch.pendingEffect(fiber, function invokeEffectOnHook() {
      hookNode.cancel && hookNode.cancel();

      checkResultUpdate();

      hookNode.cancel = storeApi.subscribe(checkResultUpdate);
    });
  }

  // if (hookNode.type === HOOK_TYPE.useSyncExternalStore) {
  //   const storeApi = hookNode.value;

  //   const getNextResult = () =>
  //     safeCallWithCurrentFiber({
  //       fiber,
  //       action: function safeCallGetSnapshot() {
  //         return renderDispatch.isAppMounted
  //           ? storeApi.getSnapshot.call(null)
  //           : storeApi.getServerSnapshot
  //             ? storeApi.getServerSnapshot?.call(null)
  //             : storeApi.getSnapshot.call(null);
  //       },
  //     });

  //   const nextResult = getNextResult();

  //   if (!Object.is(nextResult, getNextResult())) {
  //     throw new Error(`[@my-react/react] syncExternalStore getSnapshot not stable!`);
  //   }

  //   storeApi.result = nextResult;

  //   hookNode.result = nextResult;

  //   hookNode.hasEffect = true;
  // }

  if (hookNode.type === HOOK_TYPE.useSignal) {
    hookNode.result = new MyReactSignal(hookNode.value.call(null), renderDispatch);
  }

  if (hookNode.type === HOOK_TYPE.useTransition) {
    hookNode.result = [
      false,
      // TODO
      function startTransitionByHook(cb: () => void) {
        const loadingCallback = (cb: () => void) => {
          startTransition(() => {
            hookNode.result[0] = true;
            hookNode._update({ isForce: true, isSync: true, callback: cb });
          });
        };

        const loadedCallback = () => {
          startTransition(() => {
            hookNode.result[0] = false;
            hookNode._update({ isForce: true, isSync: true });
          });
        };

        const taskCallback = () => {
          startTransition(() => {
            safeCallWithCurrentFiber({ fiber, action: cb });
            loadedCallback();
          });
        };

        loadingCallback(taskCallback);
      },
    ];
  }

  const typedHook = hookNode as MyReactHookNodeDev;

  if (__DEV__ && enableDebugFiled.current) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugHookTypes = typedFiber._debugHookTypes || [];

    typedFiber._debugHookTypes.push(HOOK_TYPE[hookNode.type]);

    typedHook._debugType = HOOK_TYPE[hookNode.type];

    typedHook._debugIndex = currentHookIndex;
  }

  return hookNode;
};
