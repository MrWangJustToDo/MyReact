import { isFunction } from "@my-react/react-shared";

import { ReactiveEffect, trackEffects, triggerEffects } from "./effect";
import { ComputedFlags, RefFlags } from "./symbol";

export type ComputedGetter<T> = (...args: any[]) => T;
export type ComputedSetter<T> = (v: T) => void;

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>;
  set: ComputedSetter<T>;
}

export const computed = <T>(getterOrOption: WritableComputedOptions<T> | ComputedGetter<T>) => {
  let getter: (...args: any[]) => T;
  let setter: (v: T) => void = () => {
    console.warn("current computed is readonly");
  };
  if (isFunction(getterOrOption)) {
    getter = getterOrOption;
  } else {
    getter = getterOrOption.get;
    setter = getterOrOption.set;
  }

  return new ComputedRefImpl(getter, setter);
};

class ComputedRefImpl<T> {
  private _dirty = true;
  private _effect: ReactiveEffect<T>;
  private _value: T | null = null;
  public readonly [RefFlags.Ref_key] = true;
  public readonly [ComputedFlags.Computed_key] = true;
  private readonly _depsSet: Set<ReactiveEffect> = new Set();

  constructor(readonly _getter: () => T, private readonly _setter: (v: T) => void) {
    this._effect = new ReactiveEffect<T>(_getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerEffects(this._depsSet);
      }
    });
  }

  get value() {
    trackEffects(this._depsSet);

    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }

    return this._value as T;
  }

  set value(v: T) {
    // TODO
    this._setter(v);
  }
}
