import { HOOK_TYPE } from "@my-react/react-shared";

import { isArrayEquals } from "../share";

import type { RenderDispatch } from "../renderDispatch";
import type { CreateHookParams, MyReactFiberNode } from "@my-react/react";

export const updateHookNode = ({ hookIndex, hookType, value, reducer, deps }: CreateHookParams, fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const renderPlatform = fiber.root.renderPlatform;

  const currentHook = fiber.hookNodes[hookIndex];

  if (hookType !== currentHook.hookType) throw new Error(renderPlatform.getHookTree(fiber.hookNodes, hookIndex, hookType));

  currentHook._setOwner(fiber);

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
    if (!currentHook._contextFiber || !currentHook._contextFiber.isMounted || !Object.is(currentHook.value, value)) {
      currentHook.value = value;

      const ProviderFiber = renderDispatch.resolveContextFiber(currentHook._ownerFiber as MyReactFiberNode, currentHook.value);

      const context = renderDispatch.resolveContextValue(ProviderFiber, currentHook.value);

      currentHook._setContext(ProviderFiber);

      currentHook.result = context;

      currentHook.context = context;
    } else {
      const context = renderDispatch.resolveContextValue(currentHook._contextFiber, currentHook.value);

      currentHook.result = context;

      currentHook.context = context;
    }
    return currentHook;
  }

  if (currentHook.hookType === HOOK_TYPE.useReducer) {
    currentHook.value = value;

    currentHook.reducer = reducer;

    return currentHook;
  }

  return currentHook;
};
