import { __my_react_internal__ } from "@my-react/react";
import { PATCH_TYPE } from "@my-react/react-shared";

import type { RenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode} from "@my-react/react";

const { currentRunningFiber } = __my_react_internal__;

export const defaultGenerateEffectMap = (fiber: MyReactFiberNode, effect: () => void, map: WeakMap<MyReactFiberNode, Array<() => void>>) => {
  const exist = map.get(fiber) || [];

  exist.push(effect);

  map.set(fiber, exist);
};

export const layoutEffect = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingLayoutEffect__) {
    const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

    const layoutEffectMap = renderDispatch.layoutEffectMap;

    const allLayoutEffect = layoutEffectMap.get(fiber) || [];

    layoutEffectMap.delete(fiber);

    if (allLayoutEffect.length) {
      currentRunningFiber.current = fiber;

      allLayoutEffect.forEach((layoutEffect) => layoutEffect.call(null));

      currentRunningFiber.current = null;
    }

    if (fiber.patch & PATCH_TYPE.__pendingLayoutEffect__) fiber.patch ^= PATCH_TYPE.__pendingLayoutEffect__;
  }
};

export const effect = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingEffect__) {
    const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

    const effectMap = renderDispatch.effectMap;

    const allEffect = effectMap.get(fiber) || [];

    effectMap.delete(fiber);

    if (allEffect.length) {
      currentRunningFiber.current = fiber;

      allEffect.forEach((effect) => effect.call(null));

      currentRunningFiber.current = null;
    }

    if (fiber.patch & PATCH_TYPE.__pendingEffect__) fiber.patch ^= PATCH_TYPE.__pendingEffect__;
  }
};
