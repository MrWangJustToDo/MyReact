import { PATCH_TYPE } from "@my-react/react-shared";

import { safeCallWithFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultGenerateEffectMap = (fiber: MyReactFiberNode, effect: () => void, map: WeakMap<MyReactFiberNode, Array<() => void>>) => {
  const exist = map.get(fiber) || [];

  exist.push(effect);

  map.set(fiber, exist);
};

export const layoutEffect = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__layoutEffect__) {
    const renderContainer = fiber.container;

    const layoutEffectMap = renderContainer.renderDispatch.layoutEffectMap;

    const allLayoutEffect = layoutEffectMap.get(fiber) || [];

    layoutEffectMap.delete(fiber);

    if (allLayoutEffect.length) safeCallWithFiber({ fiber, action: () => allLayoutEffect.forEach((layoutEffect) => layoutEffect.call(null)) });

    if (fiber.patch & PATCH_TYPE.__layoutEffect__) fiber.patch ^= PATCH_TYPE.__layoutEffect__;
  }
};

export const effect = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__effect__) {
    const renderContainer = fiber.container;

    const effectMap = renderContainer.renderDispatch.effectMap;

    const allEffect = effectMap.get(fiber) || [];

    effectMap.delete(fiber);

    if (allEffect.length) safeCallWithFiber({ fiber, action: () => allEffect.forEach((effect) => effect.call(null)) });

    if (fiber.patch & PATCH_TYPE.__effect__) fiber.patch ^= PATCH_TYPE.__effect__;
  }
};
