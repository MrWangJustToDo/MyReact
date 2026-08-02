import { __my_react_internal__ } from "@my-react/react/type";
import { include, STATE_TYPE } from "@my-react/react-shared";

import { getFiberTree as getFiberTreeImpl } from "./debug";
import { getCurrentDispatchFromFiber } from "./refresh";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { UpdateQueue, RenderHookParams, createContext } from "@my-react/react/type";

const { currentRunningFiber, currentScheduler } = __my_react_internal__;

function dispatchHook(params: RenderHookParams) {
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
}

function dispatchState(_params: UpdateQueue) {
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
}

function dispatchError(_params: { fiber?: MyReactFiberNode; error?: Error }) {
  const fiber = _params.fiber || (currentRunningFiber.current as MyReactFiberNode);

  if (!fiber) {
    // a normal error
    throw _params.error;
  }

  // if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (!dispatch) {
    throw new Error("No dispatch found for the current running fiber.");
  }

  return dispatch.dispatchError(_params);
}

function dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }) {
  const fiber = _params.fiber || (currentRunningFiber.current as MyReactFiberNode);

  if (!fiber) {
    throw new Error("No fiber found for dispatching promise.");
  }

  // if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (!dispatch) {
    throw new Error("No dispatch found for the current running fiber.");
  }

  return dispatch.dispatchPromise(_params);
}

function dispatchSuspensePromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }) {
  const fiber = _params.fiber || (currentRunningFiber.current as MyReactFiberNode);

  if (!fiber) {
    throw new Error("No fiber found for dispatching suspense promise.");
  }

  // if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (!dispatch) {
    throw new Error("No dispatch found for the current running fiber.");
  }

  return dispatch.dispatchSuspensePromise(_params);
}

function readContext(_params: ReturnType<typeof createContext>): unknown {
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
}

function readPromise(_params: Promise<unknown>): unknown {
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
}

function getFiberTree(fiber: MyReactFiberNode): string {
  const dispatch = getCurrentDispatchFromFiber(fiber);

  if (dispatch) {
    return dispatch.getFiberTree(fiber);
  } else {
    return getFiberTreeImpl(fiber);
  }
}

export function initScheduler() {
  const scheduler = currentScheduler.current;

  if (scheduler.hasInit) return;

  scheduler.hasInit = true;

  scheduler.getFiberTree = getFiberTree;

  scheduler.readPromise = readPromise;

  scheduler.readContext = readContext;

  scheduler.dispatchState = dispatchState;

  scheduler.dispatchHook = dispatchHook;

  scheduler.dispatchError = dispatchError;

  scheduler.dispatchPromise = dispatchPromise;

  scheduler.dispatchSuspensePromise = dispatchSuspensePromise;
}
