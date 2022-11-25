import { nextWorkSyncAwait } from "../generate";
import { cRoundTransformFiberArray, nRoundTransformFiberArray } from "../share";

import type { MyReactFiberNode } from "@my-react/react";

const loopStart = async (fiber: MyReactFiberNode) => {
  const children = await nextWorkSyncAwait(fiber);
  cRoundTransformFiberArray.current.push(...children);
};

const loopCurrent = async () => {
  while (cRoundTransformFiberArray.current.length) {
    const fiber = cRoundTransformFiberArray.current.shift();
    if (fiber) {
      const children = await nextWorkSyncAwait(fiber);
      nRoundTransformFiberArray.current.push(...children);
    }
  }
};

const loopNext = async () => {
  while (nRoundTransformFiberArray.current.length) {
    const fiber = nRoundTransformFiberArray.current.shift();
    if (fiber) {
      const children = await nextWorkSyncAwait(fiber);
      cRoundTransformFiberArray.current.push(...children);
    }
  }
};

const loopToEnd = async () => {
  await loopCurrent();
  await loopNext();
  if (cRoundTransformFiberArray.current.length) {
    await loopToEnd();
  }
};

const loopAll = async (fiber: MyReactFiberNode) => {
  await loopStart(fiber);
  await loopToEnd();
};

export const mountLoopSyncAwait = async (fiber: MyReactFiberNode) => await loopAll(fiber);
