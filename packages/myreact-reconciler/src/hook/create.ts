import { __my_react_shared__ } from "@my-react/react";
import { HOOK_TYPE } from "@my-react/react-shared";

import type { CreateHookParams, MyReactFiberNode } from "@my-react/react";

const { createHookNode: _createHookNode } = __my_react_shared__;

export const createHookNode = (props: CreateHookParams, fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.root_dispatch;

  const hookNode = _createHookNode(props, fiber);
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

  return hookNode;
};
