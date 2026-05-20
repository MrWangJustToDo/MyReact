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

export const defaultOnUncaughtError = (error: Error): void => {
  console.error("Uncaught", error);
};

export const defaultOnCaughtError = (error: Error): void => {
  console.error("Caught", error);
};

export const defaultOnRecoverableError = (error: Error): void => {
  console.error("Recoverable", error);
};

export const startHostTransition = (): void => {
  // no-op
};

export default createReconciler;
