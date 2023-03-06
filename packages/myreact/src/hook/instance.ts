import { MyReactInternalInstance } from "../internal";

import type { HookUpdateQueue } from "../fiber";
import type { HOOK_TYPE } from "@my-react/react-shared";

export type Action = (s: any) => any | { type: string; payload: any };

export type Reducer = (state?: any, action?: Action) => any;

export type CreateHookParams = {
  hookIndex: number;
  hookType: HOOK_TYPE;
  value: unknown;
  reducer: Reducer | null;
  deps: unknown[];
};

export class MyReactHookNode extends MyReactInternalInstance {
  hookIndex = 0;

  hookType: HOOK_TYPE;

  cancel: (() => void) | null = null;

  effect = false;

  value: any = null;

  reducer: Reducer;

  deps: any[] = [];

  result: any = null;

  constructor(hookIndex: number, hookType: HOOK_TYPE, value: any, reducer: Reducer, deps: any[]) {
    super();
    this.deps = deps;
    this.value = value;
    this.reducer = reducer;
    this.hookType = hookType;
    this.hookIndex = hookIndex;
  }

  get isMyReactHook() {
    return true;
  }

  unmount() {
    super.unmount();
    this.effect = false;
    this.cancel && this.cancel();
  }

  dispatch = (action: Action) => {
    const updater: HookUpdateQueue = {
      type: "hook",
      trigger: this,
      payLoad: action,
    };

    this._ownerFiber?.updateQueue.push(updater);

    Promise.resolve().then(() => this._ownerFiber.root.renderDispatch.processFunctionComponentQueue(this._ownerFiber));
  };
}
