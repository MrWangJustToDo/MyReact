import { reactiveInstanceBeforeUnmount } from "../unmount";

import { generateFiberToList } from "./fiberToList";

import type { MyReactFiberNode } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

export const defaultGenerateDeactivatedArrayMap = (
  fiber: MyReactFiberNode,
  deactivate: MyReactFiberNode[],
  map: WeakMap<MyReactFiberNode, Array<ListTree<MyReactFiberNode>>>
) => {
  const exist = map.get(fiber) || [];

  const pendingDeactivate = deactivate.map(generateFiberToList);

  pendingDeactivate.forEach(reactiveInstanceBeforeUnmount);

  exist.push(...pendingDeactivate);

  map.set(fiber, exist);
};
