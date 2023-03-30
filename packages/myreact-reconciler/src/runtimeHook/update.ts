import { __my_react_internal__ } from "@my-react/react";
import { HOOK_TYPE, isArrayEquals } from "@my-react/react-shared";

import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { RenderHook } from "@my-react/react";
import type { ListTreeNode } from "@my-react/react-shared";

const { currentHookTreeNode } = __my_react_internal__;

export const updateHookNode = ({ type, value, reducer, deps }: RenderHook, fiber: MyReactFiberNode) => {
  const renderPlatform = fiber.container.renderPlatform;

  const renderDispatch = fiber.container.renderDispatch;

  const currentHook = currentHookTreeNode.current.value as MyReactHookNode;

  if (type !== currentHook?.type) {
    throw new Error(
      renderPlatform.getHookTree(currentHookTreeNode.current.prev as ListTreeNode<MyReactHookNode>, {
        lastRender: currentHook?.type || ("undefined" as HOOK_TYPE),
        nextRender: type,
      })
    );
  }

  currentHook._setOwner(fiber);

  currentHookTreeNode.current = currentHookTreeNode.current.next;

  if (
    currentHook.type === HOOK_TYPE.useMemo ||
    currentHook.type === HOOK_TYPE.useEffect ||
    currentHook.type === HOOK_TYPE.useCallback ||
    currentHook.type === HOOK_TYPE.useLayoutEffect ||
    currentHook.type === HOOK_TYPE.useImperativeHandle
  ) {
    if (deps && !currentHook.deps) {
      throw new Error("deps state change");
    }
    if (!deps && currentHook.deps) {
      throw new Error("deps state change");
    }
  }

  if (currentHook.type === HOOK_TYPE.useEffect || currentHook.type === HOOK_TYPE.useLayoutEffect || currentHook.type === HOOK_TYPE.useImperativeHandle) {
    if (!deps || !isArrayEquals(currentHook.deps, deps)) {
      currentHook.value = value;

      currentHook.reducer = reducer || currentHook.reducer;

      currentHook.deps = deps;

      currentHook.effect = true;
    }
    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useCallback) {
    if (!deps || !isArrayEquals(currentHook.deps, deps)) {
      currentHook.value = value;

      currentHook.result = value;

      currentHook.deps = deps;
    }
    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useMemo) {
    if (!deps || !isArrayEquals(currentHook.deps, deps)) {
      currentHook.value = value;

      currentHook.result = (value as () => unknown).call(null);

      currentHook.deps = deps;
    }
    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useContext) {
    if (!currentHook._contextFiber || !(currentHook._contextFiber as MyReactFiberNode).isMounted || !Object.is(currentHook.value, value)) {
      currentHook.value = value;

      const ProviderFiber = renderDispatch.resolveContextFiber(currentHook._ownerFiber as MyReactFiberNode, currentHook.value);

      const context = renderDispatch.resolveContextValue(ProviderFiber, currentHook.value);

      currentHook._setContext(ProviderFiber);

      currentHook.result = context;

      currentHook.context = context;
    } else {
      const context = renderDispatch.resolveContextValue(currentHook._contextFiber as MyReactFiberNode, currentHook.value);

      currentHook.result = context;

      currentHook.context = context;
    }
    return currentHook;
  }

  if (currentHook.type === HOOK_TYPE.useReducer) {
    currentHook.value = value;

    currentHook.reducer = reducer;

    return currentHook;
  }

  return currentHook;
};
