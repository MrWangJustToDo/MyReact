import { __my_react_internal__ } from "@my-react/react";
import { include, STATE_TYPE } from "@my-react/react-shared";

import { getFiberTree as getFiberTreeImpl } from "./debug";
import { getCurrentDispatchFromFiber } from "./refresh";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { UpdateQueue, RenderHookParams, createContext } from "@my-react/react";

const { currentRunningFiber, currentScheduler } = __my_react_internal__;

const dispatchHook = (params: RenderHookParams) => {
  const fiber = currentRunningFiber.current as MyReactFiberNode;

  if (!fiber) {
    throw new Error("No current running fiber found for dispatching hook.");
  }

  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (!dispatch) {
    throw new Error("No dispatch found for the current running fiber.");
  }

  return dispatch.dispatchHook(params);
};

const dispatchState = (_params: UpdateQueue) => {
  const trigger = _params.trigger;

  const fiber = trigger._reactInternals || trigger;

  if (!fiber) {
    throw new Error("No fiber found for dispatching state.");
  }

  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (!dispatch) {
    throw new Error("No dispatch found for the current running fiber.");
  }

  return dispatch.dispatchState(_params);
};

const dispatchError = (_params: { fiber?: MyReactFiberNode; error?: Error }) => {
  const fiber = _params.fiber || (currentRunningFiber.current as MyReactFiberNode);

  if (!fiber) {
    // a normal error
    throw _params.error;
  }

  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (!dispatch) {
    throw new Error("No dispatch found for the current running fiber.");
  }

  return dispatch.dispatchError(_params);
};

const dispatchPromise = (_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }) => {
  const fiber = _params.fiber || (currentRunningFiber.current as MyReactFiberNode);

  if (!fiber) {
    throw new Error("No fiber found for dispatching promise.");
  }

  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (!dispatch) {
    throw new Error("No dispatch found for the current running fiber.");
  }

  return dispatch.dispatchPromise(_params);
};

const readContext = (_params: ReturnType<typeof createContext>): unknown => {
  const fiber = currentRunningFiber.current as MyReactFiberNode;

  if (!fiber) {
    throw new Error("No current running fiber found for reading context.");
  }

  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (!dispatch) {
    throw new Error("No dispatch found for the current running fiber.");
  }

  return dispatch.readContext(_params);
};

const readPromise = (_params: Promise<unknown>): unknown => {
  const fiber = currentRunningFiber.current as MyReactFiberNode;

  if (!fiber) {
    throw new Error("No current running fiber found for reading promise.");
  }

  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (!dispatch) {
    throw new Error("No dispatch found for the current running fiber.");
  }

  return dispatch.readPromise(_params);
};

const getFiberTree = (fiber: MyReactFiberNode): string => {
  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (dispatch) {
    return dispatch.getFiberTree(fiber);
  } else {
    return getFiberTreeImpl(fiber);
  }
};

export const initScheduler = () => {
  const scheduler = currentScheduler.current;

  scheduler.getFiberTree = getFiberTree;

  scheduler.readPromise = readPromise;

  scheduler.readContext = readContext;

  scheduler.dispatchState = dispatchState;

  scheduler.dispatchHook = dispatchHook;

  scheduler.dispatchError = dispatchError;

  scheduler.dispatchPromise = dispatchPromise;
};
