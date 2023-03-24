import { MyReactInternalInstance } from "../internal";
import { enableSyncFlush } from "../share";

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

  _unmount() {
    super._unmount();
    this.effect = false;
    this.cancel && this.cancel();
  }

  _dispatch = (action: Action) => {
    const updater: HookUpdateQueue = {
      type: "hook",
      trigger: this,
      payLoad: action,
    };

    const ownerFiber = this._ownerFiber;

    if (ownerFiber && ownerFiber.isMounted) {
      const renderPlatform = ownerFiber.root.renderPlatform;

      const renderDispatch = ownerFiber.root.renderDispatch;

      ownerFiber.updateQueue.push(updater);

      if (enableSyncFlush.current) {
        renderDispatch.processFunctionComponentQueue(ownerFiber);
      } else {
        renderPlatform.microTask(() => renderDispatch.processFunctionComponentQueue(ownerFiber));
      }
    }
  };
}
