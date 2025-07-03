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

  if (hookNode.type === HOOK_TYPE.useOptimistic) {
    const value = hookNode.value;

    if (value.reducer && typeof value.reducer !== "function") {
      throw new Error(`[@my-react/react] ${HOOK_TYPE[hookNode.type]} initial error`);
    }
  }
};
