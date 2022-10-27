import { flatten } from "./tools";

import type { MyReactFiberNode } from "@my-react/react";

export const defaultGenerateUnmountArrayMap = (
  fiber: MyReactFiberNode,
  unmount: MyReactFiberNode | MyReactFiberNode[] | Array<MyReactFiberNode | MyReactFiberNode[]>,
  map: Record<string, Array<MyReactFiberNode>>
) => {
  const allUnmount = flatten(unmount);

  const exist = map[fiber.uid] || [];

  map[fiber.uid] = [...exist, ...allUnmount];
};
