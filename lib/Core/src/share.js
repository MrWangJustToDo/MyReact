import { getContextFiber } from "./tools.js";

class MyReactInstance {
  /**
   * @type MyReactFiberNode
   */
  __fiber__ = null;

  /**
   * @type MyReactFiberNode
   */
  __context__ = null;

  updateDependence(newFiber, newContext) {
    this.__fiber__ = newFiber || this.__fiber__;
    this.__context__ = newContext || this.__context__;
  }

  processContext(ContextObject) {
    if (this.__context__) this.__context__.removeListener(this);
    const providerFiber = getContextFiber(this.__fiber__, ContextObject);
    providerFiber.addListener(this);
    this.updateDependence(null, providerFiber);
    return providerFiber;
  }
}

export { MyReactInstance };

export const once = (action) => {
  let flag = false;
  return (...args) => {
    if (!flag) {
      flag = true;
      action.call(null, ...args);
    }
  };
};
