import { Effect_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "../fiber";

export class MyReactInternalInstance {
  get isMyReactInstance() {
    return true;
  }

  mode: Effect_TYPE = Effect_TYPE.__initial__;

  context: null | unknown = null;

  _contextFiber: MyReactFiberNode | null = null;

  _ownerFiber: MyReactFiberNode | null = null;

  _setContext(fiber: MyReactFiberNode | null) {
    this._contextFiber?._removeDependence(this);
    this._contextFiber = fiber;
    this._contextFiber?._addDependence(this);
  }

  _setOwner(fiber: MyReactFiberNode) {
    this._ownerFiber = fiber;
  }

  _unmount() {
    this.mode = Effect_TYPE.__initial__;
    this._contextFiber?._removeDependence(this);
    this._ownerFiber = null;
    this._contextFiber = null;
  }
}
