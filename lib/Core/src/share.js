import { MyReactFiberNode } from "./fiber.js";
import { Context } from "./tools.js";

class MyReactInstance {
  /**
   *
   * @param {MyReactFiberNode} fiber
   * @returns {MyReactFiberNode | null}
   */
  static getProviderFiber(fiber, providerObject) {
    if (fiber) {
      if (
        fiber.__isObjectNode__ &&
        fiber.__isContextProvider__ &&
        fiber.__vdom__.type === providerObject
      ) {
        return fiber;
      } else {
        return MyReactInstance.getProviderFiber(
          fiber.fiberParent,
          providerObject
        );
      }
    }
  }

  /**
   *
   * @param {MyReactFiberNode} fiber
   * @param {any} ContextObject
   */
  static getContextFiber(fiber, ContextObject) {
    if (!ContextObject) return;
    if (ContextObject.type !== Context) throw new Error("wrong usage");
    const providerFiber = MyReactInstance.getProviderFiber(
      fiber,
      ContextObject.Provider
    );
    if (!providerFiber) throw new Error("Context need Provider");
    return providerFiber;
  }

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
    const providerFiber = MyReactInstance.getContextFiber(
      this.__fiber__,
      ContextObject
    );
    this.updateDependence(null, providerFiber);
    this.__context__.addListener(this);
    return providerFiber;
  }
}

const NODE_TYPE_KEY = [
  "__isTextNode__",
  "__isEmptyNode__",
  "__isPlainNode__",
  "__isFragmentNode__",
  "__isObjectNode__",
  "__isForwardRef__",
  "__isPortal__",
  "__isMemo__",
  "__isContextProvider__",
  "__isContextConsumer__",
  "__isDynamicNode__",
  "__isClassComponent__",
  "__isFunctionComponent__",
];

class MyReactTypeInternalInstance {
  __INTERNAL_NODE_TYPE__ = {
    __isTextNode__: false,
    __isEmptyNode__: false,
    __isPlainNode__: false,
    __isFragmentNode__: false,
    // 对象转换为节点   //
    __isObjectNode__: false,
    __isForwardRef__: false,
    __isPortal__: false,
    __isMemo__: false,
    __isContextProvider__: false,
    __isContextConsumer__: false,
    // 动态节点 //
    __isDynamicNode__: false,
    __isClassComponent__: false,
    __isFunctionComponent__: false,
  };

  /**
   *
   * @param {{
   *  __isTextNode__: boolean,
   *  __isEmptyNode__: boolean,
   *  __isPlainNode__: boolean,
   *  __isFragmentNode__: boolean,
   *  __isObjectNode__: boolean,
   *  __isForwardRef__: boolean,
   *  __isPortal__: boolean,
   *  __isMemo__: boolean,
   *  __isContextProvider__: boolean,
   *  __isContextConsumer__: boolean,
   *  __isDynamicNode__: boolean,
   *  __isClassComponent__: boolean,
   *  __isFunctionComponent__: boolean,
   * }} props
   */
  _processUpdateType(props) {
    Object.keys(props || {}).forEach((key) => {
      this.__INTERNAL_NODE_TYPE__[key] = props[key];
    });
  }

  /**
   *
   * @param {MyReactTypeInternalInstance} instance
   */
  _processSucceedType(instance) {
    NODE_TYPE_KEY.forEach((key) => {
      this.__INTERNAL_NODE_TYPE__[key] = instance.__INTERNAL_NODE_TYPE__[key];
    });
  }

  get __isTextNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isTextNode__;
  }
  get __isTextNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isTextNode__;
  }
  get __isEmptyNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isEmptyNode__;
  }
  get __isPlainNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isPlainNode__;
  }
  get __isFragmentNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isFragmentNode__;
  }
  get __isObjectNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isObjectNode__;
  }
  get __isForwardRef__() {
    return this.__INTERNAL_NODE_TYPE__.__isForwardRef__;
  }
  get __isPortal__() {
    return this.__INTERNAL_NODE_TYPE__.__isPortal__;
  }
  get __isMemo__() {
    return this.__INTERNAL_NODE_TYPE__.__isMemo__;
  }
  get __isContextProvider__() {
    return this.__INTERNAL_NODE_TYPE__.__isContextProvider__;
  }
  get __isContextConsumer__() {
    return this.__INTERNAL_NODE_TYPE__.__isContextConsumer__;
  }
  get __isDynamicNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isDynamicNode__;
  }
  get __isClassComponent__() {
    return this.__INTERNAL_NODE_TYPE__.__isClassComponent__;
  }
  get __isFunctionComponent__() {
    return this.__INTERNAL_NODE_TYPE__.__isFunctionComponent__;
  }
}

export { MyReactInstance, MyReactTypeInternalInstance };
