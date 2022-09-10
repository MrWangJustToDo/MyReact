import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { isHydrateRender, isServerRender, pendingModifyFiberArray } from "./env";

import type { MyReactFiberNode } from "@my-react/react";

const { globalLoop, globalDispatch } = __my_react_internal__;

const { enableAsyncUpdate } = __my_react_shared__;

const updateEntry = () => {
  if (globalLoop.current) return;
  if (enableAsyncUpdate.current) {
    globalDispatch.current.updateAllAsync();
  } else {
    globalDispatch.current.updateAllSync();
  }
};

const asyncUpdate = () => Promise.resolve().then(updateEntry);

export const triggerUpdate = (fiber: MyReactFiberNode) => {
  if (isServerRender.current || isHydrateRender.current) {
    if (__DEV__) {
      console.log("can not update component");
    }
    return;
  }
  fiber.triggerUpdate();
  pendingModifyFiberArray.current.push(fiber);
  asyncUpdate();
};
