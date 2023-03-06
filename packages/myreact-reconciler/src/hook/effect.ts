import { Effect_TYPE } from "@my-react/react-shared";

import type { RenderDispatch } from "../dispatch";
import type { MyReactFiberNode, MyReactHookNode } from "@my-react/react";

export const effect = (fiber: MyReactFiberNode, hookNode: MyReactHookNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  if (hookNode.effect && hookNode.mode === Effect_TYPE.__initial__) {
    hookNode.mode = Effect_TYPE.__pendingEffect__;

    const strictMod = __DEV__ ? renderDispatch.resolveStrict(fiber) : false;

    if (hookNode.hookType === "useEffect") {
      const update = () => {
        hookNode.cancel && hookNode.cancel();

        if (hookNode._ownerFiber?.isMounted) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      };
      renderDispatch.pendingEffect(fiber, () => {
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

        if (hookNode._ownerFiber?.isMounted) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      };
      renderDispatch.pendingLayoutEffect(fiber, () => {
        if (__DEV__ && strictMod) {
          update();
          update();
        } else {
          update();
        }
      });
    }

    if (hookNode.hookType === "useImperativeHandle") {
      renderDispatch.pendingLayoutEffect(fiber, () => {
        // ref obj
        if (hookNode.value && typeof hookNode.value === "object") hookNode.value.current = hookNode.reducer.call(null);
        // ref function
        if (hookNode.value && typeof hookNode.value === "function") hookNode.value(hookNode.reducer.call(null));

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }
  }
};
