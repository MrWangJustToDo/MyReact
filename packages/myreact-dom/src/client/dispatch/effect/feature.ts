import type { MyReactFiberNode } from "@my-react/react";

export const layoutEffect = (fiber: MyReactFiberNode) => {
  const allLayoutEffect = fiber.__layoutEffectQueue__.slice(0);

  allLayoutEffect.forEach((layoutEffect) => layoutEffect.call(null));

  fiber.__layoutEffectQueue__ = [];
};

export const effect = (fiber: MyReactFiberNode) => {
  const allEffect = fiber.__effectQueue__.slice(0);

  allEffect.forEach((effect) => effect.call(null));

  fiber.__effectQueue__ = [];
};
