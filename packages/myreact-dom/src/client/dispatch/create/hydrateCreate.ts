import { getHydrateDom } from "./getHydrateDom";

import type { MyReactFiberNode } from "@my-react/react";

export const hydrateCreate = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode): boolean => {
  if (fiber.__isTextNode__ || fiber.__isPlainNode__) {
    const { result } = getHydrateDom(fiber, parentFiberWithDom.dom as Element);
    return result;
  }
  throw new Error("hydrate error, portal element can not hydrate");
};
