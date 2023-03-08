import flattenDeep from "lodash/flattenDeep";

import type { MyReactFiberNode } from "@my-react/react";

export const flatten = (children: MyReactFiberNode | MyReactFiberNode[] | Array<MyReactFiberNode | MyReactFiberNode[]>): MyReactFiberNode[] => {
  if (Array.isArray(children)) return flattenDeep(children);

  return [children];
};
