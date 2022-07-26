import type { MyReactFiberNode } from '../fiber';

export class MyReactInternalInstance {
  __internal_instance_state__: {
    __fiber__: MyReactFiberNode | null;
    __context__: MyReactFiberNode | null;
  } = {
    __fiber__: null,
    __context__: null,
  };

  __internal_instance_update__ = {
    __pendingEffect__: false,
  };

  context: null | unknown = null;

  get __fiber__() {
    return this.__internal_instance_state__.__fiber__;
  }

  set __fiber__(v) {
    this.__internal_instance_state__.__fiber__ = v;
  }

  get __context__() {
    return this.__internal_instance_state__.__context__;
  }

  set __context__(v) {
    this.__internal_instance_state__.__context__ = v;
  }

  get __pendingEffect__() {
    return this.__internal_instance_update__.__pendingEffect__;
  }

  set __pendingEffect__(v) {
    this.__internal_instance_update__.__pendingEffect__ = v;
  }

  setContext(context: MyReactFiberNode | null) {
    if (this.__context__) this.__context__.removeDependence(this);
    this.__context__ = context;
    this.__context__?.addDependence(this);
  }

  setFiber(fiber: MyReactFiberNode) {
    this.__fiber__ = fiber;
  }
}