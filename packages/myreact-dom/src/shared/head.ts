import { NODE_TYPE, type CustomRenderDispatch, type MyReactFiberNode } from "@my-react/react-reconciler";
import { include, STATE_TYPE, ListTree } from "@my-react/react-shared";

export const rerunHead = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__plain__) && fiber.elementType === "head" && fiber.state !== STATE_TYPE.__reschedule__) {
    fiber.state = STATE_TYPE.__stable__;

    renderDispatch.pendingAsyncLoadList = renderDispatch.pendingAsyncLoadList || new ListTree<MyReactFiberNode>();

    renderDispatch.pendingAsyncLoadList.pushToLast(fiber);
  }
};
