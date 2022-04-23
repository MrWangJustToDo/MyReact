import { pendingEffectArray, pendingLayoutEffectArray } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";

function prepareEffectArray(effectArray, index) {
  effectArray[index] = effectArray[index] || [];
  return effectArray[index];
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {Function} effect
 */
function pushLayoutEffect(fiber, effect) {
  prepareEffectArray(pendingLayoutEffectArray.current, fiber.deepIndex).push(
    effect
  );
}

function runLayoutEffect() {
  const allLayoutEffectArray = pendingLayoutEffectArray.current.slice(0);
  for (let i = allLayoutEffectArray.length - 1; i >= 0; i--) {
    const effectArray = allLayoutEffectArray[i];
    if (Array.isArray(effectArray) && effectArray.length) {
      effectArray.forEach((effect) => {
        if (typeof effect === "function") {
          effect();
        } else {
          effect.__pendingEffect__ = false;
          effect.effect = false;
          effect.cancel && effect.cancel();
          effect.cancel = effect.value();
        }
      });
    }
  }
  pendingLayoutEffectArray.current = [];
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {Function} effect
 */
function pushEffect(fiber, effect) {
  prepareEffectArray(pendingEffectArray.current, fiber.deepIndex).push(effect);
}

function runEffect() {
  const allEffectArray = pendingEffectArray.current.slice(0);
  if (allEffectArray.length) {
    setTimeout(() => {
      for (let i = allEffectArray.length - 1; i >= 0; i--) {
        const effectArray = allEffectArray[i];
        if (Array.isArray(effectArray)) {
          effectArray.forEach((effect) => {
            effect.__pendingEffect__ = false;
            effect.effect = false;
            effect.cancel && effect.cancel();
            effect.cancel = effect.value();
          });
        }
      }
    });
  }
  pendingEffectArray.current = [];
}

export { pushEffect, pushLayoutEffect, runEffect, runLayoutEffect };
