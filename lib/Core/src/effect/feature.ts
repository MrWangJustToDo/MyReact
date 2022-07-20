import { HOOK_TYPE } from '../hook';
import {
  isServerRender,
  pendingEffectArray,
  pendingLayoutEffectArray,
} from '../share';

import { prepareEffectArray } from './tool';

import type { MyReactFiberNode } from '../fiber';
import type { MyReactHookNode } from '../hook';

export const pushLayoutEffect = (
  fiber: MyReactFiberNode,
  effect: MyReactHookNode | (() => void)
) => {
  if (isServerRender.current) return;
  prepareEffectArray(pendingLayoutEffectArray.current, fiber.fiberIndex).push(
    effect
  );
};

// TODO move to dispatch
export const pushEffect = (
  fiber: MyReactFiberNode,
  effect: MyReactHookNode
) => {
  if (isServerRender.current) return;
  prepareEffectArray(pendingEffectArray.current, fiber.fiberIndex).push(effect);
};

export const runLayoutEffect = () => {
  const allLayoutEffect = pendingLayoutEffectArray.current.slice(0);
  for (let i = allLayoutEffect.length - 1; i >= 0; i--) {
    const effectArray = allLayoutEffect[i];
    if (Array.isArray(effectArray)) {
      effectArray.forEach((effect) => {
        if (typeof effect === 'function') {
          effect.call(null);
        } else {
          effect.effect = false;
          effect.__pendingEffect__ = false;
          if (effect.hookType === HOOK_TYPE.useLayoutEffect) {
            effect.cancel && effect.cancel();
            effect.cancel = effect.value();
          } else {
            if (effect.value && typeof effect.value === 'object') {
              effect.value.current = effect.reducer?.call(null);
            }
          }
        }
      });
    }
  }
  pendingLayoutEffectArray.current = [];
};

export const runEffect = () => {
  const allEffectArray = pendingEffectArray.current.slice(0);
  if (allEffectArray.length) {
    Promise.resolve().then(() => {
      for (let i = allEffectArray.length - 1; i >= 0; i--) {
        const effectArray = allEffectArray[i];
        if (Array.isArray(effectArray)) {
          effectArray.forEach((effect) => {
            effect.effect = false;
            effect.__pendingEffect__ = false;
            effect.cancel && effect.cancel();
            if (effect.__fiber__?.mount) effect.cancel = effect.value();
          });
        }
      }
    });
  }
  pendingEffectArray.current = [];
};
