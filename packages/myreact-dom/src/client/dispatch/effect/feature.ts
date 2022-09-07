import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

const { globalDispatch } = __my_react_internal__;

export const layoutEffect = (fiber: MyReactFiberNode) => {
  const layoutEffectMap = globalDispatch.current.layoutEffectMap;

  const allLayoutEffect = layoutEffectMap[fiber.uid] || [];

  layoutEffectMap[fiber.uid] = [];

  allLayoutEffect.forEach((layoutEffect) => layoutEffect.call(null));
};

export const effect = (fiber: MyReactFiberNode) => {
  const effectMap = globalDispatch.current.effectMap;

  const allEffect = effectMap[fiber.uid] || [];

  effectMap[fiber.uid] = [];

  allEffect.forEach((effect) => effect.call(null));
};
