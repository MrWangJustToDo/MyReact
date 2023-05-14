import type { MyReactComponent } from "../component";
import type { Action, RenderHook } from "../renderHook";

export type ComponentUpdateQueue<State = Record<string, unknown>, Props = Record<string, unknown>> = {
  type: "component";
  trigger: MyReactComponent;
  isForce?: boolean;
  payLoad?: Partial<State> | ((state: State, props: Props) => Partial<State>);
  callback?: () => void;
};

export type HookUpdateQueue = {
  type: "hook";
  trigger: RenderHook;
  isForce?: boolean;
  payLoad?: Action;
  callback?: () => void;
};

export type UpdateQueue = ComponentUpdateQueue | HookUpdateQueue;
