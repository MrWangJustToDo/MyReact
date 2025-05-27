import { UpdateQueueType } from "@my-react/react-shared";

import { currentScheduler } from "./env";

import type { RenderFiber } from "../renderFiber";
import type { PromiseUpdateQueue } from "../renderQueue";

export const promiseLoad = (fiber: RenderFiber, loaded: any) => {
  const updater: PromiseUpdateQueue = {
    type: UpdateQueueType.promise,
    payLoad: loaded,
    trigger: fiber,
    isImmediate: true,
    isForce: true,
    isSync: true,
  };

  const renderScheduler = currentScheduler.current;

  renderScheduler?.dispatchState(updater);
};
