import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode, MyReactHookNode } from "@my-react/react";

const { Effect_TYPE, globalDispatch } = __my_react_internal__;

export const effect = (fiber: MyReactFiberNode, hookNode: MyReactHookNode) => {
  if (hookNode.effect && hookNode.mode === Effect_TYPE.__initial__) {
    hookNode.mode = Effect_TYPE.__pendingEffect__;

    const strictMod = __DEV__ ? globalDispatch.current.resolveStrictValue(fiber) : false;

    if (hookNode.hookType === "useEffect") {
      const update = () => {
        hookNode.cancel && hookNode.cancel();

        if (hookNode._ownerFiber?.mount) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      };
      globalDispatch.current.pendingEffect(fiber, () => {
        if (__DEV__ && strictMod) {
          update();
          update();
        } else {
          update();
        }
      });
    }

    if (hookNode.hookType === "useLayoutEffect") {
      const update = () => {
        hookNode.cancel && hookNode.cancel();

        if (hookNode._ownerFiber?.mount) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      };
      globalDispatch.current.pendingLayoutEffect(fiber, () => {
        if (__DEV__ && strictMod) {
          update();
          update();
        } else {
          update();
        }
      });
    }

    if (hookNode.hookType === "useImperativeHandle") {
      globalDispatch.current.pendingLayoutEffect(fiber, () => {
        if (hookNode.value && typeof hookNode.value === "object") hookNode.value.current = hookNode.reducer.call(null);

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }
  }
};
