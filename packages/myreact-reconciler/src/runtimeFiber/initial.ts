import { PATCH_TYPE } from "@my-react/react-shared";

import type { MyReactFiberRoot } from "./instance";
import type { MyReactFiberNodeDev } from "./interface";

// just used for rootFiber
export const initialFiberNode = (fiber: MyReactFiberRoot) => {
  const renderDispatch = fiber.container.renderDispatch;

  renderDispatch.pendingCreate(fiber);

  renderDispatch.pendingUpdate(fiber);

  renderDispatch.pendingAppend(fiber);

  if (fiber.ref) {
    renderDispatch.pendingRef(fiber);
  }

  renderDispatch.patchToFiberInitial?.(fiber);

  if (!(fiber.patch & PATCH_TYPE.__update__)) {
    fiber.memoizedProps = fiber.pendingProps;
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const timeNow = Date.now();

    typedFiber._debugRenderState = {
      renderCount: 1,
      mountTime: timeNow,
      prevUpdateTime: 0,
      currentUpdateTime: timeNow,
    };
  }

  return fiber;
};
