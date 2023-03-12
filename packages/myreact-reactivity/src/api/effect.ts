import { isArray, isInteger } from "@my-react/react-shared";

import { globalDepsMap } from "../share";

import { createRef } from "./createRef";
import { EffectFlags } from "./symbol";

const globalEffectRef = createRef<null | ReactiveEffect>(null);

export class ReactiveEffect<T = any> {
  private _active = true;
  private _parent: ReactiveEffect | null = null;
  public readonly [EffectFlags.Effect_key] = true;
  private readonly _depsSetArray: Set<ReactiveEffect>[] = [];

  constructor(private readonly _action: () => T, private readonly _scheduler?: (newValue: unknown, oldValue: unknown) => unknown) {}

  cleanDeps() {
    // delete current effect deps
    this._depsSetArray.forEach((set) => set.delete(this));
    // clean the dep array
    this._depsSetArray.length = 0;
  }

  addDeps(set: Set<ReactiveEffect>) {
    this._depsSetArray.push(set);
  }

  private entryScope() {
    this._parent = globalEffectRef.current;
    globalEffectRef.current = this;
  }

  private exitScope() {
    globalEffectRef.current = this._parent;
    this._parent = null;
  }

  run() {
    this.entryScope();

    this.cleanDeps();

    let re = null;

    try {
      re = this._action();
    } catch (e) {
      console.error(e);
    } finally {
      this.exitScope();
    }

    return re as T;
  }

  update(newValue?: unknown, oldValue?: unknown) {
    if (!this._active) return this._action();

    this.entryScope();

    this.cleanDeps();

    let re = null;

    try {
      if (this._scheduler) {
        re = this._scheduler(newValue, oldValue);
      } else {
        re = this._action();
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.exitScope();
    }

    return re;
  }

  stop() {
    if (this._active) {
      this._active = false;
      this.cleanDeps();
    }
  }

  active() {
    if (!this._active) {
      this._active = true;
    }
  }
}

export const shouldTrackRef = createRef(true);
const trackStack: boolean[] = [];
export const shouldTriggerRef = createRef(true);
const triggerStack: boolean[] = [];

export function pauseTracking() {
  trackStack.push(shouldTrackRef.current);
  shouldTrackRef.current = false;
}

export function pauseTrigger() {
  triggerStack.push(shouldTriggerRef.current);
  shouldTriggerRef.current = false;
}

export function enableTracking() {
  trackStack.push(shouldTrackRef.current);
  shouldTrackRef.current = true;
}

export function enableTrigger() {
  triggerStack.push(shouldTriggerRef.current);
  shouldTriggerRef.current = true;
}

export function resetTracking() {
  const last = trackStack.pop();
  shouldTrackRef.current = last === undefined ? true : last;
}

export function resetTrigger() {
  const last = triggerStack.pop();
  shouldTriggerRef.current = last === undefined ? true : last;
}

export function track(target: any, type: "get" | "has" | "iterate", key: string | symbol | number) {
  if (!globalEffectRef.current || !shouldTrackRef.current) return;

  let depsMap = globalDepsMap.get(target);

  if (!depsMap) {
    globalDepsMap.set(target, (depsMap = new Map()));
  }

  let depsSet = depsMap.get(key);

  if (!depsSet) {
    depsMap.set(key, (depsSet = new Set()));
  }

  trackEffects(depsSet);
}

export function trackEffects(set: Set<ReactiveEffect>) {
  if (!globalEffectRef.current || !shouldTrackRef.current) return;

  if (!set.has(globalEffectRef.current)) {
    set.add(globalEffectRef.current);

    globalEffectRef.current.addDeps(set);
  }
}

export function trigger(target: any, type: "set" | "add" | "delete" | "clear", key: string | symbol | number, newValue: unknown, oldValue: unknown) {
  if (!shouldTriggerRef.current) return;

  const depsMap = globalDepsMap.get(target);

  if (!depsMap) return;

  if (isArray(target)) {
    // 直接修改length
    if (key === "length") {
      depsMap.forEach((depsSet, _key) => {
        if (_key === "length") {
          if (depsSet) triggerEffects(depsSet, newValue, oldValue);
        }
        if (Number(_key) >= (newValue as number)) {
          if (depsSet) triggerEffects(depsSet);
        }
      });
    }
    if (isInteger(key)) {
      const depsSet = depsMap.get(key);
      if (depsSet) triggerEffects(depsSet, oldValue, newValue);
      // 数组调用了push等方法
      if (type === "add") {
        const depsSet = depsMap.get("length");
        if (depsSet) triggerEffects(depsSet);
      }
    }
  } else {
    const depsSet = depsMap.get(key);
    if (depsSet) triggerEffects(depsSet, newValue, oldValue);
  }
}

export function triggerEffects(set: Set<ReactiveEffect>, oldValue?: unknown, newValue?: unknown) {
  if (!shouldTriggerRef.current) return;

  const allReactiveEffect = new Set(set);

  allReactiveEffect.forEach((reactiveEffect) => {
    if (!Object.is(reactiveEffect, globalEffectRef.current)) {
      reactiveEffect.update(oldValue, newValue);
    }
  });
}

export function effect(action: () => void) {
  const effectObject = new ReactiveEffect(action);

  effectObject.run();

  const runner: {
    (oldValue: unknown, newValue: unknown): unknown;
    effect?: ReactiveEffect;
  } = effectObject.update.bind(effectObject);

  runner.effect = effectObject;

  return runner;
}
