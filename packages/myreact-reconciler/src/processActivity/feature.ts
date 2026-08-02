import type { MyReactFiberNode } from "../runtimeFiber";

// TODO
export function processActivity(fiber: MyReactFiberNode) {
  const props = fiber.pendingProps;

  if (props.mode === "visible") return props.children;

  return null;
}
