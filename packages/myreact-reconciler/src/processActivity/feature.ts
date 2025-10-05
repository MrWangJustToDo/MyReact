import type { MyReactFiberNode } from "../runtimeFiber";

// TODO
export const processActivity = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  if (props.mode) return props.children;

  return null;
}