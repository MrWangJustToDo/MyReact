import { __my_react_internal__ } from "@my-react/react/type";
import { ListTree, PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { safeCallWithCurrentFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { UniqueArray } from "@my-react/react-shared";

const { currentScheduler } = __my_react_internal__;

export function defaultGenerateEffectMap(
  fiber: MyReactFiberNode,
  effect: () => void,
  map: WeakMap<MyReactFiberNode, ListTree<() => void>>,
  option?: { stickyToHead?: boolean; stickyToFoot?: boolean }
) {
  let list = map.get(fiber);

  if (!list) {
    list = new ListTree<() => void>();

    map.set(fiber, list);
  }

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
}

export function defaultInvokeEffect(renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) {
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
}

export function defaultInvokeLayoutEffect(renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) {
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
}

export function defaultInvokeInsertionEffect(renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) {
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
}

export function defaultDeleteCurrentEffect(renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) {
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
}

export function defaultDeleteChildEffect(renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) {
  let child = fiber.child;

  while (child) {
    defaultDeleteCurrentEffect(renderDispatch, child);

    defaultDeleteChildEffect(renderDispatch, child);

    child = child.sibling;
  }
}

export function addEffectCallback(renderDispatch: CustomRenderDispatch, cb: () => void) {
  renderDispatch.pendingEffectCallbackList.push(cb);
}

function flushDispatchEffectCallback(renderDispatch: CustomRenderDispatch) {
  const list = renderDispatch.pendingEffectCallbackList;

  if (!list.length) return;

  try {
    list.listToFoot((cb) => {
      cb();
    });
  } finally {
    list.clear();
  }
}

/**
 * Flush deferred passive-effect tasks for one dispatch, or all registered dispatches when omitted
 * (compat `flushPassiveEffects`).
 */
export function flushEffectCallback(renderDispatch?: CustomRenderDispatch) {
  if (renderDispatch) {
    flushDispatchEffectCallback(renderDispatch);
    return;
  }

  const renderScheduler = currentScheduler.current;
  const allDispatch = renderScheduler?.dispatchSet as UniqueArray<CustomRenderDispatch> | undefined;

  allDispatch?.getAll?.().forEach(flushDispatchEffectCallback);
}

export const effect = defaultInvokeEffect;

export const layoutEffect = defaultInvokeLayoutEffect;

export const insertionEffect = defaultInvokeInsertionEffect;
