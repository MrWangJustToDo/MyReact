import { __my_react_reactive__ } from "@my-react/react";
import { NODE_TYPE } from "@my-react/react-shared";

import { generateFiberToList } from "../share";

import { flatten } from "./tools";

import type { MyReactFiberNode, MyReactReactiveInstance} from "@my-react/react";
import type { LinkTreeList } from "@my-react/react-shared";

const {
  reactiveApi: { pauseTracking, pauseTrigger, resetTracking, resetTrigger },
} = __my_react_reactive__;

export const reactiveInstanceBeforeUnmount = (list: LinkTreeList<MyReactFiberNode>) => {
  pauseTracking();
  pauseTrigger();
  list.listToHead((f) => {
    if (f.type & NODE_TYPE.__isReactive__) {
      const reactiveInstance = f.instance as MyReactReactiveInstance;

      reactiveInstance.beforeUnmountHooks.forEach((f) => f?.());

    }
  });
  resetTrigger();
  resetTracking();
};

export const defaultGenerateUnmountArrayMap = (
  fiber: MyReactFiberNode,
  unmount: MyReactFiberNode | MyReactFiberNode[] | Array<MyReactFiberNode | MyReactFiberNode[]>,
  map: Record<string, Array<LinkTreeList<MyReactFiberNode>>>
) => {
  const allUnmount = flatten(unmount);

  const exist = map[fiber.uid] || [];

  const newPending = allUnmount.map(generateFiberToList);

  newPending.forEach(reactiveInstanceBeforeUnmount);

  map[fiber.uid] = [...exist, ...newPending];
};
