import type { MyReactFiberNode } from "@my-react/react";

export const flatten = (children: MyReactFiberNode | MyReactFiberNode[]): MyReactFiberNode[] => {
  if (Array.isArray(children)) {
    return children.reduce<MyReactFiberNode[]>((p, c) => p.concat(flatten(c)), []);
  }
  return [children];
};
