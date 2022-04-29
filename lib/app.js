(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyReactPureComponent = exports.MyReactComponent = void 0;
exports.classComponentMount = classComponentMount;
exports.classComponentUpdate = classComponentUpdate;

var _core = require("./core.js");

var _effect = require("./effect.js");

var _fiber = require("./fiber.js");

var _share = require("./share.js");

var _tools = require("./tools.js");

class MyReactComponent extends _share.MyReactInstance {
  constructor(props, context) {
    super();
    this.props = props;
    this.context = context;
  }

  __prevProps__ = null;
  __nextProps__ = null;
  __prevContext__ = null;
  __nextContext__ = null;
  __prevState__ = null;
  __nextState__ = null;
  __pendingCallback__ = [];
  __pendingEffect__ = false;

  get isMyReactComponent() {
    return true;
  }

  setState = (newValue, callback) => {
    let newState = newValue;

    if (typeof newValue === "function") {
      newState = newValue(this.state);
    }

    this.__nextState__ = Object.assign({}, this.__nextState__, newState);
    callback && this.__pendingCallback__.push(callback);
    this.forceUpdate();
  };
  forceUpdate = () => {
    Promise.resolve().then(() => this.__fiber__.update());
  };

  updateInstance(newState, newProps, newContext) {
    if (newProps) {
      this.__prevProps__ = this.props;
      this.props = newProps;
    }

    if (newState) {
      this.__prevState__ = this.state;
      this.state = newState;
    }

    if (newContext) {
      this.__prevContext__ = this.context;
      this.context = newContext;
    }

    this.__nextProps__ = null;
    this.__nextState__ = null;
    this.__nextContext__ = null;
    this.__fiber__.memoProps = this.props;
    this.__fiber__.memoState = this.state;
  }

}

exports.MyReactComponent = MyReactComponent;

class MyReactPureComponent extends MyReactComponent {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !(0, _tools.isNormalEqual)(this.props, nextProps) || !(0, _tools.isNormalEqual)(this.state, nextState) || !(0, _tools.isNormalEqual)(this.context, nextContext);
  }

}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


exports.MyReactPureComponent = MyReactPureComponent;

