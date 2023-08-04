import { ListTree, PATCH_TYPE } from "@my-react/react-shared";

import { safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultGenerateEffectMap = (fiber: MyReactFiberNode, effect: () => void, map: WeakMap<MyReactFiberNode, ListTree<() => void>>) => {
  const list = map.get(fiber) || new ListTree();

  list.push(effect);

  map.set(fiber, list);
};

export const effect = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.patch & PATCH_TYPE.__effect__) {
    const effectMap = renderDispatch.runtimeMap.effectMap;

    const allEffect = effectMap.get(fiber);

    effectMap.delete(fiber);

    if (allEffect && allEffect.length) {
      allEffect.listToFoot((effect) => safeCallWithFiber({ fiber, action: () => effect.call(null) }));
    }

    if (fiber.patch & PATCH_TYPE.__effect__) fiber.patch ^= PATCH_TYPE.__effect__;
  }
};

export const layoutEffect = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.patch & PATCH_TYPE.__layoutEffect__) {
    const layoutEffectMap = renderDispatch.runtimeMap.layoutEffectMap;

    const allLayoutEffect = layoutEffectMap.get(fiber);

    layoutEffectMap.delete(fiber);

    if (allLayoutEffect && allLayoutEffect.length) {
      allLayoutEffect.listToFoot((effect) => safeCallWithFiber({ fiber, action: () => effect.call(null) }));
    }

    if (fiber.patch & PATCH_TYPE.__layoutEffect__) fiber.patch ^= PATCH_TYPE.__layoutEffect__;
  }
};

export const insertionEffect = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.patch & PATCH_TYPE.__insertionEffect__) {
    const insertionEffectMap = renderDispatch.runtimeMap.insertionEffectMap;

    const allInsertionEffect = insertionEffectMap.get(fiber);

    insertionEffectMap.delete(fiber);

    if (allInsertionEffect && allInsertionEffect.length) {
      allInsertionEffect.listToFoot((effect) => safeCallWithFiber({ fiber, action: () => effect.call(null) }));
    }

    if (fiber.patch & PATCH_TYPE.__insertionEffect__) fiber.patch ^= PATCH_TYPE.__insertionEffect__;
  }
};

export const deleteEffect = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.patch & PATCH_TYPE.__insertionEffect__) {
    const insertionEffectMap = renderDispatch.runtimeMap.insertionEffectMap;

    insertionEffectMap.delete(fiber);

    if (fiber.patch & PATCH_TYPE.__insertionEffect__) fiber.patch ^= PATCH_TYPE.__insertionEffect__;
  }

  if (fiber.patch & PATCH_TYPE.__layoutEffect__) {
    const layoutEffectMap = renderDispatch.runtimeMap.layoutEffectMap;

    layoutEffectMap.delete(fiber);

    if (fiber.patch & PATCH_TYPE.__layoutEffect__) fiber.patch ^= PATCH_TYPE.__layoutEffect__;
  }

  if (fiber.patch & PATCH_TYPE.__effect__) {
    const effectMap = renderDispatch.runtimeMap.effectMap;

    effectMap.delete(fiber);

    if (fiber.patch & PATCH_TYPE.__effect__) fiber.patch ^= PATCH_TYPE.__effect__;
  }
};
