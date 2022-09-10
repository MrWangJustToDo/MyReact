import { MyReactInternalInstance } from "../internal";

import { HOOK_TYPE } from "./symbol";

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

  hookNext: MyReactHookNode | null = null;

  hookPrev: MyReactHookNode | null = null;

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

  // initialResult() {
  //   if (this.hookType === "useMemo" || this.hookType === "useState" || this.hookType === "useReducer") {
  //     this.result = this.value.call(null);
  //     return;
  //   }

  //   if (
  //     this.hookType === "useEffect" ||
  //     this.hookType === "useLayoutEffect" ||
  //     this.hookType === "useImperativeHandle"
  //   ) {
  //     this.effect = true;
  //     return;
  //   }

  //   if (this.hookType === "useRef" || this.hookType === "useCallback") {
  //     this.result = this.value;
  //     return;
  //   }

  //   if (this.hookType === "useContext") {
  //     const ProviderFiber = globalDispatch.current.resolveContextFiber(
  //       this._ownerFiber as MyReactFiberNode,
  //       this.value
  //     );
  //     this.setContext(ProviderFiber);
  //     this.result = getContextValue(ProviderFiber, this.value);
  //     this.context = this.result;
  //     return;
  //   }
  // }

  // updateResult(newValue: any, newReducer: Reducer, newDeps: any[]) {
  //   if (
  //     this.hookType === "useMemo" ||
  //     this.hookType === "useEffect" ||
  //     this.hookType === "useCallback" ||
  //     this.hookType === "useLayoutEffect" ||
  //     this.hookType === "useImperativeHandle"
  //   ) {
  //     if (newDeps && !this.deps) {
  //       throw new Error("deps state change");
  //     }
  //     if (!newDeps && this.deps) {
  //       throw new Error("deps state change");
  //     }
  //   }

  //   if (
  //     this.hookType === "useEffect" ||
  //     this.hookType === "useLayoutEffect" ||
  //     this.hookType === "useImperativeHandle"
  //   ) {
  //     if (!newDeps) {
  //       this.value = newValue;
  //       this.reducer = newReducer || this.reducer;
  //       this.deps = newDeps;
  //       this.effect = true;
  //     } else if (!isArrayEquals(this.deps, newDeps)) {
  //       this.value = newValue;
  //       this.reducer = newReducer || this.reducer;
  //       this.deps = newDeps;
  //       this.effect = true;
  //     }
  //     return;
  //   }

  //   if (this.hookType === "useCallback") {
  //     if (!isArrayEquals(this.deps, newDeps)) {
  //       this.value = newValue;
  //       this.result = newValue;
  //       this.deps = newDeps;
  //     }
  //     return;
  //   }

  //   if (this.hookType === "useMemo") {
  //     if (!isArrayEquals(this.deps, newDeps)) {
  //       this.value = newValue;
  //       this.result = newValue.call(null);
  //       this.deps = newDeps;
  //     }
  //     return;
  //   }

  //   if (this.hookType === "useContext") {
  //     if (!this._contextFiber || !this._contextFiber.mount || !Object.is(this.value, newValue)) {
  //       this.value = newValue;
  //       const ProviderFiber = globalDispatch.current.resolveContextFiber(
  //         this._ownerFiber as MyReactFiberNode,
  //         this.value
  //       );
  //       this.setContext(ProviderFiber);
  //       this.result = getContextValue(ProviderFiber, this.value);
  //       this.context = this.result;
  //     } else {
  //       this.result = getContextValue(this._contextFiber, this.value);
  //       this.context = this.result;
  //     }
  //     return;
  //   }

  //   if (this.hookType === "useReducer") {
  //     this.value = newValue;
  //     this.reducer = newReducer;
  //   }
  // }

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
      this._ownerFiber?.update();
    });
  };
}
