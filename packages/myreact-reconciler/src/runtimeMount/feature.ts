import type { MyReactFiberNode } from "@my-react/react";

export const mountLoop = (fiber: MyReactFiberNode) => {
  const renderController = fiber.root.renderController;
  let pendingFiber = fiber;
  while (pendingFiber) {
    pendingFiber = renderController.performToNextFiberOnMount(pendingFiber);
  }
};

export const mountLoopAsync = async (fiber: MyReactFiberNode) => {
  const renderController = fiber.root.renderController;
  let pendingFiber = fiber;
  while (pendingFiber) {
    pendingFiber = await renderController.performToNextFiberOnMountAsync(pendingFiber);
  }
};
