import { Effect_TYPE } from "@my-react/react-shared";

import type { RenderFiber } from "../renderFiber";

/**
 * @public
 */
export class MyReactInternalInstance {
  get isMyReactInstance() {
    return true;
  }

  constructor() {
    if (__DEV__) {
      let _ownerFiber: RenderFiber | null = null;

      Object.defineProperty(this, "_ownerFiber", {
        get() {
          return _ownerFiber;
        },
        set(_newOwnerFiber) {
          _ownerFiber = _newOwnerFiber;
        },
      });

      let _contextFiber: RenderFiber | null = null;

      Object.defineProperty(this, "_contextFiber", {
        get() {
          return _contextFiber;
        },
        set(_newContextFiber) {
          _contextFiber = _newContextFiber;
        },
      });
    }
  }

  mode: Effect_TYPE = Effect_TYPE.__initial__;

  context: null | unknown = null;

  _contextFiber: RenderFiber | null = null;

  _ownerFiber: RenderFiber | null = null;

  _setContext(fiber: RenderFiber | null) {
    this._contextFiber?._removeDependence(this);

    this._contextFiber = fiber;

    this._contextFiber?._addDependence(this);
  }

  _setOwner(fiber: RenderFiber) {
    this._ownerFiber = fiber;
  }

  _unmount() {
    this.mode = Effect_TYPE.__unmount__;

    this._contextFiber?._removeDependence(this);

    this._ownerFiber = null;

    this._contextFiber = null;
  }
}
