
var allModuleName = {...allModuleName, ...{'../lib/react.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/react.js", 
'./children.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/children.js", 
'./component.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/component.js", 
'./debug.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/debug.js", 
'./dom.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/dom.js", 
'./element.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/element.js", 
'./hook.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/hook.js", 
'./hydrate.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/hydrate.js", 
'./server.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/server.js", 
'./share.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/share.js", 
'./symbol.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/symbol.js", 
'./vdom.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/vdom.js", 
'./env.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/env.js", 
'./fiber.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/fiber.js", 
'./tools.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/tools.js", 
'./core.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/core.js", 
'./effect.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/effect.js", 
'./fiberTool.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/fiberTool.js", 
'./instance.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/instance.js", 
'./domClient.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/domClient.js", 
'./domProps.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/domProps.js", 
'./domServer.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/domServer.js", 
'./domTool.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/domTool.js", 
'./render.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/render.js", 
'./position.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/position.js", 
'./update.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/update.js", 
'./coreTool.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/coreTool.js", 
'./mount.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/mount.js", 
'./domHydrate.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/domHydrate.js", 
'./unmount.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/unmount.js", 
}};
var allModuleContent = {...allModuleContent, ...{'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/react.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = exports.Children = void 0;
Object.defineProperty(exports, "Consumer", {
  enumerable: true,
  get: function get() {
    return _symbol.Consumer;
  }
});
Object.defineProperty(exports, "ForwardRef", {
  enumerable: true,
  get: function get() {
    return _symbol.ForwardRef;
  }
});
Object.defineProperty(exports, "Fragment", {
  enumerable: true,
  get: function get() {
    return _symbol.Fragment;
  }
});
Object.defineProperty(exports, "Portal", {
  enumerable: true,
  get: function get() {
    return _symbol.Portal;
  }
});
Object.defineProperty(exports, "Provider", {
  enumerable: true,
  get: function get() {
    return _symbol.Provider;
  }
});
exports.PureComponent = void 0;
Object.defineProperty(exports, "cloneElement", {
  enumerable: true,
  get: function get() {
    return _vdom.cloneElement;
  }
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function get() {
    return _element.createContext;
  }
});
Object.defineProperty(exports, "createElement", {
  enumerable: true,
  get: function get() {
    return _vdom.createElement;
  }
});
Object.defineProperty(exports, "createPortal", {
  enumerable: true,
  get: function get() {
    return _element.createPortal;
  }
});
Object.defineProperty(exports, "createRef", {
  enumerable: true,
  get: function get() {
    return _share.createRef;
  }
});
exports["default"] = void 0;
Object.defineProperty(exports, "findDOMNode", {
  enumerable: true,
  get: function get() {
    return _dom.findDOMNode;
  }
});
Object.defineProperty(exports, "forwardRef", {
  enumerable: true,
  get: function get() {
    return _element.forwardRef;
  }
});
Object.defineProperty(exports, "hydrate", {
  enumerable: true,
  get: function get() {
    return _hydrate.hydrate;
  }
});
Object.defineProperty(exports, "isValidElement", {
  enumerable: true,
  get: function get() {
    return _vdom.isValidElement;
  }
});
Object.defineProperty(exports, "memo", {
  enumerable: true,
  get: function get() {
    return _element.memo;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function get() {
    return _dom.render;
  }
});
Object.defineProperty(exports, "renderToString", {
  enumerable: true,
  get: function get() {
    return _server.renderToString;
  }
});
exports.unstable_batchedUpdates = void 0;
Object.defineProperty(exports, "useCallback", {
  enumerable: true,
  get: function get() {
    return _hook.useCallback;
  }
});
Object.defineProperty(exports, "useContext", {
  enumerable: true,
  get: function get() {
    return _hook.useContext;
  }
});
Object.defineProperty(exports, "useDebugValue", {
  enumerable: true,
  get: function get() {
    return _hook.useDebugValue;
  }
});
Object.defineProperty(exports, "useEffect", {
  enumerable: true,
  get: function get() {
    return _hook.useEffect;
  }
});
Object.defineProperty(exports, "useImperativeHandle", {
  enumerable: true,
  get: function get() {
    return _hook.useImperativeHandle;
  }
});
Object.defineProperty(exports, "useLayoutEffect", {
  enumerable: true,
  get: function get() {
    return _hook.useLayoutEffect;
  }
});
Object.defineProperty(exports, "useMemo", {
  enumerable: true,
  get: function get() {
    return _hook.useMemo;
  }
});
Object.defineProperty(exports, "useReducer", {
  enumerable: true,
  get: function get() {
    return _hook.useReducer;
  }
});
Object.defineProperty(exports, "useRef", {
  enumerable: true,
  get: function get() {
    return _hook.useRef;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function get() {
    return _hook.useState;
  }
});

var _children = require("./children.js");

var _component = require("./component.js");

var _debug = require("./debug.js");

var _dom = require("./dom.js");

var _element = require("./element.js");

var _hook = require("./hook.js");

var _hydrate = require("./hydrate.js");

var _server = require("./server.js");

var _share = require("./share.js");

var _symbol = require("./symbol.js");

var _vdom = require("./vdom.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var unstable_batchedUpdates = _debug.safeCall;
exports.unstable_batchedUpdates = unstable_batchedUpdates;
var ReactDOM = {
  render: _dom.render,
  hydrate: _hydrate.hydrate,
  findDOMNode: _dom.findDOMNode,
  createPortal: _element.createPortal,
  renderToString: _server.renderToString,
  unstable_batchedUpdates: unstable_batchedUpdates
};
var Children = {
  map: _children.map,
  toArray: _children.toArray,
  count: _children.count,
  forEach: _children.forEach,
  only: _children.only
};
exports.Children = Children;
var Component = _component.MyReactComponent;
exports.Component = Component;
var PureComponent = _component.MyReactPureComponent;
exports.PureComponent = PureComponent;
var React = {
  // core
  createElement: _vdom.createElement,
  Component: Component,
  PureComponent: PureComponent,
  // feature
  memo: _element.memo,
  cloneElement: _vdom.cloneElement,
  isValidElement: _vdom.isValidElement,
  createRef: _share.createRef,
  createContext: _element.createContext,
  forwardRef: _element.forwardRef,
  // element type
  Fragment: _symbol.Fragment,
  Portal: _symbol.Portal,
  Provider: _symbol.Provider,
  Consumer: _symbol.Consumer,
  ForwardRef: _symbol.ForwardRef,
  // hook
  useRef: _hook.useRef,
  useMemo: _hook.useMemo,
  useState: _hook.useState,
  useEffect: _hook.useEffect,
  useReducer: _hook.useReducer,
  useContext: _hook.useContext,
  useCallback: _hook.useCallback,
  useDebugValue: _hook.useDebugValue,
  useLayoutEffect: _hook.useLayoutEffect,
  useImperativeHandle: _hook.useImperativeHandle,
  // children api
  Children: Children
};
globalThis.React = React;
globalThis.ReactDOM = ReactDOM;
Object.keys(React).forEach(function (key) {
  globalThis[key] = React[key];
});

var mixIn = _objectSpread(_objectSpread({}, React), ReactDOM);

var _default = mixIn;
exports["default"] = _default;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/debug.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safeCall = exports.logHook = exports.logFiber = exports.logCurrentRunningFiber = exports.getFiberNodeName = exports.debuggerFiber = void 0;

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _hook = require("./hook.js");

/**
 *
 * @param {MyReactFiberNode} fiber
 */
var trackDevLog = function trackDevLog(fiber) {
  var vdom = fiber.__vdom__;
  var source = vdom.props.__source;

  if (source) {
    var fileName = source.fileName,
        columnNumber = source.columnNumber,
        lineNumber = source.lineNumber;
    return "(".concat(fileName, ":").concat(lineNumber, ")");
  } else {
    return "";
  }
};
/**
 *
 * @param {MyReactFiberNode} fiber
 */


var getFiberNodeName = function getFiberNodeName(fiber) {
  if (fiber.__root__) return "<Root /> ".concat(trackDevLog(fiber));
  if (fiber.__isTextNode__) return "<text - (".concat(fiber.__vdom__, ") />");
  if (fiber.__isPlainNode__) return "<".concat(fiber.__vdom__.type, " /> ").concat(trackDevLog(fiber));
  if (fiber.__isDynamicNode__) return "<".concat(fiber.__vdom__.type.name || "Unknown", " * /> ").concat(trackDevLog(fiber));
  if (fiber.__isFragmentNode__) return "<Fragment /> ".concat(trackDevLog(fiber));

  if (fiber.__isObjectNode__) {
    if (fiber.__isForwardRef__) return "<ForwardRef /> ".concat(trackDevLog(fiber));
    if (fiber.__isPortal__) return "<Portal /> ".concat(trackDevLog(fiber));
    if (fiber.__isContextProvider__) return "<Provider /> ".concat(trackDevLog(fiber));
    if (fiber.__isContextConsumer__) return "<Consumer /> ".concat(trackDevLog(fiber));
    if (fiber.__isMemo__) return "<Memo /> ".concat(trackDevLog(fiber));
  }

  if (fiber.__isEmptyNode__) return "<Empty /> ".concat(trackDevLog(fiber));
  throw new Error("unknow fiber type");
};
/**
 *
 * @param {MyReactFiberNode} fiber
 */


exports.getFiberNodeName = getFiberNodeName;

var logFiber = function logFiber(fiber) {
  if (fiber) {
    var parent = fiber.fiberParent;
    var res = "fond in --> ".concat(getFiberNodeName(fiber));

    while (parent) {
      res = "".padStart(12) + "".concat(getFiberNodeName(parent), "\n").concat(res);
      parent = parent.fiberParent;
    }

    return "\n" + res;
  } else {
    return "";
  }
};

exports.logFiber = logFiber;

var logCurrentRunningFiber = function logCurrentRunningFiber() {
  return logFiber(_env.currentRunningFiber.current);
};
/**
 *
 * @param {MyReactHookNode} hookNode
 * @param {string} newHookType
 */


exports.logCurrentRunningFiber = logCurrentRunningFiber;

var logHook = function logHook(hookNode, newHookType) {
  var re = "";
  var prevHook = hookNode.hookPrev;

  while (prevHook) {
    re = (prevHook.hookIndex + 1).toString().padEnd(6) + prevHook.hookType.padEnd(20) + prevHook.hookType.padEnd(10) + "\n" + re;
    prevHook = prevHook.hookPrev;
  }

  re = "".padEnd(6) + "-".padEnd(30, "-") + "\n" + re;
  re = "".padEnd(6) + "Previous render".padEnd(20) + "Next render".padEnd(10) + "\n" + re;
  re = re + "--->".padEnd(6) + hookNode.hookType.padEnd(20) + newHookType.padEnd(10);
  return re;
};
/**
 *
 * @param {MyReactFiberNode} fiber
 */


exports.logHook = logHook;

var debuggerFiber = function debuggerFiber(fiber) {
  if (fiber !== null && fiber !== void 0 && fiber.dom) {
    fiber.dom.__fiber__ = fiber;
    fiber.dom.__vdom__ = fiber.__vdom__;
    fiber.dom.__children__ = fiber.children;
  }
};

exports.debuggerFiber = debuggerFiber;

var safeCall = function safeCall(action) {
  try {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return action.call.apply(action, [null].concat(args));
  } catch (e) {
    console.error("component tree:", logCurrentRunningFiber(), "\n--------------------------------\n");
    throw e;
  }
};

exports.safeCall = safeCall;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/children.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = exports.only = exports.mapByJudgeFunction = exports.map = exports.forEach = exports.count = void 0;

var _tools = require("./tools.js");

var _vdom = require("./vdom.js");

var mapByJudgeFunction = function mapByJudgeFunction(arrayLike, judge, action) {
  var arrayChildren = (0, _tools.flattenChildren)(arrayLike);
  return arrayChildren.map(function (v, index, thisArgs) {
    if (judge(v)) {
      return action.call(thisArgs, v, index, arrayChildren);
    } else {
      return v;
    }
  });
}; // MyReact Children api, just like React


exports.mapByJudgeFunction = mapByJudgeFunction;

var map = function map(arrayLike, action) {
  return mapByJudgeFunction(arrayLike, function (v) {
    return v instanceof _vdom.MyReactVDom;
  }, action);
};

exports.map = map;

var toArray = function toArray(arrayLike) {
  return map(arrayLike, function (vdom, index) {
    return (0, _vdom.cloneElement)(vdom, {
      key: vdom.key !== undefined ? ".$".concat(vdom.key) : ".".concat(index)
    });
  });
};

exports.toArray = toArray;

var forEach = function forEach(arrayLike, action) {
  mapByJudgeFunction(arrayLike, function (v) {
    return v instanceof _vdom.MyReactVDom;
  }, action);
};

exports.forEach = forEach;

var count = function count(arrayLike) {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce(function (p, c) {
      return p + count(c);
    }, 0);
  }

  return 1;
};

exports.count = count;

var only = function only(child) {
  if (child instanceof _vdom.MyReactVDom) {
    return child;
  }

  throw new Error("Children.only expected to receive a single MyReact element child.");
};

exports.only = only;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/component.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyReactPureComponent = exports.MyReactComponent = void 0;
exports.classComponentMount = classComponentMount;
exports.classComponentUpdate = classComponentUpdate;

var _core = require("./core.js");

var _effect = require("./effect.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _fiberTool = require("./fiberTool.js");

var _instance = require("./instance.js");

var _tools = require("./tools.js");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO more function need defined and improve update class component logic
var COMPONENT_LIFE_CIRCLE_KEY = ["shouldComponentUpdate", "componentDidMount", "componentDidUpdate", "componentWillUnmount"];

var MyReactComponentInternalInstance = /*#__PURE__*/function (_MyReactInstance) {
  _inherits(MyReactComponentInternalInstance, _MyReactInstance);

  var _super = _createSuper(MyReactComponentInternalInstance);

  function MyReactComponentInternalInstance() {
    var _this;

    _classCallCheck(this, MyReactComponentInternalInstance);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "props", void 0);

    _defineProperty(_assertThisInitialized(_this), "context", void 0);

    _defineProperty(_assertThisInitialized(_this), "__prevProps__", null);

    _defineProperty(_assertThisInitialized(_this), "__nextProps__", null);

    _defineProperty(_assertThisInitialized(_this), "__prevContext__", null);

    _defineProperty(_assertThisInitialized(_this), "__nextContext__", null);

    _defineProperty(_assertThisInitialized(_this), "__prevState__", null);

    _defineProperty(_assertThisInitialized(_this), "__nextState__", null);

    _defineProperty(_assertThisInitialized(_this), "__pendingCallback__", []);

    _defineProperty(_assertThisInitialized(_this), "__pendingEffect__", false);

    return _this;
  }

  _createClass(MyReactComponentInternalInstance, [{
    key: "updateInstance",
    value: function updateInstance(newState, newProps, newContext) {
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

      this.__fiber__.memoProps = this.props;
      this.__fiber__.memoState = this.state;
      this.resetNextInstanceState();
    }
  }, {
    key: "resetPrevInstanceState",
    value: function resetPrevInstanceState() {
      this.__prevState__ = null;
      this.__prevProps__ = null;
      this.__prevContext__ = null;
    }
  }, {
    key: "resetNextInstanceState",
    value: function resetNextInstanceState() {
      this.__nextProps__ = null;
      this.__nextState__ = null;
      this.__nextContext__ = null;
    }
  }]);

  return MyReactComponentInternalInstance;
}(_instance.MyReactInstance);

var MyReactComponent = /*#__PURE__*/function (_MyReactComponentInte) {
  _inherits(MyReactComponent, _MyReactComponentInte);

  var _super2 = _createSuper(MyReactComponent);

  function MyReactComponent(props, context) {
    var _this2;

    _classCallCheck(this, MyReactComponent);

    _this2 = _super2.call(this);

    _defineProperty(_assertThisInitialized(_this2), "setState", function (newValue, callback) {
      var newState = newValue;
      if (typeof newValue === "function") newState = newValue(_this2.state, _this2.props); // if there are more than once call setState function

      _this2.__nextState__ = Object.assign({}, _this2.__nextState__, newState);
      if (callback) _this2.__pendingCallback__.push(callback);

      _this2.forceUpdate();
    });

    _defineProperty(_assertThisInitialized(_this2), "forceUpdate", function () {
      Promise.resolve().then(function () {
        return _this2.__fiber__.update();
      });
    });

    _this2.props = props;
    _this2.context = context;
    return _this2;
  }

  _createClass(MyReactComponent, [{
    key: "isMyReactComponent",
    get: function get() {
      return true;
    }
  }]);

  return MyReactComponent;
}(MyReactComponentInternalInstance);

exports.MyReactComponent = MyReactComponent;

var MyReactPureComponent = /*#__PURE__*/function (_MyReactComponent) {
  _inherits(MyReactPureComponent, _MyReactComponent);

  var _super3 = _createSuper(MyReactPureComponent);

  function MyReactPureComponent() {
    _classCallCheck(this, MyReactPureComponent);

    return _super3.apply(this, arguments);
  }

  _createClass(MyReactPureComponent, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      return !(0, _tools.isNormalEqual)(this.props, nextProps) || !(0, _tools.isNormalEqual)(this.state, nextState) || !(0, _tools.isNormalEqual)(this.context, nextContext);
    }
  }]);

  return MyReactPureComponent;
}(MyReactComponent);
/**
 *
 * @param {MyReactFiberNode} fiber
 */


exports.MyReactPureComponent = MyReactPureComponent;

function processStateFromProps(fiber) {
  var Component = fiber.__vdom__.type;
  var newState = null;

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
  var newState = processStateFromProps(fiber);
  fiber.instance.updateInstance(Object.assign({}, fiber.instance.state, newState, fiber.instance.__nextState__));
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processStateFromPropsUpdateLiftCircle(fiber) {
  var newState = processStateFromProps(fiber);
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
    } else if (_typeof(fiber.__vdom__.ref) === "object") {
      fiber.__vdom__.ref.current = fiber.instance;
    }
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentInstanceLifeCircle(fiber) {
  var _Component$contextTyp;

  var Component = fiber.__vdom__.type;
  var providerFiber = (0, _fiberTool.getContextFiber)(fiber, Component.contextType);
  var context = providerFiber ? providerFiber.__vdom__.props.value : (_Component$contextTyp = Component.contextType) === null || _Component$contextTyp === void 0 ? void 0 : _Component$contextTyp.Provider.value;
  var instance = new Component(fiber.__vdom__.props, context); // still inject instance state here once the constructor not set it

  instance.props = fiber.__vdom__.props;
  instance.context = context;
  fiber.installInstance(instance);
  instance.updateDependence(fiber, providerFiber); // once there are not have a Provider

  providerFiber === null || providerFiber === void 0 ? void 0 : providerFiber.addListener(instance);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentRenderLifeCircle(fiber) {
  var children = fiber.instance.render();
  fiber.__vdom__.__dynamicChildren__ = children;
  fiber.__renderDynamic__ = true;
  return (0, _core.nextWorkCommon)(fiber);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentDidMountLiftCircle(fiber) {
  // disable DidMount during SSR
  if (_env.isServerRender.current) return;

  if (!fiber.instance.__pendingEffect__ && fiber.instance.componentDidMount && typeof fiber.instance.componentDidMount === "function") {
    fiber.instance.__pendingEffect__ = true;
    (0, _effect.pushLayoutEffect)(fiber, function () {
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
  fiber.instance.resetPrevInstanceState();
  var children = processComponentRenderLifeCircle(fiber);
  processComponentDidMountLiftCircle(fiber);
  return children;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentContextUpdate(fiber) {
  var Component = fiber.__vdom__.type; // context 更新过

  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    var _Component$contextTyp2;

    var providerFiber = fiber.instance.processContext(Component.contextType);
    return providerFiber ? providerFiber.__vdom__.props.value : (_Component$contextTyp2 = Component.contextType) === null || _Component$contextTyp2 === void 0 ? void 0 : _Component$contextTyp2.Provider.value;
  }

  return fiber.instance.context;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processShouldComponentUpdateLifeCircle(fiber) {
  if (fiber.instance.shouldComponentUpdate && typeof fiber.instance.shouldComponentUpdate === "function") {
    return fiber.instance.shouldComponentUpdate(fiber.instance.__nextProps__, fiber.instance.__nextState__, fiber.instance.__nextContext__);
  }

  return true;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function processComponentDidUpdateLiftCircle(fiber) {
  var hasUpdateLifeCircle = fiber.instance.__pendingCallback__.length || fiber.instance.componentDidUpdate && typeof fiber.instance.componentDidUpdate === "function";

  if (!fiber.instance.__pendingEffect__ && hasUpdateLifeCircle) {
    fiber.instance.__pendingEffect__ = true;
    (0, _effect.pushLayoutEffect)(fiber, function () {
      var allCallback = fiber.instance.__pendingCallback__.slice(0);

      fiber.instance.__pendingCallback__ = [];
      allCallback.forEach(function (c) {
        return c();
      });

      if (fiber.instance.componentDidUpdate) {
        fiber.instance.componentDidUpdate(fiber.instance.__prevProps__, fiber.instance.__prevState__, fiber.instance.__prevContext__);
      }

      fiber.instance.resetPrevInstanceState();
      fiber.instance.__pendingEffect__ = false;
    });
  } else {
    fiber.instance.resetPrevInstanceState();
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function classComponentUpdate(fiber) {
  fiber.instance.updateDependence(fiber);
  var newState = processStateFromPropsUpdateLiftCircle(fiber);
  var newProps = fiber.__vdom__.props;
  var newContext = processComponentContextUpdate(fiber);
  fiber.instance.__nextState__ = newState;
  fiber.instance.__nextProps__ = newProps;
  fiber.instance.__nextContext__ = newContext;
  var shouldUpdate = processShouldComponentUpdateLifeCircle(fiber);
  fiber.instance.updateInstance(newState, newProps, newContext);

  if (shouldUpdate) {
    var children = processComponentRenderLifeCircle(fiber);
    processComponentDidUpdateLiftCircle(fiber);
    return children;
  } else {
    fiber.instance.resetPrevInstanceState();
    fiber.stopUpdate();
    return [];
  }
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/dom.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDom = createDom;
exports.findDOMNode = findDOMNode;
exports.render = render;
exports.updateDom = updateDom;

var _component = require("./component.js");

var _domClient = require("./domClient.js");

var _domProps = require("./domProps.js");

var _domServer = require("./domServer.js");

var _domTool = require("./domTool.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _render = require("./render.js");

var _share = require("./share.js");

var _vdom = require("./vdom.js");

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
    Object.keys(oldProps).filter(_domProps.isEvent).filter(function (key) {
      return (0, _domProps.isGone)(newProps)(key) || (0, _domProps.isNew)(oldProps, newProps)(key);
    }).forEach(function (key) {
      var _getNativeEventName = (0, _domTool.getNativeEventName)(key.slice(2)),
          isCapture = _getNativeEventName.isCapture,
          eventName = _getNativeEventName.eventName;

      fiber.__INTERNAL_EVENT_SYSTEM__.removeEventListener(eventName, oldProps[key], isCapture);
    });
    Object.keys(oldProps).filter(_domProps.isProperty).filter((0, _domProps.isGone)(newProps)).forEach(function (key) {
      if (key === "className" || key === "value") {
        element[key] = "";
      } else {
        element.removeAttribute(key);
      }
    });
    Object.keys(oldProps).filter(_domProps.isStyle).forEach(function (styleKey) {
      Object.keys(oldProps[styleKey] || _env.empty).filter((0, _domProps.isGone)(newProps[styleKey] || _env.empty)).forEach(function (styleName) {
        element.style[styleName] = "";
      });
    });
    Object.keys(newProps).filter(_domProps.isEvent).filter((0, _domProps.isNew)(oldProps, newProps)).forEach(function (key) {
      var _getNativeEventName2 = (0, _domTool.getNativeEventName)(key.slice(2)),
          eventName = _getNativeEventName2.eventName,
          isCapture = _getNativeEventName2.isCapture;

      fiber.__INTERNAL_EVENT_SYSTEM__.addEventListener(eventName, newProps[key], isCapture);
    });
    Object.keys(newProps).filter(_domProps.isProperty).filter((0, _domProps.isNew)(oldProps, newProps)).forEach(function (key) {
      if (key === "className" || key === "value") {
        element[key] = newProps[key];
      } else {
        element.setAttribute(key, newProps[key]);
      }
    });
    Object.keys(newProps).filter(_domProps.isStyle).forEach(function (styleKey) {
      Object.keys(newProps[styleKey] || _env.empty).filter((0, _domProps.isNew)(oldProps[styleKey] || _env.empty, newProps[styleKey])).forEach(function (styleName) {
        if (!_share.isUnitlessNumber[styleName]) {
          if (typeof newProps[styleKey][styleName] === "number") {
            element.style[styleName] = "".concat(newProps[styleKey][styleName], "px");
            return;
          } else {
            element.style[styleName] = newProps[styleKey][styleName];
            return;
          }
        }

        if (newProps[styleKey][styleName] !== null && newProps[styleKey][styleName] !== undefined) {
          element.style[styleName] = newProps[styleKey][styleName];
        } else {
          element.style[styleName] = null;
        }
      });
    });
  }

  if (_env.isMounted.current && !_env.isHydrateRender.current && !_env.isServerRender.current && (_env.enableHighLight.current || window.__highlight__)) {
    _domClient.HighLight.getHighLightInstance().highLight(fiber);
  }

  return element;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @returns
 */


function createDom(fiber) {
  if (_env.isServerRender.current) {
    return (0, _domServer.createServerDom)(fiber);
  } else if (_env.isHydrateRender.current) {
    return null;
  } else {
    return (0, _domClient.createBrowserDom)(fiber);
  }
}
/**
 *
 * @param {MyReactVDom} element
 * @param {HTMLElement} container
 */


function render(element, container) {
  _env.rootContainer.current = container;
  Array.from(container.children).forEach(function (n) {
    return n.remove();
  });
  var rootElement = element;

  var _rootFiber = (0, _fiber.createFiberNode)({
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
/**
 *
 * @param {MyReactComponent} internalInstance
 * @returns
 */


function findDOMNode(internalInstance) {
  if (internalInstance instanceof _component.MyReactComponent) {
    return (0, _domTool.findLatestDomFromComponentFiber)(internalInstance.__fiber__);
  }

  return null;
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/hydrate.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hydrate = hydrate;

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _render = require("./render.js");

var _vdom = require("./vdom.js");

/**
 *
 * @param {MyReactVDom} element
 * @param {HTMLElement} container
 */
function hydrate(element, container) {
  _env.isHydrateRender.current = true;
  _env.rootContainer.current = container;
  var rootElement = element;

  var _rootFiber = (0, _fiber.createFiberNode)({
    deepIndex: 0,
    dom: container
  }, rootElement);

  _rootFiber.__root__ = true;
  _env.rootFiber.current = _rootFiber;
  container.setAttribute("hydrate", "MyReact");
  container.__vdom__ = rootElement;
  container.__fiber__ = _rootFiber;
  (0, _render.startRender)(_rootFiber);
  _env.isHydrateRender.current = false;
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/element.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContext = createContext;
exports.createPortal = createPortal;
exports.forwardRef = forwardRef;
exports.memo = memo;

var _instance = require("./instance.js");

var _symbol = require("./symbol.js");

var _vdom = require("./vdom.js");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function createPortal(element, container) {
  return (0, _vdom.createElement)({
    type: _symbol.Portal
  }, {
    container: container
  }, element);
}

function createContext(value) {
  var ContextObject = {
    type: _symbol.Context,
    // no need get Provider from tree
    __context__: null
  };
  var ProviderObject = {
    type: _symbol.Provider,
    value: value
  };
  var ConsumerObject = {
    type: _symbol.Consumer,
    Internal: _instance.MyReactInstance
  };
  Object.defineProperty(ConsumerObject, "Context", {
    get: function get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false
  });
  Object.defineProperty(ProviderObject, "Context", {
    get: function get() {
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
    type: _symbol.ForwardRef,
    render: ForwardRefRender
  };
}

function memo(MemoRender) {
  var _MemoRender$prototype;

  var MemoObject = {
    type: _symbol.Memo,
    render: (_MemoRender$prototype = MemoRender.prototype) !== null && _MemoRender$prototype !== void 0 && _MemoRender$prototype.isMyReactComponent ? function (props) {
      return (0, _vdom.createElement)(MemoRender, props);
    } : MemoRender
  };
  Object.defineProperty(MemoObject, "isMyReactMemoComponent", {
    get: function get() {
      return true;
    },
    enumerable: false,
    configurable: false
  });
  Object.defineProperty(MemoObject, "isMyReactForwardRefRender", {
    get: function get() {
      return _typeof(MemoRender) === "object" && MemoRender.type === _symbol.ForwardRef;
    },
    enumerable: false,
    configurable: false
  });
  return MemoObject;
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/hook.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyReactHookNode = void 0;
exports.useCallback = useCallback;
exports.useContext = useContext;
exports.useDebugValue = useDebugValue;
exports.useEffect = useEffect;
exports.useImperativeHandle = useImperativeHandle;
exports.useLayoutEffect = useLayoutEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useState = useState;

var _debug = require("./debug.js");

var _effect = require("./effect.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _instance = require("./instance.js");

var _share = require("./share.js");

var _tools = require("./tools.js");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// from react source code
function defaultReducer(state, action) {
  return typeof action === "function" ? action(state) : action;
}

var MyReactHookNode = /*#__PURE__*/function (_MyReactInstance) {
  _inherits(MyReactHookNode, _MyReactInstance);

  var _super = _createSuper(MyReactHookNode);

  /**
   * @type MyReactHookNode
   */

  /**
   * @type MyReactHookNode
   */

  /**
   * @type Function
   */

  /**
   * @type boolean
   */
  function MyReactHookNode(hookIndex, value, reducer, depArray, hookType) {
    var _this;

    _classCallCheck(this, MyReactHookNode);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "hookNext", null);

    _defineProperty(_assertThisInitialized(_this), "hookPrev", null);

    _defineProperty(_assertThisInitialized(_this), "cancel", null);

    _defineProperty(_assertThisInitialized(_this), "effect", false);

    _defineProperty(_assertThisInitialized(_this), "__pendingEffect__", false);

    _defineProperty(_assertThisInitialized(_this), "dispatch", function (action) {
      _this.prevResult = _this.result;
      _this.result = _this.reducer(_this.result, action);

      if (!Object.is(_this.result, _this.prevResult)) {
        Promise.resolve().then(function () {
          return _this.__fiber__.update();
        });
      }
    });

    _this.hookIndex = hookIndex;
    _this.value = value;
    _this.reducer = reducer;
    _this.depArray = depArray;
    _this.hookType = hookType;

    _this._checkValidHook();

    _this._initialResult();

    return _this;
  }

  _createClass(MyReactHookNode, [{
    key: "_initialResult",
    value: function _initialResult() {
      this.result = null;
      this.prevResult = null;
    }
  }, {
    key: "_checkValidHook",
    value: function _checkValidHook() {
      if (this.hookType === "useMemo" || this.hookType === "seEffect" || this.hookType === "useCallback" || this.hookType === "useLayoutEffect") {
        if (typeof this.value !== "function") {
          throw new Error("".concat(this.hookType, " \u521D\u59CB\u5316\u9519\u8BEF"));
        }
      }

      if (this.hookType === "useContext") {
        if (_typeof(this.value) !== "object" || this.value === null) {
          throw new Error("".concat(this.hookType, " \u521D\u59CB\u5316\u9519\u8BEF"));
        }
      }
    }
  }, {
    key: "_getContextValue",
    value: function _getContextValue() {
      var providerFiber = this.processContext(this.value);
      return (providerFiber === null || providerFiber === void 0 ? void 0 : providerFiber.__vdom__.props.value) || this.value.Provider.value;
    }
  }, {
    key: "initialResult",
    value: function initialResult() {
      if (this.hookType === "useState" || this.hookType === "useMemo" || this.hookType === "useReducer") {
        this.result = this.value.call(null);
        return;
      }

      if (this.hookType === "useEffect" || this.hookType === "useLayoutEffect" || this.hookType === "useImperativeHandle") {
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
  }, {
    key: "update",
    value: function update(newAction, newReducer, newDepArray, newHookType, newFiber) {
      this.updateDependence(newFiber);

      if (this.hookType === "useEffect" || this.hookType === "useLayoutEffect" || this.hookType === "useMemo" || this.hookType === "useCallback" || this.hookType === "useImperativeHandle") {
        if (newDepArray && !this.depArray) {
          throw new Error("依赖状态变更");
        }

        if (!newDepArray && this.depArray) {
          throw new Error("依赖状态变更");
        }
      }

      if (this.hookType === "useEffect" || this.hookType === "useLayoutEffect" || this.hookType === "useImperativeHandle") {
        if (!newDepArray) {
          this.value = newAction;
          this.reducer = newReducer || this.reducer;
          this.effect = true;
        } else if (!(0, _tools.isNormalEqual)(this.depArray, newDepArray)) {
          this.value = newAction;
          this.reducer = newReducer || this.reducer;
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
        if (!this.__context__ || !this.__context__.mount || !Object.is(this.value, newAction)) {
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
  }]);

  return MyReactHookNode;
}(_instance.MyReactInstance);
/**
 *
 * @param {{hookIndex: number, value: any, reducer: Function, depArray: any[], hookType: string}} param
 * @param {MyReactFiberNode} fiber
 */


exports.MyReactHookNode = MyReactHookNode;

function createHookNode(_ref, fiber) {
  var hookIndex = _ref.hookIndex,
      value = _ref.value,
      reducer = _ref.reducer,
      depArray = _ref.depArray,
      hookType = _ref.hookType;
  var newHookNode = new MyReactHookNode(hookIndex, value, reducer || defaultReducer, depArray, hookType);
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
    } else if (hookNode.hookType === "useLayoutEffect") {
      (0, _effect.pushLayoutEffect)(hookNode.__fiber__, hookNode);
    } else {
      (0, _effect.pushLayoutEffect)(hookNode.__fiber__, function () {
        if (hookNode.value && _typeof(hookNode.value) === "object") {
          hookNode.value.current = hookNode.reducer.call(null);
        }
      });
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
  var currentHookNode = null;

  if (fiber.hookList.length > hookIndex) {
    currentHookNode = fiber.hookList[hookIndex];

    if (currentHookNode.hookType !== hookType) {
      throw new Error("\n" + (0, _debug.logHook)(currentHookNode, hookType));
    }

    currentHookNode.update(value, reducer, depArray, hookType, fiber);
  } else if (!fiber.fiberAlternate) {
    // new create
    currentHookNode = createHookNode({
      hookIndex: hookIndex,
      hookType: hookType,
      value: value,
      depArray: depArray,
      reducer: reducer
    }, fiber);
  } else {
    var temp = {
      hookType: "undefined"
    };
    temp.hookPrev = fiber.hookFoot;
    throw new Error("\n" + (0, _debug.logHook)(temp, hookType));
  }

  if (!_env.isServerRender.current && currentHookNode.effect) {
    pushHookEffect(currentHookNode);
  }

  return currentHookNode;
}

function useState(initialValue) {
  var currentHookNode = getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, typeof initialValue === "function" ? initialValue : function () {
    return initialValue;
  }, null, null, "useState");
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
  return getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, (0, _share.createRef)(value), null, null, "useRef").result;
}

function useContext(Context) {
  return getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, Context, null, null, "useContext").result;
}

function useReducer(reducer, initialArg, init) {
  var currentHook = getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, typeof init === "function" ? function () {
    return init(initialArg);
  } : function () {
    return initialArg;
  }, reducer, null, "useReducer");
  return [currentHook.result, currentHook.dispatch];
}

function useImperativeHandle(ref, createHandle, deps) {
  getHookNode(_env.currentFunctionFiber.current, _env.currentHookDeepIndex.current++, ref, createHandle, deps, "useImperativeHandle");
}

function useDebugValue() {
  if (_env.enableDebugLog.current) {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (_console = console).log.apply(_console, ["[debug] --> ", "value"].concat(args, ["\n", "tree:", (0, _debug.logCurrentRunningFiber)()]));
  }
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/symbol.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.Portal = exports.Memo = exports.Fragment = exports.ForwardRef = exports.Context = exports.Consumer = void 0;
var Memo = Symbol["for"]("Memo");
exports.Memo = Memo;
var ForwardRef = Symbol["for"]("ForwardRef");
exports.ForwardRef = ForwardRef;
var Portal = Symbol["for"]("Portal");
exports.Portal = Portal;
var Fragment = Symbol["for"]("Fragment");
exports.Fragment = Fragment;
var Context = Symbol["for"]("Context");
exports.Context = Context;
var Provider = Symbol["for"]("Context.Provider");
exports.Provider = Provider;
var Consumer = Symbol["for"]("Context.Consumer");
exports.Consumer = Consumer;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/server.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderToString = renderToString;

var _domServer = require("./domServer.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _render = require("./render.js");

var _vdom = require("./vdom.js");

/**
 *
 * @param {MyReactVDom} element
 * @returns
 */
function renderToString(element) {
  _env.isServerRender.current = true;
  var rootElement = element;
  var container = new _domServer.Element("");
  _env.rootContainer.current = container;

  var _rootFiber = (0, _fiber.createFiberNode)({
    deepIndex: 0,
    dom: container
  }, rootElement);

  _rootFiber.__root__ = true;
  _env.rootFiber.current = _rootFiber;
  (0, _render.startRender)(_rootFiber);
  _env.isServerRender.current = false;
  return _rootFiber.dom.toString();
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/share.js':function anonymous(require,module,exports
) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.singleElement = exports.isUnitlessNumber = exports.createRef = exports.autoSortByDeepIndexFiberArray = exports.MyReactTypeInternalInstance = void 0;

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NODE_TYPE_KEY = ["__isTextNode__", "__isEmptyNode__", "__isPlainNode__", "__isFragmentNode__", "__isObjectNode__", "__isForwardRef__", "__isPortal__", "__isMemo__", "__isContextProvider__", "__isContextConsumer__", "__isDynamicNode__", "__isClassComponent__", "__isFunctionComponent__"];

var MyReactTypeInternalInstance = /*#__PURE__*/function () {
  function MyReactTypeInternalInstance() {
    _classCallCheck(this, MyReactTypeInternalInstance);

    _defineProperty(this, "__INTERNAL_NODE_TYPE__", {
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
    });
  }

  _createClass(MyReactTypeInternalInstance, [{
    key: "_processUpdateType",
    value:
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
    function _processUpdateType(props) {
      var _this = this;

      Object.keys(props || {}).forEach(function (key) {
        _this.__INTERNAL_NODE_TYPE__[key] = props[key];
      });
    }
    /**
     *
     * @param {MyReactTypeInternalInstance} instance
     */

  }, {
    key: "_processSucceedType",
    value: function _processSucceedType(instance) {
      var _this2 = this;

      NODE_TYPE_KEY.forEach(function (key) {
        _this2.__INTERNAL_NODE_TYPE__[key] = instance.__INTERNAL_NODE_TYPE__[key];
      });
    }
    /**
     *
     * @param {MyReactTypeInternalInstance} instance
     */

  }, {
    key: "isSameTypeNode",
    value: function isSameTypeNode(instance) {
      var _this3 = this;

      var result = NODE_TYPE_KEY.every(function (key) {
        return _this3.__INTERNAL_NODE_TYPE__[key] === instance.__INTERNAL_NODE_TYPE__[key];
      });
      return result;
    }
  }, {
    key: "__isTextNode__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isTextNode__;
    }
  }, {
    key: "__isEmptyNode__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isEmptyNode__;
    }
  }, {
    key: "__isPlainNode__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isPlainNode__;
    }
  }, {
    key: "__isFragmentNode__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isFragmentNode__;
    }
  }, {
    key: "__isObjectNode__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isObjectNode__;
    }
  }, {
    key: "__isForwardRef__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isForwardRef__;
    }
  }, {
    key: "__isPortal__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isPortal__;
    }
  }, {
    key: "__isMemo__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isMemo__;
    }
  }, {
    key: "__isContextProvider__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isContextProvider__;
    }
  }, {
    key: "__isContextConsumer__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isContextConsumer__;
    }
  }, {
    key: "__isDynamicNode__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isDynamicNode__;
    }
  }, {
    key: "__isClassComponent__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isClassComponent__;
    }
  }, {
    key: "__isFunctionComponent__",
    get: function get() {
      return this.__INTERNAL_NODE_TYPE__.__isFunctionComponent__;
    }
  }]);

  return MyReactTypeInternalInstance;
}(); // source from react code


exports.MyReactTypeInternalInstance = MyReactTypeInternalInstance;
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
exports.isUnitlessNumber = isUnitlessNumber;
var singleElement = {
  br: true,
  hr: true,
  img: true,
  input: true,
  param: true,
  meta: true,
  link: true
};
exports.singleElement = singleElement;

var createRef = function createRef(val) {
  return {
    current: val
  };
};

exports.createRef = createRef;

var PriorityQueueByArrayAboutJudge = /*#__PURE__*/function (_Array) {
  _inherits(PriorityQueueByArrayAboutJudge, _Array);

  var _super = _createSuper(PriorityQueueByArrayAboutJudge);

  function PriorityQueueByArrayAboutJudge() {
    var _this4;

    var judgeFun = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (o1, o2) {
      return o1 < o2;
    };
    var transferFun = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (it) {
      return it;
    };

    _classCallCheck(this, PriorityQueueByArrayAboutJudge);

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    _this4 = _super.call.apply(_super, [this].concat(args));
    _this4.judgeFun = judgeFun;
    _this4.transferFun = transferFun;

    _this4._init();

    return _this4;
  }

  _createClass(PriorityQueueByArrayAboutJudge, [{
    key: "length",
    get: function get() {
      return this.length;
    }
  }, {
    key: "peek",
    value: function peek() {
      return this[0];
    }
  }, {
    key: "pushValue",
    value: function pushValue(val) {
      this.push(val);
      var current = this.length - 1;
      var pre = (current - 1) / 2 | 0;

      while (pre >= 0 && this.judgeFun(this.transferFun(this[pre]), this.transferFun(this[current]))) {
        this._swap(pre, current);

        current = pre;
        pre = (current - 1) / 2 | 0;
      }
    }
  }, {
    key: "popTop",
    value: function popTop() {
      var re = this[0];
      this[0] = this[this.length - 1];
      this.pop();

      this._heapDown(0);

      return re;
    }
  }, {
    key: "_swap",
    value: function _swap(i, j) {
      var temp = this[i];
      this[i] = this[j];
      this[j] = temp;
    }
  }, {
    key: "_heapDown",
    value: function _heapDown(current) {
      var max = current;
      var left = current * 2 + 1;
      var right = current * 2 + 2;

      if (left < this.length && this.judgeFun(this.transferFun(this[max]), this.transferFun(this[left]))) {
        max = left;
      }

      if (right < this.length && this.judgeFun(this.transferFun(this[max]), this.transferFun(this[right]))) {
        max = right;
      }

      if (max !== current) {
        this._swap(max, current);

        this._heapDown(max);
      }
    }
  }, {
    key: "_init",
    value: function _init() {
      var start = (this.length - 1) / 2 | 0;

      for (var i = start; i >= 0; i--) {
        this._heapDown(i);
      }
    }
  }]);

  return PriorityQueueByArrayAboutJudge;
}( /*#__PURE__*/_wrapNativeSuper(Array));

var autoSortByDeepIndexFiberArray = new PriorityQueueByArrayAboutJudge(function (o1, o2) {
  return o1 > o2;
}, function (fiber) {
  return fiber.deepIndex;
});
exports.autoSortByDeepIndexFiberArray = autoSortByDeepIndexFiberArray;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/vdom.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyReactVDom = void 0;
exports.cloneElement = cloneElement;
exports.createElement = createElement;
exports.isValidElement = isValidElement;

var _debug = require("./debug.js");

var _env = require("./env.js");

var _share = require("./share.js");

var _symbol = require("./symbol.js");

var _excluded = ["key", "ref", "dangerouslySetInnerHTML"];

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MyReactVDomInternalInstance = /*#__PURE__*/function (_MyReactTypeInternalI) {
  _inherits(MyReactVDomInternalInstance, _MyReactTypeInternalI);

  var _super = _createSuper(MyReactVDomInternalInstance);

  function MyReactVDomInternalInstance() {
    var _this;

    _classCallCheck(this, MyReactVDomInternalInstance);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "__INTERNAL_STATE__", {
      __clonedNode__: null,
      __validKey__: false,
      __validType__: false,
      __dynamicChildren__: null
    });

    _defineProperty(_assertThisInitialized(_this), "type", void 0);

    _defineProperty(_assertThisInitialized(_this), "key", void 0);

    _defineProperty(_assertThisInitialized(_this), "ref", void 0);

    _defineProperty(_assertThisInitialized(_this), "props", void 0);

    _defineProperty(_assertThisInitialized(_this), "children", void 0);

    return _this;
  }

  _createClass(MyReactVDomInternalInstance, [{
    key: "__clonedNode__",
    get: function get() {
      return this.__INTERNAL_STATE__.__clonedNode__;
    },
    set: function set(v) {
      this.__INTERNAL_STATE__.__clonedNode__ = v;
    }
  }, {
    key: "__validKey__",
    get: function get() {
      return this.__INTERNAL_STATE__.__validKey__;
    },
    set: function set(v) {
      this.__INTERNAL_STATE__.__validKey__ = v;
    }
  }, {
    key: "__validType__",
    get: function get() {
      return this.__INTERNAL_STATE__.__validType__;
    },
    set: function set(v) {
      this.__INTERNAL_STATE__.__validType__ = v;
    }
  }, {
    key: "__dynamicChildren__",
    get: function get() {
      return this.__INTERNAL_STATE__.__dynamicChildren__;
    },
    set: function set(v) {
      checkSingleChildrenKey(v);
      this.__INTERNAL_STATE__.__dynamicChildren__ = v;
    } // ============= valid check =====================

  }, {
    key: "_processType",
    value: function _processType() {
      var rawType = this.type;

      if (_typeof(this.type) === "object" && this.type !== null) {
        this.__INTERNAL_NODE_TYPE__.__isObjectNode__ = true;
        rawType = this.type.type;
      } // internal element


      switch (rawType) {
        case _symbol.Fragment:
          this.__INTERNAL_NODE_TYPE__.__isFragmentNode__ = true;
          return;

        case _symbol.Provider:
          this.__INTERNAL_NODE_TYPE__.__isContextProvider__ = true;
          return;

        case _symbol.Consumer:
          this.__INTERNAL_NODE_TYPE__.__isContextConsumer__ = true;
          return;

        case _symbol.Portal:
          this.__INTERNAL_NODE_TYPE__.__isPortal__ = true;
          return;

        case _symbol.Memo:
          this.__INTERNAL_NODE_TYPE__.__isMemo__ = true;
          return;

        case _symbol.ForwardRef:
          this.__INTERNAL_NODE_TYPE__.__isForwardRef__ = true;
          return;
      }

      if (typeof rawType === "function") {
        var _rawType$prototype;

        this.__INTERNAL_NODE_TYPE__.__isDynamicNode__ = true;

        if ((_rawType$prototype = rawType.prototype) !== null && _rawType$prototype !== void 0 && _rawType$prototype.isMyReactComponent) {
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
  }, {
    key: "_checkValidVDom",
    value: function _checkValidVDom() {
      // in progress...
      if (_env.enableAllCheck.current && !this.__validType__) {
        if (this.__isContextConsumer__) {
          if (typeof this.children !== "function") {
            throw new Error("Consumer need function as children");
          }
        }

        if (this.__isPortal__) {
          if (!this.props.container) {
            throw new Error("createPortal() need a dom container");
          }
        }

        if (this.__isMemo__ || this.__isForwardRef__) {
          if (typeof this.type.render !== "function") {
            if (_typeof(this.type.render) !== "object" || !this.type.render.type) {
              throw new Error("render type must as a function");
            }
          }
        }

        if (this.__isForwardRef__) {
          var _this$type$render$pro;

          if (typeof this.type.render === "function" && (_this$type$render$pro = this.type.render.prototype) !== null && _this$type$render$pro !== void 0 && _this$type$render$pro.isMyReactComponent) {
            throw new Error("forwardRef need a function component, but get class component");
          }
        }

        if (this.ref) {
          if (_typeof(this.ref) !== "object" && typeof this.ref !== "function") {
            throw new Error("unSupport ref usage");
          }
        }

        if (_typeof(this.type) === "object") {
          var _this$type;

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
  }]);

  return MyReactVDomInternalInstance;
}(_share.MyReactTypeInternalInstance);

var MyReactVDom = /*#__PURE__*/function (_MyReactVDomInternalI) {
  _inherits(MyReactVDom, _MyReactVDomInternalI);

  var _super2 = _createSuper(MyReactVDom);

  function MyReactVDom(type, props, children) {
    var _this2;

    _classCallCheck(this, MyReactVDom);

    _this2 = _super2.call(this);

    var _ref = props || {},
        key = _ref.key,
        ref = _ref.ref,
        dangerouslySetInnerHTML = _ref.dangerouslySetInnerHTML,
        resProps = _objectWithoutProperties(_ref, _excluded);

    _this2.type = type;
    _this2.key = key;
    _this2.ref = ref;
    _this2.props = resProps;
    _this2.children = (dangerouslySetInnerHTML === null || dangerouslySetInnerHTML === void 0 ? void 0 : dangerouslySetInnerHTML.__html) || children;

    _this2._processType();

    _this2._checkValidVDom();

    return _this2;
  }

  return _createClass(MyReactVDom);
}(MyReactVDomInternalInstance);

exports.MyReactVDom = MyReactVDom;

function createVDom(_ref2) {
  var type = _ref2.type,
      props = _ref2.props,
      children = _ref2.children;
  return new MyReactVDom(type, props, children || props.children);
}

var keyError = {};
/**
 *
 * @param {MyReactVDom[]} children
 */

function checkValidKey(children) {
  var obj = {};
  var hasLog = false;
  children.forEach(function (c) {
    if (isValidElement(c) && !c.__validKey__) {
      if (obj[c.key]) {
        if (!hasLog) {
          console.error("array child have duplicate key", (0, _debug.logCurrentRunningFiber)());
        }

        hasLog = true;
      }

      if (c.key === undefined) {
        if (!hasLog) {
          var key = (0, _debug.logCurrentRunningFiber)();

          if (!keyError[key]) {
            keyError[key] = true;
            console.error("each array child must have a unique key props", key);
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


var checkArrayChildrenKey = function checkArrayChildrenKey(children) {
  if (_env.enableAllCheck.current) {
    children.forEach(function (child) {
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


var checkSingleChildrenKey = function checkSingleChildrenKey(children) {
  if (_env.enableAllCheck.current) {
    if (Array.isArray(children)) {
      checkValidKey(children);
    } else if (isValidElement(children)) {
      children.__validKey__ = true;
    }
  }
};

function createElement(type, props, children) {
  var childrenLength = arguments.length - 2;
  props = props || {};

  if (type !== null && type !== void 0 && type.defaultProps) {
    Object.keys(type.defaultProps).forEach(function (propKey) {
      props[propKey] = props[propKey] || type.defaultProps[propKey];
    });
  }

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
    type: type,
    props: props,
    children: children
  });
}

function cloneElement(element, props, children) {
  if (element instanceof MyReactVDom) {
    var clonedElement = createElement.apply(void 0, [element.type, Object.assign({}, element.props, {
      key: element.key
    }, {
      ref: element.ref
    }, props), children].concat(_toConsumableArray(Array.from(arguments).slice(3))));
    clonedElement.__validKey__ = true;
    clonedElement.__validType__ = true;
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
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/env.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rootFiber = exports.rootContainer = exports.pendingUpdateFiberArray = exports.pendingUnmountFiberArray = exports.pendingSyncModifyFiberArray = exports.pendingPositionFiberArray = exports.pendingLayoutEffectArray = exports.pendingEffectArray = exports.pendingAsyncModifyFiberArray = exports.nextTransformFiberArray = exports.needLoop = exports.isServerRender = exports.isMounted = exports.isHydrateRender = exports.enableKeyDiff = exports.enableHighLight = exports.enableEventSystem = exports.enableDebugLog = exports.enableControlComponent = exports.enableAsyncUpdate = exports.enableAllCheck = exports.empty = exports.currentTransformFiberArray = exports.currentRunningFiber = exports.currentHookDeepIndex = exports.currentFunctionFiber = exports.asyncUpdateTimeStep = exports.asyncUpdateTimeLimit = void 0;

var _share = require("./share.js");

var empty = {};
exports.empty = empty;
var asyncUpdateTimeLimit = 14;
exports.asyncUpdateTimeLimit = asyncUpdateTimeLimit;
var needLoop = (0, _share.createRef)(false);
exports.needLoop = needLoop;
var rootFiber = (0, _share.createRef)(null);
exports.rootFiber = rootFiber;
var rootContainer = (0, _share.createRef)(null);
exports.rootContainer = rootContainer;
var currentRunningFiber = (0, _share.createRef)(null);
exports.currentRunningFiber = currentRunningFiber;
var isMounted = (0, _share.createRef)(false);
exports.isMounted = isMounted;
var isServerRender = (0, _share.createRef)(false);
exports.isServerRender = isServerRender;
var isHydrateRender = (0, _share.createRef)(false);
exports.isHydrateRender = isHydrateRender;
var enableKeyDiff = (0, _share.createRef)(true);
exports.enableKeyDiff = enableKeyDiff;
var enableHighLight = (0, _share.createRef)(false);
exports.enableHighLight = enableHighLight;
var enableDebugLog = (0, _share.createRef)(false);
exports.enableDebugLog = enableDebugLog;
var enableAllCheck = (0, _share.createRef)(true);
exports.enableAllCheck = enableAllCheck;
var enableAsyncUpdate = (0, _share.createRef)(true);
exports.enableAsyncUpdate = enableAsyncUpdate;
var enableEventSystem = (0, _share.createRef)(true);
exports.enableEventSystem = enableEventSystem;
var enableControlComponent = (0, _share.createRef)(true);
exports.enableControlComponent = enableControlComponent;
var asyncUpdateTimeStep = (0, _share.createRef)(null);
exports.asyncUpdateTimeStep = asyncUpdateTimeStep;
var currentHookDeepIndex = (0, _share.createRef)(0);
exports.currentHookDeepIndex = currentHookDeepIndex;
var currentFunctionFiber = (0, _share.createRef)(null);
exports.currentFunctionFiber = currentFunctionFiber;
var nextTransformFiberArray = (0, _share.createRef)([]);
exports.nextTransformFiberArray = nextTransformFiberArray;
var currentTransformFiberArray = (0, _share.createRef)([]);
exports.currentTransformFiberArray = currentTransformFiberArray;
var pendingLayoutEffectArray = (0, _share.createRef)([]);
exports.pendingLayoutEffectArray = pendingLayoutEffectArray;
var pendingEffectArray = (0, _share.createRef)([]);
exports.pendingEffectArray = pendingEffectArray;
var pendingSyncModifyFiberArray = (0, _share.createRef)([]);
exports.pendingSyncModifyFiberArray = pendingSyncModifyFiberArray;
var pendingAsyncModifyFiberArray = (0, _share.createRef)(_share.autoSortByDeepIndexFiberArray);
exports.pendingAsyncModifyFiberArray = pendingAsyncModifyFiberArray;
var pendingUpdateFiberArray = (0, _share.createRef)([]);
exports.pendingUpdateFiberArray = pendingUpdateFiberArray;
var pendingUnmountFiberArray = (0, _share.createRef)([]);
exports.pendingUnmountFiberArray = pendingUnmountFiberArray;
var pendingPositionFiberArray = (0, _share.createRef)([]);
exports.pendingPositionFiberArray = pendingPositionFiberArray;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/tools.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenChildren = exports.canNotUpdate = void 0;
exports.isEqual = isEqual;
exports.isNormalEqual = isNormalEqual;
exports.updateAsyncTimeStep = exports.shouldYieldAsyncUpdateOrNot = exports.mapFiber = void 0;

var _children = require("./children.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function isNormalEqual(src, target) {
  if (_typeof(src) === "object" && _typeof(target) === "object" && src !== null && target !== null) {
    var flag = true;
    flag = flag && Object.keys(src).length === Object.keys(target).length;

    for (var key in src) {
      if (!key.startsWith("__")) {
        flag = flag && Object.is(src[key], target[key]);

        if (!flag) {
          return flag;
        }
      }
    }

    return flag;
  }

  return Object.is(src, target);
}

function isEqual(src, target) {
  if (_typeof(src) === "object" && _typeof(target) === "object" && src !== null && target !== null) {
    var flag = true;
    flag = flag && Object.keys(src).length === Object.keys(target).length;

    for (var key in src) {
      if (key !== "children" && !key.startsWith("__")) {
        flag = flag && isEqual(src[key], target[key]);
      }
    }

    return flag;
  }

  return Object.is(src, target);
}

var flattenChildren = function flattenChildren(arrayLike) {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce(function (p, c) {
      return p.concat(flattenChildren(c));
    }, []);
  }

  return [arrayLike];
};

exports.flattenChildren = flattenChildren;

var mapFiber = function mapFiber(arrayLike, action) {
  return (0, _children.mapByJudgeFunction)(arrayLike, function (f) {
    return f instanceof _fiber.MyReactFiberNode;
  }, action);
};

exports.mapFiber = mapFiber;

var updateAsyncTimeStep = function updateAsyncTimeStep() {
  _env.asyncUpdateTimeStep.current = new Date().getTime();
};

exports.updateAsyncTimeStep = updateAsyncTimeStep;

var shouldYieldAsyncUpdateOrNot = function shouldYieldAsyncUpdateOrNot() {
  return new Date().getTime() - _env.asyncUpdateTimeStep.current > _env.asyncUpdateTimeLimit;
};

exports.shouldYieldAsyncUpdateOrNot = shouldYieldAsyncUpdateOrNot;

var canNotUpdate = function canNotUpdate() {
  if (_env.isServerRender.current) throw new Error("can not update component during SSR");
  if (_env.isHydrateRender.current) throw new Error("can not update component during hydrate");
};

exports.canNotUpdate = canNotUpdate;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/fiber.js':function anonymous(require,module,exports
) {
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

var _fiberTool = require("./fiberTool.js");

var _hook = require("./hook.js");

var _instance = require("./instance.js");

var _position = require("./position.js");

var _share = require("./share.js");

var _update = require("./update.js");

var _vdom = require("./vdom.js");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MyReactFiberInternalInstance = /*#__PURE__*/function (_MyReactTypeInternalI) {
  _inherits(MyReactFiberInternalInstance, _MyReactTypeInternalI);

  var _super = _createSuper(MyReactFiberInternalInstance);

  function MyReactFiberInternalInstance() {
    var _this;

    _classCallCheck(this, MyReactFiberInternalInstance);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(_args));

    _defineProperty(_assertThisInitialized(_this), "__INTERNAL_DIFF__", {
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
      __renderDynamic__: false,
      __updateTimeStep__: Date.now(),
      __lastUpdateTimeStep__: null
    });

    _defineProperty(_assertThisInitialized(_this), "__INTERNAL_STATE__", {
      __pendingUpdate__: false,
      __pendingUnmount__: false,
      __pendingPosition__: false
    });

    _defineProperty(_assertThisInitialized(_this), "__INTERNAL_EVENT_STATE__", {});

    _defineProperty(_assertThisInitialized(_this), "__INTERNAL_EVENT_SYSTEM__", {
      addEventListener: function addEventListener(event, cb, isCapture) {
        if (_env.enableEventSystem.current) {
          if (_typeof(isCapture) === "object" && isCapture !== null) {
            throw new Error("event system not support object options, pls use dom.addEventListener(), will improve this later");
          }

          var cacheEventName = "".concat(event, "_").concat(isCapture ? "true" : "false");

          if (_this.__INTERNAL_EVENT_STATE__[cacheEventName]) {
            _this.__INTERNAL_EVENT_STATE__[cacheEventName].cb = cb;
          } else {
            var handler = function handler() {
              if (handler.cb) {
                var _handler$cb;

                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }

                (_handler$cb = handler.cb).call.apply(_handler$cb, [null].concat(args));
              } // support control component


              if (_env.enableControlComponent.current) {
                if (_this.__isPlainNode__ && _this.__vdom__.type === "input" && // todo more event, like change
                event === "input" && "value" in _this.memoProps) {
                  _this.dom["value"] = _this.memoProps["value"];
                }
              }
            };

            handler.cb = cb;
            _this.__INTERNAL_EVENT_STATE__[cacheEventName] = handler;

            _this.dom.addEventListener(event, handler, isCapture);
          }
        } else {
          if (_env.enableControlComponent.current) {
            throw new Error("must enable eventSystem first!");
          }

          _this.dom.addEventListener(event, cb, isCapture);
        }
      },
      removeEventListener: function removeEventListener(event, cb, isCapture) {
        if (_env.enableEventSystem.current) {
          var cacheEventName = "".concat(event, "_").concat(isCapture ? "true" : "false");

          if (!_this.__INTERNAL_EVENT_STATE__[cacheEventName]) {
            throw new Error("can not remove event listener");
          }

          _this.__INTERNAL_EVENT_STATE__[cacheEventName].cb = null;
        } else {
          _this.dom.removeEventListener(event, cb, isCapture);
        }
      }
    });

    return _this;
  }

  _createClass(MyReactFiberInternalInstance, [{
    key: "__diffMount__",
    get: function get() {
      return this.__INTERNAL_DIFF__.__diffMount__;
    },
    set: function set(v) {
      this.__INTERNAL_DIFF__.__diffMount__ = v;
    }
  }, {
    key: "__diffPrevRender__",
    get: function get() {
      return this.__INTERNAL_DIFF__.__diffPrevRender__;
    },
    set: function set(v) {
      this.__INTERNAL_DIFF__.__diffPrevRender__ = v;
    }
  }, {
    key: "__renderedChildren__",
    get: function get() {
      return this.__INTERNAL_DIFF__.__renderedChildren__;
    },
    set: function set(v) {
      this.__INTERNAL_DIFF__.__renderedChildren__ = v;
    }
  }, {
    key: "__renderDynamic__",
    get: function get() {
      return this.__INTERNAL_DIFF__.__renderDynamic__;
    },
    set: function set(v) {
      this.__INTERNAL_DIFF__.__renderDynamic__ = v;
    }
  }, {
    key: "__pendingUpdate__",
    get: function get() {
      return this.__INTERNAL_STATE__.__pendingUpdate__;
    },
    set: function set(v) {
      this.__INTERNAL_STATE__.__pendingUpdate__ = v;
    }
  }, {
    key: "__pendingPosition__",
    get: function get() {
      return this.__INTERNAL_STATE__.__pendingPosition__;
    },
    set: function set(v) {
      this.__INTERNAL_STATE__.__pendingPosition__ = v;
    }
  }, {
    key: "__pendingUnmount__",
    get: function get() {
      return this.__INTERNAL_STATE__.__pendingUnmount__;
    },
    set: function set(v) {
      this.__INTERNAL_STATE__.__pendingUnmount__ = v;
    }
  }, {
    key: "__renderedCount__",
    get: function get() {
      return this.__INTERNAL_DIFF__.__renderedCount__;
    },
    set: function set(v) {
      this.__INTERNAL_DIFF__.__renderedCount__ = v;
    } // =========== event system ===============

  }]);

  return MyReactFiberInternalInstance;
}(_share.MyReactTypeInternalInstance);

var MyReactFiberNode = /*#__PURE__*/function (_MyReactFiberInternal) {
  _inherits(MyReactFiberNode, _MyReactFiberInternal);

  var _super2 = _createSuper(MyReactFiberNode);

  /**
   * @type number
   */

  /**
   * @type string
   */

  /**
   * @type MyReactFiberNode[]
   */

  /**
   * @type MyReactFiberNode[]
   */

  /**
   * @type MyReactFiberNode
   */

  /**
   * @type MyReactFiberNode
   */

  /**
   * @type MyReactFiberNode
   */

  /**
   * @type MyReactFiberNode
   */

  /**
   * @type MyReactFiberNode
   */

  /**
   * @type MyReactHookNode
   */

  /**
   * @type MyReactHookNode
   */

  /**
   * @type MyReactHookNode[]
   */

  /**
   * @type MyReactInstance & MyReactComponent
   */

  /**
   * @type Function[]
   */

  /**
   * @type MyReactVDom
   */
  function MyReactFiberNode(key, deepIndex, fiberParent, fiberAlternate, effect, dom, hookHead, hookFoot, hookList, listeners, instance) {
    var _this2;

    _classCallCheck(this, MyReactFiberNode);

    _this2 = _super2.call(this);

    _defineProperty(_assertThisInitialized(_this2), "key", void 0);

    _defineProperty(_assertThisInitialized(_this2), "deepIndex", void 0);

    _defineProperty(_assertThisInitialized(_this2), "effect", void 0);

    _defineProperty(_assertThisInitialized(_this2), "dom", void 0);

    _defineProperty(_assertThisInitialized(_this2), "mount", true);

    _defineProperty(_assertThisInitialized(_this2), "initial", true);

    _defineProperty(_assertThisInitialized(_this2), "memoProps", null);

    _defineProperty(_assertThisInitialized(_this2), "memoState", null);

    _defineProperty(_assertThisInitialized(_this2), "children", []);

    _defineProperty(_assertThisInitialized(_this2), "child", null);

    _defineProperty(_assertThisInitialized(_this2), "fiberChildHead", null);

    _defineProperty(_assertThisInitialized(_this2), "fiberChildFoot", null);

    _defineProperty(_assertThisInitialized(_this2), "fiberParent", null);

    _defineProperty(_assertThisInitialized(_this2), "fiberSibling", null);

    _defineProperty(_assertThisInitialized(_this2), "fiberAlternate", null);

    _defineProperty(_assertThisInitialized(_this2), "hookHead", void 0);

    _defineProperty(_assertThisInitialized(_this2), "hookFoot", void 0);

    _defineProperty(_assertThisInitialized(_this2), "hookList", void 0);

    _defineProperty(_assertThisInitialized(_this2), "instance", void 0);

    _defineProperty(_assertThisInitialized(_this2), "listeners", void 0);

    _defineProperty(_assertThisInitialized(_this2), "__vdom__", null);

    _defineProperty(_assertThisInitialized(_this2), "__needUpdate__", false);

    _this2.key = key;
    _this2.deepIndex = deepIndex;
    _this2.fiberParent = fiberParent;
    _this2.fiberAlternate = fiberAlternate;
    _this2.effect = effect;
    _this2.dom = dom;
    _this2.hookHead = hookHead;
    _this2.hookFoot = hookFoot;
    _this2.hookList = hookList;
    _this2.listeners = listeners;
    _this2.instance = instance;

    _this2._initialUpdate();

    _this2._initialParent();

    return _this2;
  }

  _createClass(MyReactFiberNode, [{
    key: "_initialUpdate",
    value: function _initialUpdate() {
      if (this.fiberAlternate) {
        var fiberAlternate = this.fiberAlternate;
        fiberAlternate.mount = false;
        fiberAlternate.fiberAlternate = null;
        fiberAlternate.__needUpdate__ = false;
        this.__renderedCount__ = fiberAlternate.__renderedCount__ + 1;
        this.__INTERNAL_EVENT_STATE__ = fiberAlternate.__INTERNAL_EVENT_STATE__;
      }
    }
  }, {
    key: "_initialParent",
    value: function _initialParent() {
      if (this.fiberParent) {
        this.fiberParent.addChild(this);
      }
    }
    /**
     *
     * @param {MyReactVDom} newVDom
     */

  }, {
    key: "installVDom",
    value: function installVDom(newVDom) {
      this.__vdom__ = newVDom;
      this.key = newVDom === null || newVDom === void 0 ? void 0 : newVDom.key;

      this._processType();

      this._processDom();

      this._processRef();

      this._processMemoProps();
    }
  }, {
    key: "_processType",
    value: function _processType() {
      var VDom = this.__vdom__;

      if ((0, _vdom.isValidElement)(VDom)) {
        this._processSucceedType(VDom);

        return;
      }

      if (_typeof(VDom) === "object") {
        this.__INTERNAL_NODE_TYPE__.__isEmptyNode__ = true;
        return;
      }

      this.__INTERNAL_NODE_TYPE__.__isTextNode__ = true;
    }
  }, {
    key: "_processDom",
    value: function _processDom() {
      if (this.__isTextNode__ || this.__isPlainNode__) {
        this.dom = this.dom || (0, _dom.createDom)(this);
      }

      if (this.__isPortal__) {
        this.dom = this.__vdom__.props.container;
      }
    }
  }, {
    key: "_processRef",
    value: function _processRef() {
      if (this.__isPlainNode__ && this.dom) {
        var ref = this.__vdom__.ref;

        if (_typeof(ref) === "object") {
          ref.current = this.dom;
        } else if (typeof ref === "function") {
          ref.call(null, this.dom);
        }
      }
    }
  }, {
    key: "_processMemoProps",
    value: function _processMemoProps() {
      this.memoProps = this.__isTextNode__ ? null : this.__vdom__.props;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.fiberChildHead = null;
      this.fiberChildFoot = null;
      this.child = null;
      this.children = [];
      this.__renderedChildren__ = [];
    }
  }, {
    key: "updated",
    value: function updated() {
      this.initial = false;
      this.__needUpdate__ = false;
      if (!this.effect) this.fiberAlternate = null;
    }
  }, {
    key: "updateDiffState",
    value: function updateDiffState() {
      if (this.fiberAlternate) {
        this.__renderedCount__ = this.fiberAlternate.__renderedCount__ + 1;
      } else if (_env.isMounted.current) {
        this.__renderedCount__ = this.__renderedCount__ + 1;
      } // only need update dom node


      if (!this.__isPlainNode__ && !this.__isTextNode__) {
        this.effect = null;
      }
    }
  }, {
    key: "stopUpdate",
    value: function stopUpdate() {
      var _this3 = this;

      var alternate = this.fiberAlternate;

      if (alternate !== this) {
        this.child = alternate.child;
        this.children = alternate.children;
        this.fiberChildHead = alternate.fiberChildHead;
        this.fiberChildFoot = alternate.fiberChildFoot;
        this.__renderedChildren__ = alternate.__renderedChildren__;
        this.children.forEach(function (child) {
          return child.fiberParent = _this3;
        });
      }
    }
    /**
     *
     * @param {MyReactFiberNode} parentFiber
     */

  }, {
    key: "installParent",
    value: function installParent(parentFiber) {
      this.fiberParent = parentFiber;
      this.fiberSibling = null;

      this._initialParent();
    }
    /**
     *
     * @param {MyReactComponent & MyReactInstance} instance
     */

  }, {
    key: "installInstance",
    value: function installInstance(instance) {
      this.instance = instance;
    }
    /**
     *
     * @param {MyReactHookNode} hookNode
     */

  }, {
    key: "installHook",
    value: function installHook(hookNode) {
      this.addHook(hookNode);
    }
  }, {
    key: "addListener",
    value: function addListener(node) {
      if (this.listeners.every(function (_node) {
        return _node !== node;
      })) {
        this.listeners.push(node);
      }
    }
  }, {
    key: "removeListener",
    value: function removeListener(node) {
      this.listeners = this.listeners.filter(function (_node) {
        return _node !== node;
      });
    }
    /**
     *
     * @param {MyReactFiberNode} childFiber
     */

  }, {
    key: "addChild",
    value: function addChild(childFiber) {
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

  }, {
    key: "addHook",
    value: function addHook(hookNode) {
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
  }, {
    key: "update",
    value: function update() {
      if (this.mount) {
        (0, _fiberTool.pushFiber)(this);
      } else {
        console.error("update a unmount fiber");
      }
    }
  }]);

  return MyReactFiberNode;
}(MyReactFiberInternalInstance);
/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: string, dom: HTMLElement, hookHead: MyReactHookNode, hookFoot: MyReactHookNode, hookList: MyReactHookNode[], listeners: MyReactInstance[], instance: MyReactInstance }} param
 * @param {MyReactVDom} newVDom
 * @returns
 */


exports.MyReactFiberNode = MyReactFiberNode;

function createFiberNode(_ref, newVDom) {
  var key = _ref.key,
      deepIndex = _ref.deepIndex,
      fiberParent = _ref.fiberParent,
      fiberAlternate = _ref.fiberAlternate,
      effect = _ref.effect,
      dom = _ref.dom,
      hookHead = _ref.hookHead,
      hookFoot = _ref.hookFoot,
      _ref$hookList = _ref.hookList,
      hookList = _ref$hookList === void 0 ? [] : _ref$hookList,
      _ref$listeners = _ref.listeners,
      listeners = _ref$listeners === void 0 ? [] : _ref$listeners,
      instance = _ref.instance;
  var newFiberNode = new MyReactFiberNode(key, deepIndex, fiberParent, fiberAlternate, effect, dom, hookHead, hookFoot, hookList, listeners, instance);
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


function createFiberNodeWithUpdate(_ref2, newVDom) {
  var key = _ref2.key,
      deepIndex = _ref2.deepIndex,
      fiberParent = _ref2.fiberParent,
      fiberAlternate = _ref2.fiberAlternate,
      effect = _ref2.effect,
      dom = _ref2.dom,
      hookHead = _ref2.hookHead,
      hookFoot = _ref2.hookFoot,
      _ref2$hookList = _ref2.hookList,
      hookList = _ref2$hookList === void 0 ? [] : _ref2$hookList,
      _ref2$listeners = _ref2.listeners,
      listeners = _ref2$listeners === void 0 ? [] : _ref2$listeners,
      instance = _ref2.instance;
  var newFiber = createFiberNode({
    key: key,
    deepIndex: deepIndex,
    fiberParent: fiberParent,
    fiberAlternate: fiberAlternate,
    effect: effect,
    dom: dom,
    hookHead: hookHead,
    hookFoot: hookFoot,
    hookList: hookList,
    listeners: listeners,
    instance: instance
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


function createFiberNodeWithPosition(_ref3, _ref4) {
  var key = _ref3.key,
      deepIndex = _ref3.deepIndex,
      fiberParent = _ref3.fiberParent,
      fiberAlternate = _ref3.fiberAlternate,
      effect = _ref3.effect,
      dom = _ref3.dom,
      hookHead = _ref3.hookHead,
      hookFoot = _ref3.hookFoot,
      _ref3$hookList = _ref3.hookList,
      hookList = _ref3$hookList === void 0 ? [] : _ref3$hookList,
      _ref3$listeners = _ref3.listeners,
      listeners = _ref3$listeners === void 0 ? [] : _ref3$listeners,
      instance = _ref3.instance;
  var newVDom = _ref4.newVDom,
      previousRenderFiber = _ref4.previousRenderFiber;
  var newFiber = createFiberNode({
    key: key,
    deepIndex: deepIndex,
    fiberParent: fiberParent,
    fiberAlternate: fiberAlternate,
    effect: effect,
    dom: dom,
    hookHead: hookHead,
    hookFoot: hookFoot,
    hookList: hookList,
    listeners: listeners,
    instance: instance
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


function createFiberNodeWithUpdateAndPosition(_ref5, _ref6) {
  var key = _ref5.key,
      deepIndex = _ref5.deepIndex,
      fiberParent = _ref5.fiberParent,
      fiberAlternate = _ref5.fiberAlternate,
      effect = _ref5.effect,
      dom = _ref5.dom,
      hookHead = _ref5.hookHead,
      hookFoot = _ref5.hookFoot,
      _ref5$hookList = _ref5.hookList,
      hookList = _ref5$hookList === void 0 ? [] : _ref5$hookList,
      _ref5$listeners = _ref5.listeners,
      listeners = _ref5$listeners === void 0 ? [] : _ref5$listeners,
      instance = _ref5.instance;
  var newVDom = _ref6.newVDom,
      previousRenderFiber = _ref6.previousRenderFiber;
  var newFiber = createFiberNodeWithUpdate({
    key: key,
    deepIndex: deepIndex,
    fiberParent: fiberParent,
    fiberAlternate: fiberAlternate,
    effect: effect,
    dom: dom,
    hookHead: hookHead,
    hookFoot: hookFoot,
    hookList: hookList,
    listeners: listeners,
    instance: instance
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
  var newFiber = updateFiberNode(fiber, parentFiber, vdom);

  if (newFiber !== previousRenderFiber) {
    (0, _position.processUpdatePosition)(newFiber, previousRenderFiber);
  }

  return newFiber;
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/core.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextWork = nextWork;
exports.nextWorkCommon = nextWorkCommon;

var _component = require("./component.js");

var _coreTool = require("./coreTool.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _vdom = require("./vdom.js");

/**
 *
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactVDom[]} children
 */
function transformChildrenFiber(parentFiber, _children) {
  var _parentFiber$fiberAlt;

  var index = 0;
  var isNewChildren = !Boolean(parentFiber.fiberAlternate);
  var children = Array.isArray(_children) ? _children : [_children];
  var previousRenderChildren = ((_parentFiber$fiberAlt = parentFiber.fiberAlternate) === null || _parentFiber$fiberAlt === void 0 ? void 0 : _parentFiber$fiberAlt.__renderedChildren__) || [];
  var assignPreviousRenderChildren = (0, _coreTool.getMatchedRenderChildren)(children, previousRenderChildren);
  parentFiber.reset();

  while (index < children.length || index < previousRenderChildren.length) {
    var newChild = children[index];
    var previousRenderChild = previousRenderChildren[index];
    var assignPreviousRenderChild = assignPreviousRenderChildren[index];
    var newFiber = isNewChildren ? (0, _coreTool.getNewFiberWithInitial)(newChild, parentFiber) : (0, _coreTool.getNewFiberWithUpdate)(newChild, parentFiber, previousRenderChild, assignPreviousRenderChild);

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

  var children = fiber.__vdom__.type(fiber.__vdom__.props);

  _env.currentHookDeepIndex.current = 0;
  _env.currentFunctionFiber.current = null;
  fiber.__vdom__.__dynamicChildren__ = children;
  fiber.__renderDynamic__ = true;
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
  if (fiber.__renderDynamic__) {
    return transformChildrenFiber(fiber, fiber.__vdom__.__dynamicChildren__);
  } else {
    return transformChildrenFiber(fiber, fiber.__vdom__.children);
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkForwardRef(fiber) {
  var render = fiber.__vdom__.type.render;
  _env.currentHookDeepIndex.current = 0;
  _env.currentFunctionFiber.current = fiber;
  var children = render(fiber.__vdom__.props, fiber.__vdom__.ref);
  _env.currentHookDeepIndex.current = 0;
  _env.currentFunctionFiber.current = null;
  fiber.__vdom__.__dynamicChildren__ = children;
  fiber.__renderDynamic__ = true;
  return nextWorkCommon(fiber);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkProvider(fiber) {
  // maybe need other way to get provider state
  // Provider 不存在needUpdate的状态
  if (_env.isMounted.current && fiber.initial) {
    var listenerFibers = fiber.listeners.map(function (it) {
      return it.__fiber__;
    }); // update only alive fiber

    Promise.resolve().then(function () {
      return listenerFibers.filter(function (f) {
        return f.mount;
      }).forEach(function (f) {
        return f.update();
      });
    });
  } // improve, need unmount ...


  fiber.__vdom__.type.Context.__context__ = fiber;
  return nextWorkCommon(fiber);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkConsumer(fiber) {
  fiber.instance = fiber.instance || new fiber.__vdom__.type.Internal();
  fiber.instance.updateDependence(fiber);
  var Component = fiber.__vdom__.type;

  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    var providerFiber = fiber.instance.processContext(Component.Context);
    var context = (providerFiber === null || providerFiber === void 0 ? void 0 : providerFiber.__vdom__.props.value) || Component.Context.Provider.value;
    fiber.instance.context = context;
  }

  fiber.__vdom__.__dynamicChildren__ = fiber.__vdom__.children(fiber.instance.context);
  fiber.__renderDynamic__ = true;
  return nextWorkCommon(fiber);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkMemo(fiber) {
  // 对于memo组件，只有当前fiber需要运行时才运行
  if (fiber.initial || fiber.__needUpdate__) {
    var _render$prototype;

    var _fiber$__vdom__$type = fiber.__vdom__.type,
        _render = _fiber$__vdom__$type.render,
        isMyReactForwardRefRender = _fiber$__vdom__$type.isMyReactForwardRefRender;
    var render = isMyReactForwardRefRender ? _render.render : _render;
    var isClassComponent = (_render$prototype = render.prototype) === null || _render$prototype === void 0 ? void 0 : _render$prototype.isMyReactComponent;

    if (isClassComponent) {
      throw new Error("not support memo(class) render, maybe need improve later, this error just a bug for MyReact");
    } else {
      _env.currentHookDeepIndex.current = 0;
      _env.currentFunctionFiber.current = fiber;
      var children = isMyReactForwardRefRender ? render(fiber.__vdom__.props, fiber.__vdom__.ref) : render(fiber.__vdom__.props);
      _env.currentHookDeepIndex.current = 0;
      _env.currentFunctionFiber.current = null;
      fiber.__vdom__.__dynamicChildren__ = children;
      fiber.__renderDynamic__ = true;
      return nextWorkCommon(fiber);
    }
  } else {
    return [];
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function nextWorkObject(fiber) {
  if (fiber.__isMemo__) return nextWorkMemo(fiber);
  if (fiber.__isPortal__) return nextWorkCommon(fiber);
  if (fiber.__isForwardRef__) return nextWorkForwardRef(fiber);
  if (fiber.__isContextProvider__) return nextWorkProvider(fiber);
  if (fiber.__isContextConsumer__) return nextWorkConsumer(fiber);
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
  var children = [];
  if (fiber.__isDynamicNode__) children = nextWorkComponent(fiber);else if (fiber.__isObjectNode__) children = nextWorkObject(fiber);else if (!fiber.__isTextNode__) children = nextWorkCommon(fiber);
  _env.currentRunningFiber.current = null;
  fiber.updated();
  return children;
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/effect.js':function anonymous(require,module,exports
) {
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
  var allLayoutEffectArray = _env.pendingLayoutEffectArray.current.slice(0);

  for (var i = allLayoutEffectArray.length - 1; i >= 0; i--) {
    var effectArray = allLayoutEffectArray[i];

    if (Array.isArray(effectArray) && effectArray.length) {
      effectArray.forEach(function (effect) {
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
  var allEffectArray = _env.pendingEffectArray.current.slice(0);

  if (allEffectArray.length) {
    setTimeout(function () {
      for (var i = allEffectArray.length - 1; i >= 0; i--) {
        var effectArray = allEffectArray[i];

        if (Array.isArray(effectArray)) {
          effectArray.forEach(function (effect) {
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
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/fiberTool.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContextFiber = void 0;
exports.pushFiber = pushFiber;

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _symbol = require("./symbol.js");

var _tools = require("./tools.js");

var _update = require("./update.js");

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function pushFiber(fiber) {
  (0, _tools.canNotUpdate)();

  if (!fiber.__needUpdate__) {
    fiber.__needUpdate__ = true;
    fiber.fiberAlternate = fiber;

    if (_env.enableAsyncUpdate.current) {
      _env.pendingAsyncModifyFiberArray.current.pushValue(fiber);
    } else {
      _env.pendingSyncModifyFiberArray.current.push(fiber);
    }
  }

  (0, _update.asyncUpdate)();
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {any} providerObject
 * @returns {MyReactFiberNode | null}
 */


var getProviderFiber = function getProviderFiber(fiber, providerObject) {
  if (fiber) {
    if (fiber.__isObjectNode__ && fiber.__isContextProvider__ && fiber.__vdom__.type === providerObject) {
      return fiber;
    } else {
      return getProviderFiber(fiber.fiberParent, providerObject);
    }
  }
};
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {any} contextObject
 * @returns {MyReactFiberNode | null}
 */


var getContextFiber = function getContextFiber(fiber, contextObject) {
  if (!contextObject) return null;
  if (contextObject.type !== _symbol.Context) throw new Error("wrong context usage"); // 需要更多考虑
  // return contextObject.__context__ &&
  //   contextObject.__context__.mount &&
  //   fiber.deepIndex > contextObject.__context__.deepIndex
  //   ? contextObject.__context__
  //   : null;

  return getProviderFiber(fiber, contextObject.Provider);
};

exports.getContextFiber = getContextFiber;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/instance.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyReactInstance = void 0;

var _fiber = require("./fiber.js");

var _fiberTool = require("./fiberTool.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MyReactInstance = /*#__PURE__*/function () {
  function MyReactInstance() {
    _classCallCheck(this, MyReactInstance);

    _defineProperty(this, "__fiber__", null);

    _defineProperty(this, "__context__", null);
  }

  _createClass(MyReactInstance, [{
    key: "updateDependence",
    value:
    /**
     *
     * @param {MyReactFiberNode} newFiber
     * @param {MyReactFiberNode} newContext
     */
    function updateDependence(newFiber, newContext) {
      this.__fiber__ = newFiber || this.__fiber__;
      this.__context__ = newContext || this.__context__;
    }
  }, {
    key: "processContext",
    value: function processContext(ContextObject) {
      var _this$__context__;

      if (this.__context__) this.__context__.removeListener(this);
      var providerFiber = (0, _fiberTool.getContextFiber)(this.__fiber__, ContextObject);
      this.updateDependence(null, providerFiber);
      (_this$__context__ = this.__context__) === null || _this$__context__ === void 0 ? void 0 : _this$__context__.addListener(this);
      return providerFiber;
    }
  }]);

  return MyReactInstance;
}();

exports.MyReactInstance = MyReactInstance;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/domClient.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HighLight = void 0;
exports.createBrowserDom = createBrowserDom;

var _dom = require("./dom.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ========= dev ============
var HighLight = /*#__PURE__*/_createClass(
/**
 * @type HighLight
 */

/**
 *
 * @returns HighLight
 */

/**
 * @type MyReactFiberNode[]
 */
function HighLight() {
  var _this = this;

  _classCallCheck(this, HighLight);

  _defineProperty(this, "map", []);

  _defineProperty(this, "range", document.createRange());

  _defineProperty(this, "pendingUpdate", []);

  _defineProperty(this, "container", null);

  _defineProperty(this, "createHighLight", function () {
    var element = document.createElement("div");

    _this.container.append(element);

    return element;
  });

  _defineProperty(this, "getHighLight", function () {
    if (_this.map.length) {
      var element = _this.map.shift();

      return element;
    }

    return _this.createHighLight();
  });

  _defineProperty(this, "highLight", function (fiber) {
    if (fiber.dom) {
      if (!fiber.dom.__pendingHighLight__) {
        fiber.dom.__pendingHighLight__ = true;

        _this.startHighLight(fiber);
      }
    }
  });

  _defineProperty(this, "startHighLight", function (fiber) {
    _this.pendingUpdate.push(fiber);

    _this.flashPending();
  });

  _defineProperty(this, "flashPending", function (cb) {
    Promise.resolve().then(function () {
      var allFiber = _this.pendingUpdate.slice(0);

      _this.pendingUpdate = [];
      var allWrapper = [];
      allFiber.forEach(function (f) {
        var wrapperDom = _this.getHighLight();

        allWrapper.push(wrapperDom);
        f.__isTextNode__ ? _this.range.selectNodeContents(f.dom) : _this.range.selectNode(f.dom);

        var rect = _this.range.getBoundingClientRect();

        var left = parseInt(rect.left) + parseInt(document.scrollingElement.scrollLeft);
        var top = parseInt(rect.top) + parseInt(document.scrollingElement.scrollTop);
        var width = parseInt(rect.width) + 4;
        var height = parseInt(rect.height) + 4;
        var positionLeft = left - 2;
        var positionTop = top - 2;
        wrapperDom.style.cssText = "\n          position: absolute;\n          width: ".concat(width, "px;\n          height: ").concat(height, "px;\n          left: ").concat(positionLeft, "px;\n          top: ").concat(positionTop, "px;\n          pointer-events: none;\n          box-shadow: 0.0625rem 0.0625rem 0.0625rem red, -0.0625rem -0.0625rem 0.0625rem red;\n          ");
      });
      setTimeout(function () {
        allWrapper.forEach(function (wrapperDom) {
          wrapperDom.style.boxShadow = "none";

          _this.map.push(wrapperDom);
        });
        allFiber.forEach(function (f) {
          return f.dom.__pendingHighLight__ = false;
        });
      }, 100);
    });
  });

  this.container = document.createElement("div");
  this.container.style.cssText = "\n      position: absolute;\n      z-index: 999999;\n      width: 100%;\n      left: 0;\n      top: 0;\n      pointer-events: none;\n      ";
  document.body.append(this.container);
});
/**
 *
 * @param {MyReactFiberNode} fiber
 * @returns
 */


exports.HighLight = HighLight;

_defineProperty(HighLight, "instance", undefined);

_defineProperty(HighLight, "getHighLightInstance", function () {
  HighLight.instance = HighLight.instance || new HighLight();
  return HighLight.instance;
});

function createBrowserDom(fiber) {
  var dom = fiber.__isTextNode__ ? document.createTextNode(fiber.__vdom__) : document.createElement(fiber.__vdom__.type);
  fiber.dom = dom;
  (0, _dom.updateDom)(dom, _env.empty, fiber.__isTextNode__ ? _env.empty : fiber.__vdom__.props, fiber);
  return dom;
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/domProps.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStyle = exports.isProperty = exports.isNew = exports.isInternal = exports.isGone = exports.isEvent = exports.isChildren = void 0;

// 编译之后加上的props
var isInternal = function isInternal(key) {
  return key.startsWith("__");
};

exports.isInternal = isInternal;

var isChildren = function isChildren(key) {
  return key === "children" || key === "dangerouslySetInnerHTML";
};

exports.isChildren = isChildren;

var isEvent = function isEvent(key) {
  return key.startsWith("on");
};

exports.isEvent = isEvent;

var isProperty = function isProperty(key) {
  return !isChildren(key) && !isEvent(key) && !isStyle(key) && !isInternal(key);
};

exports.isProperty = isProperty;

var isNew = function isNew(oldProps, newProps) {
  return function (key) {
    return oldProps[key] !== newProps[key];
  };
};

exports.isNew = isNew;

var isGone = function isGone(newProps) {
  return function (key) {
    return !(key in newProps);
  };
};

exports.isGone = isGone;

var isStyle = function isStyle(key) {
  return key === "style";
};

exports.isStyle = isStyle;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/render.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderLoopAsync = renderLoopAsync;
exports.renderLoopSync = renderLoopSync;
exports.startRender = startRender;

var _core = require("./core.js");

var _debug = require("./debug.js");

var _effect = require("./effect.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _mount = require("./mount.js");

var _tools = require("./tools.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function transformStart(fiber) {
  var _currentTransformFibe;

  (_currentTransformFibe = _env.currentTransformFiberArray.current).push.apply(_currentTransformFibe, _toConsumableArray((0, _core.nextWork)(fiber)));
}

function transformCurrent() {
  while (_env.currentTransformFiberArray.current.length) {
    var _nextTransformFiberAr;

    var fiber = _env.currentTransformFiberArray.current.shift();

    (_nextTransformFiberAr = _env.nextTransformFiberArray.current).push.apply(_nextTransformFiberAr, _toConsumableArray((0, _core.nextWork)(fiber)));
  }
}

function transformNext() {
  while (_env.nextTransformFiberArray.current.length) {
    var _currentTransformFibe2;

    var fiber = _env.nextTransformFiberArray.current.shift();

    (_currentTransformFibe2 = _env.currentTransformFiberArray.current).push.apply(_currentTransformFibe2, _toConsumableArray((0, _core.nextWork)(fiber)));
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
  loopAllAsync(getNextFiber, cb);
}
/**
 *
 * @param {() => MyReactFiberNode} getNextFiber
 * @param {() => void} cb
 */


function loopAllAsync(getNextFiber, cb) {
  var shouldYield = false;

  while (!shouldYield) {
    if (_env.currentTransformFiberArray.length || _env.nextTransformFiberArray.current) {
      (0, _debug.safeCall)(transformAll);
    }

    shouldYield = (0, _tools.shouldYieldAsyncUpdateOrNot)();

    if (!shouldYield) {
      (function () {
        var nextStartUpdateFiber = getNextFiber();

        if (nextStartUpdateFiber) {
          (0, _debug.safeCall)(function () {
            return transformStart(nextStartUpdateFiber);
          });
        } else {
          shouldYield = true;
        }
      })();
    }

    var hasNext = _env.currentTransformFiberArray.current.length || _env.nextTransformFiberArray.current.length;
    shouldYield = shouldYield || !hasNext;
  }

  if (shouldYield) {
    cb();
    (0, _tools.updateAsyncTimeStep)();
  } else {
    loopAllAsync(getNextFiber, cb);
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function startRender(fiber) {
  _env.needLoop.current = true;
  (0, _debug.safeCall)(function () {
    return renderLoopSync(fiber);
  });
  (0, _debug.safeCall)(function () {
    return (0, _mount.mountStart)();
  });
  (0, _effect.runLayoutEffect)();
  (0, _effect.runEffect)();
  _env.isMounted.current = true;
  _env.needLoop.current = false;
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/domTool.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNativeEventName = exports.getDom = exports.findLatestDomFromComponentFiber = void 0;

var _fiber2 = require("./fiber.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {(f: MyReactFiberNode) => MyReactFiberNode} transfer
 * @returns
 */
var getDom = function getDom(fiber) {
  var transfer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (fiber) {
    return fiber.parent;
  };

  if (fiber) {
    if (fiber.dom) {
      return fiber.dom;
    } else {
      return getDom(transfer(fiber), transfer);
    }
  }
};
/**
 *
 * @param {MyReactFiberNode} fiber
 */


exports.getDom = getDom;

var findLatestDomFromFiber = function findLatestDomFromFiber(fiber) {
  var currentLoopFiberArray = [fiber];

  while (currentLoopFiberArray.length) {
    var _fiber = currentLoopFiberArray.shift();

    if (_fiber.dom) return _fiber.dom;
    currentLoopFiberArray.push.apply(currentLoopFiberArray, _toConsumableArray(_fiber.children));
  }
};
/**
 *
 * @param {MyReactFiberNode} fiber
 */


var findLatestDomFromComponentFiber = function findLatestDomFromComponentFiber(fiber) {
  if (fiber) {
    if (fiber.dom) return fiber.dom;

    for (var i = 0; i < fiber.children.length; i++) {
      var dom = findLatestDomFromFiber(fiber.children[i]);
      if (dom) return dom;
    }
  }
}; // in progress


exports.findLatestDomFromComponentFiber = findLatestDomFromComponentFiber;

var getNativeEventName = function getNativeEventName(eventName) {
  var isCapture = false;

  if (eventName.endsWith("Capture")) {
    isCapture = true;
    eventName = eventName.split("Capture")[0];
  }

  if (eventName === "DoubleClick") {
    eventName = "dblclick";
  } else {
    eventName = eventName.toLowerCase();
  }

  return {
    isCapture: isCapture,
    eventName: eventName
  };
};

exports.getNativeEventName = getNativeEventName;
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/domServer.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Element = void 0;
exports.createServerDom = createServerDom;

var _dom = require("./dom.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _share = require("./share.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Element = /*#__PURE__*/function () {
  function Element(type) {
    _classCallCheck(this, Element);

    _defineProperty(this, "style", {});

    _defineProperty(this, "attrs", {});

    _defineProperty(this, "children", []);

    this.type = type;
  }

  _createClass(Element, [{
    key: "addEventListener",
    value: function addEventListener() {}
  }, {
    key: "removeEventListener",
    value: function removeEventListener() {}
  }, {
    key: "removeAttribute",
    value: function removeAttribute(key) {
      delete this.attrs[key];
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(key, value) {
      this.attrs[key] = value;
    }
    /**
     *
     * @param {Element} dom
     */

  }, {
    key: "append",
    value: function append() {
      var _this$children;

      (_this$children = this.children).push.apply(_this$children, arguments);
    }
  }, {
    key: "appendChild",
    value: function appendChild(dom) {
      if (dom instanceof Element || dom instanceof TextElement) {
        this.children.push(dom);
        return dom;
      } else {
        throw new Error("element instance error");
      }
    }
  }, {
    key: "serializeStyle",
    value: function serializeStyle() {
      var _this = this;

      var styleKeys = Object.keys(this.style);

      if (styleKeys.length) {
        return "style=\"".concat(styleKeys.map(function (key) {
          return "".concat(key, ": ").concat(_this.style[key].toString(), ";");
        }).reduce(function (p, c) {
          return p + c;
        }, ""), "\"");
      }

      return "";
    }
  }, {
    key: "serializeAttrs",
    value: function serializeAttrs() {
      var _this2 = this;

      var attrsKeys = Object.keys(this.attrs);

      if (attrsKeys.length) {
        return attrsKeys.map(function (key) {
          if (_this2.attrs[key] === null || _this2.attrs[key] === undefined) {
            return "";
          } else {
            return "".concat(key, "='").concat(_this2.attrs[key].toString(), "'");
          }
        }).reduce(function (p, c) {
          return "".concat(p, " ").concat(c);
        }, "");
      } else {
        return "";
      }
    }
  }, {
    key: "serializeProps",
    value: function serializeProps() {
      if (this.className) {
        return "class=\"".concat(this.className, "\"");
      } else {
        return "";
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      if (_share.singleElement[this.type]) {
        if (this.children.length) throw new Error("can not add child to ".concat(this.type, " element"));
        return "<".concat(this.type, " ").concat(this.serializeProps(), " ").concat(this.serializeStyle(), " ").concat(this.serializeAttrs(), " />");
      } else {
        if (this.type) {
          return "<".concat(this.type, " ").concat(this.serializeProps(), " ").concat(this.serializeStyle(), " ").concat(this.serializeAttrs(), " >").concat(this.children.reduce(function (p, c) {
            if (p.length && c instanceof TextElement && p[p.length - 1] instanceof TextElement) {
              p.push("<!-- -->");
              p.push(c);
            } else {
              p.push(c);
            }

            return p;
          }, []).map(function (dom) {
            return dom.toString();
          }).reduce(function (p, c) {
            return p + c;
          }, ""), "</").concat(this.type, ">");
        } else {
          return this.children.map(function (dom) {
            return dom.toString();
          }).reduce(function (p, c) {
            return p + c;
          }, "");
        }
      }
    }
  }]);

  return Element;
}();

exports.Element = Element;

var TextElement = /*#__PURE__*/function () {
  function TextElement(content) {
    _classCallCheck(this, TextElement);

    this.content = content;
  }

  _createClass(TextElement, [{
    key: "toString",
    value: function toString() {
      return this.content.toString();
    }
  }]);

  return TextElement;
}();
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function createServerDom(fiber) {
  var dom = fiber.__isTextNode__ ? new TextElement(fiber.__vdom__) : new Element(fiber.__vdom__.type);
  fiber.dom = dom;
  (0, _dom.updateDom)(dom, _env.empty, fiber.__isTextNode__ ? _env.empty : fiber.__vdom__.props, fiber);
  return dom;
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/position.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processUpdatePosition = processUpdatePosition;
exports.runPosition = runPosition;

var _debug = require("./debug.js");

var _domTool = require("./domTool.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

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
    try {
      (0, _debug.debuggerFiber)(fiber);
      return parentDom.insertBefore(fiber.dom, beforeDom);
    } catch (e) {
      console.error("position error", (0, _debug.logFiber)(fiber), parentDom, fiber.dom, beforeDom);
      throw e;
    }
  }

  fiber.children.forEach(function (f) {
    return insertBefore(f, beforeDom, parentDom);
  });
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
    (0, _debug.debuggerFiber)(fiber);
    return parentDom.append(fiber.dom);
  }

  fiber.children.forEach(function (f) {
    return append(f, parentDom);
  });
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
  if (fiber) {
    if (fiber.__isPortal__) return null;
    if (fiber.__isPlainNode__ || fiber.__isTextNode__) return fiber.dom;
    return getPlainNodeDom(fiber.child);
  } else {
    return null;
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function getInsertBeforeDomFromSibling(fiber) {
  if (!fiber) return null;
  var sibling = fiber.fiberSibling;

  if (sibling) {
    return getPlainNodeDom(sibling) || getInsertBeforeDomFromSibling(sibling.fiberSibling);
  } else {
    return null;
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parentFiberWithDom
 *
 * 换一种角度思考
 */


function getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithDom) {
  if (!fiber) return null;
  if (fiber === parentFiberWithDom) return null;
  var beforeDom = getInsertBeforeDomFromSibling(fiber);
  if (beforeDom) return beforeDom;
  return getInsertBeforeDomFromSiblingAndParent(fiber.fiberParent, parentFiberWithDom);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @returns {MyReactFiberNode}
 */


function getParentFiberWithDom(fiber) {
  if (!fiber) return _env.rootFiber.current;
  if (fiber.dom) return fiber;
  return getParentFiberWithDom(fiber.fiberParent);
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function commitPosition(fiber) {
  var children = fiber.children;

  if (children.some(function (child) {
    return child.__diffMount__;
  })) {
    var parentFiberWithDom = getParentFiberWithDom(fiber);

    for (var i = children.length - 1; i >= 0; i--) {
      var childFiber = children[i];

      if (childFiber.__diffMount__) {
        var beforeDom = getInsertBeforeDomFromSiblingAndParent(childFiber, parentFiberWithDom);

        if (beforeDom) {
          insertBefore(childFiber, beforeDom, parentFiberWithDom.dom);
        } else {
          append(childFiber, parentFiberWithDom.dom);
        }

        childFiber.__diffMount__ = false;
        childFiber.__diffPrevRender__ = null;
      }
    }
  }
}
/**
 *
 * @param {MyReactFiberNode} fiber
 */


function runPosition(fiber) {
  var allPositionArray = _env.pendingPositionFiberArray.current.slice(0);

  allPositionArray.forEach(function (fiber) {
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
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/update.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncUpdate = void 0;
exports.commitUpdate = commitUpdate;
exports.hydrateUpdate = hydrateUpdate;
exports.pushUpdate = pushUpdate;
exports.runUpdate = runUpdate;

var _debug = require("./debug.js");

var _dom = require("./dom.js");

var _domClient = require("./domClient.js");

var _domHydrate = require("./domHydrate.js");

var _domTool = require("./domTool.js");

var _effect = require("./effect.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _position = require("./position.js");

var _render = require("./render.js");

var _unmount = require("./unmount.js");

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
function hydrateUpdate(currentFiber, parentDom) {
  if (currentFiber.__isPlainNode__ || currentFiber.__isTextNode__ && currentFiber.__vdom__ !== "") {
    var dom = (0, _domHydrate.getHydrateDom)(parentDom);
    var isHydrateMatch = (0, _domHydrate.checkDomHydrate)(currentFiber, dom);

    if (isHydrateMatch) {
      currentFiber.dom = (0, _domHydrate.hydrateDom)(currentFiber, dom);
    } else {
      currentFiber.dom = (0, _domClient.createBrowserDom)(currentFiber);

      if (dom) {
        parentDom.replaceChild(currentFiber.dom, dom);
      } else {
        parentDom.append(currentFiber.dom);
      }
    }

    currentFiber._processRef();

    currentFiber.dom.__hydrate__ = true;
    (0, _debug.debuggerFiber)(currentFiber);
  }

  currentFiber.fiberAlternate = null;
  currentFiber.effect = null;
}
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

    (0, _debug.debuggerFiber)(currentFiber);
  }

  currentFiber.fiberAlternate = null;
  currentFiber.effect = null;
}

function updateEntry() {
  _env.enableAsyncUpdate.current ? updateAllAsync() : updateAllSync();
}

function getSyncPendingModifyFiberArray() {
  var pendingUpdate = _env.pendingSyncModifyFiberArray.current.slice(0).filter(function (f) {
    return f.__needUpdate__ && f.mount;
  });

  pendingUpdate.sort(function (f1, f2) {
    return f1.deepIndex - f2.deepIndex > 0 ? 1 : -1;
  });
  _env.pendingSyncModifyFiberArray.current = [];
  return pendingUpdate;
}

function updateAllSync() {
  _env.needLoop.current = true;
  var pendingUpdate = getSyncPendingModifyFiberArray();
  (0, _debug.safeCall)(function () {
    return pendingUpdate.forEach(_render.renderLoopSync);
  });
  (0, _position.runPosition)();
  runUpdate();
  (0, _unmount.runUnmount)();
  (0, _effect.runLayoutEffect)();
  (0, _effect.runEffect)();
  _env.needLoop.current = false;
}

function getAsyncPendingModifyNextFiber() {
  while (_env.pendingAsyncModifyFiberArray.current.length) {
    var nextFiber = _env.pendingAsyncModifyFiberArray.current.popTop();

    if (nextFiber.mount && nextFiber.__needUpdate__) {
      return nextFiber;
    }
  }

  return null;
}

function updateAllAsync() {
  _env.needLoop.current = true;
  (0, _render.renderLoopAsync)(getAsyncPendingModifyNextFiber, function () {
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

var asyncUpdate = function asyncUpdate() {
  return Promise.resolve().then(updateStart);
};
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
  var allUpdateArray = _env.pendingUpdateFiberArray.current.slice(0);

  allUpdateArray.forEach(function (fiber) {
    fiber.__pendingUpdate__ = false;

    if (fiber.mount) {
      commitUpdate(fiber, (0, _domTool.getDom)(fiber.fiberParent, function (fiber) {
        return fiber.fiberParent;
      }) || _env.rootContainer.current);
    }
  });
  _env.pendingUpdateFiberArray.current = [];
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/coreTool.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMatchedRenderChildren = getMatchedRenderChildren;
exports.getNewFiberWithInitial = getNewFiberWithInitial;
exports.getNewFiberWithUpdate = getNewFiberWithUpdate;

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _tools = require("./tools.js");

var _unmount = require("./unmount.js");

var _vdom = require("./vdom.js");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 *
 * @param {MyReactVDom | MyReactVDom[]} newVDom
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
 */
function isSameTypeNode(newVDom, previousRenderChild) {
  if (!_env.isMounted.current) return false;
  var newVDomIsArray = Array.isArray(newVDom);
  var previousRenderChildIsArray = Array.isArray(previousRenderChild);
  if (newVDomIsArray && previousRenderChildIsArray) return true;
  if (newVDomIsArray) return false;
  if (previousRenderChildIsArray) return false;
  var previousRenderChildVDom = previousRenderChild === null || previousRenderChild === void 0 ? void 0 : previousRenderChild.__vdom__;
  var newVDomIsVDomInstance = newVDom instanceof _vdom.MyReactVDom;
  var previousRenderChildVDomIsVDomInstance = previousRenderChildVDom instanceof _vdom.MyReactVDom;

  if (newVDomIsVDomInstance && previousRenderChildVDomIsVDomInstance) {
    // key different
    if (_env.enableKeyDiff.current && newVDom.key !== previousRenderChildVDom.key) {
      return false;
    }

    var result = newVDom.isSameTypeNode(previousRenderChildVDom);

    if (result) {
      if (newVDom.__isDynamicNode__ || newVDom.__isPlainNode__) {
        return newVDom.type === previousRenderChildVDom.type;
      }

      if (newVDom.__isObjectNode__) {
        return newVDom.type.type === previousRenderChildVDom.type.type;
      }

      return result;
    } else {
      return false;
    }
  }

  if (newVDomIsVDomInstance) return false;
  if (previousRenderChildVDomIsVDomInstance) return false; // text node

  if (_typeof(newVDom) !== "object") {
    return previousRenderChild && previousRenderChild.__isTextNode__;
  }

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
  if (_env.isServerRender.current) return previousRenderChildren;
  if (_env.isHydrateRender.current) return previousRenderChildren;
  if (!_env.enableKeyDiff.current) return previousRenderChildren;
  if (!previousRenderChildren) return previousRenderChildren;
  if (previousRenderChildren.length === 0) return previousRenderChildren;
  var tempRenderChildren = previousRenderChildren.slice(0);
  var assignPreviousRenderChildren = Array(tempRenderChildren.length).fill(null);
  newChildren.forEach(function (vDom, index) {
    if (tempRenderChildren.length) {
      if (vDom instanceof _vdom.MyReactVDom && vDom.key !== undefined) {
        var targetIndex = tempRenderChildren.findIndex(function (fiber) {
          return fiber instanceof _fiber.MyReactFiberNode && fiber.key === vDom.key;
        });

        if (targetIndex !== -1) {
          assignPreviousRenderChildren[index] = tempRenderChildren[targetIndex];
          tempRenderChildren.splice(targetIndex, 1);
        }
      }
    }
  });
  return assignPreviousRenderChildren.map(function (v) {
    if (v) return v;
    return tempRenderChildren.shift();
  });
}
/**
 *
 * @param {MyReactVDom} newVDom
 * @param {MyReactFiberNode} parentFiber
 */


function getNewFiberWithInitial(newVDom, parentFiber) {
  if (Array.isArray(newVDom)) {
    return newVDom.map(function (v) {
      return getNewFiberWithInitial(v, parentFiber);
    });
  }

  if (newVDom === undefined) return null;
  return (0, _fiber.createFiberNodeWithUpdate)({
    fiberParent: parentFiber,
    deepIndex: parentFiber.deepIndex + 1,
    effect: "PLACEMENT"
  }, newVDom === false || newVDom === null ? "" : newVDom);
}
/**
 *
 * @param {MyReactVDom | MyReactVDom[]} newVDom
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
 * @param {MyReactFiberNode | MyReactFiberNode[]} matchedPreviousRenderChild
 * @returns
 */


function getNewFiberWithUpdate(newVDom, parentFiber, previousRenderChild, matchedPreviousRenderChild) {
  var isSameType = isSameTypeNode(newVDom, matchedPreviousRenderChild);

  if (isSameType) {
    if (Array.isArray(newVDom)) {
      matchedPreviousRenderChild = getMatchedRenderChildren(newVDom, matchedPreviousRenderChild);

      if (newVDom.length < matchedPreviousRenderChild.length) {
        (0, _unmount.pushUnmount)(matchedPreviousRenderChild.slice(newVDom.length));
      }

      return newVDom.map(function (v, index) {
        return getNewFiberWithUpdate(v, parentFiber, previousRenderChild[index], matchedPreviousRenderChild[index]);
      });
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
    return newVDom.map(function (v) {
      return getNewFiberWithUpdate(v, parentFiber, null, null, false);
    });
  }

  if (newVDom === undefined) return null;
  return (0, _fiber.createFiberNodeWithPosition)({
    fiberParent: parentFiber,
    deepIndex: parentFiber.deepIndex + 1,
    effect: "PLACEMENT"
  }, {
    newVDom: newVDom === false || newVDom === null ? "" : newVDom,
    previousRenderFiber: previousRenderChild
  });
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/mount.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mountStart = mountStart;

var _domTool = require("./domTool.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _update = require("./update.js");

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
function mountLoop(currentFiber, parentDom) {
  if (currentFiber && currentFiber.mount) {
    if (_env.isHydrateRender.current) {
      (0, _update.hydrateUpdate)(currentFiber, parentDom);
    } else {
      (0, _update.commitUpdate)(currentFiber, parentDom);
    }

    currentFiber.children.forEach(function (f) {
      mountLoop(f, currentFiber.dom || parentDom);
    }); // no need use this logic
    // mountLoop(currentFiber.fiberChildHead, currentFiber.dom || parentDom);
    // mountLoop(currentFiber.fiberSibling, parentDom);
  }
}

function mountStart() {
  try {
    mountLoop(_env.rootFiber.current, (0, _domTool.getDom)(_env.rootFiber.current.fiberParent, function (fiber) {
      return fiber.fiberParent;
    }) || _env.rootContainer.current);
  } catch (e) {
    console.log(e);
  }
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/domHydrate.js':function anonymous(require,module,exports
) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkDomHydrate = checkDomHydrate;
exports.getHydrateDom = getHydrateDom;
exports.hydrateDom = hydrateDom;

var _debug = require("./debug.js");

var _domProps = require("./domProps.js");

var _domTool = require("./domTool.js");

var _env = require("./env.js");

var _fiber = require("./fiber.js");

var _share = require("./share.js");

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 * @param {{[k: string]: any}} props
 * @returns
 */
function domPropsHydrate(fiber, dom, props) {
  Object.keys(props).filter(_domProps.isProperty).forEach(function (key) {
    var _props$key;

    if (key === "className") {
      if (dom[key] !== props[key]) {
        console.warn("hydrate error, dom class not match form the template: ", "server: ".concat(dom[key], ", "), "client: ".concat(props[key], " \n"), (0, _debug.logFiber)(fiber));
        dom[key] = props[key];
      }

      return;
    }

    if (key === "value") {
      dom[key] !== props[key];
      return;
    }

    if (props[key] !== null && props[key] !== undefined && dom.getAttribute(key) !== ((_props$key = props[key]) === null || _props$key === void 0 ? void 0 : _props$key.toString())) {
      var _props$key2;

      console.warn("hydrate warning, dom attrs not match from template: ", "server: ".concat(dom.getAttribute(key), ", "), "client: ".concat((_props$key2 = props[key]) === null || _props$key2 === void 0 ? void 0 : _props$key2.toString(), " \n"), (0, _debug.logFiber)(fiber));
      dom.setAttribute(key, props[key]);
    }
  });
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 * @param {{[k: string]: any}} props
 * @returns
 */


function domEventHydrate(fiber, dom, props) {
  Object.keys(props).filter(_domProps.isEvent).forEach(function (key) {
    var _getNativeEventName = (0, _domTool.getNativeEventName)(key.slice(2)),
        eventName = _getNativeEventName.eventName,
        isCapture = _getNativeEventName.isCapture;

    fiber.__INTERNAL_EVENT_SYSTEM__.addEventListener(eventName, props[key], isCapture);
  });
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 * @param {{[k: string]: any}} props
 * @returns
 */


function domStyleHydrate(fiber, dom, props) {
  Object.keys(props).filter(_domProps.isStyle).forEach(function (styleKey) {
    Object.keys(props[styleKey] || _env.empty).forEach(function (styleName) {
      if (!_share.isUnitlessNumber[styleName]) {
        if (typeof props[styleKey][styleName] === "number") {
          dom.style[styleName] = "".concat(props[styleKey][styleName], "px");
          return;
        }
      }

      dom.style[styleName] = props[styleKey][styleName];
    });
  });
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 */


function hydrateDom(fiber, dom) {
  var _fiber$__vdom__, _fiber$__vdom__2, _fiber$__vdom__3;

  fiber.dom = dom;
  domPropsHydrate(fiber, dom, ((_fiber$__vdom__ = fiber.__vdom__) === null || _fiber$__vdom__ === void 0 ? void 0 : _fiber$__vdom__.props) || _env.empty);
  domEventHydrate(fiber, dom, ((_fiber$__vdom__2 = fiber.__vdom__) === null || _fiber$__vdom__2 === void 0 ? void 0 : _fiber$__vdom__2.props) || _env.empty);
  domStyleHydrate(fiber, dom, ((_fiber$__vdom__3 = fiber.__vdom__) === null || _fiber$__vdom__3 === void 0 ? void 0 : _fiber$__vdom__3.props) || _env.empty);
  return dom;
}
/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 */


function checkDomHydrate(fiber, dom) {
  if (!dom) {
    console.error("hydrate error, current dom not render by SSR", fiber.__vdom__, (0, _debug.logFiber)(fiber));
    return false;
  }

  if (fiber.__isTextNode__) {
    if (dom.nodeType !== Node.TEXT_NODE) {
      console.error("hydrate error, current dom type not match vdom type", fiber.__vdom__, dom, (0, _debug.logFiber)(fiber));
      return false;
    }

    if (fiber.__vdom__.toString() !== dom.textContent) {
      console.warn("hydrate waring, current hydrate text not match template text: ", "server: ".concat(dom.textContent, ", "), "client: ".concat(fiber.__vdom__.toString()), (0, _debug.logFiber)(fiber));
      return false;
    }
  }

  if (fiber.__isPlainNode__) {
    if (dom.nodeType !== Node.ELEMENT_NODE) {
      console.error("hydrate error, current dom type not a element type", fiber, dom, (0, _debug.logFiber)(fiber));
      return false;
    }

    if (fiber.__vdom__.type.toLowerCase() !== dom.nodeName.toLowerCase()) {
      console.error("hydrate error, current dom type not match vdom type", fiber, dom, (0, _debug.logFiber)(fiber));
      return false;
    }
  }

  return true;
}
/**
 *
 * @param {HTMLElement} parentDom
 */


function getHydrateDom(parentDom) {
  var children = Array.from(parentDom.childNodes);
  return children.find(function (dom) {
    return dom.nodeType !== document.COMMENT_NODE && !dom.__hydrate__;
  });
}
},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/unmount.js':function anonymous(require,module,exports
) {
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
  (0, _tools.mapFiber)(fiber, function (f) {
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
  fiber.hookList.forEach(function (hook) {
    if (hook.hookType === "useEffect" || hook.hookType === "useLayoutEffect") {
      hook.effect = false;
      hook.cancel && hook.cancel();
    }

    if (hook.hookType === "useContext") {
      var _hook$__context__;

      (_hook$__context__ = hook.__context__) === null || _hook$__context__ === void 0 ? void 0 : _hook$__context__.removeListener(hook);
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
  var allUnmountFiberArray = _env.pendingUnmountFiberArray.current.slice(0);

  allUnmountFiberArray.forEach(function (fiber) {
    fiber.__pendingUnmount__ = false;
    clearFiberNode(fiber);
    clearFiberDom(fiber);
  });
  _env.pendingUnmountFiberArray.current = [];
}
},
}};
var cache = cache || {};
function require(entry) {
  const fullModulePath = allModuleName[entry] || entry;
  if (!(fullModulePath in cache)) {
    const module = {exports: {}};
    cache[fullModulePath] = module;
    allModuleContent[fullModulePath](require, module, module.exports)
  }
  return cache[fullModulePath].exports;
}
// start 
require('../lib/react.js')
    