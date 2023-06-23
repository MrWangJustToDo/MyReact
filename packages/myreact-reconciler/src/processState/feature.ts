import { __my_react_internal__ } from "@my-react/react";
import { ListTree, STATE_TYPE } from "@my-react/react-shared";

import type { UpdateQueue } from "@my-react/react";

const { currentComponentFiber, currentRenderPlatform } = __my_react_internal__;

export const processState = (_params: UpdateQueue) => {
  if (_params.type === "component") {
    const ownerFiber = _params.trigger._ownerFiber;

    if (!ownerFiber || ownerFiber.state & STATE_TYPE.__unmount__) return;

    if (__DEV__ && currentComponentFiber.current) {
      currentRenderPlatform.current?.log({
        fiber: currentComponentFiber.current,
        message: `trigger an update when current update flow is running, this is a unexpected behavior, please make sure current render function is a pure function`,
        level: "warn",
      });
    }

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    // if (__DEV__) {
    //   const typedOwnerFiber = ownerFiber as MyReactFiberNodeDev;

    //   typedOwnerFiber._debugUpdateQueue = typedOwnerFiber._debugUpdateQueue || new ListTree();

    //   typedOwnerFiber._debugUpdateQueue.push(_params);
    // }

    ownerFiber._prepare();
  } else {
    const ownerFiber = _params.trigger._ownerFiber;

    if (!ownerFiber || ownerFiber?.state & STATE_TYPE.__unmount__) return;

    if (__DEV__ && currentComponentFiber.current) {
      currentRenderPlatform.current?.log({
        fiber: currentComponentFiber.current,
        message: `trigger an update when current update flow is running, this is a unexpected behavior, please make sure current render function is a pure function`,
        level: "warn",
      });
    }

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    // if (__DEV__) {
    //   const typedOwnerFiber = ownerFiber as MyReactFiberNodeDev;

    //   typedOwnerFiber._debugUpdateQueue = typedOwnerFiber._debugUpdateQueue || new ListTree();

    //   typedOwnerFiber._debugUpdateQueue.push(_params);
    // }

    ownerFiber._prepare();
  }
};
