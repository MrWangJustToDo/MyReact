import { Effect_TYPE } from "@my-react/react-shared";

import { enableGetterInstance } from "../share";

import type { RenderFiber } from "../renderFiber";

/**
 * @public
 */
export class MyReactInternalInstance {
  get isMyReactInstance() {
    return true;
  }

  constructor() {
    if (enableGetterInstance.current) {
      let _ownerFiber: RenderFiber | null = null;

      Object.defineProperty(this, "_owner", {
        get() {
          return _ownerFiber;
        },
        set(_newOwnerFiber) {
          _ownerFiber = _newOwnerFiber;
        },
      });

      let _contextFiber: RenderFiber | null = null;

      Object.defineProperty(this, "_context", {
        get() {
          return _contextFiber;
        },
        set(_newContextFiber) {
          _contextFiber = _newContextFiber;
        },
      });
    }
  }

  effect: Effect_TYPE = Effect_TYPE.__initial__;

  context: null | unknown = null;

  _context: RenderFiber | null = null;

  _owner: RenderFiber | null = null;

  _setContext(fiber: RenderFiber | null) {
    this._context?._removeDependence(this);

    this._context = fiber;

    this._context?._addDependence(this);
  }

  _setOwner(fiber: RenderFiber) {
    this._owner = fiber;
  }

  _unmount() {
    this.effect = Effect_TYPE.__unmount__;

    this._context?._removeDependence(this);

    this._owner = null;

    this._context = null;
  }
}
