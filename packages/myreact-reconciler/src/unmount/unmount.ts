import { generateFiberToList } from "../share";

import { flatten } from "./tools";

import type { MyReactFiberNode } from "@my-react/react";
import type { LinkTreeList } from "@my-react/react-shared";

export const defaultGenerateUnmountListMap = (
  fiber: MyReactFiberNode,
  unmount: MyReactFiberNode | MyReactFiberNode[] | Array<MyReactFiberNode | MyReactFiberNode[]>,
  map: Record<string, Array<LinkTreeList<MyReactFiberNode>>>
) => {
  const allUnmount = flatten(unmount);

  const fiberList = allUnmount.map((f) => generateFiberToList(f));

  const exist = map[fiber.uid] || [];

  map[fiber.uid] = [...exist, ...fiberList];
};
