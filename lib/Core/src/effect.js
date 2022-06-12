import { MyReactFiberNode } from "./fiber/index.js";
import {
  isServerRender,
  pendingLayoutEffectArray,
  pendingEffectArray,
} from "./env.js";

const prepareEffectArray = (effectArray, index) => {
  effectArray[index] = effectArray[index] || [];
  return effectArray[index];
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {any} effect
 */
const pushLayoutEffect = (fiber, effect) => {
  if (isServerRender.current) return;
  prepareEffectArray(pendingLayoutEffectArray.current, fiber.deepIndex).push(
    effect
  );
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {any} effect
 */
const pushEffect = (fiber, effect) => {
  if (isServerRender.current) return;
  prepareEffectArray(pendingEffectArray.current, fiber.deepIndex).push(effect);
};

const runLayoutEffect = () => {
  const allLayoutEffectArray = pendingLayoutEffectArray.current.slice(0);
  for (let i = allLayoutEffectArray.length - 1; i >= 0; i--) {
    const effectArray = allLayoutEffectArray[i];
    if (Array.isArray(effectArray) && effectArray.length) {
      effectArray.forEach((effect) => {
        if (typeof effect === "function") {
          effect();
        } else {
          effect.effect = false;
          effect.__pendingEffect__ = false;
          effect.cancel && effect.cancel();
          effect.cancel = effect.value();
        }
      });
    }
  }
  pendingLayoutEffectArray.current = [];
};

const runEffect = () => {
  const allEffectArray = pendingEffectArray.current.slice(0);
  if (allEffectArray.length) {
    setTimeout(() => {
      for (let i = allEffectArray.length - 1; i >= 0; i--) {
        const effectArray = allEffectArray[i];
        if (Array.isArray(effectArray)) {
          effectArray.forEach((effect) => {
            effect.effect = false;
            effect.__pendingEffect__ = false;
            effect.cancel && effect.cancel();
            if (effect.__fiber__.mount) effect.cancel = effect.value();
          });
        }
      }
    });
  }
  pendingEffectArray.current = [];
};

export { pushEffect, pushLayoutEffect, runEffect, runLayoutEffect };
