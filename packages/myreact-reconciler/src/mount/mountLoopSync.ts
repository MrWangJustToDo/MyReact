import { nextWorkSync } from "../generate";
import { cRoundTransformFiberArray, nRoundTransformFiberArray } from "../share";

import type { MyReactFiberNode } from "@my-react/react";

const loopStart = (fiber: MyReactFiberNode) => {
  cRoundTransformFiberArray.current.push(...nextWorkSync(fiber));
};

const loopCurrent = () => {
  while (cRoundTransformFiberArray.current.length) {
    const fiber = cRoundTransformFiberArray.current.shift();
    if (fiber) {
      nRoundTransformFiberArray.current.push(...nextWorkSync(fiber));
    }
  }
};

const loopNext = () => {
  while (nRoundTransformFiberArray.current.length) {
    const fiber = nRoundTransformFiberArray.current.shift();
    if (fiber) {
      cRoundTransformFiberArray.current.push(...nextWorkSync(fiber));
    }
  }
};

const loopToEnd = () => {
  loopCurrent();
  loopNext();
  if (cRoundTransformFiberArray.current.length) {
    loopToEnd();
  }
};

const loopAll = (fiber: MyReactFiberNode) => {
  loopStart(fiber);
  loopToEnd();
};

export const mountLoopSync = (fiber: MyReactFiberNode) => loopAll(fiber);
