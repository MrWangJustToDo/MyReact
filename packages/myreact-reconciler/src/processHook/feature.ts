import { __my_react_internal__ } from "@my-react/react";
import { HOOK_TYPE, ListTree, STATE_TYPE, include } from "@my-react/react-shared";

import { listenerMap } from "../renderDispatch";
import { getInstanceFieldByInstance } from "../runtimeGenerate";
import { createHookNode, effectHookNode, updateHookNode } from "../runtimeHook";
import { currentRenderDispatch, safeCall } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { InstanceField } from "../runtimeGenerate";
import type { HookInstanceField, MyReactHookNode } from "../runtimeHook";
import type { RenderHookParams } from "@my-react/react";

const { currentComponentFiber, currentHookNodeIndex } = __my_react_internal__;

const resolveHookValue = (hookNode: MyReactHookNode, field: InstanceField) => {
  if (hookNode) {
    switch (hookNode.type) {
      case HOOK_TYPE.useState:
      case HOOK_TYPE.useReducer:
        return [hookNode.result, (field as HookInstanceField).dispatch];
      case HOOK_TYPE.useId:
      case HOOK_TYPE.useRef:
      case HOOK_TYPE.useMemo:
      case HOOK_TYPE.useContext:
      case HOOK_TYPE.useCallback:
      case HOOK_TYPE.useTransition:
      case HOOK_TYPE.useDeferredValue:
      case HOOK_TYPE.useSyncExternalStore:
        return hookNode.result;
      case HOOK_TYPE.useSignal:
        return [hookNode.result.getValue, hookNode.result.setValue];
    }
  }
};

export const processHook = ({ type, reducer, value, deps }: RenderHookParams) => {
  const fiber = currentComponentFiber.current as MyReactFiberNode;

  const renderDispatch = currentRenderDispatch.current;

  if (!fiber) throw new Error("[@my-react/react] can not use hook outside of component");

  if (!renderDispatch) throw new Error(`[@my-react/react] internal error, can not get 'renderDispatch' for current render`);

  fiber.hookList = fiber.hookList || new ListTree();

  let currentHook: MyReactHookNode | null = null;

  // initial
  if (include(fiber.state, STATE_TYPE.__create__)) {
    currentHook = createHookNode({ type, reducer, value, deps }, fiber);

    safeCall(function safeCallHookInitialListener() {
      listenerMap.get(renderDispatch)?.hookInitial?.forEach((cb) => cb(currentHook, fiber));
    });
  } else {
    // update
    currentHook = updateHookNode({ type, reducer, value, deps }, fiber, __DEV__ && Boolean(include(fiber.state, STATE_TYPE.__hmr__)));

    safeCall(function safeCallHookUpdateListener() {
      listenerMap.get(renderDispatch)?.hookUpdate?.forEach((cb) => cb(currentHook, fiber));
    });
  }

  currentHookNodeIndex.current++;

  const field = getInstanceFieldByInstance(currentHook);

  effectHookNode(fiber, currentHook, field);

  return resolveHookValue(currentHook, field);
};
