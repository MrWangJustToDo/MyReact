import { __my_react_internal__ } from "@my-react/react";

import { mountLoop, mountLoopAsync } from "../runtimeMount";
import { safeCall, safeCallAsync } from "../share";

import type { RenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const reconcileMount = (fiber: MyReactFiberNode, hydrate: boolean) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  renderDispatch.reconcileCommit(fiber, hydrate);
};

export const mountAll = (fiber: MyReactFiberNode, hydrate?: boolean) => {
  globalLoop.current = true;

  safeCall(() => mountLoop(fiber));

  reconcileMount(fiber, hydrate);

  globalLoop.current = false;
};

export const mountAllAsync = async (fiber: MyReactFiberNode, hydrate?: boolean) => {
  globalLoop.current = true;

  await safeCallAsync(() => mountLoopAsync(fiber));

  reconcileMount(fiber, hydrate);

  globalLoop.current = false;
};
