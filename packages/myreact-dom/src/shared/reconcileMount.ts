import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

export const reconcileMount = (fiber: MyReactFiberNode, hydrate: boolean) => {
  __my_react_internal__.globalDispatch.current.reconcileCommit(fiber, hydrate, fiber);
};
