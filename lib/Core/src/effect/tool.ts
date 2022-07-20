import type { MyReactHookNode } from '../hook';

export const prepareEffectArray = (
  effectArray: Array<MyReactHookNode | (() => void)>[],
  index: number
) => {
  effectArray[index] = effectArray[index] || [];

  return effectArray[index];
};
