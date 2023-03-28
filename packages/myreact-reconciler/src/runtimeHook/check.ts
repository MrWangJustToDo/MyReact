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
      throw new Error(`${hookNode.type} initial error`);
    }
  }
  if (hookNode.type === HOOK_TYPE.useContext) {
    if (typeof hookNode.value !== "object" || hookNode.value === null) {
      throw new Error(`${hookNode.type} initial error`);
    }
  }
};
