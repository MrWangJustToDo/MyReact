import { getContextFiber, getContextValue } from "../fiber";
import { MyReactInternalInstance } from "../internal";
import { isArrayEquals } from "../share";

import type { HookUpdateQueue } from "../fiber";

export type HOOK_TYPE =
  | "useRef"
  | "useMemo"
  | "useState"
  | "useEffect"
  | "useContext"
  | "useReducer"
  | "useCallback"
  | "useDebugValue"
  | "useLayoutEffect"
  | "useImperativeHandle";

export type Action = (s: any) => any | { type: string; payload: any };

export type Reducer = (state?: any, action?: Action) => any;

export class MyReactHookNode extends MyReactInternalInstance {
  hookIndex = 0;

  hookNext: MyReactHookNode | null = null;

  hookPrev: MyReactHookNode | null = null;

  hookType: HOOK_TYPE | null = null;

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

  initialResult() {
    if (this.hookType === "useMemo" || this.hookType === "useState" || this.hookType === "useReducer") {
      this.result = this.value.call(null);
      return;
    }

    if (
      this.hookType === "useEffect" ||
      this.hookType === "useLayoutEffect" ||
      this.hookType === "useImperativeHandle"
    ) {
      this.effect = true;
      return;
    }

    if (this.hookType === "useRef" || this.hookType === "useCallback") {
      this.result = this.value;
      return;
    }

    if (this.hookType === "useContext") {
      const ProviderFiber = getContextFiber(this.__fiber__, this.value);
      this.setContext(ProviderFiber);
      this.result = getContextValue(ProviderFiber, this.value);
      this.context = this.result;
      return;
    }
  }

  updateResult(newValue: any, newReducer: Reducer, newDeps: any[]) {
    if (
      this.hookType === "useMemo" ||
      this.hookType === "useEffect" ||
      this.hookType === "useCallback" ||
      this.hookType === "useLayoutEffect" ||
      this.hookType === "useImperativeHandle"
    ) {
      if (newDeps && !this.deps) {
        throw new Error("deps state change");
      }
      if (!newDeps && this.deps) {
        throw new Error("deps state change");
      }
    }

    if (
      this.hookType === "useEffect" ||
      this.hookType === "useLayoutEffect" ||
      this.hookType === "useImperativeHandle"
    ) {
      if (!newDeps) {
        this.value = newValue;
        this.reducer = newReducer || this.reducer;
        this.deps = newDeps;
        this.effect = true;
      } else if (!isArrayEquals(this.deps, newDeps)) {
        this.value = newValue;
        this.reducer = newReducer || this.reducer;
        this.deps = newDeps;
        this.effect = true;
      }
      return;
    }

    if (this.hookType === "useCallback") {
      if (!isArrayEquals(this.deps, newDeps)) {
        this.value = newValue;
        this.result = newValue;
        this.deps = newDeps;
      }
      return;
    }

    if (this.hookType === "useMemo") {
      if (!isArrayEquals(this.deps, newDeps)) {
        this.value = newValue;
        this.result = newValue.call(null);
        this.deps = newDeps;
      }
      return;
    }

    if (this.hookType === "useContext") {
      if (!this.__context__ || !this.__context__.mount || !Object.is(this.value, newValue)) {
        this.value = newValue;
        const ProviderFiber = getContextFiber(this.__fiber__, this.value);
        this.setContext(ProviderFiber);
        this.result = getContextValue(ProviderFiber, this.value);
        this.context = this.result;
      } else {
        this.result = getContextValue(this.__context__, this.value);
        this.context = this.result;
      }
      return;
    }

    if (this.hookType === "useReducer") {
      this.value = newValue;
      this.reducer = newReducer;
    }
  }

  unmount() {
    if (this.hookType === "useEffect" || this.hookType === "useLayoutEffect") {
      this.effect = false;
      this.cancel && this.cancel();
      return;
    }
    if (this.hookType === "useContext") {
      this.__context__?.removeDependence(this);
    }
  }

  dispatch = (action: Action) => {
    const updater: HookUpdateQueue = {
      type: "hook",
      trigger: this,
      action,
    };

    this.__fiber__?.__hookUpdateQueue__.push(updater);

    Promise.resolve().then(() => {
      this.__fiber__?.update();
    });
  };
}
