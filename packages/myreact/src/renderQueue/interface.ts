import type { MyReactComponent } from "../component";
import type { Action, RenderHook } from "../renderHook";

export type ComponentUpdateQueue = {
  type: "component";
  trigger: MyReactComponent;
  isForce?: boolean;
  payLoad?: Record<string, unknown> | ((state: Record<string, unknown>, props: Record<string, unknown>) => Record<string, unknown>);
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
