import { NODE_TYPE, type CustomRenderDispatch, type MyReactFiberNode } from "@my-react/react-reconciler";
import { include, STATE_TYPE, ListTree } from "@my-react/react-shared";

export const rerunHead = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (include(fiber.type, NODE_TYPE.__plain__) && fiber.elementType === "head" && fiber.state !== STATE_TYPE.__reschedule__) {
    renderDispatch.pendingAsyncLoadFiberList = renderDispatch.pendingAsyncLoadFiberList || new ListTree<MyReactFiberNode>();

    renderDispatch.pendingAsyncLoadFiberList.pushToLast(fiber);
  }
};
