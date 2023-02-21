import { reactiveInstanceBeforeUnmount } from "../unmount";

import { generateFiberToList } from "./fiberToList";

import type { MyReactFiberNode } from "@my-react/react";
import type { LinkTreeList} from "@my-react/react-shared";

export const defaultGenerateDeactivatedArrayMap = (fiber: MyReactFiberNode, map: Record<string, Array<LinkTreeList<MyReactFiberNode>>>) => {
  const globalDispatch = fiber.root.globalDispatch;

  const allDeactivateFibers = globalDispatch.keepLiveMap[fiber.uid] || [];

  const pendingDeactivate = allDeactivateFibers.map(generateFiberToList);

  pendingDeactivate.forEach(reactiveInstanceBeforeUnmount);

  map[fiber.uid] = pendingDeactivate;
}