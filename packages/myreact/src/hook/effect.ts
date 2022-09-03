import { globalDispatch } from "../share";

import type { MyReactFiberNode } from "../fiber";
import type { MyReactHookNode } from "./instance";

export const effect = (fiber: MyReactFiberNode, hookNode: MyReactHookNode) => {
  if (hookNode.effect && !hookNode.__pendingEffect__) {
    hookNode.__pendingEffect__ = true;

    if (hookNode.hookType === "useEffect") {
      globalDispatch.current.pendingEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        if (hookNode.__fiber__?.mount) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.__pendingEffect__ = false;
      });
    }

    if (hookNode.hookType === "useLayoutEffect") {
      globalDispatch.current.pendingLayoutEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        if (hookNode.__fiber__?.mount) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.__pendingEffect__ = false;
      });
    }

    if (hookNode.hookType === "useImperativeHandle") {
      globalDispatch.current.pendingLayoutEffect(fiber, () => {
        if (hookNode.value && typeof hookNode.value === "object") hookNode.value.current = hookNode.reducer.call(null);

        hookNode.effect = false;

        hookNode.__pendingEffect__ = false;
      });
    }
  }
};
