import { Reconciler } from "./feature";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type createReconcilerType from "react-reconciler";

export * from "@my-react/react-reconciler";

export const version = __VERSION__;

export const createReconciler = Reconciler as unknown as typeof createReconcilerType;

export interface FiberNode<T = Record<string, any>> extends MyReactFiberNode {
  stateNode: T;
  return: FiberNode | null;
  child: FiberNode | null;
  sibling: FiberNode | null;
  alternate?: FiberNode | null;
}

export { enableKnownConfigLog } from "./config";

export function defaultOnUncaughtError(error: Error): void {
  console.error("Uncaught", error);
}

export function defaultOnCaughtError(error: Error): void {
  console.error("Caught", error);
}

export function defaultOnRecoverableError(error: Error): void {
  console.error("Recoverable", error);
}

export function startHostTransition(): void {
  // no-op
}

export default createReconciler;
