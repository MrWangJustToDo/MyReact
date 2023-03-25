import { HOOK_TYPE } from "@my-react/react-shared";

import { createHookNode, effectHookNode, updateHookNode } from "../runtimeHook";

import type { CreateHookParams, MyReactFiberNode, MyReactHookNode } from "@my-react/react";

const resolveHookValue = (hookNode: MyReactHookNode) => {
  if (hookNode) {
    switch (hookNode.type) {
      case HOOK_TYPE.useState:
      case HOOK_TYPE.useReducer:
        return [hookNode.result, hookNode._dispatch];
      case HOOK_TYPE.useRef:
      case HOOK_TYPE.useMemo:
      case HOOK_TYPE.useContext:
      case HOOK_TYPE.useCallback:
        return hookNode.result;
      case HOOK_TYPE.useSignal:
        return [hookNode.result.getValue, hookNode.result.setValue];
    }
  }
};

export const processHookNode = (fiber: MyReactFiberNode | null, { type, reducer, value, deps }: CreateHookParams) => {
  if (!fiber) throw new Error("can not use hook outside of component");

  let currentHook: MyReactHookNode | null = null;

  // initial
  if (!fiber.isInvoked) {
    currentHook = createHookNode({ type, reducer, value, deps }, fiber);
  } else {
    // update
    currentHook = updateHookNode({ type, reducer, value, deps }, fiber);
  }

  effectHookNode(fiber, currentHook);

  return resolveHookValue(currentHook);
};
