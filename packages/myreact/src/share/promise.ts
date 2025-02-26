import { UpdateQueueType } from "@my-react/react-shared";

import { currentRenderPlatform } from "./env";

import type { RenderFiber } from "../renderFiber";
import type { PromiseUpdateQueue } from "../renderQueue";

export const promiseLoad = (fiber: RenderFiber, loaded: any) => {
  const updater: PromiseUpdateQueue = {
    type: UpdateQueueType.promise,
    payLoad: loaded,
    trigger: fiber,
    isForce: true,
    isSync: true,
  };

  const renderPlatform = currentRenderPlatform.current;

  renderPlatform?.dispatchState(updater);
};
