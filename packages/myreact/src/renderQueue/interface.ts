import type { MyReactComponent } from "../component";
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
  payLoad?: Action;
  callback?: () => void;
};

/**
 * @public
 */
export type UpdateQueue<T = Record<string, any>> = (ComponentUpdateQueue | HookUpdateQueue) & T;
