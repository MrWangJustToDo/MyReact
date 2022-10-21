import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

const { currentRunningFiber } = __my_react_internal__;

export const layoutEffect = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  const layoutEffectMap = globalDispatch.layoutEffectMap;

  const allLayoutEffect = layoutEffectMap[fiber.uid] || [];

  layoutEffectMap[fiber.uid] = [];

  currentRunningFiber.current = fiber;

  allLayoutEffect.forEach((layoutEffect) => layoutEffect.call(null));

  currentRunningFiber.current = null;
};

export const effect = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  const effectMap = globalDispatch.effectMap;

  const allEffect = effectMap[fiber.uid] || [];

  effectMap[fiber.uid] = [];

  currentRunningFiber.current = fiber;

  allEffect.forEach((effect) => effect.call(null));

  currentRunningFiber.current = null;
};
