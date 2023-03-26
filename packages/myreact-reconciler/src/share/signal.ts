import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactFiberNode } from "@my-react/react";

const { currentFunctionFiber } = __my_react_internal__;
const { enableSyncFlush } = __my_react_shared__;

export class MyReactSignal<T = any> {
  private _value: T;
  private _fiber: MyReactFiberNode | null;
  public readonly _depsSet: Set<MyReactFiberNode> = new Set();

  constructor(_rawValue: T) {
    this._value = _rawValue;
  }

  getValue = () => {
    if (currentFunctionFiber.current) {
      this._fiber = currentFunctionFiber.current;
      this._depsSet.add(currentFunctionFiber.current);
    }

    return this._value;
  };

  setValue = (newValue: T) => {
    if (!Object.is(this._value, newValue)) {
      const allDeps = new Set(this._depsSet);

      const renderPlatform = this._fiber.root.renderPlatform as RenderPlatform;

      this._depsSet.clear();

      if (renderPlatform) {
        this._fiber = null;

        renderPlatform.microTask(() => {
          // enableSyncFlush.current = true;
          allDeps.forEach((f) => f._update());
          // enableSyncFlush.current = false;
        });
      }

      this._value = newValue;
    }
  };
}
