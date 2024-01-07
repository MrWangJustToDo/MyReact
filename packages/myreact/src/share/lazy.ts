import { MODE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { currentRenderPlatform } from "./env";

import type { MixinMyReactClassComponent, MixinMyReactFunctionComponent } from "../element";
import type { RenderFiber } from "../renderFiber";
import type { LazyUpdateQueue } from "../renderQueue";

export const lazyLoaded = (fiber: RenderFiber, loaded: null | MixinMyReactFunctionComponent | MixinMyReactClassComponent) => {
  const updater: LazyUpdateQueue = {
    type: UpdateQueueType.lazy,
    payLoad: loaded,
    trigger: fiber,
    isForce: true,
    isSync: true,
    isInitial: fiber.mode === MODE_TYPE.__initial__,
  };

  const renderPlatform = currentRenderPlatform.current;

  renderPlatform?.dispatchState(updater);
};