function processStateFromProps(fiber) {
  const Component = fiber.__vdom__.type;
  let newState = null;

  if (typeof Component.getDerivedStateFromProps === "function") {
    newState = Component.getDerivedStateFromProps(fiber.__vdom__.props, fiber.instance.state);
  }

  return newState;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processStateFromPropsMountLifeCircle(fiber) {
  const newState = processStateFromProps(fiber);
  fiber.instance.updateInstance(Object.assign({}, fiber.instance.state, newState, fiber.instance.__nextState__));
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processStateFromPropsUpdateLiftCircle(fiber) {
  const newState = processStateFromProps(fiber);
  return Object.assign({}, fiber.instance.state, newState, fiber.instance.__nextState__);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentInstanceRef(fiber) {
  if (fiber.__vdom__.ref) {
    if (typeof fiber.__vdom__.ref === "function") {
      fiber.__vdom__.ref(fiber.instance);
    } else if (typeof fiber.__vdom__.ref === "object") {
      fiber.__vdom__.ref.current = fiber.instance;
    }
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentInstanceLifeCircle(fiber) {
  const Component = fiber.__vdom__.type;
  const providerFiber = (0, _tools.getContextFiber)(fiber, Component.contextType);
  const instance = new Component(fiber.__vdom__.props, providerFiber === null || providerFiber === void 0 ? void 0 : providerFiber.__vdom__.props.value);
  fiber.installInstance(instance);
  instance.updateDependence(fiber, providerFiber);
  providerFiber === null || providerFiber === void 0 ? void 0 : providerFiber.addListener(instance);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentRenderLifeCircle(fiber) {
  const children = fiber.instance.render();
  fiber.__vdom__.__dynamicChildren__ = children;
  return (0, _core.nextWorkCommon)(fiber);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentDidMountLiftCircle(fiber) {
  if (!fiber.instance.__pendingEffect__ && typeof fiber.instance.componentDidMount === "function") {
    fiber.instance.__pendingEffect__ = true;
    (0, _effect.pushLayoutEffect)(fiber, () => {
      fiber.instance.componentDidMount();
      fiber.instance.__pendingEffect__ = false;
    });
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function classComponentMount(fiber) {
  processComponentInstanceLifeCircle(fiber);
  processComponentInstanceRef(fiber);
  processStateFromPropsMountLifeCircle(fiber);
  const children = processComponentRenderLifeCircle(fiber);
  processComponentDidMountLiftCircle(fiber);
  return children;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentContextUpdate(fiber) {
  if (fiber.instance.__context__ && !fiber.instance.__context__.mount) {
    const providerFiber = fiber.instance.processContext(fiber.__vdom__.type.contextType);
    return providerFiber.__vdom__.props.value;
  }

  return fiber.instance.context;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processShouldComponentUpdateLifeCircle(fiber) {
  if (typeof fiber.instance.shouldComponentUpdate === "function") {
    return fiber.instance.shouldComponentUpdate(fiber.instance.__nextProps__, fiber.instance.__nextState__, fiber.instance.__nextContext__);
  }

  return true;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentDidUpdateLiftCircle(fiber) {
  if (!fiber.instance.__pendingEffect__) {
    fiber.instance.__pendingEffect__ = true;
    (0, _effect.pushLayoutEffect)(fiber, () => {
      if (typeof fiber.instance.componentDidUpdate === "function") {
        fiber.instance.componentDidUpdate(fiber.instance.__prevProps__, fiber.instance.__prevState__, fiber.instance.__prevContext__);
        fiber.instance.__prevProps__ = null;
        fiber.instance.__prevState__ = null;
        fiber.instance.__prevContext__ = null;
      }

      if (fiber.instance.__pendingCallback__.length) {
        const allCallback = fiber.instance.__pendingCallback__.slice(0);

        fiber.instance.__pendingCallback__ = [];
        allCallback.forEach(c => c());
      }

      fiber.instance.__pendingEffect__ = false;
    });
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function classComponentUpdate(fiber) {
  fiber.instance.updateDependence(fiber);
  const newState = processStateFromPropsUpdateLiftCircle(fiber);
  const newProps = fiber.__vdom__.props;
  const newContext = processComponentContextUpdate(fiber);
  fiber.instance.__nextState__ = newState;
  fiber.instance.__nextProps__ = newProps;
  fiber.instance.__nextContext__ = newContext;
  const shouldUpdate = processShouldComponentUpdateLifeCircle(fiber);
  fiber.instance.updateInstance(newState, newProps, newContext);

  if (shouldUpdate) {
    const children = processComponentRenderLifeCircle(fiber);
    processComponentDidUpdateLiftCircle(fiber);
    return children;
  } else {
    fiber.stopUpdate();
    return [];
  }
}
},{"./core.js":2,"./effect.js":4,"./fiber.js":7,"./share.js":13,"./tools.js":14}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextWork = nextWork;
exports.nextWorkCommon = nextWorkCommon;

var _component = require("./component.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _tools = require("./tools.js");

var _unmount = require("./unmount.js");

var _vdom = require("./vdom.js");

/**
 *
 * @param {MyReactVDom | MyReactVDom[]} newVDom
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
 * @param {MyReactFiberNode | MyReactFiberNode[]} matchedPreviousRenderChild
 * @param {boolean} isSameType
 * @returns
 */
function getNewFiberWithUpdate(newVDom, parentFiber, previousRenderChild, matchedPreviousRenderChild, isSameType) {
  if (isSameType) {
    if (Array.isArray(newVDom)) {
      matchedPreviousRenderChild = getMatchedRenderChildren(newVDom, matchedPreviousRenderChild);

      if (newVDom.length < matchedPreviousRenderChild.length) {
        (0, _unmount.pushUnmount)(matchedPreviousRenderChild.slice(newVDom.length));
      }

      return newVDom.map((v, index) => getNewFiberWithUpdate(v, parentFiber, previousRenderChild[index], matchedPreviousRenderChild[index], isSameTypeNode(v, matchedPreviousRenderChild[index])));
    }

    if (matchedPreviousRenderChild === null) return null; // 相同的引用  不会重新运行

    if (Object.is(matchedPreviousRenderChild.__vdom__, newVDom)) {
      return (0, _fiber.updateFiberNodeWithPosition)(matchedPreviousRenderChild, parentFiber, previousRenderChild, newVDom);
    } // 更新dom节点


    if (matchedPreviousRenderChild.__isPlainNode__ && (0, _tools.isEqual)(matchedPreviousRenderChild.__vdom__.props, newVDom.props)) {
      return (0, _fiber.updateFiberNodeWithPosition)(matchedPreviousRenderChild, parentFiber, previousRenderChild, newVDom);
    }

    if (matchedPreviousRenderChild.__isMemo__ && (0, _tools.isNormalEqual)(matchedPreviousRenderChild.__vdom__.props, newVDom.props)) {
      return (0, _fiber.updateFiberNodeWithPosition)(matchedPreviousRenderChild, parentFiber, previousRenderChild, newVDom);
    } // 优化Provider更新，方法之一


    if (matchedPreviousRenderChild.__isContextProvider__ && (0, _tools.isNormalEqual)(matchedPreviousRenderChild.__vdom__.props.value, newVDom.props.value)) {
      return (0, _fiber.updateFiberNodeWithPosition)(matchedPreviousRenderChild, parentFiber, previousRenderChild, newVDom);
    }

    return (0, _fiber.createFiberNodeWithUpdateAndPosition)({
      fiberParent: parentFiber,
      deepIndex: parentFiber.deepIndex + 1,
      // skip commit
      fiberAlternate: matchedPreviousRenderChild.__pendingUpdate__ ? matchedPreviousRenderChild.fiberAlternate : matchedPreviousRenderChild,
      dom: matchedPreviousRenderChild.dom,
      hookHead: matchedPreviousRenderChild.hookHead,
      hookFoot: matchedPreviousRenderChild.hookFoot,
      hookList: matchedPreviousRenderChild.hookList,
      listeners: matchedPreviousRenderChild.listeners,
      instance: matchedPreviousRenderChild.instance,
      effect: matchedPreviousRenderChild.__isTextNode__ || matchedPreviousRenderChild.__isPlainNode__ ? "UPDATE" : null
    }, {
      newVDom: newVDom === false || newVDom === null ? "" : newVDom,
      previousRenderFiber: previousRenderChild
    });
  }

  if (matchedPreviousRenderChild) {
    (0, _unmount.pushUnmount)(matchedPreviousRenderChild);
  }

  if (Array.isArray(newVDom)) {
    return newVDom.map(v => getNewFiberWithUpdate(v, parentFiber, null, null, false));
  }

  if (newVDom === undefined) return null;
  return (0, _fiber.createFiberNodeWithPosition)({
    fiberParent: parentFiber,
    deepIndex: parentFiber.deepIndex + 1,
    effect: newVDom !== null && newVDom !== void 0 && newVDom.__isPortal__ ? "PORTAL" : "PLACEMENT"
  }, {
    newVDom: newVDom === false || newVDom === null ? "" : newVDom,
    previousRenderFiber: previousRenderChild
  });
}
/**
 *
 * @param {MyReactVDom} newVDom
 * @param {MyReactFiberNode} parentFiber
 */


function getNewFiberWithInitial(newVDom, parentFiber) {
  if (Array.isArray(newVDom)) {
    return newVDom.map(v => getNewFiberWithInitial(v, parentFiber));
  }

  if (newVDom === undefined) return null;
  return (0, _fiber.createFiberNodeWithUpdate)({
    fiberParent: parentFiber,
    deepIndex: parentFiber.deepIndex + 1,
    effect: newVDom.__isPortal__ ? "PORTAL" : "PLACEMENT"
  }, newVDom === false || newVDom === null ? "" : newVDom);
}
/**
 *
 * @param {MyReactVDom | MyReactVDom[]} newVDom
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
 */


function isSameTypeNode(newVDom, previousRenderChild) {
  if (Array.isArray(newVDom) && Array.isArray(previousRenderChild)) return true;
  const previousRenderChildVDom = previousRenderChild === null || previousRenderChild === void 0 ? void 0 : previousRenderChild.__vdom__;

  if (newVDom instanceof _vdom.MyReactVDom && previousRenderChildVDom instanceof _vdom.MyReactVDom) {
    if (_env.enableKeyDiff.current && newVDom.key !== previousRenderChildVDom.key) return false;
    if (newVDom.__isDynamicNode__ || newVDom.__isPlainNode__) return newVDom.type === previousRenderChildVDom.type;
    if (newVDom.__isObjectNode__) // cause hook error
      return previousRenderChildVDom.__isObjectNode__ && newVDom.type.type === previousRenderChildVDom.type.type;
    if (newVDom.__isEmptyNode__) return previousRenderChildVDom.__isEmptyNode__;
    if (newVDom.__isFragmentNode__) return previousRenderChildVDom.__isFragmentNode__;
  }

  if (newVDom instanceof _vdom.MyReactVDom) return false;
  if (previousRenderChildVDom instanceof _vdom.MyReactVDom) return false;
  if (typeof newVDom !== "object") return previousRenderChild && previousRenderChild.__isTextNode__;
  if (newVDom === null) return previousRenderChild === null;
  return false;
}
/**
 *
 * @param {MyReactVDom[]} newChildren
 * @param {MyReactFiberNode[]} previousRenderChildren
 */


function getMatchedRenderChildren(newChildren, previousRenderChildren) {
  if (!_env.isMounted.current) return previousRenderChildren;
  if (!_env.enableKeyDiff.current) return previousRenderChildren;
  const tempRenderChildren = previousRenderChildren.slice(0);
  const assignPreviousRenderChildren = Array(tempRenderChildren.length).fill(null);
  newChildren.forEach((vdom, index) => {
    if (tempRenderChildren.length) {
      if (vdom instanceof _vdom.MyReactVDom && vdom.key !== undefined) {
        const targetIndex = tempRenderChildren.findIndex(fiber => fiber instanceof _fiber.MyReactFiberNode && fiber.key === vdom.key);

        if (targetIndex !== -1) {
          assignPreviousRenderChildren[index] = tempRenderChildren[targetIndex];
          tempRenderChildren.splice(targetIndex, 1);
        }
      }
    }
  });
  return assignPreviousRenderChildren.map(v => {
    if (v) return v;
    return tempRenderChildren.shift();
  });
}
/**
 *
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactVDom[]} children
 */


function transformChildrenFiber(parentFiber, _children) {
  var _parentFiber$fiberAlt;

  let index = 0;
  const isNewChildren = !Boolean(parentFiber.fiberAlternate);
  const children = Array.isArray(_children) ? _children : [_children];
  const previousRenderChildren = ((_parentFiber$fiberAlt = parentFiber.fiberAlternate) === null || _parentFiber$fiberAlt === void 0 ? void 0 : _parentFiber$fiberAlt.__renderedChildren__) || [];
  const assignPreviousRenderChildren = getMatchedRenderChildren(children, previousRenderChildren);
  parentFiber.reset();

  while (index < children.length || index < previousRenderChildren.length) {
    const newChild = children[index];
    const previousRenderChild = previousRenderChildren[index];
    const assignPreviousRenderChild = assignPreviousRenderChildren[index];
    const isSameType = _env.isMounted.current && isSameTypeNode(newChild, assignPreviousRenderChild);
    const newFiber = isNewChildren ? getNewFiberWithInitial(newChild, parentFiber) : getNewFiberWithUpdate(newChild, parentFiber, previousRenderChild, assignPreviousRenderChild, isSameType);

    parentFiber.__renderedChildren__.push(newFiber);

    index++;
  }

  return parentFiber.children;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkFunctionComponent(fiber) {
  _env.currentHookDeepIndex.current = 0;
  _env.currentFunctionFiber.current = fiber;

  const children = fiber.__vdom__.type(fiber.__vdom__.props);

  _env.currentHookDeepIndex.current = 0;
  _env.currentFunctionFiber.current = null;
  fiber.__vdom__.__dynamicChildren__ = children;
  return nextWorkCommon(fiber);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkClassComponent(fiber) {
  if (!fiber.instance) {
    return (0, _component.classComponentMount)(fiber);
  } else {
    return (0, _component.classComponentUpdate)(fiber);
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkComponent(fiber) {
  if (fiber.initial || fiber.__needUpdate__) {
    if (fiber.__isFunctionComponent__) {
      return nextWorkFunctionComponent(fiber);
    } else {
      return nextWorkClassComponent(fiber);
    }
  }

  return [];
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkCommon(fiber) {
  if (fiber.__vdom__.__dynamicChildren__ !== null) {
    return transformChildrenFiber(fiber, fiber.__vdom__.__dynamicChildren__);
  }

  if (fiber.__vdom__.children !== undefined) {
    return transformChildrenFiber(fiber, fiber.__vdom__.children);
  }

  return [];
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkForwardRef(fiber) {
  const {
    render
  } = fiber.__vdom__.type;
  _env.currentHookDeepIndex.current = 0;
  _env.currentFunctionFiber.current = fiber;
  const children = render(fiber.__vdom__.props, fiber.__vdom__.ref);
  _env.currentHookDeepIndex.current = 0;
  _env.currentFunctionFiber.current = null;
  fiber.__vdom__.__dynamicChildren__ = children;
  return nextWorkCommon(fiber);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkProvider(fiber) {
  // maybe need other way to get provider state
  if (fiber.initial) {
    const listenerFibers = fiber.listeners.map(it => it.__fiber__); // update only alive fiber

    Promise.resolve().then(() => listenerFibers.filter(f => f.mount).forEach(f => f.update()));
  }

  return nextWorkCommon(fiber);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkConsumer(fiber) {
  if (!fiber.instance) {
    fiber.instance = new fiber.__vdom__.type.Internal();
  }

  fiber.instance.updateDependence(fiber);

  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    const providerFiber = fiber.instance.processContext(fiber.__vdom__.type.Context);
    fiber.instance.context = providerFiber.__vdom__.props.value;
  }

  fiber.__vdom__.__dynamicChildren__ = fiber.__vdom__.children(fiber.instance.context);
  return nextWorkCommon(fiber);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkMemo(fiber) {
  // 对于memo组件，只有当前fiber需要运行时才运行
  if (fiber.initial || fiber.__needUpdate__) {
    const {
      render: _render,
      isMyReactForwardRefRender
    } = fiber.__vdom__.type;
    const render = isMyReactForwardRefRender ? _render.render : _render;
    _env.currentHookDeepIndex.current = 0;
    _env.currentFunctionFiber.current = fiber;
    const children = isMyReactForwardRefRender ? render(fiber.__vdom__.props, fiber.__vdom__.ref) : render(fiber.__vdom__.props);
    _env.currentHookDeepIndex.current = 0;
    _env.currentFunctionFiber.current = null;
    fiber.__vdom__.__dynamicChildren__ = children;
    return nextWorkCommon(fiber);
  } else {
    return [];
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkObject(fiber) {
  if (fiber.__isForwardRef__) return nextWorkForwardRef(fiber);
  if (fiber.__isContextProvider__) return nextWorkProvider(fiber);
  if (fiber.__isContextConsumer__) return nextWorkConsumer(fiber);
  if (fiber.__isPortal__) return nextWorkCommon(fiber);
  if (fiber.__isMemo__) return nextWorkMemo(fiber);
  throw new Error("unknown element");
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWork(fiber) {
  // maybe need warning for this
  if (!fiber.mount) return [];
  _env.currentRunningFiber.current = fiber;
  let children = [];
  if (fiber.__isDynamicNode__) children = nextWorkComponent(fiber);else if (fiber.__isObjectNode__) children = nextWorkObject(fiber);else if (!fiber.__isTextNode__) children = nextWorkCommon(fiber);
  _env.currentRunningFiber.current = null;
  fiber.updated();
  return children;
}
},{"./component.js":1,"./env.js":6,"./fiber.js":7,"./tools.js":14,"./unmount.js":15,"./vdom.js":17}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDom = createDom;
exports.render = render;
exports.updateDom = updateDom;

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _render = require("./render.js");

var _tools = require("./tools.js");

class HighLight {
  /**
   * @type HighLight
   */
  static instance = undefined;
  /**
   *
   * @returns HighLight
   */

  static getHighLightInstance = () => {
    HighLight.instance = HighLight.instance || new HighLight();
    return HighLight.instance;
  };
  map = [];
  range = document.createRange();
  /**
   * @type MyReactFiberNode[]
   */

  pendingUpdate = [];
  container = null;

  constructor() {
    // if (enableHighLight.current) {
    this.container = document.createElement("div");
    this.container.style.cssText = `
      position: absolute;
      z-index: 999999;
      width: 100%;
      left: 0;
      top: 0;
      `;
    document.body.append(this.container); // }
  }

  createHighLight = () => {
    const element = document.createElement("div");
    this.container.append(element);
    return element;
  };
  getHighLight = () => {
    if (this.map.length) {
      const element = this.map.shift();
      return element;
    }

    return this.createHighLight();
  };
  /**
   *
   * @param {MyReactFiberNode} fiber
   */

  highLight = fiber => {
    if ((_env.enableHighLight.current || window.__highlight__) && fiber.dom) {
      if (!fiber.dom.__pendingHighLight__) {
        fiber.dom.__pendingHighLight__ = true;
        this.startHighLight(fiber);
      }
    }
  };
  startHighLight = fiber => {
    this.pendingUpdate.push(fiber);
    this.flashPending();
  };
  flashPending = cb => {
    Promise.resolve().then(() => {
      const allFiber = this.pendingUpdate.slice(0);
      this.pendingUpdate = [];
      const allWrapper = [];
      allFiber.forEach(f => {
        const wrapperDom = this.getHighLight();
        allWrapper.push(wrapperDom);
        f.__isTextNode__ ? this.range.selectNodeContents(f.dom) : this.range.selectNode(f.dom);
        const rect = this.range.getBoundingClientRect();
        const left = parseInt(rect.left) + parseInt(document.scrollingElement.scrollLeft);
        const top = parseInt(rect.top) + parseInt(document.scrollingElement.scrollTop);
        const width = parseInt(rect.width) + 4;
        const height = parseInt(rect.height) + 4;
        const positionLeft = left - 2;
        const positionTop = top - 2;
        wrapperDom.style.cssText = `
          position: absolute;
          width: ${width}px;
          height: ${height}px;
          left: ${positionLeft}px;
          top: ${positionTop}px;
          pointer-events: none;
          box-shadow: 0.0625rem 0.0625rem 0.0625rem red, -0.0625rem -0.0625rem 0.0625rem red;
          `;
      });
      setTimeout(() => {
        allWrapper.forEach(wrapperDom => {
          wrapperDom.style.boxShadow = "none";
          this.map.push(wrapperDom);
        });
        allFiber.forEach(f => f.dom.__pendingHighLight__ = false);
      }, 100);
    });
  };
}

var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};
/**
 *
 * @param {HTMLElement} element
 * @param {{[k: string]: any}} oldProps
 * @param {{[k: string]: any}} newProps
 * @param {MyReactFiberNode} fiber
 * @returns
 */

function updateDom(element, oldProps, newProps, fiber) {
  if (fiber.__isTextNode__) {
    element.textContent = fiber.__vdom__;
  } else if (fiber.__isPlainNode__) {
    Object.keys(oldProps).filter(_tools.isEvent).filter(key => (0, _tools.isGone)(newProps)(key) || (0, _tools.isNew)(oldProps, newProps)(key)).forEach(key => {
      const eventName = (0, _tools.getNativeEventName)(key.slice(2));
      element.removeEventListener(eventName, oldProps[key]);
    });
    Object.keys(oldProps).filter(_tools.isProperty).filter((0, _tools.isGone)(newProps)).forEach(key => {
      if (key === "className") {
        element[key] = "";
      } else {
        element.removeAttribute(key);
      }
    });
    Object.keys(oldProps).filter(_tools.isStyle).forEach(styleKey => {
      Object.keys(oldProps[styleKey] || _env.empty).filter((0, _tools.isGone)(newProps[styleKey] || _env.empty)).forEach(styleName => {
        element.style[styleName] = "";
      });
    });
    Object.keys(newProps).filter(_tools.isProperty).filter((0, _tools.isNew)(oldProps, newProps)).forEach(key => {
      if (key === "className") {
        element[key] = newProps[key];
      } else {
        element.setAttribute(key, newProps[key]);
      }
    });
    Object.keys(newProps).filter(_tools.isEvent).filter((0, _tools.isNew)(oldProps, newProps)).forEach(key => {
      const eventName = (0, _tools.getNativeEventName)(key.slice(2));
      element.addEventListener(eventName, newProps[key]);
    });
    Object.keys(newProps).filter(_tools.isStyle).forEach(styleKey => {
      Object.keys(newProps[styleKey] || {}).filter((0, _tools.isNew)(oldProps[styleKey] || _env.empty, newProps[styleKey])).forEach(styleName => {
        if (!isUnitlessNumber[styleName]) {
          if (typeof newProps[styleKey][styleName] === "number") {
            element.style[styleName] = `${newProps[styleKey][styleName]}px`;
            return;
          }
        }

        element.style[styleName] = newProps[styleKey][styleName];
      });
    });
  }

  if (_env.isMounted.current && (_env.enableHighLight.current || window.__highlight__)) {
    HighLight.getHighLightInstance().highLight(fiber);
  }

  return element;
}

function createDom(fiber) {
  const dom = fiber.__isTextNode__ ? document.createTextNode(fiber.__vdom__) : document.createElement(fiber.__vdom__.type);
  updateDom(dom, _env.empty, fiber.__isTextNode__ ? _env.empty : fiber.__vdom__.props, fiber);
  return dom;
}

function render(element, container) {
  _env.rootContainer.current = container;
  Array.from(container.children).forEach(n => n.remove());
  const rootElement = element;

  const _rootFiber = (0, _fiber.createFiberNode)({
    deepIndex: 0,
    dom: container
  }, rootElement);

  _rootFiber.__root__ = true;
  _env.rootFiber.current = _rootFiber;
  container.setAttribute("render", "MyReact");
  container.__vdom__ = rootElement;
  container.__fiber__ = _rootFiber;
  (0, _render.startRender)(_rootFiber);
}
},{"./env.js":6,"./fiber.js":7,"./render.js":12,"./tools.js":14}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushEffect = pushEffect;
exports.pushLayoutEffect = pushLayoutEffect;
exports.runEffect = runEffect;
exports.runLayoutEffect = runLayoutEffect;

var _env = require("./env.js");

var _fiber = require("./fiber.js");

function prepareEffectArray(effectArray, index) {
  effectArray[index] = effectArray[index] || [];
  return effectArray[index];
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {Function} effect
 */


function pushLayoutEffect(fiber, effect) {
  prepareEffectArray(_env.pendingLayoutEffectArray.current, fiber.deepIndex).push(effect);
}

function runLayoutEffect() {
  const allLayoutEffectArray = _env.pendingLayoutEffectArray.current.slice(0);

  for (let i = allLayoutEffectArray.length - 1; i >= 0; i--) {
    const effectArray = allLayoutEffectArray[i];

    if (Array.isArray(effectArray) && effectArray.length) {
      effectArray.forEach(effect => {
        if (typeof effect === "function") {
          effect();
        } else {
          effect.__pendingEffect__ = false;
          effect.effect = false;
          effect.cancel && effect.cancel();
          effect.cancel = effect.value();
        }
      });
    }
  }

  _env.pendingLayoutEffectArray.current = [];
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {Function} effect
 */


function pushEffect(fiber, effect) {
  prepareEffectArray(_env.pendingEffectArray.current, fiber.deepIndex).push(effect);
}

function runEffect() {
  const allEffectArray = _env.pendingEffectArray.current.slice(0);

  if (allEffectArray.length) {
    setTimeout(() => {
      for (let i = allEffectArray.length - 1; i >= 0; i--) {
        const effectArray = allEffectArray[i];

        if (Array.isArray(effectArray)) {
          effectArray.forEach(effect => {
            effect.__pendingEffect__ = false;
            effect.effect = false;
            effect.cancel && effect.cancel();
            effect.cancel = effect.value();
          });
        }
      }
    });
  }

  _env.pendingEffectArray.current = [];
}
},{"./env.js":6,"./fiber.js":7}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContext = createContext;
exports.createPortal = createPortal;
exports.forwardRef = forwardRef;
exports.memo = memo;

var _share = require("./share.js");

var _tools = require("./tools.js");

var _vdom = require("./vdom.js");

function createPortal(element, container) {
  return (0, _vdom.createElement)({
    type: _tools.Portal
  }, {
    container
  }, element);
}

function createContext(value) {
  const ContextObject = {
    type: _tools.Context
  };
  const ProviderObject = {
    type: _tools.Provider,
    value
  };
  const ConsumerObject = {
    type: _tools.Consumer,
    Internal: _share.MyReactInstance
  };
  Object.defineProperty(ConsumerObject, "Context", {
    get() {
      return ContextObject;
    },

    enumerable: false,
    configurable: false
  });
  Object.defineProperty(ProviderObject, "Context", {
    get() {
      return ContextObject;
    },

    enumerable: false,
    configurable: false
  });
  ContextObject.Provider = ProviderObject;
  ContextObject.Consumer = ConsumerObject;
  return ContextObject;
}

function forwardRef(ForwardRefRender) {
  return {
    type: _tools.ForwardRef,
    render: ForwardRefRender
  };
}

function memo(MemoRender) {
  const MemoObject = {
    type: _tools.Memo,
    render: MemoRender
  };
  Object.defineProperty(MemoObject, "isMyReactMemoComponent", {
    get() {
      return true;
    },

    enumerable: false,
    configurable: false
  });
  Object.defineProperty(MemoObject, "isMyReactForwardRefRender", {
    get() {
      return typeof MemoRender === "object" && MemoRender.type === _tools.ForwardRef;
    },

    enumerable: false,
    configurable: false
  });
  return MemoObject;
}
},{"./share.js":13,"./tools.js":14,"./vdom.js":17}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rootFiber = exports.rootContainer = exports.pendingUpdateFiberArray = exports.pendingUnmountFiberArray = exports.pendingPositionFiberArray = exports.pendingModifyFiberArray = exports.pendingLayoutEffectArray = exports.pendingEffectArray = exports.nextTransformFiberArray = exports.needLoop = exports.isMounted = exports.enableKeyDiff = exports.enableHighLight = exports.enableDebugLog = exports.enableAsyncUpdate = exports.enableAllCheck = exports.empty = exports.currentTransformFiberArray = exports.currentRunningFiber = exports.currentHookDeepIndex = exports.currentFunctionFiber = exports.asyncUpdateTimeStep = exports.asyncUpdateTimeLimit = void 0;

var _tools = require("./tools.js");

const empty = {};
exports.empty = empty;
const asyncUpdateTimeLimit = 16;
exports.asyncUpdateTimeLimit = asyncUpdateTimeLimit;
const needLoop = (0, _tools.createRef)(false);
exports.needLoop = needLoop;
const rootFiber = (0, _tools.createRef)(null);
exports.rootFiber = rootFiber;
const rootContainer = (0, _tools.createRef)(null);
exports.rootContainer = rootContainer;
const currentRunningFiber = (0, _tools.createRef)(null);
exports.currentRunningFiber = currentRunningFiber;
const isMounted = (0, _tools.createRef)(false);
exports.isMounted = isMounted;
const enableKeyDiff = (0, _tools.createRef)(true);
exports.enableKeyDiff = enableKeyDiff;
const enableHighLight = (0, _tools.createRef)(false);
exports.enableHighLight = enableHighLight;
const enableDebugLog = (0, _tools.createRef)(false);
exports.enableDebugLog = enableDebugLog;
const enableAllCheck = (0, _tools.createRef)(true);
exports.enableAllCheck = enableAllCheck;
const enableAsyncUpdate = (0, _tools.createRef)(true);
exports.enableAsyncUpdate = enableAsyncUpdate;
const asyncUpdateTimeStep = (0, _tools.createRef)(null);
exports.asyncUpdateTimeStep = asyncUpdateTimeStep;
const currentHookDeepIndex = (0, _tools.createRef)(0);
exports.currentHookDeepIndex = currentHookDeepIndex;
const currentFunctionFiber = (0, _tools.createRef)(null);
exports.currentFunctionFiber = currentFunctionFiber;
const nextTransformFiberArray = (0, _tools.createRef)([]);
exports.nextTransformFiberArray = nextTransformFiberArray;
const currentTransformFiberArray = (0, _tools.createRef)([]);
exports.currentTransformFiberArray = currentTransformFiberArray;
const pendingLayoutEffectArray = (0, _tools.createRef)([]);
exports.pendingLayoutEffectArray = pendingLayoutEffectArray;
const pendingEffectArray = (0, _tools.createRef)([]);
exports.pendingEffectArray = pendingEffectArray;
const pendingModifyFiberArray = (0, _tools.createRef)([]);
exports.pendingModifyFiberArray = pendingModifyFiberArray;
const pendingUpdateFiberArray = (0, _tools.createRef)([]);
exports.pendingUpdateFiberArray = pendingUpdateFiberArray;
const pendingUnmountFiberArray = (0, _tools.createRef)([]);
exports.pendingUnmountFiberArray = pendingUnmountFiberArray;
const pendingPositionFiberArray = (0, _tools.createRef)([]);
exports.pendingPositionFiberArray = pendingPositionFiberArray;
},{"./tools.js":14}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyReactFiberNode = void 0;
exports.createFiberNode = createFiberNode;
exports.createFiberNodeWithPosition = createFiberNodeWithPosition;
exports.createFiberNodeWithUpdate = createFiberNodeWithUpdate;
exports.createFiberNodeWithUpdateAndPosition = createFiberNodeWithUpdateAndPosition;
exports.updateFiberNode = updateFiberNode;
exports.updateFiberNodeWithPosition = updateFiberNodeWithPosition;

var _component = require("./component.js");

var _dom = require("./dom.js");

var _env = require("./env.js");

var _hook = require("./hook.js");

var _position = require("./position.js");

var _share = require("./share.js");

var _update = require("./update.js");

var _vdom = require("./vdom.js");

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function pushFiber(fiber) {
  if (!fiber.__needUpdate__) {
    fiber.__needUpdate__ = true;
    fiber.fiberAlternate = fiber;

    _env.pendingModifyFiberArray.current.push(fiber);
  }

  (0, _update.asyncUpdate)();
}

class MyReactFiberInternalInstance extends _share.MyReactTypeInternalInstance {
  __INTERNAL_DIFF__ = {
    __diffMount__: false,

    /**
     * @type MyReactFiberNode
     */
    __diffPrevRender__: null,

    /**
     * @type MyReactFiberNode[]
     */
    __renderedChildren__: [],
    __renderedCount__: 1,
    __updateTimeStep__: Date.now(),
    __lastUpdateTimeStep__: null
  };
  __INTERNAL_STATE__ = {
    __pendingUpdate__: false,
    __pendingUnmount__: false,
    __pendingPosition__: false
  };

  get __diffMount__() {
    return this.__INTERNAL_DIFF__.__diffMount__;
  }

  set __diffMount__(v) {
    this.__INTERNAL_DIFF__.__diffMount__ = v;
  }

  get __diffPrevRender__() {
    return this.__INTERNAL_DIFF__.__diffPrevRender__;
  }

  set __diffPrevRender__(v) {
    this.__INTERNAL_DIFF__.__diffPrevRender__ = v;
  }

  get __renderedChildren__() {
    return this.__INTERNAL_DIFF__.__renderedChildren__;
  }

  set __renderedChildren__(v) {
    this.__INTERNAL_DIFF__.__renderedChildren__ = v;
  }

  get __pendingUpdate__() {
    return this.__INTERNAL_STATE__.__pendingUpdate__;
  }

  get __pendingPosition__() {
    return this.__INTERNAL_STATE__.__pendingPosition__;
  }

  get __pendingUnmount__() {
    return this.__INTERNAL_STATE__.__pendingUnmount__;
  }

  set __pendingUpdate__(v) {
    this.__INTERNAL_STATE__.__pendingUpdate__ = v;
  }

  set __pendingPosition__(v) {
    this.__INTERNAL_STATE__.__pendingPosition__ = v;
  }

  set __pendingUnmount__(v) {
    this.__INTERNAL_STATE__.__pendingUnmount__ = v;
  }

  get __renderedCount__() {
    return this.__INTERNAL_DIFF__.__renderedCount__;
  }

  set __renderedCount__(v) {
    this.__INTERNAL_DIFF__.__renderedCount__ = v;
  }

}

class MyReactFiberNode extends MyReactFiberInternalInstance {
  mount = true;
  initial = true;
  memoProps = null;
  memoState = null;
  /**
   * @type MyReactFiberNode[]
   */

  children = [];
  /**
   * @type MyReactFiberNode[]
   */

  child = null;
  /**
   * @type MyReactFiberNode
   */

  fiberChildHead = null;
  /**
   * @type MyReactFiberNode
   */

  fiberChildFoot = null;
  /**
   * @type MyReactFiberNode
   */

  fiberParent = null;
  /**
   * @type MyReactFiberNode
   */

  fiberSibling = null;
  /**
   * @type MyReactFiberNode
   */

  fiberAlternate = null;
  /**
   * @type MyReactVDom
   */

  __vdom__ = null;
  __needUpdate__ = false;

  constructor(key, deepIndex,
  /**
   * @type MyReactFiberNode
   */
  fiberParent,
  /**
   * @type MyReactFiberNode
   */
  fiberAlternate, effect, dom,
  /**
   * @type MyReactHookNode
   */
  hookHead,
  /**
   * @type MyReactHookNode
   */
  hookFoot,
  /**
   * @type MyReactHookNode[]
   */
  hookList, listeners,
  /**
   * @type MyReactInstance & MyReactComponent
   */
  instance) {
    super();
    this.key = key;
    this.deepIndex = deepIndex;
    this.fiberParent = fiberParent;
    this.fiberAlternate = fiberAlternate;
    this.effect = effect;
    this.dom = dom;
    this.hookHead = hookHead;
    this.hookFoot = hookFoot;
    this.hookList = hookList;
    this.listeners = listeners;
    this.instance = instance;

    this._initialUpdate();

    this._initialParent();
  }

  _initialUpdate() {
    if (this.fiberAlternate) {
      const {
        fiberAlternate
      } = this;
      fiberAlternate.mount = false;
      fiberAlternate.fiberAlternate = null;
      fiberAlternate.__needUpdate__ = false;
      this.__renderedCount__ = fiberAlternate.__renderedCount__ + 1;
    }
  }

  _initialParent() {
    if (this.fiberParent) {
      this.fiberParent.addChild(this);
    }
  }
  /**
   *
   * @param {MyReactVDom} newVDom
   */


  installVDom(newVDom) {
    this.__vdom__ = newVDom;
    this.key = newVDom.key;

    this._processType();

    this._processDom();

    this._processRef();

    this._processMemoProps();
  }

  _processType() {
    const VDom = this.__vdom__;

    if ((0, _vdom.isValidElement)(VDom)) {
      this._processSucceedType(VDom);

      return;
    }

    if (typeof VDom === "object") {
      this.__INTERNAL_NODE_TYPE__.__isEmptyNode__ = true;
      return;
    }

    this.__INTERNAL_NODE_TYPE__.__isTextNode__ = true;
  }

  _processDom() {
    if (this.__isTextNode__ || this.__isPlainNode__) {
      this.dom = this.dom || (0, _dom.createDom)(this);
    }

    if (this.__isPortal__) {
      this.dom = this.__vdom__.props.container;
    }
  }

  _processRef() {
    if (this.__isPlainNode__) {
      const {
        ref
      } = this.__vdom__;

      if (typeof ref === "object") {
        ref.current = this.dom;
      } else if (typeof ref === "function") {
        ref.call(null, this.dom);
      }
    }
  }

  _processMemoProps() {
    this.memoProps = this.__isTextNode__ ? null : this.__vdom__.props;
  }

  reset() {
    this.fiberChildHead = null;
    this.fiberChildFoot = null;
    this.child = null;
    this.children = [];
    this.__renderedChildren__ = [];
  }

  updated() {
    this.initial = false;
    this.__needUpdate__ = false;
    if (!this.effect) this.fiberAlternate = null;
  }

  updateDiffState() {
    if (this.fiberAlternate) {
      this.__renderedCount__ = this.fiberAlternate.__renderedCount__ + 1;
    } else {
      this.__renderedCount__ = this.__renderedCount__ + 1;
    }
  }

  stopUpdate() {
    const alternate = this.fiberAlternate;

    if (alternate !== this) {
      this.child = alternate.child;
      this.children = alternate.children;
      this.fiberChildHead = alternate.fiberChildHead;
      this.fiberChildFoot = alternate.fiberChildFoot;
      this.__renderedChildren__ = alternate.__renderedChildren__;
      this.children.forEach(child => child.fiberParent = this);
    } else {
      throw new Error("预料之外的错误");
    }
  }
  /**
   *
   * @param {MyReactFiberNode} parentFiber
   */


  installParent(parentFiber) {
    this.fiberParent = parentFiber;
    this.fiberSibling = null;

    this._initialParent();
  }
  /**
   *
   * @param {MyReactComponent & MyReactInstance} instance
   */


  installInstance(instance) {
    this.instance = instance;
  }
  /**
   *
   * @param {MyReactHookNode} hookNode
   */


  installHook(hookNode) {
    this.addHook(hookNode);
  }

  addListener(node) {
    if (this.listeners.every(_node => _node !== node)) {
      this.listeners.push(node);
    }
  }

  removeListener(node) {
    this.listeners = this.listeners.filter(_node => _node !== node);
  }
  /**
   *
   * @param {MyReactFiberNode} childFiber
   */


  addChild(childFiber) {
    this.children.push(childFiber);

    if (!this.child) {
      this.child = childFiber;
      this.fiberChildHead = childFiber;
      this.fiberChildFoot = childFiber;
    } else {
      this.fiberChildFoot.fiberSibling = childFiber;
      this.fiberChildFoot = childFiber;
    }
  }
  /**
   *
   * @param {MyReactHookNode} hookNode
   */


  addHook(hookNode) {
    this.hookList.push(hookNode);

    if (!this.hookHead) {
      this.hookHead = hookNode;
      this.hookFoot = hookNode;
    } else {
      this.hookFoot.hookNext = hookNode;
      hookNode.hookPrev = this.hookFoot;
      this.hookFoot = hookNode;
    }
  }

  update() {
    if (this.mount) {
      pushFiber(this);
    } else {
      console.error("update a unmount fiber");
    }
  }

}
/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: string, dom: HTMLElement, hookHead: MyReactHookNode, hookFoot: MyReactHookNode, hookList: MyReactHookNode[], listeners: MyReactInstance[], instance: MyReactInstance }} param
 * @param {MyReactVDom} newVDom
 * @returns
 */


exports.MyReactFiberNode = MyReactFiberNode;

function createFiberNode({
  key,
  deepIndex,
  fiberParent,
  fiberAlternate,
  effect,
  dom,
  hookHead,
  hookFoot,
  hookList = [],
  listeners = [],
  instance
}, newVDom) {
  const newFiberNode = new MyReactFiberNode(key, deepIndex, fiberParent, fiberAlternate, effect, dom, hookHead, hookFoot, hookList, listeners, instance);
  newFiberNode.installVDom(newVDom);
  newFiberNode.updateDiffState();
  return newFiberNode;
}
/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: string, dom: HTMLElement, hookHead: MyReactHookNode, hookFoot: MyReactHookNode, hookList: MyReactHookNode[], listeners: MyReactInstance[], instance: MyReactInstance }} param
 * @param {MyReactVDom} newVDom
 * @returns
 */


function createFiberNodeWithUpdate({
  key,
  deepIndex,
  fiberParent,
  fiberAlternate,
  effect,
  dom,
  hookHead,
  hookFoot,
  hookList = [],
  listeners = [],
  instance
}, newVDom) {
  const newFiber = createFiberNode({
    key,
    deepIndex,
    fiberParent,
    fiberAlternate,
    effect,
    dom,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance
  }, newVDom);

  if (_env.isMounted.current && newFiber.dom && newFiber.effect) {
    (0, _update.pushUpdate)(newFiber);
  }

  return newFiber;
}
/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: string, dom: HTMLElement, hookHead: MyReactHookNode, hookFoot: MyReactHookNode, hookList: MyReactHookNode[], listeners: MyReactInstance[], instance: MyReactInstance }} param
 * @param {{newVDom: MyReactVDom, previousRenderFiber: MyReactFiberNode}} param
 * @returns
 */


function createFiberNodeWithPosition({
  key,
  deepIndex,
  fiberParent,
  fiberAlternate,
  effect,
  dom,
  hookHead,
  hookFoot,
  hookList = [],
  listeners = [],
  instance
}, {
  newVDom,
  previousRenderFiber
}) {
  const newFiber = createFiberNode({
    key,
    deepIndex,
    fiberParent,
    fiberAlternate,
    effect,
    dom,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance
  }, newVDom);

  if (newFiber.fiberAlternate ? newFiber.fiberAlternate !== previousRenderFiber : newFiber !== previousRenderFiber) {
    (0, _position.processUpdatePosition)(newFiber, previousRenderFiber);
  }

  return newFiber;
}
/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: string, dom: HTMLElement, hookHead: MyReactHookNode, hookFoot: MyReactHookNode, hookList: MyReactHookNode[], listeners: MyReactInstance[], instance: MyReactInstance }} param
 * @param {{newVDom: MyReactVDom, previousRenderFiber: MyReactFiberNode}} param
 * @returns
 */


function createFiberNodeWithUpdateAndPosition({
  key,
  deepIndex,
  fiberParent,
  fiberAlternate,
  effect,
  dom,
  hookHead,
  hookFoot,
  hookList = [],
  listeners = [],
  instance
}, {
  newVDom,
  previousRenderFiber
}) {
  const newFiber = createFiberNodeWithUpdate({
    key,
    deepIndex,
    fiberParent,
    fiberAlternate,
    effect,
    dom,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance
  }, newVDom);

  if (newFiber.fiberAlternate ? newFiber.fiberAlternate !== previousRenderFiber : newFiber !== previousRenderFiber) {
    (0, _position.processUpdatePosition)(newFiber, previousRenderFiber);
  }

  return newFiber;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactVDom} vdom
 */


function updateFiberNode(fiber, parentFiber, vdom) {
  fiber.fiberAlternate = fiber;
  fiber.updateDiffState();
  fiber.installVDom(vdom);
  fiber.installParent(parentFiber);
  return fiber;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactFiberNode} previousRenderFiber
 * @param {MyReactVDom} vdom
 * @returns
 */


function updateFiberNodeWithPosition(fiber, parentFiber, previousRenderFiber, vdom) {
  const newFiber = updateFiberNode(fiber, parentFiber, vdom);

  if (newFiber !== previousRenderFiber) {
    (0, _position.processUpdatePosition)(newFiber, previousRenderFiber);
  }

  return newFiber;
}
},{"./component.js":1,"./dom.js":3,"./env.js":6,"./hook.js":8,"./position.js":10,"./share.js":13,"./update.js":16,"./vdom.js":17}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyReactHookNode = void 0;
exports.useCallback = useCallback;
exports.useContext = useContext;
exports.useDebugValue = useDebugValue;
exports.useEffect = useEffect;
exports.useLayoutEffect = useLayoutEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useState = useState;

var _effect = require("./effect.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _share = require("./share.js");

var _tools = require("./tools.js");

// from react source code
function defaultReducer(state, action) {
  return typeof action === "function" ? action(state) : action;
}

class MyReactHookNode extends _share.MyReactInstance {
  /**
   * @type MyReactHookNode
   */
  hookNext = null;
  /**
   * @type MyReactHookNode
   */

  hookPrev = null;
  /**
   * @type Function
   */

  cancel = null;
  /**
   * @type boolean
   */

  effect = false;
  __pendingEffect__ = false;

  constructor(hookIndex, value, reducer, depArray, hookType) {
    super();
    this.hookIndex = hookIndex;
    this.value = value;
    this.reducer = reducer;
    this.depArray = depArray;
    this.hookType = hookType;

    this._checkValidHook();

    this._initialResult();
  }

  _initialResult() {
    this.result = null;
    this.prevResult = null;
  }

  _checkValidHook() {
    if (this.hookType === "useMemo" || this.hookType === "seEffect" || this.hookType === "useCallback" || this.hookType === "useLayoutEffect") {
      if (typeof this.value !== "function") {
        throw new Error(`${this.hookType} 初始化错误`);
      }
    }

    if (this.hookType === "useContext") {
      if (typeof this.value !== "object" || this.value === null) {
        throw new Error(`${this.hookType} 初始化错误`);
      }
    }
  }

  _getContextValue() {
    const providerFiber = this.processContext(this.value);
    return providerFiber.__vdom__.props.value;
  }

  initialResult() {
    if (this.hookType === "useState" || this.hookType === "useMemo" || this.hookType === "useReducer") {
      this.result = this.value.call(null);
      return;
    }

    if (this.hookType === "useEffect" || this.hookType === "useLayoutEffect") {
      this.effect = true;
      return;
    }

    if (this.hookType === "useCallback" || this.hookType === "useRef") {
      this.result = this.value;
      return;
    }

    if (this.hookType === "useContext") {
      this.result = this._getContextValue();
      return;
    }

    throw new Error("无效的hook");
  }

  update(newAction, newReducer, newDepArray, newHookType, newFiber) {
    this.updateDependence(newFiber);

    if (this.hookType === "useEffect" || this.hookType === "useLayoutEffect" || this.hookType === "useMemo" || this.hookType === "useCallback") {
      if (newDepArray && !this.depArray) {
        throw new Error("依赖状态变更");
      }

      if (!newDepArray && this.depArray) {
        throw new Error("依赖状态变更");
      }
    }

    if (this.hookType === "useEffect" || this.hookType === "useLayoutEffect") {
      if (!newDepArray) {
        this.value = newAction;
        this.effect = true;
      } else if (!(0, _tools.isNormalEqual)(this.depArray, newDepArray)) {
        this.value = newAction;
        this.depArray = newDepArray;
        this.effect = true;
      }
    }

    if (this.hookType === "useCallback") {
      if (!(0, _tools.isNormalEqual)(this.depArray, newDepArray)) {
        this.value = newAction;
        this.prevResult = this.result;
        this.result = newAction;
        this.depArray = newDepArray;
      }
    }

    if (this.hookType === "useMemo") {
      if (!(0, _tools.isNormalEqual)(this.depArray, newDepArray)) {
        this.value = newAction;
        this.prevResult = this.result;
        this.result = newAction.call(null);
        this.depArray = newDepArray;
      }
    }

    if (this.hookType === "useContext") {
      if (!this.__context__.mount || !Object.is(this.value, newAction)) {
        this.value = newAction;
        this.prevResult = this.result;
        this.result = this._getContextValue();
      }
    }

    if (this.hookType === "useReducer") {
      this.value = newAction;
      this.reducer = newReducer;
    }
  }

  dispatch = action => {
    this.prevResult = this.result;
    this.result = this.reducer(this.result, action);

    if (!Object.is(this.result, this.prevResult)) {
      Promise.resolve().then(() => this.__fiber__.update());
    }
  };
}
/**
 *
 * @param {{hookIndex: number, value: any, reducer: Function, depArray: any[], hookType: string}} param
 * @param {MyReactFiberNode} fiber
 */


exports.MyReactHookNode = MyReactHookNode;

function createHookNode({
  hookIndex,
  value,
  reducer,
  depArray,
  hookType
}, fiber) {
  const newHookNode = new MyReactHookNode(hookIndex, value, reducer || defaultReducer, depArray, hookType);
  newHookNode.updateDependence(fiber);
  newHookNode.initialResult();
  fiber.installHook(newHookNode);
  return newHookNode;
}
/**
 *
 * @param {MyReactHookNode} hookNode
 */


function pushHookEffect(hookNode) {
  if (!hookNode.__pendingEffect__) {
    hookNode.__pendingEffect__ = true;

    if (hookNode.hookType === "useEffect") {
      (0, _effect.pushEffect)(hookNode.__fiber__, hookNode);
    } else {
      (0, _effect.pushLayoutEffect)(hookNode.__fiber__, hookNode);
    }
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {number} hookIndex
 * @param {any} value
 * @param {any[]} depArray
 * @param {string} hookType
 */


function getHookNode(fiber, hookIndex, value, reducer, depArray, hookType) {
  if (!fiber) throw new Error("hook使用必须在函数组件中");
  let currentHookNode = null;

  if (fiber.hookList.length > hookIndex) {
    currentHookNode = fiber.hookList[hookIndex];

    if (currentHookNode.hookType !== hookType) {
      throw new Error("\n" + (0, _tools.logHook)(currentHookNode, hookType));
    }

    currentHookNode.update(value, reducer, depArray, hookType, fiber);
  } else if (!fiber.fiberAlternate) {
    // new create
    currentHookNode = createHookNode({
      hookIndex,
      hookType,
      value,
      depArray,
      reducer
    }, fiber);
  } else {
    const temp = {
      hookType: "undefined"
    };
    temp.hookPrev = fiber.hookFoot;
    throw new Error("\n" + (0, _tools.logHook)(temp, hookType));
  }

  if (currentHookNode.effect) {
    pushHookEffect(currentHookNode);
  }

  return currentHookNode;
}

function useState(initialValue) {
  const currentHookNode = getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, typeof initialValue === "function" ? initialValue : () => initialValue, null, null, "useState");
  return [currentHookNode.result, currentHookNode.dispatch];
}

function useEffect(action, depArray) {
  getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, action, null, depArray, "useEffect");
}

function useLayoutEffect(action, depArray) {
  getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, action, null, depArray, "useLayoutEffect");
}

function useCallback(action, depArray) {
  return getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, action, null, depArray, "useCallback").result;
}

function useMemo(action, depArray) {
  return getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, action, null, depArray, "useMemo").result;
}

function useRef(value) {
  return getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, (0, _tools.createRef)(value), null, null, "useRef").result;
}

function useContext(Context) {
  return getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, Context, null, null, "useContext").result;
}

function useReducer(reducer, initialArg, init) {
  const currentHook = getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, typeof init === "function" ? () => init(initialArg) : () => initialArg, reducer, null, "useReducer");
  return [currentHook.result, currentHook.dispatch];
}

function useDebugValue(...args) {
  if (_env.enableDebugLog.current) {
    console.log(`[debug] --> `, `value`, ...args, "\n", `tree:`, (0, _tools.logCurrentRunningFiber)());
  }
}
},{"./effect.js":4,"./env.js":6,"./fiber.js":7,"./share.js":13,"./tools.js":14}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mountStart = mountStart;

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _tools = require("./tools.js");

var _update = require("./update.js");

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
function mountLoop(currentFiber, parentDom) {
  if (currentFiber && currentFiber.mount) {
    (0, _update.commitUpdate)(currentFiber, parentDom);
    currentFiber.children.forEach(f => {
      mountLoop(f, currentFiber.dom || parentDom);
    }); // no need use this logic
    // mountLoop(currentFiber.fiberChildHead, currentFiber.dom || parentDom);
    // mountLoop(currentFiber.fiberSibling, parentDom);
  }
}

function mountStart() {
  try {
    mountLoop(_env.rootFiber.current, (0, _tools.getDom)(_env.rootFiber.current.fiberParent, fiber => fiber.fiberParent) || _env.rootContainer.current);
  } catch (e) {
    console.log(e);
  }
}
},{"./env.js":6,"./fiber.js":7,"./tools.js":14,"./update.js":16}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processUpdatePosition = processUpdatePosition;
exports.runPosition = runPosition;

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _tools = require("./tools.js");

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} beforeDom
 * @param {HTMLElement} parentDom
 */
function insertBefore(fiber, beforeDom, parentDom) {
  if (!fiber) throw new Error("意料之外的错误");
  fiber.effect = null;
  if (fiber.__isPortal__) return;

  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    (0, _tools.debuggerFiber)(fiber);
    return parentDom.insertBefore(fiber.dom, beforeDom);
  }

  fiber.children.forEach(f => insertBefore(f, beforeDom, parentDom));
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} parentDom
 */


function append(fiber, parentDom) {
  if (!fiber) throw new Error("意料之外的错误");
  fiber.effect = null;
  if (fiber.__isPortal__) return;

  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    (0, _tools.debuggerFiber)(fiber);
    return parentDom.append(fiber.dom);
  }

  fiber.children.forEach(f => append(f, parentDom));
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function pushPosition(fiber) {
  if (!fiber.__pendingPosition__) {
    fiber.__pendingPosition__ = true;

    _env.pendingPositionFiberArray.current.push(fiber);
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function getPlainNodeDom(fiber) {
  if (fiber.__isPortal__) return null;
  if (fiber.__isPlainNode__ || fiber.__isTextNode__) return fiber.dom;
  return getPlainNodeDom(fiber.child);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function getInsertBeforeDomFromSibling(fiber) {
  const sibling = fiber.fiberSibling;

  if (sibling) {
    return getPlainNodeDom(sibling) || getInsertBeforeDomFromSibling(sibling.fiberSibling);
  } else {
    return null;
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function getInsertBeforeDomFromSiblingAndParent(fiber) {
  const beforeDom = getInsertBeforeDomFromSibling(fiber);
  if (beforeDom) return beforeDom;
  const parentSibling = fiber.fiberParent.fiberSibling;

  if (parentSibling) {
    if (parentSibling.__isPlainNode__ || parentSibling.__isTextNode__) {
      return parentSibling.dom;
    } else if (parentSibling.child) {
      return getInsertBeforeDomFromSiblingAndParent(parentSibling.child);
    } else {
      return null;
    }
  }

  return null;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function commitPosition(fiber) {
  const children = fiber.children;

  for (let i = children.length - 1; i >= 0; i--) {
    const childFiber = children[i];

    if (childFiber.__diffMount__) {
      if (fiber.__isPlainNode__ || fiber.__isPortal__) {
        const beforeDom = getInsertBeforeDomFromSibling(childFiber);

        if (beforeDom) {
          insertBefore(childFiber, beforeDom, fiber.dom);
        } else {
          append(childFiber, fiber.dom);
        }
      } else {
        const beforeDom = getInsertBeforeDomFromSiblingAndParent(childFiber);

        if (beforeDom) {
          insertBefore(childFiber, beforeDom, (0, _tools.getDom)(fiber, f => f.fiberParent) || _env.rootContainer.current);
        } else {
          append(childFiber, (0, _tools.getDom)(fiber, f => f.fiberParent) || _env.rootContainer.current);
        }
      }

      childFiber.__diffMount__ = false;
      childFiber.__diffPrevRender__ = null;
    }
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function runPosition(fiber) {
  const allPositionArray = _env.pendingPositionFiberArray.current.slice(0);

  allPositionArray.forEach(fiber => {
    fiber.__pendingPosition__ = false;
    commitPosition(fiber);
  });
  _env.pendingPositionFiberArray.current = [];
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} previousRenderChild
 */


function processUpdatePosition(fiber, previousRenderChild) {
  if (!fiber.__diffMount__) {
    fiber.__diffMount__ = true;
    fiber.__diffPrevRender__ = previousRenderChild;
    pushPosition(fiber.fiberParent);
  }
}
},{"./env.js":6,"./fiber.js":7,"./tools.js":14}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactDOM = exports.React = void 0;
Object.defineProperty(exports, "cloneElement", {
  enumerable: true,
  get: function () {
    return _vdom.cloneElement;
  }
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _element.createContext;
  }
});
Object.defineProperty(exports, "createPortal", {
  enumerable: true,
  get: function () {
    return _element.createPortal;
  }
});
Object.defineProperty(exports, "createRef", {
  enumerable: true,
  get: function () {
    return _tools.createRef;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "forwardRef", {
  enumerable: true,
  get: function () {
    return _element.forwardRef;
  }
});
Object.defineProperty(exports, "isValidElement", {
  enumerable: true,
  get: function () {
    return _vdom.isValidElement;
  }
});
Object.defineProperty(exports, "memo", {
  enumerable: true,
  get: function () {
    return _element.memo;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _dom.render;
  }
});
Object.defineProperty(exports, "useCallback", {
  enumerable: true,
  get: function () {
    return _hook.useCallback;
  }
});
Object.defineProperty(exports, "useContext", {
  enumerable: true,
  get: function () {
    return _hook.useContext;
  }
});
Object.defineProperty(exports, "useEffect", {
  enumerable: true,
  get: function () {
    return _hook.useEffect;
  }
});
Object.defineProperty(exports, "useLayoutEffect", {
  enumerable: true,
  get: function () {
    return _hook.useLayoutEffect;
  }
});
Object.defineProperty(exports, "useMemo", {
  enumerable: true,
  get: function () {
    return _hook.useMemo;
  }
});
Object.defineProperty(exports, "useRef", {
  enumerable: true,
  get: function () {
    return _hook.useRef;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function () {
    return _hook.useState;
  }
});

var _component = require("./component.js");

var _dom = require("./dom.js");

var _element = require("./element.js");

var _hook = require("./hook.js");

var _tools = require("./tools.js");

var _vdom = require("./vdom.js");

const ReactDOM = {
  render: _dom.render,
  unstable_batchedUpdates: _tools.safeCall
};
exports.ReactDOM = ReactDOM;
const React = {
  // core
  createElement: _vdom.createElement,
  Component: _component.MyReactComponent,
  PureComponent: _component.MyReactPureComponent,
  // feature
  memo: _element.memo,
  cloneElement: _vdom.cloneElement,
  isValidElement: _vdom.isValidElement,
  createRef: _tools.createRef,
  createContext: _element.createContext,
  createPortal: _element.createPortal,
  forwardRef: _element.forwardRef,
  // element type
  Fragment: _tools.Fragment,
  Portal: _tools.Portal,
  Provider: _tools.Provider,
  Consumer: _tools.Consumer,
  ForwardRef: _tools.ForwardRef,
  // hook
  useState: _hook.useState,
  useEffect: _hook.useEffect,
  useLayoutEffect: _hook.useLayoutEffect,
  useCallback: _hook.useCallback,
  useMemo: _hook.useMemo,
  useContext: _hook.useContext,
  useRef: _hook.useRef,
  useReducer: _hook.useReducer,
  useDebugValue: _hook.useDebugValue,
  Children: {
    map: _tools.mapVDom,
    toArray: _tools.flattenChildren,
    count: _tools.childrenCount,
    forEach: _tools.mapVDom
  }
};
exports.React = React;
window.React = React;
window.ReactDOM = ReactDOM;
Object.keys(React).forEach(key => {
  window[key] = React[key];
});
var _default = React;
exports.default = _default;
},{"./component.js":1,"./dom.js":3,"./element.js":5,"./hook.js":8,"./tools.js":14,"./vdom.js":17}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderLoopAsync = renderLoopAsync;
exports.renderLoopSync = renderLoopSync;
exports.startRender = startRender;

var _core = require("./core.js");

var _effect = require("./effect.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _mount = require("./mount.js");

var _tools = require("./tools.js");

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function transformStart(fiber) {
  _env.currentTransformFiberArray.current.push(...(0, _core.nextWork)(fiber));
}

function transformCurrent() {
  while (_env.currentTransformFiberArray.current.length) {
    const fiber = _env.currentTransformFiberArray.current.shift();

    _env.nextTransformFiberArray.current.push(...(0, _core.nextWork)(fiber));
  }
}

function transformNext() {
  while (_env.nextTransformFiberArray.current.length) {
    const fiber = _env.nextTransformFiberArray.current.shift();

    _env.currentTransformFiberArray.current.push(...(0, _core.nextWork)(fiber));
  }
}

function transformAll() {
  transformCurrent();
  transformNext();

  if (_env.currentTransformFiberArray.current.length) {
    transformAll();
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function renderLoopSync(fiber) {
  transformStart(fiber);
  transformAll();
}
/**
 *
 * @param {() => MyReactFiberNode} getNextFiber
 * @param {() => void} cb
 */


function renderLoopAsync(getNextFiber, cb) {
  (0, _tools.updateAsyncTimeStep)();
  loopAll(getNextFiber, cb);
}
/**
 *
 * @param {() => MyReactFiberNode} getNextFiber
 * @param {() => void} cb
 */


function loopAll(getNextFiber, cb) {
  let shouldYield = false;

  while (!shouldYield) {
    if (_env.currentTransformFiberArray.length || _env.nextTransformFiberArray.current) {
      (0, _tools.safeCall)(transformAll);
    }

    shouldYield = (0, _tools.shouldYieldAsyncUpdateOrNot)();

    if (!shouldYield) {
      const nextStartUpdateFiber = getNextFiber();

      if (nextStartUpdateFiber) {
        (0, _tools.safeCall)(() => transformStart(nextStartUpdateFiber));
      } else {
        shouldYield = true;
      }
    }

    const hasNext = _env.currentTransformFiberArray.current.length || _env.nextTransformFiberArray.current.length;
    shouldYield = shouldYield || !hasNext;
  }

  if (shouldYield) {
    cb();
    (0, _tools.updateAsyncTimeStep)();
  } else {
    loopAll(getNextFiber, cb);
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function startRender(fiber) {
  _env.needLoop.current = true;
  (0, _tools.safeCall)(() => renderLoopSync(fiber));
  (0, _tools.safeCall)(() => (0, _mount.mountStart)());
  (0, _effect.runLayoutEffect)();
  (0, _effect.runEffect)();
  _env.isMounted.current = true;
  _env.needLoop.current = false;
}
},{"./core.js":2,"./effect.js":4,"./env.js":6,"./fiber.js":7,"./mount.js":9,"./tools.js":14}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyReactTypeInternalInstance = exports.MyReactInstance = void 0;

var _tools = require("./tools.js");

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
    const providerFiber = (0, _tools.getContextFiber)(this.__fiber__, ContextObject);
    this.updateDependence(null, providerFiber);

    this.__context__.addListener(this);

    return providerFiber;
  }

}

exports.MyReactInstance = MyReactInstance;
const NODE_TYPE_KEY = ["__isTextNode__", "__isEmptyNode__", "__isPlainNode__", "__isFragmentNode__", "__isObjectNode__", "__isForwardRef__", "__isPortal__", "__isMemo__", "__isContextProvider__", "__isContextConsumer__", "__isDynamicNode__", "__isClassComponent__", "__isFunctionComponent__"];

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
    __isFunctionComponent__: false
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
    Object.keys(props || {}).forEach(key => {
      this.__INTERNAL_NODE_TYPE__[key] = props[key];
    });
  }
  /**
   *
   * @param {TypeHelperInstance} instance
   */


  _processSucceedType(instance) {
    NODE_TYPE_KEY.forEach(key => {
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

exports.MyReactTypeInternalInstance = MyReactTypeInternalInstance;
},{"./tools.js":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNativeEventName = exports.getFiberNodeName = exports.getDom = exports.getContextFiber = exports.flattenChildren = exports.debuggerFiber = exports.createRef = exports.childrenCount = exports.Provider = exports.Portal = exports.Memo = exports.Fragment = exports.ForwardRef = exports.Context = exports.Consumer = void 0;
exports.isEqual = isEqual;
exports.isNew = exports.isGone = exports.isEvent = void 0;
exports.isNormalEqual = isNormalEqual;
exports.updateAsyncTimeStep = exports.shouldYieldAsyncUpdateOrNot = exports.safeCall = exports.mapVDom = exports.mapFiber = exports.map = exports.logHook = exports.logFiber = exports.logCurrentRunningFiber = exports.isStyle = exports.isProperty = void 0;

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _hook = require("./hook.js");

var _vdom = require("./vdom.js");

const isEvent = key => key.startsWith("on");

exports.isEvent = isEvent;

const isProperty = key => key !== "children" && !isEvent(key) && !isStyle(key);

exports.isProperty = isProperty;

const isNew = (oldProps, newProps) => key => oldProps[key] !== newProps[key];

exports.isNew = isNew;

const isGone = newProps => key => !(key in newProps);

exports.isGone = isGone;

const isStyle = key => key === "style";

exports.isStyle = isStyle;
const Memo = Symbol.for("Memo");
exports.Memo = Memo;
const ForwardRef = Symbol.for("ForwardRef");
exports.ForwardRef = ForwardRef;
const Portal = Symbol.for("Portal");
exports.Portal = Portal;
const Fragment = Symbol.for("Fragment");
exports.Fragment = Fragment;
const Context = Symbol.for("Context");
exports.Context = Context;
const Provider = Symbol.for("Context.Provider");
exports.Provider = Provider;
const Consumer = Symbol.for("Context.Consumer");
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {(f: MyReactFiberNode) => MyReactFiberNode} transfer
 * @returns
 */

exports.Consumer = Consumer;

const getDom = (fiber, transfer = fiber => fiber.parent) => {
  if (fiber) {
    if (fiber.dom) {
      return fiber.dom;
    } else {
      return getDom(transfer(fiber), transfer);
    }
  }
};

exports.getDom = getDom;

const createRef = val => ({
  current: val
});
/**
 *
 * @param {MyReactFiberNode} fiber
 */


exports.createRef = createRef;

const getFiberNodeName = fiber => {
  if (fiber.__root__) return "<Root />";
  if (fiber.__isTextNode__) return `<text - (${fiber.__vdom__}) />`;
  if (fiber.__isPlainNode__) return `<${fiber.__vdom__.type} />`;
  if (fiber.__isDynamicNode__) return `<${fiber.__vdom__.type.name || "Unknown"} * />`;
  if (fiber.__isFragmentNode__) return `<Fragment />`;

  if (fiber.__isObjectNode__) {
    if (fiber.__isForwardRef__) return `<ForwardRef />`;
    if (fiber.__isPortal__) return `<Portal />`;
    if (fiber.__isContextProvider__) return `<Provider />`;
    if (fiber.__isContextConsumer__) return `<Consumer />`;
    if (fiber.__isMemo__) return `<Memo />`;
  }

  if (fiber.__isEmptyNode__) return `<Empty />`;
  throw new Error("unknow fiber type");
};
/**
 *
 * @param {MyReactFiberNode} fiber
 */


exports.getFiberNodeName = getFiberNodeName;

const logFiber = fiber => {
  if (fiber) {
    let parent = fiber.fiberParent;
    let res = `fond in --> ${getFiberNodeName(fiber)}`;

    while (parent) {
      res = "".padStart(12) + `${getFiberNodeName(parent)}\n${res}`;
      parent = parent.fiberParent;
    }

    return "\n" + res;
  } else {
    return "";
  }
};

exports.logFiber = logFiber;

const logCurrentRunningFiber = () => logFiber(_env.currentRunningFiber.current);
/**
 *
 * @param {MyReactHookNode} hookNode
 * @param {string} newHookType
 */


exports.logCurrentRunningFiber = logCurrentRunningFiber;

const logHook = (hookNode, newHookType) => {
  let re = "";
  let prevHook = hookNode.hookPrev;

  while (prevHook) {
    re = (prevHook.hookIndex + 1).toString().padEnd(6) + prevHook.hookType.padEnd(20) + prevHook.hookType.padEnd(10) + "\n" + re;
    prevHook = prevHook.hookPrev;
  }

  re = "".padEnd(6) + "-".padEnd(30, "-") + "\n" + re;
  re = "".padEnd(6) + "Previous render".padEnd(20) + "Next render".padEnd(10) + "\n" + re;
  re = re + "--->".padEnd(6) + hookNode.hookType.padEnd(20) + newHookType.padEnd(10);
  return re;
};

exports.logHook = logHook;

const safeCall = action => {
  try {
    return action();
  } catch (e) {
    console.warn("component tree:", logCurrentRunningFiber(), "\n", "-----------------------------------", "\n", e);
    throw e;
  }
};

exports.safeCall = safeCall;

function isNormalEqual(src, target) {
  if (typeof src === "object" && typeof target === "object" && src !== null && target !== null) {
    let flag = true;
    flag = flag && Object.keys(src).length === Object.keys(target).length;

    for (let key in src) {
      flag = flag && Object.is(src[key], target[key]);

      if (!flag) {
        return flag;
      }
    }

    return flag;
  }

  return Object.is(src, target);
}

function isEqual(src, target) {
  if (typeof src === "object" && typeof target === "object" && src !== null && target !== null) {
    let flag = true;
    flag = flag && Object.keys(src).length === Object.keys(target).length;

    for (let key in src) {
      if (key !== "children") {
        flag = flag && isEqual(src[key], target[key]);
      }
    }

    return flag;
  }

  return Object.is(src, target);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @returns {MyReactFiberNode | null}
 */


const getProviderFiber = (fiber, providerObject) => {
  if (fiber) {
    if (fiber.__isObjectNode__ && fiber.__isContextProvider__ && fiber.__vdom__.type === providerObject) {
      return fiber;
    } else {
      return getProviderFiber(fiber.fiberParent, providerObject);
    }
  }
};

const getContextFiber = (fiber, ContextObject) => {
  if (!ContextObject) return;
  if (ContextObject.type !== Context) throw new Error("错误的用法");
  const providerFiber = getProviderFiber(fiber, ContextObject.Provider);
  if (!providerFiber) throw new Error("context need provider");
  return providerFiber;
};

exports.getContextFiber = getContextFiber;

const flattenChildren = arrayLike => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce((p, c) => p.concat(flattenChildren(c)), []);
  }

  return [arrayLike];
};

exports.flattenChildren = flattenChildren;

const map = (arrayLike, judge, action) => {
  const arrayChildren = flattenChildren(arrayLike);
  return arrayChildren.map((v, index, thisArgs) => {
    if (judge(v)) {
      return action.apply(thisArgs, [v, index]);
    } else {
      return v;
    }
  });
};

exports.map = map;

const childrenCount = arrayLike => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce((p, c) => p + childrenCount(c), 0);
  }

  return 1;
};

exports.childrenCount = childrenCount;

const mapVDom = (arrayLike, action) => map(arrayLike, v => v instanceof _vdom.MyReactVDom, action);

exports.mapVDom = mapVDom;

const mapFiber = (arrayLike, action) => map(arrayLike, f => f instanceof _fiber.MyReactFiberNode, action); // in progress


exports.mapFiber = mapFiber;

const getNativeEventName = eventName => {
  if (eventName === "DoubleClick") {
    return "dblclick";
  }

  return eventName.toLowerCase();
};

exports.getNativeEventName = getNativeEventName;

const updateAsyncTimeStep = () => {
  _env.asyncUpdateTimeStep.current = new Date().getTime();
};

exports.updateAsyncTimeStep = updateAsyncTimeStep;

const shouldYieldAsyncUpdateOrNot = () => {
  return new Date().getTime() - _env.asyncUpdateTimeStep.current > _env.asyncUpdateTimeLimit;
};
/**
 *
 * @param {MyReactFiberNode} fiber
 */


exports.shouldYieldAsyncUpdateOrNot = shouldYieldAsyncUpdateOrNot;

const debuggerFiber = fiber => {
  if (fiber !== null && fiber !== void 0 && fiber.dom) {
    fiber.dom.__fiber__ = fiber;
    fiber.dom.__vdom__ = fiber.__vdom__;
    fiber.dom.__children__ = fiber.children;
  }
};

exports.debuggerFiber = debuggerFiber;
},{"./env.js":6,"./fiber.js":7,"./hook.js":8,"./vdom.js":17}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushUnmount = pushUnmount;
exports.runUnmount = runUnmount;

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _tools = require("./tools.js");

/**
 *
 * @param {MyReactFiberNode | MyReactFiberNode[]} fiber
 */
function pushUnmount(fiber) {
  (0, _tools.mapFiber)(fiber, f => {
    if (!f.__pendingUnmount__) {
      f.__pendingUnmount__ = true;

      _env.pendingUnmountFiberArray.current.push(f);
    }
  });
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function clearFiberNode(fiber) {
  fiber.children.forEach(clearFiberNode);
  fiber.hookList.forEach(hook => {
    if (hook.hookType === "useEffect" || hook.hookType === "useLayoutEffect") {
      hook.effect = false;
      hook.cancel && hook.cancel();
    }

    if (hook.hookType === "useContext") {
      hook.__context__.removeListener(hook);
    }
  });

  if (fiber.instance) {
    if (typeof fiber.instance.componentWillUnmount === "function") {
      fiber.instance.componentWillUnmount();
    }

    if (fiber.instance.__context__) {
      fiber.instance.__context__.removeListener(fiber.instance);
    }
  }

  fiber.mount = false;
  fiber.initial = false;
  fiber.__pendingUpdate__ = false;
  fiber.__pendingUnmount__ = false;
  fiber.__pendingPosition__ = false;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function clearFiberDom(fiber) {
  if (fiber.dom) {
    if (!fiber.__isPortal__) {
      fiber.dom.remove();
    } else {
      fiber.children.forEach(clearFiberDom);
    }
  } else {
    fiber.children.forEach(clearFiberDom);
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function runUnmount(fiber) {
  const allUnmountFiberArray = _env.pendingUnmountFiberArray.current.slice(0);

  allUnmountFiberArray.forEach(fiber => {
    fiber.__pendingUnmount__ = false;
    clearFiberNode(fiber);
    clearFiberDom(fiber);
  });
  _env.pendingUnmountFiberArray.current = [];
}
},{"./env.js":6,"./fiber.js":7,"./tools.js":14}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncUpdate = void 0;
exports.commitUpdate = commitUpdate;
exports.pushUpdate = pushUpdate;
exports.runUpdate = runUpdate;

var _dom = require("./dom.js");

var _effect = require("./effect.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _position = require("./position.js");

var _render = require("./render.js");

var _tools = require("./tools.js");

var _unmount = require("./unmount.js");

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
function commitUpdate(currentFiber, parentDom) {
  if (currentFiber.dom) {
    // 新增
    if (currentFiber.effect === "PLACEMENT") {
      parentDom.appendChild(currentFiber.dom); // 更新
    } else if (currentFiber.effect === "UPDATE") {
      (0, _dom.updateDom)(currentFiber.dom, currentFiber.__isTextNode__ ? _env.empty : currentFiber.fiberAlternate.__vdom__.props, currentFiber.__isTextNode__ ? _env.empty : currentFiber.__vdom__.props, currentFiber);
    }

    (0, _tools.debuggerFiber)(currentFiber);
  }

  currentFiber.fiberAlternate = null;
  currentFiber.effect = null;
}

function updateEntry() {
  _env.enableAsyncUpdate.current ? updateAllAsync() : updateAllSync();
}

function getSyncPendingModifyFiberArray() {
  const pendingUpdate = _env.pendingModifyFiberArray.current.slice(0).filter(f => f.__needUpdate__ && f.mount);

  pendingUpdate.sort((f1, f2) => f1.deepIndex - f2.deepIndex > 0 ? 1 : -1);
  _env.pendingModifyFiberArray.current = [];
  return pendingUpdate;
}

function updateAllSync() {
  _env.needLoop.current = true;
  const pendingUpdate = getSyncPendingModifyFiberArray();
  (0, _tools.safeCall)(() => pendingUpdate.forEach(_render.renderLoopSync));
  (0, _position.runPosition)();
  runUpdate();
  (0, _unmount.runUnmount)();
  (0, _effect.runLayoutEffect)();
  (0, _effect.runEffect)();
  _env.needLoop.current = false;
}

function getAsyncPendingModifyNextFiber() {
  while (_env.pendingModifyFiberArray.current.length) {
    const nextFiber = _env.pendingModifyFiberArray.current.shift();

    if (nextFiber.mount && nextFiber.__needUpdate__) {
      return nextFiber;
    }
  }

  return null;
}

function updateAllAsync() {
  _env.needLoop.current = true;
  (0, _render.renderLoopAsync)(getAsyncPendingModifyNextFiber, () => {
    (0, _position.runPosition)();
    runUpdate();
    (0, _unmount.runUnmount)();
    (0, _effect.runLayoutEffect)();
    (0, _effect.runEffect)();
    _env.needLoop.current = false;
  });
}

function updateStart() {
  if (!_env.needLoop.current) {
    updateEntry();
  }
}

const asyncUpdate = () => Promise.resolve().then(updateStart);
/**
 *
 * @param {MyReactFiberNode} fiber
 */


exports.asyncUpdate = asyncUpdate;

function pushUpdate(fiber) {
  if (!fiber.__pendingUpdate__) {
    fiber.__pendingUpdate__ = true;

    _env.pendingUpdateFiberArray.current.push(fiber);
  }
}

function runUpdate() {
  const allUpdateArray = _env.pendingUpdateFiberArray.current.slice(0);

  allUpdateArray.forEach(fiber => {
    fiber.__pendingUpdate__ = false;

    if (fiber.mount) {
      commitUpdate(fiber, (0, _tools.getDom)(fiber.fiberParent, fiber => fiber.fiberParent) || _env.rootContainer.current);
    }
  });
}
},{"./dom.js":3,"./effect.js":4,"./env.js":6,"./fiber.js":7,"./position.js":10,"./render.js":12,"./tools.js":14,"./unmount.js":15}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyReactVDom = void 0;
exports.cloneElement = cloneElement;
exports.createElement = createElement;
exports.isValidElement = isValidElement;

var _env = require("./env.js");

var _share = require("./share.js");

var _tools = require("./tools.js");

class MyReactVDomInternalInstance extends _share.MyReactTypeInternalInstance {
  __INTERNAL_STATE__ = {
    __clonedNode__: null,
    __validKey__: false,
    __validType__: false,
    __dynamicChildren__: null
  };

  get __clonedNode__() {
    return this.__INTERNAL_STATE__.__clonedNode__;
  }

  get __validKey__() {
    return this.__INTERNAL_STATE__.__validKey__;
  }

  get __validType__() {
    return this.__INTERNAL_STATE__.__validType__;
  }

  get __dynamicChildren__() {
    return this.__INTERNAL_STATE__.__dynamicChildren__;
  }

  set __clonedNode__(v) {
    this.__INTERNAL_STATE__.__clonedNode__ = v;
  }

  set __validKey__(v) {
    this.__INTERNAL_STATE__.__validKey__ = v;
  }

  set __validType__(v) {
    this.__INTERNAL_STATE__.__validType__ = v;
  }

  set __dynamicChildren__(v) {
    checkSingleChildrenKey(v);
    this.__INTERNAL_STATE__.__dynamicChildren__ = v;
  }

}

class MyReactVDom extends MyReactVDomInternalInstance {
  constructor(
  /**
   * @type typeof MyReactInstance
   */
  type, props,
  /**
   * @type MyReactVDom[]
   */
  children) {
    super();
    const {
      key,
      ref,
      ...resProps
    } = props || {};
    this.type = type;
    this.key = key;
    this.ref = ref;
    this.props = resProps;
    this.children = children;

    this._processType();

    this._checkValidVDom();
  }

  _processType() {
    let rawType = this.type;

    if (typeof this.type === "object" && this.type !== null) {
      this.__INTERNAL_NODE_TYPE__.__isObjectNode__ = true;
      rawType = this.type.type;
    } // internal element


    switch (rawType) {
      case _tools.Fragment:
        this.__INTERNAL_NODE_TYPE__.__isFragmentNode__ = true;
        return;

      case _tools.Provider:
        this.__INTERNAL_NODE_TYPE__.__isContextProvider__ = true;
        return;

      case _tools.Consumer:
        this.__INTERNAL_NODE_TYPE__.__isContextConsumer__ = true;
        return;

      case _tools.Portal:
        this.__INTERNAL_NODE_TYPE__.__isPortal__ = true;
        return;

      case _tools.Memo:
        this.__INTERNAL_NODE_TYPE__.__isMemo__ = true;
        return;

      case _tools.ForwardRef:
        this.__INTERNAL_NODE_TYPE__.__isForwardRef__ = true;
        return;
    }

    if (typeof rawType === "function") {
      this.__INTERNAL_NODE_TYPE__.__isDynamicNode__ = true;

      if (rawType.prototype.isMyReactComponent) {
        this.__INTERNAL_NODE_TYPE__.__isClassComponent__ = true;
      } else {
        this.__INTERNAL_NODE_TYPE__.__isFunctionComponent__ = true;
      }

      return;
    }

    if (typeof rawType === "string") {
      this.__INTERNAL_NODE_TYPE__.__isPlainNode__ = true;
      return;
    }

    this.__INTERNAL_NODE_TYPE__.__isEmptyNode__ = true;
  }

  _checkValidVDom() {
    // in progress...
    if (_env.enableAllCheck.current && !this.__validType__) {
      if (this.__isContextConsumer__) {
        if (typeof this.children !== "function") {
          throw new Error("Consumer need function as children");
        }
      }

      if (this.__isContextProvider__) {
        if (this.props.value === undefined) {
          throw new Error("Provider need a value props");
        }
      }

      if (this.__isPortal__) {
        if (!this.props.container) {
          throw new Error("createPortal() need a dom container");
        }
      }

      if (this.__isMemo__ || this.__isForwardRef__) {
        if (typeof this.type.render !== "function") {
          if (typeof this.type.render !== "object" || !this.type.render.type) {
            throw new Error("render type must as a function");
          }
        }
      }

      if (this.ref) {
        if (typeof this.ref !== "object" && typeof this.ref !== "function") {
          throw new Error("unSupport ref usage");
        }
      }

      if (typeof this.type === "object") {
        var _this$type;

        console.log(this.type);

        if (!((_this$type = this.type) !== null && _this$type !== void 0 && _this$type.type)) {
          throw new Error("invalid element type");
        }
      }

      if (this.key && typeof this.key !== "string" && typeof this.key !== "number") {
        throw new Error("invalid key props");
      }

      this.__validType__ = true;
    }
  }

}

exports.MyReactVDom = MyReactVDom;

function createVDom({
  type,
  props,
  children
}) {
  return new MyReactVDom(type, props, children || props.children);
}

let keyError = {};
/**
 *
 * @param {MyReactVDom[]} children
 */

function checkValidKey(children) {
  let obj = {};
  let hasLog = false;
  children.forEach(c => {
    if (isValidElement(c) && !c.__validKey__) {
      if (obj[c.key]) {
        if (!hasLog) {
          console.error("array child have duplicate key", (0, _tools.logCurrentRunningFiber)());
        }

        hasLog = true;
      }

      if (c.key === undefined) {
        if (!hasLog) {
          const key = (0, _tools.logCurrentRunningFiber)();

          if (!keyError[key]) {
            keyError[key] = true;
            console.error("each array child must have a unique key props", (0, _tools.logCurrentRunningFiber)());
          }
        }

        hasLog = true;
      } else {
        obj[c.key] = true;
      }

      c.__validKey__ = true;
    }
  });
}
/**
 *
 * @param {MyReactVDom[]} children
 */


const checkArrayChildrenKey = children => {
  if (_env.enableAllCheck.current) {
    children.forEach(child => {
      if (Array.isArray(child)) {
        checkValidKey(child);
      } else if (isValidElement(child)) {
        child.__validKey__ = true;
      }
    });
  }
};
/**
 *
 * @param {MyReactVDom[] | MyReactVDom} children
 */


const checkSingleChildrenKey = children => {
  if (_env.enableAllCheck.current) {
    if (Array.isArray(children)) {
      checkValidKey(children);
    } else if (isValidElement(children)) {
      children.__validKey__ = true;
    }
  }
};

function createElement(type, props, children) {
  const childrenLength = arguments.length - 2;
  props = props || {};

  if (childrenLength > 1) {
    children = Array.from(arguments).slice(2);
    checkArrayChildrenKey(children);
  } else {
    checkSingleChildrenKey(children);
  } // 将children参数自动添加到props中


  if (Array.isArray(children) && children.length || children !== null && children !== undefined) {
    props.children = children;
  }

  return createVDom({
    type,
    props,
    children
  });
}

function cloneElement(element, props, children) {
  if (element instanceof MyReactVDom) {
    const clonedElement = createElement(element.type, Object.assign({}, element.props, {
      key: element.key
    }, {
      ref: element.ref
    }, props), children, ...Array.from(arguments).slice(3));
    clonedElement.__clonedNode__ = true;
    return clonedElement;
  } else {
    return element;
  }
}
/**
 *
 * @param {MyReactVDom | any} element
 * @returns
 */


function isValidElement(element) {
  if (element instanceof MyReactVDom) {
    return true;
  } else {
    return false;
  }
}
},{"./env.js":6,"./share.js":13,"./tools.js":14}]},{},[11]);
