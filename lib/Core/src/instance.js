import { MyReactFiberNode } from "./fiber.js";
import { getContextFiber } from "./fiberTool.js";

class MyReactInstance {
  /**
   * @type MyReactFiberNode
   */
  __fiber__ = null;

  /**
   * @type MyReactFiberNode
   */
  __context__ = null;

  /**
   *
   * @param {MyReactFiberNode} newFiber
   * @param {MyReactFiberNode} newContext
   */
  updateDependence(newFiber, newContext) {
    this.__fiber__ = newFiber || this.__fiber__;
    this.__context__ = newContext || this.__context__;
  }

  processContext(ContextObject) {
    if (this.__context__) this.__context__.removeListener(this);
    const providerFiber = getContextFiber(this.__fiber__, ContextObject);
    this.updateDependence(null, providerFiber);
    this.__context__?.addListener(this);
    return providerFiber;
  }
}

export { MyReactInstance };
