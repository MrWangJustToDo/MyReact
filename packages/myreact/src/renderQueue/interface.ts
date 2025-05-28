import type { MyReactComponent } from "../component";
import type { RenderFiber } from "../renderFiber";
import type { Action, Reducer, RenderHook } from "../renderHook";
import type { UpdateQueueType } from "@my-react/react-shared";

/**
 * @public
 */
export type ComponentUpdateQueue<State = Record<string, unknown>, Props = Record<string, unknown>> = {
  type: UpdateQueueType.component;
  trigger: MyReactComponent;
  isForce?: boolean;
  isSync?: boolean;
  isSkip?: boolean;
  isRetrigger?: boolean;
  isImmediate?: boolean;
  payLoad?: Partial<State> | ((state: State, props: Props) => Partial<State>);
  callback?: () => void;
};

/**
 * @public
 */
export type HookUpdateQueue = {
  type: UpdateQueueType.hook;
  trigger: RenderHook;
  isForce?: boolean;
  isSync?: boolean;
  isSkip?: boolean;
  isRetrigger?: boolean;
  isImmediate?: boolean;
  payLoad?: Action;
  reducer?: Reducer;
  callback?: () => void;
};

/**
 * @public
 */
export type ContextUpdateQueue = {
  type: UpdateQueueType.context;
  trigger: RenderFiber;
  isForce?: boolean;
  isSync?: boolean;
  isSkip?: boolean;
  isRetrigger?: boolean;
  isImmediate?: boolean;
  payLoad?: Record<string, unknown>;
  callback?: () => void;
};

/**
 * @public
 */
export type SuspenseUpdateQueue = {
  type: UpdateQueueType.suspense;
  trigger: RenderFiber;
  isForce?: boolean;
  isSync?: boolean;
  isSkip?: boolean;
  isRetrigger?: boolean;
  isImmediate?: boolean;
  payLoad?: Array<any>;
  callback?: () => void;
};

/**
 * @public
 */
export type HMRUpdateQueue = {
  type: UpdateQueueType.hmr;
  trigger: RenderFiber;
  isForce?: boolean;
  isSync?: boolean;
  isSkip?: boolean;
  isRetrigger?: boolean;
  isImmediate?: boolean;
  payLoad?: Record<string, unknown>;
  callback?: () => void;
};

/**
 * @public
 */
export type TriggerUpdateQueue = {
  type: UpdateQueueType.trigger;
  trigger: RenderFiber;
  isForce?: boolean;
  isSync?: boolean;
  isSkip?: boolean;
  isRetrigger?: boolean;
  isImmediate?: boolean;
  payLoad?: Record<string, unknown>;
  callback?: () => void;
};

/**
 * @public
 */
export type UpdateQueue<T = Record<string, any>> = (
  | ComponentUpdateQueue
  | HookUpdateQueue
  | ContextUpdateQueue
  | HMRUpdateQueue
  | TriggerUpdateQueue
  | SuspenseUpdateQueue
) &
  T;
