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

  setContext(fiber: MyReactFiberNode | null) {
    this._ownerFiber?.removeContext(this._contextFiber);
    this._contextFiber?.removeDependence(this);
    this._contextFiber = fiber;
    this._contextFiber?.addDependence(this);
    this._ownerFiber?.addContext(this._contextFiber);
  }

  setOwner(fiber: MyReactFiberNode) {
    this._ownerFiber = fiber;
  }

  unmount() {
    this.mode = Effect_TYPE.__initial__;
    this._contextFiber?.removeDependence(this);
    this._ownerFiber?.removeContext(this._contextFiber);
  }
}
