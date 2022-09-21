import { Effect_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode, MyReactHookNode } from "@my-react/react";

export const effect = (fiber: MyReactFiberNode, hookNode: MyReactHookNode) => {
  const globalDispatch = fiber.root.dispatch;

  if (hookNode.effect && hookNode.mode === Effect_TYPE.__initial__) {
    hookNode.mode = Effect_TYPE.__pendingEffect__;

    const strictMod = __DEV__ ? globalDispatch.resolveStrictValue(fiber) : false;

    if (hookNode.hookType === "useEffect") {
      const update = () => {
        hookNode.cancel && hookNode.cancel();

        if (hookNode._ownerFiber?.mount) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      };
      globalDispatch.pendingEffect(fiber, () => {
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
      globalDispatch.pendingLayoutEffect(fiber, () => {
        if (__DEV__ && strictMod) {
          update();
          update();
        } else {
          update();
        }
      });
    }

    if (hookNode.hookType === "useImperativeHandle") {
      globalDispatch.pendingLayoutEffect(fiber, () => {
        if (hookNode.value && typeof hookNode.value === "object") hookNode.value.current = hookNode.reducer.call(null);

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }
  }
};
