import type { MyReactComponent } from "../component";
import type { MixinMyReactClassComponent, MixinMyReactFunctionComponent } from "../element";
import type { RenderFiber } from "../renderFiber";
import type { Action, RenderHook } from "../renderHook";
import type { UpdateQueueType } from "@my-react/react-shared";

/**
 * @public
 */
export type ComponentUpdateQueue<State = Record<string, unknown>, Props = Record<string, unknown>> = {
  type: UpdateQueueType.component;
  trigger: MyReactComponent;
  isForce?: boolean;
  isSync?: boolean;
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
  isRetrigger?: boolean;
  isImmediate?: boolean;
  payLoad?: Action;
  callback?: () => void;
};

/**
 * @public
 */
export type LazyUpdateQueue = {
  type: UpdateQueueType.lazy;
  trigger: RenderFiber;
  isForce?: boolean;
  isSync?: boolean;
  isRetrigger?: boolean;
  isImmediate?: boolean;
  payLoad?: MixinMyReactFunctionComponent | MixinMyReactClassComponent;
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
  isRetrigger?: boolean;
  isImmediate?: boolean;
  payLoad?: Record<string, unknown>;
  callback?: () => void;
};

/**
 * @public
 */
export type UpdateQueue<T = Record<string, any>> = (ComponentUpdateQueue | HookUpdateQueue | LazyUpdateQueue | ContextUpdateQueue) & T;
