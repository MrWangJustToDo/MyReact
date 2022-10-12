import type { MyReactFiberNode } from "@my-react/react";

export const layoutEffect = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  const layoutEffectMap = globalDispatch.layoutEffectMap;

  const allLayoutEffect = layoutEffectMap[fiber.uid] || [];

  layoutEffectMap[fiber.uid] = [];

  allLayoutEffect.forEach((layoutEffect) => layoutEffect.call(null));
};

export const effect = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  const effectMap = globalDispatch.effectMap;

  const allEffect = effectMap[fiber.uid] || [];

  effectMap[fiber.uid] = [];

  allEffect.forEach((effect) => effect.call(null));
};
