import { __my_react_internal__ } from "@my-react/react";
import { HOOK_TYPE } from "@my-react/react-shared";

import { MyReactSignal } from "../share";

import type { CreateHookParams, MyReactFiberNode, MyReactFiberNodeDev, Action, Reducer } from "@my-react/react";

const { MyReactHookNode } = __my_react_internal__;

const defaultReducer: Reducer = (state?: unknown, action?: Action) => {
  return typeof action === "function" ? action(state) : action;
};

export const createHookNode = (props: CreateHookParams, fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  const hookNode = new MyReactHookNode(props.hookIndex, props.hookType, props.value, props.reducer || defaultReducer, props.deps);

  hookNode.setOwner(fiber);

  fiber.addHook(hookNode);

  if (hookNode.hookType === HOOK_TYPE.useMemo || hookNode.hookType === HOOK_TYPE.useState || hookNode.hookType === HOOK_TYPE.useReducer) {
    hookNode.result = hookNode.value.call(null);
    return hookNode;
  }

  if (hookNode.hookType === HOOK_TYPE.useEffect || hookNode.hookType === HOOK_TYPE.useLayoutEffect || hookNode.hookType === HOOK_TYPE.useImperativeHandle) {
    hookNode.effect = true;
    return hookNode;
  }

  if (hookNode.hookType === HOOK_TYPE.useRef || hookNode.hookType === HOOK_TYPE.useCallback) {
    hookNode.result = hookNode.value;
    return hookNode;
  }

  if (hookNode.hookType === HOOK_TYPE.useContext) {
    const ProviderFiber = globalDispatch.resolveContextFiber(hookNode._ownerFiber as MyReactFiberNode, hookNode.value);

    const context = globalDispatch.resolveContextValue(ProviderFiber, hookNode.value);

    hookNode.setContext(ProviderFiber);

    hookNode.result = context;

    hookNode.context = context;

    return hookNode;
  }

  if (hookNode.hookType === HOOK_TYPE.useSignal) {
    hookNode.result = new MyReactSignal(hookNode.value.call(null));

    return hookNode;
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugHookTypes = typedFiber._debugHookTypes || [];

    typedFiber._debugHookTypes.push(hookNode.hookType);
  }

  return hookNode;
};
