import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";
import type { RenderDispatch } from "@my-react/react-reconciler";

const { currentRunningFiber } = __my_react_internal__;

export const layoutEffect = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const layoutEffectMap = renderDispatch.layoutEffectMap;

  const allLayoutEffect = layoutEffectMap.get(fiber) || [];

  layoutEffectMap.set(fiber, []);

  currentRunningFiber.current = fiber;

  allLayoutEffect.forEach((layoutEffect) => layoutEffect.call(null));

  currentRunningFiber.current = null;
};

export const effect = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const effectMap = renderDispatch.effectMap;

  const allEffect = effectMap.get(fiber) || [];

  effectMap.set(fiber, []);

  currentRunningFiber.current = fiber;

  allEffect.forEach((effect) => effect.call(null));

  currentRunningFiber.current = null;
};
