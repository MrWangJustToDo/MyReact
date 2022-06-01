
var allModuleName = {...allModuleName, ...{'../reactive/index.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/reactive/index.js", 
'../lib/env.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/env.js", 
'./share.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/share.js", 
}};
var allModuleContent = {...allModuleContent, ...{'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/reactive/index.js':function anonymous(require,module,exports
) {
const { currentFunctionFiber } = require("../lib/env.js");

const createReactive = (data) => {
  if (typeof data !== "object") {
    throw new Error("can not reactive a plain data");
  }

  return defineReactive(data);
};

const defineReactive = (data) => {
  if (typeof data === "object") {
    if (!Object.prototype.hasOwnProperty.call(data, "__reactive__")) {
      if (Array.isArray(data)) {
        // TODO
      } else {
        for (const key in data) {
          let listener = [];
          let originalValue = data[key];
          originalValue =
            typeof originalValue === "object"
              ? defineReactive(originalValue)
              : originalValue;
          Object.defineProperty(data, key, {
            get() {
              listener = listener.filter((n) => n && n.mount);
              currentFunctionFiber.current &&
                listener.every((n) => n !== currentFunctionFiber.current) &&
                listener.push(currentFunctionFiber.current);
              return originalValue;
            },
            set(val) {
              if (!Object.is(originalValue, val)) {
                val = typeof val === "object" ? defineReactive(val) : val;
                Promise.resolve().then(() => {
                  listener.forEach((n) => {
                    if (n.mount) n.update();
                  });
                });
                originalValue = val;
              }
            },
          });
        }
      }
      Object.defineProperty(data, "__reactive__", {
        value: data,
        enumerable: false,
        configurable: false,
      });
    }
    return data;
  }
};

window.createReactive = createReactive;

module.exports.createReactive = createReactive;

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
require('../reactive/index.js')
    