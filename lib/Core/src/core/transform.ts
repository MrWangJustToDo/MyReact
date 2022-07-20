import { cRoundTransformFiberArray, nRoundTransformFiberArray } from '../share';

import { nextWorkSync } from './donext';

import type { MyReactFiberNode } from '../fiber';

export const transformStart = (fiber: MyReactFiberNode) => {
  cRoundTransformFiberArray.current.push(...nextWorkSync(fiber));
};

export const transformCurrent = () => {
  while (cRoundTransformFiberArray.current.length) {
    const fiber = cRoundTransformFiberArray.current.shift();
    if (fiber) {
      nRoundTransformFiberArray.current.push(...nextWorkSync(fiber));
    }
  }
};

export const transformNext = () => {
  while (nRoundTransformFiberArray.current.length) {
    const fiber = nRoundTransformFiberArray.current.shift();
    if (fiber) {
      cRoundTransformFiberArray.current.push(...nextWorkSync(fiber));
    }
  }
};

export const transformAll = () => {
  transformCurrent();
  transformNext();
  if (cRoundTransformFiberArray.current.length) {
    transformAll();
  }
};
