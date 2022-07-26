import { getContextFiber, getContextValue } from '../fiber';
import { MyReactInternalInstance, isArrayEquals } from '../share';

import type { HookUpdateQueue } from '../fiber';

export enum HOOK_TYPE {
  useRef = 'useRef',
  useMemo = 'useMemo',
  useState = 'useState',
  useEffect = 'useEffect',
  useContext = 'useContext',
  useReducer = 'useReducer',
  useCallback = 'useCallback',
  useDebugValue = 'useDebugValue',
  useLayoutEffect = 'useLayoutEffect',
  useImperativeHandle = 'useImperativeHandle',
}

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

  constructor(
    hookIndex: number,
    hookType: HOOK_TYPE,
    value: any,
    reducer: Reducer,
    deps: any[]
  ) {
    super();
    this.deps = deps;
    this.value = value;
    this.reducer = reducer;
    this.hookType = hookType;
    this.hookIndex = hookIndex;
  }

  initialResult() {
    if (
      this.hookType === HOOK_TYPE.useMemo ||
      this.hookType === HOOK_TYPE.useState ||
      this.hookType === HOOK_TYPE.useReducer
    ) {
      this.result = this.value.call(null);
      return;
    }

    if (
      this.hookType === HOOK_TYPE.useEffect ||
      this.hookType === HOOK_TYPE.useLayoutEffect ||
      this.hookType === HOOK_TYPE.useImperativeHandle
    ) {
      this.effect = true;
      return;
    }

    if (
      this.hookType === HOOK_TYPE.useRef ||
      this.hookType === HOOK_TYPE.useCallback
    ) {
      this.result = this.value;
      return;
    }

    if (this.hookType === HOOK_TYPE.useContext) {
      const ProviderFiber = getContextFiber(this.__fiber__, this.value);
      this.setContext(ProviderFiber);
      this.result = getContextValue(ProviderFiber, this.value);
      return;
    }
  }

  updateResult(newValue: any, newReducer: Reducer, newDeps: any[]) {
    if (
      this.hookType === HOOK_TYPE.useMemo ||
      this.hookType === HOOK_TYPE.useEffect ||
      this.hookType === HOOK_TYPE.useCallback ||
      this.hookType === HOOK_TYPE.useLayoutEffect ||
      this.hookType === HOOK_TYPE.useImperativeHandle
    ) {
      if (newDeps && !this.deps) {
        throw new Error('deps state change');
      }
      if (!newDeps && this.deps) {
        throw new Error('deps state change');
      }
    }

    if (
      this.hookType === HOOK_TYPE.useEffect ||
      this.hookType === HOOK_TYPE.useLayoutEffect ||
      this.hookType === HOOK_TYPE.useImperativeHandle
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
    }

    if (this.hookType === HOOK_TYPE.useCallback) {
      if (!isArrayEquals(this.deps, newDeps)) {
        this.value = newValue;
        this.result = newValue;
        this.deps = newDeps;
      }
    }

    if (this.hookType === HOOK_TYPE.useMemo) {
      if (!isArrayEquals(this.deps, newDeps)) {
        this.value = newValue;
        this.result = newValue.call(null);
        this.deps = newDeps;
      }
    }

    if (this.hookType === HOOK_TYPE.useContext) {
      if (
        !this.__context__ ||
        !this.__context__.mount ||
        !Object.is(this.value, newValue)
      ) {
        this.value = newValue;
        const ProviderFiber = getContextFiber(this.__fiber__, this.value);
        this.setContext(ProviderFiber);
        this.result = getContextValue(ProviderFiber, this.value);
      } else {
        this.result = getContextValue(this.__context__, this.value);
      }
    }

    if (this.hookType === HOOK_TYPE.useReducer) {
      this.value = newValue;
      this.reducer = newReducer;
    }
  }

  dispatch = (action: Action) => {
    const updater: HookUpdateQueue = {
      type: 'hook',
      trigger: this,
      action,
    };

    this.__fiber__?.__hookUpdateQueue__.push(updater);
    Promise.resolve().then(() => {
      this.__fiber__?.update();
    });
  };
}
