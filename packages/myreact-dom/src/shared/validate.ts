import { NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const checkRoot = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__class__)) return;

  if (include(fiber.type, NODE_TYPE.__function__)) return;

  if (include(fiber.type, NODE_TYPE.__portal__)) return;

  return;

  // throw new Error(`[@my-react/react-dom] the root element should be a dynamic node such as 'function' or 'class'`)
};
