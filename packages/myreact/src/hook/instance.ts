import { HOOK_TYPE } from "@my-react/react-shared";

import { MyReactInternalInstance } from "../internal";

import type { HookUpdateQueue } from "../fiber";

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
    if (this.hookType === HOOK_TYPE.useEffect || this.hookType === HOOK_TYPE.useLayoutEffect) {
      this.effect = false;
      this.cancel && this.cancel();
      return;
    }
  }

  dispatch = (action: Action) => {
    const updater: HookUpdateQueue = {
      type: "hook",
      trigger: this,
      payLoad: action,
    };

    this._ownerFiber?.updateQueue.push(updater);

    Promise.resolve().then(() => {
      const fiber = this._ownerFiber;
      if (fiber) {
        fiber.root.globalDispatch.resolveHookQueue(fiber);
      }
    });
  };
}
