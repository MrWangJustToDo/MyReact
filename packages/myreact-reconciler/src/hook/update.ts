import { __my_react_shared__ } from "@my-react/react";
import { HOOK_TYPE } from "@my-react/react-shared";

import { isArrayEquals } from "../share";

import type { CreateHookParams, MyReactFiberNode } from "@my-react/react";

const { logHook } = __my_react_shared__;

export const updateHookNode = ({ hookIndex, hookType, value, reducer, deps }: CreateHookParams, fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.root_dispatch;

  const currentHook = fiber.hookNodeArray[hookIndex];

  if (hookType !== currentHook.hookType) {
    const array = fiber.hookTypeArray.slice(0, hookIndex);
    throw new Error(logHook([...array, currentHook.hookType], [...array, hookType]));
  }

  currentHook.setOwner(fiber);

  if (
    currentHook.hookType === HOOK_TYPE.useMemo ||
    currentHook.hookType === HOOK_TYPE.useEffect ||
    currentHook.hookType === HOOK_TYPE.useCallback ||
    currentHook.hookType === HOOK_TYPE.useLayoutEffect ||
    currentHook.hookType === HOOK_TYPE.useImperativeHandle
  ) {
    if (deps && !currentHook.deps) {
      throw new Error("deps state change");
    }
    if (!deps && currentHook.deps) {
      throw new Error("deps state change");
    }
  }

  if (
    currentHook.hookType === HOOK_TYPE.useEffect ||
    currentHook.hookType === HOOK_TYPE.useLayoutEffect ||
    currentHook.hookType === HOOK_TYPE.useImperativeHandle
  ) {
    if (!deps) {
      currentHook.value = value;
      currentHook.reducer = reducer || currentHook.reducer;
      currentHook.deps = deps;
      currentHook.effect = true;
    } else if (!isArrayEquals(currentHook.deps, deps)) {
      currentHook.value = value;
      currentHook.reducer = reducer || currentHook.reducer;
      currentHook.deps = deps;
      currentHook.effect = true;
    }
    return currentHook;
  }

  if (currentHook.hookType === HOOK_TYPE.useCallback) {
    if (!isArrayEquals(currentHook.deps, deps)) {
      currentHook.value = value;
      currentHook.result = value;
      currentHook.deps = deps;
    }
    return currentHook;
  }

  if (currentHook.hookType === HOOK_TYPE.useMemo) {
    if (!isArrayEquals(currentHook.deps, deps)) {
      currentHook.value = value;
      currentHook.result = (value as () => unknown).call(null);
      currentHook.deps = deps;
    }
    return currentHook;
  }

  if (currentHook.hookType === HOOK_TYPE.useContext) {
    if (!currentHook._contextFiber || !currentHook._contextFiber.mounted || !Object.is(currentHook.value, value)) {
      currentHook.value = value;
      const ProviderFiber = globalDispatch.resolveContextFiber(currentHook._ownerFiber as MyReactFiberNode, currentHook.value);

      const context = globalDispatch.resolveContextValue(ProviderFiber, currentHook.value);

      currentHook.setContext(ProviderFiber);

      currentHook.result = context;

      currentHook.context = context;
    } else {
      const context = globalDispatch.resolveContextValue(currentHook._contextFiber, currentHook.value);

      currentHook.result = context;

      currentHook.context = context;
    }
    return currentHook;
  }

  if (currentHook.hookType === HOOK_TYPE.useReducer) {
    currentHook.value = value;
    currentHook.reducer = reducer!;
    return currentHook;
  }

  return currentHook;
};
