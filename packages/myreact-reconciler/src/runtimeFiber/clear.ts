import { __my_react_shared__ } from "@my-react/react";

import { defaultDeleteCurrentEffect } from "../dispatchEffect";
import { processClassComponentUnmount } from "../processClass";
import { hookListUnmount } from "../runtimeHook";

import type { MyReactFiberNode } from "./instance";
import type { MyReactFiberNodeDev } from "./interface";
import type { CustomRenderDispatch } from "../renderDispatch";

const { enableDebugFiled } = __my_react_shared__;

export const clearFiberNode = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  hookListUnmount(fiber, renderDispatch);

  processClassComponentUnmount(fiber, renderDispatch);

  defaultDeleteCurrentEffect(fiber, renderDispatch);

  fiber.instance = null;

  fiber.hookList = null;

  fiber.updateQueue = null;

  renderDispatch.commitUnsetRef(fiber);

  if (__DEV__ && enableDebugFiled.current) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugHookTypes = [];
  }
};
