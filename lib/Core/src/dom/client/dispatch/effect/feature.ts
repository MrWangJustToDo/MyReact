import { safeCallWithFiber } from '../../../../share';

import type { MyReactFiberNode } from '../../../../fiber';

export const layoutEffect = (fiber: MyReactFiberNode) => {
  const allLayoutEffect = fiber.layoutEffectQueue.slice(0);

  allLayoutEffect.forEach((layoutEffect) => layoutEffect.call(null));

  fiber.layoutEffectQueue = [];
};

export const effect = (fiber: MyReactFiberNode) => {
  const allEffect = fiber.effectQueue.slice(0);

  Promise.resolve().then(() => {
    safeCallWithFiber({
      fiber,
      action: () => allEffect.forEach((effect) => effect.call(null)),
    });
  });

  fiber.effectQueue = [];
};
