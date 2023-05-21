import { PATCH_TYPE } from "@my-react/react-shared";

import { safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultGenerateEffectMap = (fiber: MyReactFiberNode, effect: () => void, map: WeakMap<MyReactFiberNode, Array<() => void>>) => {
  const exist = map.get(fiber) || [];

  exist.push(effect);

  map.set(fiber, exist);
};

export const effect = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.patch & PATCH_TYPE.__effect__) {
    const effectMap = renderDispatch.runtimeMap.effectMap;

    const allEffect = effectMap.get(fiber) || [];

    effectMap.delete(fiber);

    if (allEffect.length) safeCallWithFiber({ fiber, action: () => allEffect.forEach((effect) => effect.call(null)) });

    if (fiber.patch & PATCH_TYPE.__effect__) fiber.patch ^= PATCH_TYPE.__effect__;
  }
};

export const layoutEffect = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.patch & PATCH_TYPE.__layoutEffect__) {
    const layoutEffectMap = renderDispatch.runtimeMap.layoutEffectMap;

    const allLayoutEffect = layoutEffectMap.get(fiber) || [];

    layoutEffectMap.delete(fiber);

    if (allLayoutEffect.length) safeCallWithFiber({ fiber, action: () => allLayoutEffect.forEach((layoutEffect) => layoutEffect.call(null)) });

    if (fiber.patch & PATCH_TYPE.__layoutEffect__) fiber.patch ^= PATCH_TYPE.__layoutEffect__;
  }
};

export const insertionEffect = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.patch & PATCH_TYPE.__insertionEffect__) {
    const insertionEffectMap = renderDispatch.runtimeMap.insertionEffectMap;

    const allInsertionEffect = insertionEffectMap.get(fiber) || [];

    insertionEffectMap.delete(fiber);

    if (allInsertionEffect.length) safeCallWithFiber({ fiber, action: () => allInsertionEffect.forEach((insertionEffect) => insertionEffect.call(null)) });

    if (fiber.patch & PATCH_TYPE.__insertionEffect__) fiber.patch ^= PATCH_TYPE.__insertionEffect__;
  }
};
