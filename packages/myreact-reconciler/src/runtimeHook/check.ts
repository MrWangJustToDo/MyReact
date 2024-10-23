import { HOOK_TYPE } from "@my-react/react-shared";

import type { MyReactHookNode } from "./instance";

export const checkHookValid = (hookNode: MyReactHookNode) => {
  if (
    hookNode.type === HOOK_TYPE.useMemo ||
    hookNode.type === HOOK_TYPE.useEffect ||
    hookNode.type === HOOK_TYPE.useCallback ||
    hookNode.type === HOOK_TYPE.useLayoutEffect
  ) {
    if (typeof hookNode.value !== "function") {
      throw new Error(`[@my-react/react] ${HOOK_TYPE[hookNode.type]} initial error`);
    }
  }
  if (hookNode.type === HOOK_TYPE.useContext) {
    if (typeof hookNode.value !== "object" || hookNode.value === null) {
      throw new Error(`[@my-react/react] ${HOOK_TYPE[hookNode.type]} initial error`);
    }
  }

  if (hookNode.type === HOOK_TYPE.useSyncExternalStore) {
    const storeApi = hookNode.value;
    if (typeof storeApi.subscribe !== "function" || typeof storeApi.getSnapshot !== "function") {
      throw new Error(`[@my-react/react] ${HOOK_TYPE[hookNode.type]} initial error`);
    }
  }
};

export const isValidInternalHookName = (name: string) => {
  switch (name) {
    case HOOK_TYPE[HOOK_TYPE.useId]:
    case HOOK_TYPE[HOOK_TYPE.useRef]:
    case HOOK_TYPE[HOOK_TYPE.useMemo]:
    case HOOK_TYPE[HOOK_TYPE.useState]:
    case HOOK_TYPE[HOOK_TYPE.useSignal]:
    case HOOK_TYPE[HOOK_TYPE.useEffect]:
    case HOOK_TYPE[HOOK_TYPE.useContext]:
    case HOOK_TYPE[HOOK_TYPE.useReducer]:
    case HOOK_TYPE[HOOK_TYPE.useCallback]:
    case HOOK_TYPE[HOOK_TYPE.useTransition]:
    case HOOK_TYPE[HOOK_TYPE.useDebugValue]:
    case HOOK_TYPE[HOOK_TYPE.useLayoutEffect]:
    case HOOK_TYPE[HOOK_TYPE.useDeferredValue]:
    case HOOK_TYPE[HOOK_TYPE.useInsertionEffect]:
    case HOOK_TYPE[HOOK_TYPE.useImperativeHandle]:
    case HOOK_TYPE[HOOK_TYPE.useSyncExternalStore]:
      return true;
    default:
      return false;
  }
};

export const isValidHookName = (name?: string) => {
  return name?.startsWith("use");
}
