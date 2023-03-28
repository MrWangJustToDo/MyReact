import { __my_react_internal__ } from "@my-react/react";

import type { RenderFiber } from "@my-react/react";

const { currentComponentFiber } = __my_react_internal__;

export class MyReactSignal<T = any> {
  private _value: T;
  public readonly _depsSet: Set<RenderFiber> = new Set();

  constructor(_rawValue: T) {
    this._value = _rawValue;
  }

  getValue = () => {
    if (currentComponentFiber.current) {
      this._depsSet.add(currentComponentFiber.current);
    }

    return this._value;
  };

  setValue = (newValue: T) => {
    if (!Object.is(this._value, newValue)) {
      const allDeps = new Set(this._depsSet);

      this._depsSet.clear();

      this._value = newValue;

      allDeps.forEach((f) => f._update());
    }
  };
}
