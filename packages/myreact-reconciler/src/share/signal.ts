import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

const { currentFunctionFiber } = __my_react_internal__;

export class MyReactSignal<T = any> {
  private _value: T;
  public readonly _depsSet: Set<MyReactFiberNode> = new Set();

  constructor(_rawValue: T) {
    this._value = _rawValue;
  }

  getValue = () => {
    if (currentFunctionFiber.current) {
      this._depsSet.add(currentFunctionFiber.current);
    }

    return this._value;
  };

  setValue = (newValue: T) => {
    if (!Object.is(this._value, newValue)) {
      const allDeps = new Set(this._depsSet);

      this._depsSet.clear();

      if (allDeps.size) {
        Promise.resolve().then(() => {
          allDeps.forEach((f) => f.update());
        });
      }

      this._value = newValue;
    }
  };
}
