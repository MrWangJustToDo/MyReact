import { generateFiberToList } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { ListTree } from "@my-react/react-shared";

// TODO
export const defaultGenerateDeactivatedArrayMap = (
  fiber: MyReactFiberNode,
  deactivate: MyReactFiberNode[],
  map: WeakMap<MyReactFiberNode, Array<ListTree<MyReactFiberNode>>>
) => {
  const exist = map.get(fiber) || [];

  const pendingDeactivate = deactivate.map(generateFiberToList);

  exist.push(...pendingDeactivate);

  map.set(fiber, exist);
};
