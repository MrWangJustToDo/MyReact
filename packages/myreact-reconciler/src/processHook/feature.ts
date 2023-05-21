import { __my_react_internal__ } from "@my-react/react";
import { HOOK_TYPE, ListTree, STATE_TYPE } from "@my-react/react-shared";

import { createHookNode, effectHookNode, updateHookNode } from "../runtimeHook";
import { currentRenderDispatch } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";
import type { RenderHookParams } from "@my-react/react";

const { currentComponentFiber, currentHookNodeIndex } = __my_react_internal__;

const resolveHookValue = (hookNode: MyReactHookNode) => {
  if (hookNode) {
    switch (hookNode.type) {
      case HOOK_TYPE.useState:
      case HOOK_TYPE.useReducer:
        return [hookNode.result, hookNode._dispatch];
      case HOOK_TYPE.useId:
      case HOOK_TYPE.useRef:
      case HOOK_TYPE.useMemo:
      case HOOK_TYPE.useContext:
      case HOOK_TYPE.useCallback:
      case HOOK_TYPE.useDeferredValue:
      case HOOK_TYPE.useSyncExternalStore:
        return hookNode.result;
      case HOOK_TYPE.useSignal:
        return [hookNode.result.getValue, hookNode.result.setValue];
    }
  }
};

export const processHookNode = ({ type, reducer, value, deps }: RenderHookParams) => {
  const fiber = currentComponentFiber.current as MyReactFiberNode;

  const renderDispatch = currentRenderDispatch.current;

  if (!fiber) throw new Error("can not use hook outside of component");

  if (!renderDispatch) throw new Error(`internal error, can not get 'renderDispatch' for current render`);

  fiber.hookList = fiber.hookList || new ListTree();

  let currentHook: MyReactHookNode | null = null;

  // initial
  if (fiber.state === STATE_TYPE.__initial__) {
    currentHook = createHookNode({ type, reducer, value, deps }, fiber);
  } else {
    // update
    currentHook = updateHookNode({ type, reducer, value, deps }, fiber);
  }

  currentHookNodeIndex.current++;

  effectHookNode(fiber, currentHook);

  return resolveHookValue(currentHook);
};
