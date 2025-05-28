import { ListTree, PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { safeCallWithCurrentFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultGenerateEffectMap = (
  fiber: MyReactFiberNode,
  effect: () => void,
  map: WeakMap<MyReactFiberNode, ListTree<() => void>>,
  option?: { stickyToHead?: boolean; stickyToFoot?: boolean }
) => {
  const list = map.get(fiber) || new ListTree();

  if (option) {
    if (option.stickyToHead) {
      list.pushToHead(effect);
    } else if (option.stickyToFoot) {
      list.pushToLast(effect);
    } else {
      list.push(effect);
    }
  } else {
    list.push(effect);
  }

  map.set(fiber, list);
};

export const defaultInvokeEffect = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.patch, PATCH_TYPE.__effect__)) {
    const effectMap = renderDispatch.runtimeMap.effectMap;

    const allEffect = effectMap.get(fiber);

    effectMap.delete(fiber);

    if (allEffect && allEffect.length) {
      allEffect.listToFoot(function invokeEffect(effect) {
        safeCallWithCurrentFiber({
          fiber,
          action: function safeCallEffect() {
            effect.call(null);
          },
        });
      });
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__effect__);
  }
};

export const defaultInvokeLayoutEffect = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.patch, PATCH_TYPE.__layoutEffect__)) {
    const layoutEffectMap = renderDispatch.runtimeMap.layoutEffectMap;

    const allLayoutEffect = layoutEffectMap.get(fiber);

    layoutEffectMap.delete(fiber);

    if (allLayoutEffect && allLayoutEffect.length) {
      allLayoutEffect.listToFoot(function invokeLayoutEffect(effect) {
        safeCallWithCurrentFiber({
          fiber,
          action: function safeCallLayoutEffect() {
            effect.call(null);
          },
        });
      });
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__layoutEffect__);
  }
};

export const defaultInvokeInsertionEffect = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.patch, PATCH_TYPE.__insertionEffect__)) {
    const insertionEffectMap = renderDispatch.runtimeMap.insertionEffectMap;

    const allInsertionEffect = insertionEffectMap.get(fiber);

    insertionEffectMap.delete(fiber);

    if (allInsertionEffect && allInsertionEffect.length) {
      allInsertionEffect.listToFoot(function invokeInsertionEffect(effect) {
        safeCallWithCurrentFiber({
          fiber,
          action: function safeCallInsertionEffect() {
            effect.call(null);
          },
        });
      });
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__insertionEffect__);
  }
};

export const defaultDeleteCurrentEffect = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.patch, PATCH_TYPE.__insertionEffect__)) {
    const insertionEffectMap = renderDispatch.runtimeMap.insertionEffectMap;

    insertionEffectMap.delete(fiber);

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__insertionEffect__);
  }

  if (include(fiber.patch, PATCH_TYPE.__layoutEffect__)) {
    const layoutEffectMap = renderDispatch.runtimeMap.layoutEffectMap;

    layoutEffectMap.delete(fiber);

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__layoutEffect__);
  }

  if (include(fiber.patch, PATCH_TYPE.__effect__)) {
    const effectMap = renderDispatch.runtimeMap.effectMap;

    effectMap.delete(fiber);

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__effect__);
  }
};

export const defaultDeleteChildEffect = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  let child = fiber.child;

  while (child) {
    defaultDeleteCurrentEffect(renderDispatch, child);

    defaultDeleteChildEffect(renderDispatch, child);

    child = child.sibling;
  }
};

export const effect = defaultInvokeEffect;

export const layoutEffect = defaultInvokeLayoutEffect;

export const insertionEffect = defaultInvokeInsertionEffect;
