import { UpdateQueueType } from "@my-react/react-shared";

import { currentScheduler } from "./env";

import type { MixinMyReactClassComponent, MixinMyReactFunctionComponent } from "../element";
import type { RenderFiber } from "../renderFiber";
import type { LazyUpdateQueue } from "../renderQueue";

export const lazyLoaded = (fiber: RenderFiber, loaded: null | MixinMyReactFunctionComponent | MixinMyReactClassComponent) => {
  const updater: LazyUpdateQueue = {
    type: UpdateQueueType.lazy,
    payLoad: loaded,
    trigger: fiber,
    isImmediate: true,
    isForce: true,
    isSync: true,
  };

  const renderScheduler = currentScheduler.current;

  renderScheduler?.dispatchState(updater);
};
