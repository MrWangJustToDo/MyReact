import { ListTree, STATE_TYPE } from "@my-react/react-shared";

import type { UpdateQueue } from "@my-react/react";

export const processState = (_params: UpdateQueue) => {
  if (_params.type === "component") {
    const ownerFiber = _params.trigger._ownerFiber;

    if (!ownerFiber || ownerFiber.state & STATE_TYPE.__unmount__) return;

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    ownerFiber._prepare();
  } else {
    const ownerFiber = _params.trigger._ownerFiber;

    if (!ownerFiber || ownerFiber?.state & STATE_TYPE.__unmount__) return;

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    ownerFiber._prepare();
  }
};
