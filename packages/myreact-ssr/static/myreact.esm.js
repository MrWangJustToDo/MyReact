function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var createRef = function createRef(value) {
  return {
    current: value
  };
};

var EmptyDispatch = /*#__PURE__*/function () {
  function EmptyDispatch() {}

  var _proto = EmptyDispatch.prototype;

  _proto.trigger = function trigger(_fiber) {
  };

  _proto.reconcileCommit = function reconcileCommit(_fiber, _hydrate, _parentFiberWithDom) {
    return false;
  };

  _proto.reconcileCreate = function reconcileCreate(_list) {
  };

  _proto.reconcileUpdate = function reconcileUpdate(_list) {
  };

  _proto.beginProgressList = function beginProgressList() {
  };

  _proto.endProgressList = function endProgressList() {
  };

  _proto.generateUpdateList = function generateUpdateList(_fiber) {
  };

  _proto.pendingCreate = function pendingCreate(_fiber) {
  };

  _proto.pendingUpdate = function pendingUpdate(_fiber) {
  };

  _proto.pendingAppend = function pendingAppend(_fiber) {
  };

  _proto.pendingContext = function pendingContext(_fiber) {
  };

  _proto.pendingPosition = function pendingPosition(_fiber) {
  };

  _proto.pendingUnmount = function pendingUnmount(_fiber, _pendingUnmount) {
  };

  _proto.pendingLayoutEffect = function pendingLayoutEffect(_fiber, _layoutEffect) {
  };

  _proto.pendingEffect = function pendingEffect(_fiber, _effect) {
  };

  _proto.updateAllSync = function updateAllSync() {
  };

  _proto.updateAllAsync = function updateAllAsync() {
  };

  return EmptyDispatch;
}();

var asyncUpdateTimeLimit = 8;
var globalLoop = /*#__PURE__*/createRef(false);
var globalDispatch = /*#__PURE__*/createRef( /*#__PURE__*/new EmptyDispatch());
var currentRunningFiber = /*#__PURE__*/createRef(null);
var currentFunctionFiber = /*#__PURE__*/createRef(null);
var currentHookDeepIndex = /*#__PURE__*/createRef(0);
var isAppMounted = /*#__PURE__*/createRef(false);
var isAppCrash = /*#__PURE__*/createRef(false);
var isServerRender = /*#__PURE__*/createRef(false);
var isHydrateRender = /*#__PURE__*/createRef(false); // ==== feature ==== //

var enableKeyDiff = /*#__PURE__*/createRef(true);
var enableHighlight = /*#__PURE__*/createRef(false);
var enableDebugLog = /*#__PURE__*/createRef(false);
var enableAllCheck = /*#__PURE__*/createRef(true);
var enableAsyncUpdate = /*#__PURE__*/createRef(true);
var enableEventSystem = /*#__PURE__*/createRef(true);
var enableControlComponent = /*#__PURE__*/createRef(true); // ==== running ==== //

var asyncUpdateTimeStep = /*#__PURE__*/createRef(null);
var nRoundTransformFiberArray = /*#__PURE__*/createRef([]);
var cRoundTransformFiberArray = /*#__PURE__*/createRef([]); // ==== update ==== //

var pendingModifyFiberArray = /*#__PURE__*/createRef([]);
var pendingModifyTopLevelFiber = /*#__PURE__*/createRef(null);
var pendingUpdateFiberListArray = /*#__PURE__*/createRef([]);
var pendingUpdateFiberList = /*#__PURE__*/createRef(null);

var getTrackDevLog = function getTrackDevLog(fiber) {
  var _owner$element;

  if (!enableAllCheck.current) return '';
  var element = fiber.element;
  var source = typeof element === 'object' ? element == null ? void 0 : element._source : null;
  var owner = typeof element === 'object' ? element == null ? void 0 : element._owner : null;
  var preString = '';

  if (source) {
    var fileName = source.fileName,
        lineNumber = source.lineNumber;
    preString = preString + " (" + fileName + ":" + lineNumber + ")";
  }

  if (owner && !fiber.__isDynamicNode__ && typeof owner.element === 'object' && typeof ((_owner$element = owner.element) == null ? void 0 : _owner$element.type) === 'function') {
    var typedType = owner.element.type;
    var name = typedType.displayName || owner.element.type.name;
    preString = preString + " (render dy " + name + ")";
  }

  return preString;
};
var getFiberNodeName = function getFiberNodeName(fiber) {
  if (fiber.__isMemo__) return "<Memo />" + getTrackDevLog(fiber);
  if (fiber.__isLazy__) return "<Lazy />" + getTrackDevLog(fiber);
  if (fiber.__isPortal__) return "<Portal />" + getTrackDevLog(fiber);
  if (fiber.__isNullNode__) return "<null />" + getTrackDevLog(fiber);
  if (fiber.__isEmptyNode__) return "<Empty />" + getTrackDevLog(fiber);
  if (fiber.__isStrictNode__) return "<Strict />" + getTrackDevLog(fiber);
  if (fiber.__isSuspense__) return "<Suspense />" + getTrackDevLog(fiber);
  if (fiber.__isForwardRef__) return "<ForwardRef />" + getTrackDevLog(fiber);
  if (fiber.__isFragmentNode__) return "<Fragment />" + getTrackDevLog(fiber);
  if (fiber.__isContextProvider__) return "<Provider />" + getTrackDevLog(fiber);
  if (fiber.__isContextConsumer__) return "<Consumer />" + getTrackDevLog(fiber);

  if (typeof fiber.element === 'object' && fiber.element !== null) {
    var _fiber$element, _fiber$element2;

    if (fiber.__isPlainNode__ && typeof ((_fiber$element = fiber.element) == null ? void 0 : _fiber$element.type) === 'string') {
      return "<" + fiber.element.type + " />" + getTrackDevLog(fiber);
    }

    if (fiber.__isDynamicNode__ && typeof ((_fiber$element2 = fiber.element) == null ? void 0 : _fiber$element2.type) === 'function') {
      var typedType = fiber.element.type;
      var name = typedType.displayName || fiber.element.type.name || 'anonymous';
      name = fiber.__root__ ? name + " (root)" : name;
      return "<" + name + "* />" + getTrackDevLog(fiber);
    }

    return "<unknown />" + getTrackDevLog(fiber);
  } else {
    var _fiber$element3;

    return "<text - (" + ((_fiber$element3 = fiber.element) == null ? void 0 : _fiber$element3.toString()) + ") />" + getTrackDevLog(fiber);
  }
};
var getFiberTree = function getFiberTree(fiber) {
  if (fiber) {
    var preString = ''.padEnd(4) + 'at'.padEnd(4);
    var parent = fiber.parent;
    var res = "" + preString + getFiberNodeName(fiber);

    while (parent) {
      res = "" + preString + getFiberNodeName(parent) + "\n" + res;
      parent = parent.parent;
    }

    return "\n" + res;
  }

  return '';
};
var getHookTree = function getHookTree(hookType, newType) {
  var re = '\n' + ''.padEnd(6) + 'Prev render:'.padEnd(20) + 'Next render:'.padEnd(10) + '\n';

  for (var key in hookType) {
    var c = hookType[key];
    var n = newType[key];
    re += (+key + 1).toString().padEnd(6) + (c == null ? void 0 : c.padEnd(20)) + (n == null ? void 0 : n.padEnd(10)) + '\n';
  }

  re += ''.padEnd(6) + '^'.repeat(30) + '\n';
  return re;
};
var cache = {};
var log = function log(_ref) {
  var fiber = _ref.fiber,
      message = _ref.message,
      _ref$level = _ref.level,
      level = _ref$level === void 0 ? 'warn' : _ref$level,
      _ref$triggerOnce = _ref.triggerOnce,
      triggerOnce = _ref$triggerOnce === void 0 ? false : _ref$triggerOnce;
  var tree = getFiberTree(fiber || currentRunningFiber.current);

  if (triggerOnce) {
    if (cache[tree]) return;
    cache[tree] = true;
  }

  console[level]("[" + level + "]:", '\n-----------------------------------------\n', "" + (typeof message === 'string' ? message : message.stack || message.message), '\n-----------------------------------------\n', 'Render Tree:', tree);
};
var safeCall = function safeCall(action) {
  try {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return action.call.apply(action, [null].concat(args));
  } catch (e) {
    log({
      message: e,
      level: 'error'
    });
    isAppCrash.current = true;
    throw new Error(e.message);
  }
};
var safeCallWithFiber = function safeCallWithFiber(_ref2) {
  var action = _ref2.action,
      fiber = _ref2.fiber;

  try {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return action.call.apply(action, [null].concat(args));
  } catch (e) {
    log({
      message: e,
      level: 'error',
      fiber: fiber
    });
    isAppCrash.current = true;
    throw new Error(e.message);
  }
};
var debugWithDOM = function debugWithDOM(fiber) {
  if (fiber.dom) {
    var debugDOM = fiber.dom;
    debugDOM['__fiber__'] = fiber;
    debugDOM['__element__'] = fiber.element;
    debugDOM['__children__'] = fiber.children;
  }
};

var MyReactInternalInstance = /*#__PURE__*/function () {
  function MyReactInternalInstance() {
    this.__internal_instance_state__ = {
      __fiber__: null,
      __context__: null
    };
    this.__internal_instance_update__ = {
      __pendingEffect__: false
    };
    this.context = null;
  }

  var _proto = MyReactInternalInstance.prototype;

  _proto.setContext = function setContext(context) {
    var _this$__context__;

    if (this.__context__) this.__context__.removeDependence(this);
    this.__context__ = context;
    (_this$__context__ = this.__context__) == null ? void 0 : _this$__context__.addDependence(this);
  };

  _proto.setFiber = function setFiber(fiber) {
    this.__fiber__ = fiber;
  };

  _proto.unmount = function unmount() {
    var _this$__context__2;

    (_this$__context__2 = this.__context__) == null ? void 0 : _this$__context__2.removeDependence(this);
  };

  _createClass(MyReactInternalInstance, [{
    key: "__fiber__",
    get: function get() {
      return this.__internal_instance_state__.__fiber__;
    },
    set: function set(v) {
      this.__internal_instance_state__.__fiber__ = v;
    }
  }, {
    key: "__context__",
    get: function get() {
      return this.__internal_instance_state__.__context__;
    },
    set: function set(v) {
      this.__internal_instance_state__.__context__ = v;
    }
  }, {
    key: "__pendingEffect__",
    get: function get() {
      return this.__internal_instance_update__.__pendingEffect__;
    },
    set: function set(v) {
      this.__internal_instance_update__.__pendingEffect__ = v;
    }
  }]);

  return MyReactInternalInstance;
}();

var NODE_TYPE_OBJ = {
  __isNullNode__: false,
  __isTextNode__: false,
  __isEmptyNode__: false,
  __isPlainNode__: false,
  __isStrictNode__: false,
  __isFragmentNode__: false,
  // ====  object node ==== //
  __isObjectNode__: false,
  __isMemo__: false,
  __isPortal__: false,
  __isForwardRef__: false,
  __isContextProvider__: false,
  __isContextConsumer__: false,
  __isLazy__: false,
  __isSuspense__: false,
  // ==== dynamic node ==== //
  __isDynamicNode__: false,
  __isClassComponent__: false,
  __isFunctionComponent__: false
};
var NODE_TYPE_KEY = /*#__PURE__*/Object.keys(NODE_TYPE_OBJ);

var MyReactInternalType = /*#__PURE__*/function () {
  function MyReactInternalType() {
    this.__internal_node_type__ = {
      __isNullNode__: false,
      __isTextNode__: false,
      __isEmptyNode__: false,
      __isPlainNode__: false,
      __isStrictNode__: false,
      __isFragmentNode__: false,
      // ====  object node ==== //
      __isObjectNode__: false,
      __isForwardRef__: false,
      __isPortal__: false,
      __isMemo__: false,
      __isContextProvider__: false,
      __isContextConsumer__: false,
      __isLazy__: false,
      __isSuspense__: false,
      // ==== dynamic node ==== //
      __isDynamicNode__: false,
      __isClassComponent__: false,
      __isFunctionComponent__: false
    };
  }

  var _proto = MyReactInternalType.prototype;

  _proto.setNodeType = function setNodeType(props) {
    var _this = this;

    Object.keys(props || {}).forEach(function (key) {
      var typeKey = key;
      _this.__internal_node_type__[typeKey] = (props == null ? void 0 : props[typeKey]) || false;
    });
  };

  _proto.isSameType = function isSameType(props) {
    var _this2 = this;

    if (props) {
      return NODE_TYPE_KEY.every(function (key) {
        return _this2.__internal_node_type__[key] ? Object.is(_this2.__internal_node_type__[key], props[key]) : true;
      });
    } else {
      return false;
    }
  };

  _createClass(MyReactInternalType, [{
    key: "__isNullNode__",
    get: function get() {
      return this.__internal_node_type__.__isNullNode__;
    }
  }, {
    key: "__isTextNode__",
    get: function get() {
      return this.__internal_node_type__.__isTextNode__;
    }
  }, {
    key: "__isEmptyNode__",
    get: function get() {
      return this.__internal_node_type__.__isEmptyNode__;
    }
  }, {
    key: "__isPlainNode__",
    get: function get() {
      return this.__internal_node_type__.__isPlainNode__;
    }
  }, {
    key: "__isStrictNode__",
    get: function get() {
      return this.__internal_node_type__.__isStrictNode__;
    }
  }, {
    key: "__isFragmentNode__",
    get: function get() {
      return this.__internal_node_type__.__isFragmentNode__;
    }
  }, {
    key: "__isObjectNode__",
    get: function get() {
      return this.__internal_node_type__.__isObjectNode__;
    }
  }, {
    key: "__isForwardRef__",
    get: function get() {
      return this.__internal_node_type__.__isForwardRef__;
    }
  }, {
    key: "__isPortal__",
    get: function get() {
      return this.__internal_node_type__.__isPortal__;
    }
  }, {
    key: "__isMemo__",
    get: function get() {
      return this.__internal_node_type__.__isMemo__;
    }
  }, {
    key: "__isContextProvider__",
    get: function get() {
      return this.__internal_node_type__.__isContextProvider__;
    }
  }, {
    key: "__isContextConsumer__",
    get: function get() {
      return this.__internal_node_type__.__isContextConsumer__;
    }
  }, {
    key: "__isLazy__",
    get: function get() {
      return this.__internal_node_type__.__isLazy__;
    }
  }, {
    key: "__isSuspense__",
    get: function get() {
      return this.__internal_node_type__.__isSuspense__;
    }
  }, {
    key: "__isDynamicNode__",
    get: function get() {
      return this.__internal_node_type__.__isDynamicNode__;
    }
  }, {
    key: "__isClassComponent__",
    get: function get() {
      return this.__internal_node_type__.__isClassComponent__;
    }
  }, {
    key: "__isFunctionComponent__",
    get: function get() {
      return this.__internal_node_type__.__isFunctionComponent__;
    }
  }]);

  return MyReactInternalType;
}();

var isNormalEquals = function isNormalEquals(src, target, children) {
  if (children === void 0) {
    children = true;
  }

  if (typeof src === 'object' && typeof target === 'object' && src !== null && target !== null) {
    var srcKeys = Object.keys(src);
    var targetKeys = Object.keys(target);
    if (srcKeys.length !== targetKeys.length) return false;
    var res = true;

    for (var key in src) {
      if (key === 'children') {
        if (children) {
          res = res && Object.is(src[key], target[key]);
        } else {
          continue;
        }
      } else {
        res = res && Object.is(src[key], target[key]);
      }

      if (!res) return res;
    }

    return res;
  }

  return Object.is(src, target);
};
var isArrayEquals = function isArrayEquals(src, target) {
  if (Array.isArray(src) && Array.isArray(target) && src.length === target.length) {
    var re = true;

    for (var key in src) {
      re = re && Object.is(src[key], target[key]);
      if (!re) return re;
    }

    return re;
  }

  return false;
};

var once = function once(action) {
  var called = false;
  return function () {
    if (called) return;
    called = true;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    action.call.apply(action, [null].concat(args));
  };
};

var IS_SINGLE_ELEMENT = {
  br: true,
  hr: true,
  img: true,
  input: true,
  param: true,
  meta: true,
  link: true
};

var My_React_Element = /*#__PURE__*/Symbol["for"]('react.element');
var My_React_Memo = /*#__PURE__*/Symbol["for"]('react.memo');
var My_React_ForwardRef = /*#__PURE__*/Symbol["for"]('react.forward_ref');
var My_React_Portal = /*#__PURE__*/Symbol["for"]('react.portal');
var My_React_Fragment = /*#__PURE__*/Symbol["for"]('react.fragment');
var My_React_Context = /*#__PURE__*/Symbol["for"]('react.context');
var My_React_Provider = /*#__PURE__*/Symbol["for"]('react.provider');
var My_React_Consumer = /*#__PURE__*/Symbol["for"]('react.consumer');
var My_React_Lazy = /*#__PURE__*/Symbol["for"]('react.lazy');
var My_React_Suspense = /*#__PURE__*/Symbol["for"]('react.suspense');
var My_React_Strict = /*#__PURE__*/Symbol["for"]('react.strict');

var flattenChildren = function flattenChildren(children) {
  if (Array.isArray(children)) {
    return children.reduce(function (p, c) {
      return p.concat(flattenChildren(c));
    }, []);
  }

  return [children];
};

var shouldPauseAsyncUpdate = function shouldPauseAsyncUpdate() {
  if (!asyncUpdateTimeStep.current) {
    asyncUpdateTimeStep.current = Date.now();
    return false;
  } else {
    var result = Date.now() - asyncUpdateTimeStep.current > asyncUpdateTimeLimit;
    if (result) asyncUpdateTimeStep.current = null;
    return result;
  }
};

var MyReactFiberInternal = /*#__PURE__*/function (_MyReactInternalType) {
  _inheritsLoose(MyReactFiberInternal, _MyReactInternalType);

  function MyReactFiberInternal() {
    var _this;

    _this = _MyReactInternalType.apply(this, arguments) || this;
    _this.__internal_node_diff__ = {
      __renderedChildren__: [],
      __renderedChildHead__: null,
      __renderedChildFoot__: null,
      __renderedCount__: 1,
      __isRenderDynamic__: false,
      __dynamicChildren__: null,
      __isUpdateRender__: false,
      __updateTimeStep__: Date.now(),
      __lastUpdateTimeStep__: 0,
      __updateTimeSpace__: Infinity,
      __fallback__: null,
      __root__: false
    };
    _this.__internal_node_state__ = {
      __pendingCreate__: false,
      __pendingUpdate__: false,
      __pendingAppend__: false,
      __pendingPosition__: false,
      __pendingContext__: false
    };
    _this.__internal_node_event__ = {};
    _this.__internal_node_context__ = {
      __dependence__: [],
      __contextMap__: {}
    };
    _this.__internal_node_props__ = {
      __vdom__: null,
      __prevVdom__: null,
      __props__: {},
      __prevProps__: {},
      __children__: null
    }; // __internal_node_dom__: {
    //   dom: Element | Text | null;
    //   nameSpace: string | null;
    // } = {
    //   dom: null,
    //   nameSpace: null,
    // };
    // get dom() {
    //   return this.__internal_node_dom__.dom;
    // }
    // set dom(v) {
    //   this.__internal_node_dom__.dom = v;
    // }
    // get nameSpace() {
    //   return this.__internal_node_dom__.nameSpace;
    // }
    // set nameSpace(v) {
    //   this.__internal_node_dom__.nameSpace = v;
    // }

    _this.__internal_node_hook__ = {
      hookHead: null,
      hookFoot: null,
      hookList: [],
      hookType: []
    };
    _this.__internal_node_update__ = {
      __compUpdateQueue__: [],
      __hookUpdateQueue__: []
    };
    _this.__internal_node_effect__ = {
      __effectQueue__: [],
      __layoutEffectQueue__: []
    };
    _this.__internal_node_unmount__ = {
      __unmountQueue__: []
    };
    return _this;
  }

  var _proto = MyReactFiberInternal.prototype;

  _proto.addDependence = function addDependence(node) {
    var dependence = this.__dependence__;

    if (dependence.every(function (n) {
      return n !== node;
    })) {
      dependence.push(node);
    }
  };

  _proto.removeDependence = function removeDependence(node) {
    var dependence = this.__dependence__;
    this.__dependence__ = dependence.filter(function (n) {
      return n !== node;
    });
  };

  _createClass(MyReactFiberInternal, [{
    key: "__isUpdateRender__",
    get: function get() {
      return this.__internal_node_diff__.__isUpdateRender__;
    },
    set: function set(v) {
      this.__internal_node_diff__.__isUpdateRender__ = v;
    }
  }, {
    key: "__isRenderDynamic__",
    get: function get() {
      return this.__internal_node_diff__.__isRenderDynamic__;
    },
    set: function set(v) {
      this.__internal_node_diff__.__isRenderDynamic__ = v;
    }
  }, {
    key: "__renderedCount__",
    get: function get() {
      return this.__internal_node_diff__.__renderedCount__;
    },
    set: function set(v) {
      this.__internal_node_diff__.__renderedCount__ = v;
    }
  }, {
    key: "__renderedChildren__",
    get: function get() {
      return this.__internal_node_diff__.__renderedChildren__;
    },
    set: function set(v) {
      this.__internal_node_diff__.__renderedChildren__ = v;
    }
  }, {
    key: "__renderedChildHead__",
    get: function get() {
      return this.__internal_node_diff__.__renderedChildHead__;
    },
    set: function set(v) {
      this.__internal_node_diff__.__renderedChildHead__ = v;
    }
  }, {
    key: "__renderedChildFoot__",
    get: function get() {
      return this.__internal_node_diff__.__renderedChildFoot__;
    },
    set: function set(v) {
      this.__internal_node_diff__.__renderedChildFoot__ = v;
    }
  }, {
    key: "__dynamicChildren__",
    get: function get() {
      return this.__internal_node_diff__.__dynamicChildren__;
    },
    set: function set(v) {
      this.__internal_node_diff__.__dynamicChildren__ = v;
      this.__internal_node_diff__.__isRenderDynamic__ = true;
    }
  }, {
    key: "__updateTimeStep__",
    get: function get() {
      return this.__internal_node_diff__.__updateTimeStep__;
    },
    set: function set(v) {
      var diff = this.__internal_node_diff__;
      var lastTimeStep = diff.__updateTimeStep__;
      var nowTimeStep = v;
      diff.__lastUpdateTimeStep__ = lastTimeStep;
      diff.__updateTimeStep__ = nowTimeStep;
      diff.__updateTimeSpace__ = nowTimeStep - lastTimeStep;
    }
  }, {
    key: "__fallback__",
    get: function get() {
      return this.__internal_node_diff__.__fallback__;
    },
    set: function set(v) {
      this.__internal_node_diff__.__fallback__ = v;
    }
  }, {
    key: "__root__",
    get: function get() {
      return this.__internal_node_diff__.__root__;
    },
    set: function set(v) {
      this.__internal_node_diff__.__root__ = v;
    }
  }, {
    key: "__pendingCreate__",
    get: function get() {
      return this.__internal_node_state__.__pendingCreate__;
    },
    set: function set(v) {
      this.__internal_node_state__.__pendingCreate__ = v;
    }
  }, {
    key: "__pendingUpdate__",
    get: function get() {
      return this.__internal_node_state__.__pendingUpdate__;
    },
    set: function set(v) {
      this.__internal_node_state__.__pendingUpdate__ = v;
    }
  }, {
    key: "__pendingAppend__",
    get: function get() {
      return this.__internal_node_state__.__pendingAppend__;
    },
    set: function set(v) {
      this.__internal_node_state__.__pendingAppend__ = v;
    }
  }, {
    key: "__pendingPosition__",
    get: function get() {
      return this.__internal_node_state__.__pendingPosition__;
    },
    set: function set(v) {
      this.__internal_node_state__.__pendingPosition__ = v;
    }
  }, {
    key: "__pendingContext__",
    get: function get() {
      return this.__internal_node_state__.__pendingContext__;
    },
    set: function set(v) {
      this.__internal_node_state__.__pendingContext__ = v;
    }
  }, {
    key: "__dependence__",
    get: function get() {
      return this.__internal_node_context__.__dependence__;
    },
    set: function set(v) {
      this.__internal_node_context__.__dependence__ = v;
    }
  }, {
    key: "__contextMap__",
    get: function get() {
      return this.__internal_node_context__.__contextMap__;
    },
    set: function set(v) {
      this.__internal_node_context__.__contextMap__ = v;
    }
  }, {
    key: "__vdom__",
    get: function get() {
      return this.__internal_node_props__.__vdom__;
    },
    set: function set(v) {
      var props = this.__internal_node_props__;
      props.__vdom__ = v;
      props.__props__ = typeof v === 'object' ? (v == null ? void 0 : v.props) || {} : {};
      props.__children__ = typeof v === 'object' ? v == null ? void 0 : v.props.children : [];
    }
  }, {
    key: "__props__",
    get: function get() {
      return this.__internal_node_props__.__props__;
    }
  }, {
    key: "__children__",
    get: function get() {
      return this.__internal_node_props__.__children__;
    }
  }, {
    key: "__prevVdom__",
    get: function get() {
      return this.__internal_node_props__.__prevVdom__;
    },
    set: function set(v) {
      var props = this.__internal_node_props__;
      props.__prevVdom__ = v;
      props.__prevProps__ = typeof v === 'object' ? (v == null ? void 0 : v.props) || {} : {};
    }
  }, {
    key: "__prevProps__",
    get: function get() {
      return this.__internal_node_props__.__prevProps__;
    }
  }, {
    key: "hookHead",
    get: function get() {
      return this.__internal_node_hook__.hookHead;
    },
    set: function set(v) {
      this.__internal_node_hook__.hookHead = v;
    }
  }, {
    key: "hookFoot",
    get: function get() {
      return this.__internal_node_hook__.hookFoot;
    },
    set: function set(v) {
      this.__internal_node_hook__.hookFoot = v;
    }
  }, {
    key: "hookList",
    get: function get() {
      return this.__internal_node_hook__.hookList;
    },
    set: function set(v) {
      this.__internal_node_hook__.hookList = v;
    }
  }, {
    key: "hookType",
    get: function get() {
      return this.__internal_node_hook__.hookType;
    },
    set: function set(v) {
      this.__internal_node_hook__.hookType = v;
    }
  }, {
    key: "__compUpdateQueue__",
    get: function get() {
      return this.__internal_node_update__.__compUpdateQueue__;
    },
    set: function set(v) {
      this.__internal_node_update__.__compUpdateQueue__ = v;
    }
  }, {
    key: "__hookUpdateQueue__",
    get: function get() {
      return this.__internal_node_update__.__hookUpdateQueue__;
    },
    set: function set(v) {
      this.__internal_node_update__.__hookUpdateQueue__ = v;
    }
  }, {
    key: "__unmountQueue__",
    get: function get() {
      return this.__internal_node_unmount__.__unmountQueue__;
    },
    set: function set(v) {
      this.__internal_node_unmount__.__unmountQueue__ = v;
    }
  }, {
    key: "__effectQueue__",
    get: function get() {
      return this.__internal_node_effect__.__effectQueue__;
    },
    set: function set(v) {
      this.__internal_node_effect__.__effectQueue__ = v;
    }
  }, {
    key: "__layoutEffectQueue__",
    get: function get() {
      return this.__internal_node_effect__.__layoutEffectQueue__;
    },
    set: function set(v) {
      this.__internal_node_effect__.__layoutEffectQueue__ = v;
    }
  }]);

  return MyReactFiberInternal;
}(MyReactInternalType);

var MyReactFiberNode = /*#__PURE__*/function (_MyReactFiberInternal) {
  _inheritsLoose(MyReactFiberNode, _MyReactFiberInternal);

  function MyReactFiberNode(index, parent, element) {
    var _this2;

    _this2 = _MyReactFiberInternal.call(this) || this;
    _this2.fiberIndex = 0;
    _this2.mount = true;
    _this2.dom = null;
    _this2.nameSpace = null;
    _this2.children = [];
    _this2.child = null;
    _this2.parent = null;
    _this2.sibling = null;
    _this2.instance = null;
    _this2.__needUpdate__ = true;
    _this2.__needTrigger__ = false;
    _this2.parent = parent;
    _this2.fiberIndex = index;
    _this2.element = element;
    _this2.__vdom__ = element;
    return _this2;
  }

  var _proto2 = MyReactFiberNode.prototype;

  _proto2.addChild = function addChild(child) {
    this.children.push(child);

    if (this.__renderedChildFoot__) {
      this.__renderedChildFoot__.sibling = child;
      this.__renderedChildFoot__ = child;
    } else {
      this.child = child;
      this.__renderedChildHead__ = child;
      this.__renderedChildFoot__ = child;
    }
  };

  _proto2.initialParent = function initialParent() {
    if (this.parent) {
      var _this$element;

      this.parent.addChild(this);

      if (this.parent.nameSpace) {
        this.nameSpace = this.parent.nameSpace;
      }

      if (this.parent.__isSuspense__) {
        this.__fallback__ = this.parent.__props__.fallback;
      } else {
        this.__fallback__ = this.parent.__fallback__;
      }

      var contextMap = Object.assign({}, this.parent.__contextMap__, this.__contextMap__);

      if (typeof this.element === 'object' && typeof ((_this$element = this.element) == null ? void 0 : _this$element.type) === 'object' && this.__isContextProvider__) {
        var typedElementType = this.element.type;
        var contextObj = typedElementType['Context'];
        var contextId = contextObj['id'];
        contextMap[contextId] = this;
      }

      this.__contextMap__ = contextMap;
    }
  };

  _proto2.installParent = function installParent(newParent) {
    this.parent = newParent;
    this.sibling = null;
    this.initialParent();
  };

  _proto2.updateRenderState = function updateRenderState() {
    if (enableAllCheck.current) {
      this.__renderedCount__ += 1;
      this.__updateTimeStep__ = Date.now();
    }
  };

  _proto2.beforeUpdate = function beforeUpdate() {
    this.child = null;
    this.children = [];
    this.__renderedChildHead__ = null;
    this.__renderedChildFoot__ = null;
  };

  _proto2.triggerUpdate = function triggerUpdate() {
    this.__needUpdate__ = true;
    this.__needTrigger__ = true;
    this.__isUpdateRender__ = true;
  };

  _proto2.prepareUpdate = function prepareUpdate() {
    this.__needUpdate__ = true;
    this.__isUpdateRender__ = true;
  };

  _proto2.afterUpdate = function afterUpdate() {
    this.__needUpdate__ = false;
    this.__needTrigger__ = false;
    this.__isUpdateRender__ = false;
    this.__isRenderDynamic__ = false;
  } // when update, install new vdom
  ;

  _proto2.installVDom = function installVDom(vdom) {
    this.element = vdom;
    this.__vdom__ = vdom;
  } // TODO
  ;

  _proto2.checkVDom = function checkVDom() {
    if (enableAllCheck.current) {
      var vdom = this.element;

      if (isValidElement(vdom)) {
        var typedVDom = vdom;

        if (!typedVDom._store['validType']) {
          if (this.__isContextConsumer__) {
            if (typeof typedVDom.props.children !== 'function') {
              throw new Error("Consumer need a function children");
            }
          }

          if (this.__isMemo__ || this.__isForwardRef__) {
            var typedType = typedVDom.type;

            if (typeof typedType.render !== 'function' && typeof typedType.render !== 'object') {
              throw new Error('invalid render type');
            }

            if (this.__isForwardRef__ && typeof typedType.render !== 'function') {
              throw new Error('forwardRef() need a function component');
            }
          }

          if (typedVDom.ref) {
            if (typeof typedVDom.ref !== 'object' && typeof typedVDom.ref !== 'function') {
              throw new Error('unSupport ref usage, should be a function or a object like {current: any}');
            }
          }

          if (typedVDom.key && typeof typedVDom.key !== 'string') {
            throw new Error("invalid key type, " + typedVDom.key);
          }

          if (typedVDom.props.children && typedVDom.props['dangerouslySetInnerHTML']) {
            throw new Error('can not render contain `children` and `dangerouslySetInnerHTML`');
          }

          if (typedVDom.props['dangerouslySetInnerHTML']) {
            if (typeof typedVDom.props['dangerouslySetInnerHTML'] !== 'object' || !Object.prototype.hasOwnProperty.call(typedVDom.props['dangerouslySetInnerHTML'], '__html')) {
              throw new Error('invalid dangerouslySetInnerHTML props, should like {__html: string}');
            }
          }

          typedVDom._store['validType'] = true;
        }
      }
    }
  };

  _proto2.initialType = function initialType() {
    var vdom = this.element;
    var nodeType = getTypeFromVDom(vdom);
    this.setNodeType(nodeType);

    if (isValidElement(vdom)) {
      if (vdom.type === 'svg') this.nameSpace = 'http://www.w3.org/2000/svg';
    }
  };

  _proto2.checkIsSameType = function checkIsSameType(vdom) {
    if (this.__needTrigger__) return true;
    var nodeType = getTypeFromVDom(vdom);
    var result = this.isSameType(nodeType);
    var element = vdom;
    var currentElement = this.element;

    if (result) {
      if (this.__isDynamicNode__ || this.__isPlainNode__) {
        return Object.is(currentElement.type, element.type);
      }

      if (this.__isObjectNode__ && typeof element.type === 'object' && typeof currentElement.type === 'object') {
        return Object.is(element.type['$$typeof'], currentElement.type['$$typeof']);
      }

      return true;
    } else {
      return false;
    }
  };

  _proto2.addHook = function addHook(hookNode) {
    this.hookList.push(hookNode);
    this.hookType.push(hookNode.hookType);

    if (!this.hookHead) {
      this.hookHead = hookNode;
      this.hookFoot = hookNode;
    } else if (this.hookFoot) {
      this.hookFoot.hookNext = hookNode;
      hookNode.hookPrev = this.hookFoot;
      this.hookFoot = hookNode;
    }
  };

  _proto2.checkHook = function checkHook(hookNode) {
    if (enableAllCheck.current) {
      if (hookNode.hookType === 'useMemo' || hookNode.hookType === 'useEffect' || hookNode.hookType === 'useCallback' || hookNode.hookType === 'useLayoutEffect') {
        if (typeof hookNode.value !== 'function') {
          throw new Error(hookNode.hookType + " initial error");
        }
      }

      if (hookNode.hookType === 'useContext') {
        if (typeof hookNode.value !== 'object' || hookNode.value === null) {
          throw new Error(hookNode.hookType + " initial error");
        }
      }
    }
  };

  _proto2.applyRef = function applyRef() {
    if (this.__isPlainNode__) {
      var typedElement = this.element;

      if (this.dom) {
        var ref = typedElement.ref;

        if (typeof ref === 'object' && ref !== null) {
          ref.current = this.dom;
        } else if (typeof ref === 'function') {
          ref(this.dom);
        }
      } else {
        throw new Error('do not have a dom for plain node');
      }
    }

    if (this.__isClassComponent__) {
      var _typedElement = this.element;

      if (this.instance) {
        var _ref = _typedElement.ref;

        if (typeof _ref === 'object' && _ref !== null) {
          _ref.current = this.instance;
        } else if (typeof _ref === 'function') {
          _ref(this.instance);
        }
      }
    }
  };

  _proto2.applyVDom = function applyVDom() {
    this.__prevVdom__ = this.__isTextNode__ ? this.__vdom__ : Object.assign({}, this.__vdom__);
  };

  _proto2.installInstance = function installInstance(instance) {
    this.instance = instance;
  };

  _proto2.update = function update() {
    globalDispatch.current.trigger(this);
  };

  _proto2.unmount = function unmount() {
    this.hookList.forEach(function (hook) {
      return hook.unmount();
    });
    this.instance && this.instance.unmount();
    this.mount = false;
    this.__needUpdate__ = false;
    this.__needTrigger__ = false;
    this.__pendingCreate__ = false;
    this.__pendingUpdate__ = false;
    this.__pendingAppend__ = false;
    this.__pendingPosition__ = false;
  };

  return MyReactFiberNode;
}(MyReactFiberInternal);

var getContextFiber = function getContextFiber(fiber, ContextObject) {
  if (ContextObject && fiber) {
    var id = ContextObject.id;
    var contextFiber = fiber.__contextMap__[id];
    return contextFiber;
  }

  return null;
};
var getContextValue = function getContextValue(fiber, ContextObject) {
  var contextValue = fiber ? fiber.__props__.value : ContextObject == null ? void 0 : ContextObject.Provider.value;
  return contextValue;
};

var processComponentUpdateQueue = function processComponentUpdateQueue(fiber) {
  var allComponentUpdater = fiber.__compUpdateQueue__.slice(0);

  fiber.__compUpdateQueue__ = [];
  var typedInstance = fiber.instance;
  var baseState = Object.assign({}, typedInstance.state);
  var baseProps = Object.assign({}, typedInstance.props);
  return allComponentUpdater.reduce(function (p, c) {
    return {
      newState: _extends({}, p.newState, typeof c.payLoad === 'function' ? c.payLoad(baseState, baseProps) : c.payLoad),
      isForce: p.isForce || c.isForce || false,
      callback: c.callback ? p.callback.concat(c.callback) : p.callback
    };
  }, {
    newState: _extends({}, baseState),
    isForce: false,
    callback: []
  });
};
var processHookUpdateQueue = function processHookUpdateQueue(fiber) {
  var allHookUpdater = fiber.__hookUpdateQueue__.slice(0);

  fiber.__hookUpdateQueue__ = [];
  allHookUpdater.forEach(function (_ref) {
    var action = _ref.action,
        trigger = _ref.trigger;
    trigger.result = trigger.reducer(trigger.result, action);
  });
};

var updateFiberNode = function updateFiberNode(_ref, newChild) {
  var fiber = _ref.fiber,
      parent = _ref.parent,
      prevFiber = _ref.prevFiber;
  fiber.installParent(parent);
  var prevVDom = fiber.__vdom__;
  fiber.installVDom(newChild);
  var newVDom = fiber.__vdom__;
  fiber.checkVDom();
  fiber.updateRenderState();

  if (prevVDom !== newVDom) {
    if (fiber.__isMemo__) {
      var typedPrevVDom = prevVDom;
      var typedNewVDom = newVDom;

      if (!fiber.__needTrigger__ && isNormalEquals(typedPrevVDom.props, typedNewVDom.props)) {
        fiber.afterUpdate();
      } else {
        fiber.prepareUpdate();
      }
    } else {
      fiber.prepareUpdate();

      if (fiber.__isContextProvider__) {
        var _typedPrevVDom = prevVDom;
        var _typedNewVDom = newVDom;

        if (!isNormalEquals(_typedPrevVDom.props.value, _typedNewVDom.props.value)) {
          globalDispatch.current.pendingContext(fiber);
        }
      }

      if (fiber.__isPlainNode__) {
        var _typedPrevVDom2 = prevVDom;
        var _typedNewVDom2 = newVDom;

        if (!isNormalEquals(_typedPrevVDom2.props, _typedNewVDom2.props, false)) {
          globalDispatch.current.pendingUpdate(fiber);
        }
      }

      if (fiber.__isTextNode__) {
        globalDispatch.current.pendingUpdate(fiber);
      }
    }
  }

  if (fiber !== prevFiber) {
    globalDispatch.current.pendingPosition(fiber);
  }

  return fiber;
};

var createFiberNode = function createFiberNode(_ref, VDom) {
  var fiberIndex = _ref.fiberIndex,
      parent = _ref.parent,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'append' : _ref$type;
  var newFiberNode = new MyReactFiberNode(fiberIndex, parent, VDom);
  newFiberNode.checkVDom();
  newFiberNode.initialType();
  newFiberNode.initialParent();
  globalDispatch.current.pendingCreate(newFiberNode);
  globalDispatch.current.pendingUpdate(newFiberNode);

  if (type === 'append') {
    globalDispatch.current.pendingAppend(newFiberNode);
  } else {
    globalDispatch.current.pendingPosition(newFiberNode);
  }

  if (newFiberNode.__isPlainNode__ || newFiberNode.__isClassComponent__) {
    if (VDom.ref) {
      globalDispatch.current.pendingLayoutEffect(newFiberNode, function () {
        return newFiberNode.applyRef();
      });
    }
  }

  return newFiberNode;
};

var unmountFiber = function unmountFiber(fiber) {
  fiber.children.forEach(unmountFiber);
  fiber.unmount();
};

var mapFiber = function mapFiber(arrayLike, action) {
  if (Array.isArray(arrayLike)) {
    arrayLike.forEach(function (f) {
      return mapFiber(f, action);
    });
  } else {
    if (arrayLike instanceof MyReactFiberNode) {
      action(arrayLike);
    }
  }
};

var cannotUpdate = function cannotUpdate() {
  if (isServerRender.current) throw new Error('can not update component during SSR');
  if (isHydrateRender.current) throw new Error('can not update component during hydrate');
  if (isAppCrash.current) return true;
  if (typeof window === 'undefined') return false;
  return true;
};

var IS_UNIT_LESS_NUMBER = {
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

var ListTreeNode = function ListTreeNode(value) {
  this.prev = null;
  this.next = null;
  this.children = [];
  this.value = value;
};
var LinkTreeList = /*#__PURE__*/function () {
  function LinkTreeList() {
    this.rawArray = [];
    this.scopeRoot = {
      index: -1,
      value: new ListTreeNode(false)
    };
    this.scopeArray = []; // listArray: ListTreeNode<T>[][] = [];

    this.scopeLength = 0;
    this.length = 0;
    this.head = null;
    this.foot = null;
  }

  var _proto = LinkTreeList.prototype;

  _proto.scopePush = function scopePush(scopeItem) {
    while (this.scopeLength && this.scopeArray[this.scopeLength - 1].index >= scopeItem.index) {
      this.scopeArray.pop();
      this.scopeLength--;
    }

    if (this.scopeLength) {
      this.scopeArray[this.scopeLength - 1].value.children.push(scopeItem.value);
    } else {
      this.scopeRoot.value.children.push(scopeItem.value);
    }

    this.scopeArray.push(scopeItem);
    this.scopeLength++;
  };

  _proto.append = function append(node, index) {
    this.length++;
    this.rawArray.push(node);
    var listNode = new ListTreeNode(node);
    this.push(listNode);
    this.scopePush({
      index: index,
      value: listNode
    }); // if (this.listArray[index]) {
    //   const array = this.listArray[index];
    //   array.push(listNode);
    // } else {
    //   this.listArray[index] = [listNode];
    // }
  };

  _proto.unshift = function unshift(node) {
    if (!this.head) {
      this.head = node;
      this.foot = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
  };

  _proto.shift = function shift() {
    if (this.head) {
      var re = this.head;

      if (this.head.next) {
        this.head = this.head.next;
        re.next = null;
        this.head.prev = null;
      } else {
        this.head = null;
        this.foot = null;
      }

      return re;
    } else {
      return null;
    }
  };

  _proto.push = function push(node) {
    if (!this.foot) {
      this.head = node;
      this.foot = node;
    } else {
      this.foot.next = node;
      node.prev = this.foot;
      this.foot = node;
    }
  };

  _proto.pop = function pop() {
    if (this.foot) {
      var re = this.foot;

      if (this.foot.prev) {
        this.foot = this.foot.prev;
        re.prev = null;
        this.foot.next = null;
      } else {
        this.head = null;
        this.foot = null;
      }

      return re;
    } else {
      return null;
    }
  };

  _proto.pickHead = function pickHead() {
    return this.head;
  };

  _proto.pickFoot = function pickFoot() {
    return this.foot;
  };

  _proto.listToFoot = function listToFoot(action) {
    var node = this.head;

    while (node) {
      action(node.value);
      node = node.next;
    }
  };

  _proto.listToHead = function listToHead(action) {
    var node = this.foot;

    while (node) {
      action(node.value);
      node = node.prev;
    }
  };

  _proto.reconcile = function reconcile(action) {
    var reconcileScope = function reconcileScope(node) {
      if (node.children) {
        node.children.forEach(reconcileScope);
      }

      action(node.value);
    };

    if (this.scopeLength) {
      this.scopeRoot.value.children.forEach(reconcileScope);
    } // for (let i = this.listArray.length - 1; i >= 0; i--) {
    //   const array = this.listArray[i];
    //   if (array) {
    //     array.forEach((p) => action(p.value));
    //   }
    // }

  };

  _proto.has = function has() {
    return this.head !== null;
  };

  return LinkTreeList;
}();

function isValidElement(element) {
  return typeof element === 'object' && !Array.isArray(element) && (element == null ? void 0 : element.$$typeof) === My_React_Element;
}
function getTypeFromVDom(element) {
  var nodeType = {};

  if (isValidElement(element)) {
    var rawType = element.type;

    if (typeof rawType === 'object') {
      nodeType.__isObjectNode__ = true;
      var typedRawType = rawType;

      switch (typedRawType['$$typeof']) {
        case My_React_Provider:
          nodeType.__isContextProvider__ = true;
          break;

        case My_React_Consumer:
          nodeType.__isContextConsumer__ = true;
          break;

        case My_React_Portal:
          nodeType.__isPortal__ = true;
          break;

        case My_React_Memo:
          nodeType.__isMemo__ = true;
          break;

        case My_React_ForwardRef:
          nodeType.__isForwardRef__ = true;
          break;

        case My_React_Lazy:
          nodeType.__isLazy__ = true;
          break;

        default:
          throw new Error("invalid object element type " + typedRawType['$$typeof'].toString());
      }
    } else if (typeof rawType === 'function') {
      var _rawType$prototype;

      nodeType.__isDynamicNode__ = true;

      if ((_rawType$prototype = rawType.prototype) != null && _rawType$prototype.isMyReactComponent) {
        nodeType.__isClassComponent__ = true;
      } else {
        nodeType.__isFunctionComponent__ = true;
      }
    } else if (typeof rawType === 'symbol') {
      switch (rawType) {
        case My_React_Fragment:
          nodeType.__isFragmentNode__ = true;
          break;

        case My_React_Strict:
          nodeType.__isStrictNode__ = true;
          break;

        case My_React_Suspense:
          nodeType.__isSuspense__ = true;
          break;

        default:
          throw new Error("invalid symbol element type " + rawType.toString());
      }
    } else if (typeof rawType === 'string') {
      nodeType.__isPlainNode__ = true;
    } else {
      throw new Error("invalid element type " + rawType);
    }
  } else {
    if (typeof element === 'object' && element !== null) {
      nodeType.__isEmptyNode__ = true;
    } else if (element === null || element === undefined || element === false) {
      nodeType.__isNullNode__ = true;
    } else {
      nodeType.__isTextNode__ = true;
    }
  }

  return nodeType;
}
var checkValidKey = function checkValidKey(children) {
  var obj = {};
  var onceWarnDuplicate = once(log);
  var onceWarnUndefined = once(log);
  children.forEach(function (c) {
    if (isValidElement(c) && !c._store['validKey']) {
      if (typeof c.key === 'string') {
        if (obj[c.key]) {
          onceWarnDuplicate({
            message: 'array child have duplicate key'
          });
        }

        obj[c.key] = true;
      } else {
        onceWarnUndefined({
          message: 'each array child must have a unique key props',
          triggerOnce: true
        });
      }

      c._store['validKey'] = true;
    }
  });
};
var checkArrayChildrenKey = function checkArrayChildrenKey(children) {
  if (enableAllCheck.current) {
    children.forEach(function (child) {
      if (Array.isArray(child)) {
        checkValidKey(child);
      } else {
        if (isValidElement(child)) child._store['validKey'] = true;
      }
    });
  }
};
var checkSingleChildrenKey = function checkSingleChildrenKey(children) {
  if (enableAllCheck.current) {
    if (Array.isArray(children)) {
      checkValidKey(children);
    } else {
      if (isValidElement(children)) children._store['validKey'] = true;
    }
  }
};

var _excluded = ["ref", "key", "__self", "__source"],
    _excluded2 = ["ref", "key", "__self", "__source"];

var createVDom = function createVDom(_ref2) {
  var _ref3;

  var type = _ref2.type,
      key = _ref2.key,
      ref = _ref2.ref,
      props = _ref2.props,
      _self = _ref2._self,
      _source = _ref2._source,
      _owner = _ref2._owner;
  return _ref3 = {}, _ref3['$$typeof'] = My_React_Element, _ref3.type = type, _ref3.key = key, _ref3.ref = ref, _ref3.props = props, _ref3._owner = _owner, _ref3._self = _self, _ref3._source = _source, _ref3._store = {}, _ref3;
};

function createElement(type, config, children) {
  var key = null;
  var ref = null;
  var self = null;
  var source = null;
  var props = {};

  if (config !== null && config !== undefined) {
    var _ref = config.ref,
        _key = config.key,
        __self = config.__self,
        __source = config.__source,
        resProps = _objectWithoutPropertiesLoose(config, _excluded);

    ref = _ref === undefined ? null : _ref;
    key = _key === undefined ? null : _key + '';
    self = __self === undefined ? null : __self;
    source = __source === undefined ? null : __source;
    Object.keys(resProps).forEach(function (key) {
      return props[key] = resProps[key];
    });
  }

  if (typeof type === 'function' || typeof type === 'object') {
    var typedType = type;
    Object.keys((typedType == null ? void 0 : typedType.defaultProps) || {}).forEach(function (key) {
      var _typedType$defaultPro;

      props[key] = props[key] === undefined ? (_typedType$defaultPro = typedType.defaultProps) == null ? void 0 : _typedType$defaultPro[key] : props[key];
    });
  }

  var childrenLength = arguments.length - 2;

  if (childrenLength > 1) {
    children = Array.from(arguments).slice(2);
    checkArrayChildrenKey(children);
    props.children = children;
  } else if (childrenLength === 1) {
    checkSingleChildrenKey(children);
    props.children = children;
  }

  return createVDom({
    type: type,
    key: key,
    ref: ref,
    props: props,
    _self: self,
    _source: source,
    _owner: currentFunctionFiber.current
  });
}
function cloneElement(element, config, children) {
  if (isValidElement(element)) {
    var props = Object.assign({}, element.props);
    var key = element.key;
    var ref = element.ref;
    var type = element.type;
    var self = element._self;
    var source = element._source;
    var owner = element._owner;

    if (config !== null && config !== undefined) {
      var _ref = config.ref,
          _key = config.key,
          resProps = _objectWithoutPropertiesLoose(config, _excluded2);

      if (_ref !== undefined) {
        ref = _ref;
        owner = currentFunctionFiber.current;
      }

      if (_key !== undefined) {
        key = _key + '';
      }

      var defaultProps = {};

      if (typeof element.type === 'function' || typeof element.type === 'object') {
        var typedType = element.type;
        defaultProps = typedType == null ? void 0 : typedType.defaultProps;
      }

      for (var _key2 in resProps) {
        if (Object.prototype.hasOwnProperty.call(resProps, _key2)) {
          if (resProps[_key2] === undefined && defaultProps) {
            props[_key2] = defaultProps[_key2];
          } else {
            props[_key2] = resProps[_key2];
          }
        }
      }
    }

    var childrenLength = arguments.length - 2;

    if (childrenLength > 1) {
      children = Array.from(arguments).slice(2);
      checkArrayChildrenKey(children);
      props.children = children;
    } else if (childrenLength === 1) {
      checkSingleChildrenKey(children);
      props.children = children;
    }

    var clonedElement = createVDom({
      type: type,
      key: key,
      ref: ref,
      props: props,
      _self: self,
      _source: source,
      _owner: owner
    });
    clonedElement._store['clonedEle'] = true;
    return clonedElement;
  } else {
    throw new Error('cloneElement() need valid element as args');
  }
}

var contextId = 0;
var createContext = function createContext(value) {
  var _ContextObject, _Provider, _Consumer;

  var ContextObject = (_ContextObject = {}, _ContextObject['$$typeof'] = My_React_Context, _ContextObject.id = contextId++, _ContextObject.Provider = {}, _ContextObject.Consumer = {}, _ContextObject);
  var Provider = (_Provider = {}, _Provider['$$typeof'] = My_React_Provider, _Provider.value = value, _Provider.Context = {
    id: 0
  }, _Provider);
  var Consumer = (_Consumer = {}, _Consumer['$$typeof'] = My_React_Consumer, _Consumer.Internal = MyReactInternalInstance, _Consumer.Context = {
    id: 0
  }, _Consumer);
  Object.defineProperty(Provider, 'Context', {
    get: function get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false
  });
  Object.defineProperty(Consumer, 'Context', {
    get: function get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false
  });
  ContextObject.Provider = Provider;
  ContextObject.Consumer = Consumer;
  return ContextObject;
};
var forwardRef = function forwardRef(render) {
  var _ref;

  return _ref = {}, _ref['$$typeof'] = My_React_ForwardRef, _ref.render = render, _ref;
};
var memo = function memo(render) {
  var _ref2;

  return _ref2 = {}, _ref2['$$typeof'] = My_React_Memo, _ref2.render = render, _ref2;
};
var lazy = function lazy(loader) {
  var _ref3;

  return _ref3 = {}, _ref3['$$typeof'] = My_React_Lazy, _ref3.loader = loader, _ref3._loading = false, _ref3._loaded = false, _ref3.render = null, _ref3;
};

var mapByJudge = function mapByJudge(arrayLike, judge, action) {
  var arrayChildren = flattenChildren(arrayLike);
  return arrayChildren.map(function (v, index) {
    if (judge(v)) {
      return action.call(null, v, index, arrayChildren);
    } else {
      return v;
    }
  });
};

var map = function map(arrayLike, action) {
  return mapByJudge(arrayLike, function (v) {
    return v !== undefined && v !== null;
  }, action);
};
var toArray = function toArray(arrayLike) {
  return map(arrayLike, function (element, index) {
    return cloneElement(element, {
      key: (element == null ? void 0 : element.key) !== undefined ? ".$" + element.key : "." + index
    });
  });
};
var forEach = function forEach(arrayLike, action) {
  mapByJudge(arrayLike, function (v) {
    return v !== undefined && v !== null;
  }, action);
};
var count = function count(arrayLike) {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce(function (p, c) {
      return p + count(c);
    }, 0);
  }

  return 1;
};
var only = function only(child) {
  if (isValidElement(child)) return child;
  if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') return true;
  throw new Error('Children.only() expected to receive a single MyReact element child.');
};

var MyReactComponent = /*#__PURE__*/function (_MyReactInternalInsta) {
  _inheritsLoose(MyReactComponent, _MyReactInternalInsta);

  function MyReactComponent(props, context) {
    var _this;

    _this = _MyReactInternalInsta.call(this) || this;
    _this.state = null;
    _this.props = null;
    _this.context = null;

    _this.setState = function (payLoad, callback) {
      var _this$__fiber__;

      var updater = {
        type: 'state',
        payLoad: payLoad,
        callback: callback,
        trigger: _assertThisInitialized(_this)
      };
      (_this$__fiber__ = _this.__fiber__) == null ? void 0 : _this$__fiber__.__compUpdateQueue__.push(updater);
      Promise.resolve().then(function () {
        var _this$__fiber__2;

        (_this$__fiber__2 = _this.__fiber__) == null ? void 0 : _this$__fiber__2.update();
      });
    };

    _this.forceUpdate = function () {
      var _this$__fiber__3;

      var updater = {
        type: 'state',
        isForce: true,
        trigger: _assertThisInitialized(_this)
      };
      (_this$__fiber__3 = _this.__fiber__) == null ? void 0 : _this$__fiber__3.__compUpdateQueue__.push(updater);
      Promise.resolve().then(function () {
        var _this$__fiber__4;

        (_this$__fiber__4 = _this.__fiber__) == null ? void 0 : _this$__fiber__4.update();
      });
    };

    _this.props = props || null;
    _this.context = context || null;
    return _this;
  }

  var _proto = MyReactComponent.prototype;

  _proto.unmount = function unmount() {
    _MyReactInternalInsta.prototype.unmount.call(this);

    var instance = this;
    instance.componentWillUnmount == null ? void 0 : instance.componentWillUnmount();
  };

  _createClass(MyReactComponent, [{
    key: "isReactComponent",
    get: function get() {
      return true;
    }
  }, {
    key: "isMyReactComponent",
    get: function get() {
      return true;
    }
  }]);

  return MyReactComponent;
}(MyReactInternalInstance);
var MyReactPureComponent = /*#__PURE__*/function (_MyReactComponent) {
  _inheritsLoose(MyReactPureComponent, _MyReactComponent);

  function MyReactPureComponent() {
    return _MyReactComponent.apply(this, arguments) || this;
  }

  var _proto2 = MyReactPureComponent.prototype;

  _proto2.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !isNormalEquals(nextProps, this.props) || !isNormalEquals(nextState, this.state) || !isNormalEquals(nextContext, this.context);
  };

  return MyReactPureComponent;
}(MyReactComponent);

var getKeyMatchedChildren = function getKeyMatchedChildren(newChildren, prevFiberChildren) {
  if (!isAppMounted.current) return prevFiberChildren;
  if (isServerRender.current) return prevFiberChildren;
  if (isHydrateRender.current) return prevFiberChildren;
  if (!enableKeyDiff.current) return prevFiberChildren;
  if (!prevFiberChildren) return prevFiberChildren;
  if (prevFiberChildren.length === 0) return prevFiberChildren;
  var tempChildren = prevFiberChildren.slice(0);
  var assignPrevChildren = Array(tempChildren.length).fill(null);
  newChildren.forEach(function (element, index) {
    if (tempChildren.length) {
      if (isValidElement(element)) {
        if (typeof element.key === 'string') {
          var targetIndex = tempChildren.findIndex(function (fiber) {
            var _fiber$element;

            return fiber instanceof MyReactFiberNode && typeof fiber.element === 'object' && ((_fiber$element = fiber.element) == null ? void 0 : _fiber$element.key) === element.key;
          });

          if (targetIndex !== -1) {
            assignPrevChildren[index] = tempChildren[targetIndex];
            tempChildren.splice(targetIndex, 1);
          }
        }
      }
    }
  });
  return assignPrevChildren.map(function (v) {
    if (v) return v;
    return tempChildren.shift();
  });
};

var getIsSameTypeNode = function getIsSameTypeNode(newChild, prevFiberChild) {
  if (!isAppMounted.current) return false;
  var newChildIsArray = Array.isArray(newChild);
  var prevElementChildIsArray = Array.isArray(prevFiberChild);
  if (newChildIsArray && prevElementChildIsArray) return true;
  if (newChildIsArray) return false;
  if (prevElementChildIsArray) return false;
  var typedPrevFiberChild = prevFiberChild;
  var typedNewChild = newChild;
  var prevRenderedChild = typedPrevFiberChild == null ? void 0 : typedPrevFiberChild.element;
  var result = typedPrevFiberChild == null ? void 0 : typedPrevFiberChild.checkIsSameType(typedNewChild);

  if (result && enableKeyDiff.current && !typedPrevFiberChild.__isTextNode__ && !typedPrevFiberChild.__isNullNode__) {
    return typedNewChild.key === prevRenderedChild.key;
  } else {
    return result;
  }
};

var getNewFiberWithUpdate = function getNewFiberWithUpdate(newChild, parentFiber, prevFiberChild, assignPrevFiberChild) {
  var isSameType = getIsSameTypeNode(newChild, assignPrevFiberChild);

  if (isSameType) {
    if (Array.isArray(newChild) && Array.isArray(prevFiberChild) && Array.isArray(assignPrevFiberChild)) {
      var assignPrevFiberChildren = getKeyMatchedChildren(newChild, assignPrevFiberChild);

      if (newChild.length < assignPrevFiberChildren.length) {
        globalDispatch.current.pendingUnmount(parentFiber, assignPrevFiberChildren.slice(newChild.length));
      }

      return newChild.map(function (v, index) {
        return getNewFiberWithUpdate(v, parentFiber, prevFiberChild[index], assignPrevFiberChildren[index]);
      });
    }

    return updateFiberNode({
      fiber: assignPrevFiberChild,
      parent: parentFiber,
      prevFiber: prevFiberChild
    }, newChild);
  } else {
    if (assignPrevFiberChild) {
      globalDispatch.current.pendingUnmount(parentFiber, assignPrevFiberChild);
    }

    if (Array.isArray(newChild)) {
      return newChild.map(function (v) {
        return getNewFiberWithUpdate(v, parentFiber);
      });
    }

    return createFiberNode({
      fiberIndex: parentFiber.fiberIndex + 1,
      parent: parentFiber,
      type: 'position'
    }, newChild);
  }
};

var getNewFiberWithInitial = function getNewFiberWithInitial(newChild, parentFiber) {
  if (Array.isArray(newChild)) {
    return newChild.map(function (v) {
      return getNewFiberWithInitial(v, parentFiber);
    });
  }

  return createFiberNode({
    fiberIndex: parentFiber.fiberIndex + 1,
    parent: parentFiber
  }, newChild);
};

var transformChildrenFiber = function transformChildrenFiber(parentFiber, children) {
  var index = 0;
  var isUpdate = parentFiber.__isUpdateRender__;
  var newChildren = Array.isArray(children) ? children : [children];
  var prevFiberChildren = isUpdate ? parentFiber.__renderedChildren__ : [];
  var assignPrevFiberChildren = getKeyMatchedChildren(newChildren, prevFiberChildren);
  parentFiber.__renderedChildren__ = [];
  parentFiber.beforeUpdate();

  while (index < newChildren.length || index < assignPrevFiberChildren.length) {
    var newChild = newChildren[index];
    var prevFiberChild = prevFiberChildren[index];
    var assignPrevFiberChild = assignPrevFiberChildren[index];
    var newFiber = isUpdate ? getNewFiberWithUpdate(newChild, parentFiber, prevFiberChild, assignPrevFiberChild) : getNewFiberWithInitial(newChild, parentFiber);

    parentFiber.__renderedChildren__.push(newFiber);

    index++;
  }

  parentFiber.afterUpdate();
  return parentFiber.children;
};

var nextWorkCommon = function nextWorkCommon(fiber) {
  if (fiber.__isRenderDynamic__) {
    return transformChildrenFiber(fiber, fiber.__dynamicChildren__);
  } else {
    return transformChildrenFiber(fiber, fiber.__children__);
  }
};

var nextWorkClassComponent = function nextWorkClassComponent(fiber) {
  if (!fiber.instance) {
    return classComponentMount(fiber);
  } else {
    return classComponentUpdate(fiber);
  }
};

var nextWorkFunctionComponent = function nextWorkFunctionComponent(fiber) {
  processHookUpdateQueue(fiber);
  currentHookDeepIndex.current = 0;
  currentFunctionFiber.current = fiber;
  var typedElement = fiber.element;
  var children = typedElement.type(fiber.__props__);
  currentFunctionFiber.current = null;
  currentHookDeepIndex.current = 0;
  fiber.__dynamicChildren__ = children;
  return nextWorkCommon(fiber);
};

var nextWorkComponent = function nextWorkComponent(fiber) {
  if (fiber.__isFunctionComponent__) {
    return nextWorkFunctionComponent(fiber);
  } else {
    return nextWorkClassComponent(fiber);
  }
};

var nextWorkMemo = function nextWorkMemo(fiber) {
  var _targetRender$prototy;

  var _fiber$element = fiber.element,
      type = _fiber$element.type,
      ref = _fiber$element.ref;
  var typedType = type;
  var render = typedType.render;
  var isForwardRefRender = false;
  var targetRender = typeof render === 'object' ? (isForwardRefRender = true, render.render) : render;
  var isClassComponent = targetRender == null ? void 0 : (_targetRender$prototy = targetRender.prototype) == null ? void 0 : _targetRender$prototy.isMyReactComponent;

  if (isClassComponent) {
    return nextWorkClassComponent(fiber);
  } else {
    processHookUpdateQueue(fiber);
    currentHookDeepIndex.current = 0;
    currentFunctionFiber.current = fiber;
    var typedRender = targetRender;
    var children = isForwardRefRender ? typedRender(fiber.__props__, ref) : typedRender(fiber.__props__);
    currentFunctionFiber.current = null;
    currentHookDeepIndex.current = 0;
    fiber.__dynamicChildren__ = children;
    return nextWorkCommon(fiber);
  }
};

var nextWorkLazy = function nextWorkLazy(fiber) {
  var type = fiber.element.type;
  var typedType = type;

  if (typedType._loaded === true) {
    var render = typedType.render;
    fiber.__dynamicChildren__ = createElement(render, fiber.__props__);
    return nextWorkCommon(fiber);
  } else if (typedType._loading === false) {
    if (!isServerRender.current) {
      typedType._loading = true;
      Promise.resolve().then(function () {
        return typedType.loader();
      }).then(function (re) {
        var render = typeof re === 'object' && typeof (re == null ? void 0 : re["default"]) === 'function' ? re["default"] : re;
        typedType._loaded = true;
        typedType._loading = false;
        typedType.render = render;
        fiber.update();
      });
    }
  }

  fiber.__dynamicChildren__ = fiber.__fallback__;
  return nextWorkCommon(fiber);
};

var nextWorkForwardRef = function nextWorkForwardRef(fiber) {
  processHookUpdateQueue(fiber);
  var _fiber$element2 = fiber.element,
      type = _fiber$element2.type,
      ref = _fiber$element2.ref;
  var typedType = type;
  var typedRender = typedType.render;
  currentHookDeepIndex.current = 0;
  currentFunctionFiber.current = fiber;
  var children = typedRender(fiber.__props__, ref);
  currentFunctionFiber.current = null;
  currentHookDeepIndex.current = 0;
  fiber.__dynamicChildren__ = children;
  return nextWorkCommon(fiber);
};

var nextWorkProvider = function nextWorkProvider(fiber) {
  return nextWorkCommon(fiber);
};

var nextWorkConsumer = function nextWorkConsumer(fiber) {
  var _fiber$element3 = fiber.element,
      type = _fiber$element3.type,
      props = _fiber$element3.props;
  var typedType = type;
  fiber.instance = fiber.instance || new typedType.Internal();
  fiber.instance.setFiber(fiber);
  var Context = typedType.Context;

  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    var ProviderFiber = getContextFiber(fiber, Context);
    var context = getContextValue(ProviderFiber, Context);
    fiber.instance.context = context;
    fiber.instance.setContext(ProviderFiber);
  } else {
    var _context = getContextValue(fiber.instance.__context__, Context);

    fiber.instance.context = _context;
  }

  var typedChildren = props.children;
  var children = typedChildren(fiber.instance.context);
  fiber.__dynamicChildren__ = children;
  return nextWorkCommon(fiber);
};

var nextWorkObject = function nextWorkObject(fiber) {
  if (fiber.__isMemo__) return nextWorkMemo(fiber);
  if (fiber.__isLazy__) return nextWorkLazy(fiber);
  if (fiber.__isPortal__) return nextWorkCommon(fiber);
  if (fiber.__isSuspense__) return nextWorkCommon(fiber);
  if (fiber.__isForwardRef__) return nextWorkForwardRef(fiber);
  if (fiber.__isContextProvider__) return nextWorkProvider(fiber);
  if (fiber.__isContextConsumer__) return nextWorkConsumer(fiber);
  throw new Error("unknown element " + fiber.element);
};

var nextWorkSync = function nextWorkSync(fiber) {
  if (!fiber.mount) return [];
  if (!fiber.__needUpdate__ && !fiber.__needTrigger__) return [];
  currentRunningFiber.current = fiber;
  var children = [];
  if (fiber.__isDynamicNode__) children = nextWorkComponent(fiber);else if (fiber.__isObjectNode__) children = nextWorkObject(fiber);else children = nextWorkCommon(fiber);
  currentRunningFiber.current = null;
  return children;
};
var nextWorkAsync = function nextWorkAsync(fiber) {
  if (!fiber.mount) return null;

  if (fiber.__needUpdate__ || fiber.__needTrigger__) {
    currentRunningFiber.current = fiber;
    if (fiber.__isDynamicNode__) nextWorkComponent(fiber);else if (fiber.__isObjectNode__) nextWorkObject(fiber);else nextWorkCommon(fiber);
    currentRunningFiber.current = null;

    if (fiber.children.length) {
      return fiber.child;
    }
  }

  var nextFiber = fiber;

  while (nextFiber && nextFiber !== pendingModifyTopLevelFiber.current) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }

  return null;
};

var loopStart = function loopStart(fiber) {
  var _cRoundTransformFiber;

  (_cRoundTransformFiber = cRoundTransformFiberArray.current).push.apply(_cRoundTransformFiber, nextWorkSync(fiber));
};

var loopCurrent = function loopCurrent() {
  while (cRoundTransformFiberArray.current.length) {
    var fiber = cRoundTransformFiberArray.current.shift();

    if (fiber) {
      var _nRoundTransformFiber;

      (_nRoundTransformFiber = nRoundTransformFiberArray.current).push.apply(_nRoundTransformFiber, nextWorkSync(fiber));
    }
  }
};

var loopNext = function loopNext() {
  while (nRoundTransformFiberArray.current.length) {
    var fiber = nRoundTransformFiberArray.current.shift();

    if (fiber) {
      var _cRoundTransformFiber2;

      (_cRoundTransformFiber2 = cRoundTransformFiberArray.current).push.apply(_cRoundTransformFiber2, nextWorkSync(fiber));
    }
  }
};

var loopToEnd = function loopToEnd() {
  loopCurrent();
  loopNext();

  if (cRoundTransformFiberArray.current.length) {
    loopToEnd();
  }
};

var loopAll = function loopAll(fiber) {
  loopStart(fiber);
  loopToEnd();
};

var mountLoopSync = function mountLoopSync(fiber) {
  return loopAll(fiber);
};

var updateLoopSync = function updateLoopSync(loopController, reconcileUpdate) {
  if (loopController.hasNext()) {
    var fiber = loopController.getNext();

    var _loop = function _loop() {
      var _fiber = fiber;
      fiber = safeCall(function () {
        return nextWorkAsync(_fiber);
      });
      loopController.getUpdateList(_fiber);
      loopController.setYield(fiber);
    };

    while (fiber) {
      _loop();
    }
  }

  reconcileUpdate();
};

var updateLoopAsync = function updateLoopAsync(loopController, shouldPause, reconcileUpdate) {
  var _loop = function _loop() {
    var fiber = loopController.getNext();

    if (fiber) {
      var nextFiber = safeCall(function () {
        return nextWorkAsync(fiber);
      });
      loopController.getUpdateList(fiber);
      loopController.setYield(nextFiber);
    }
  };

  while (loopController.hasNext() && !shouldPause()) {
    _loop();
  }

  if (!loopController.doesPause()) {
    reconcileUpdate();
  }
};

var processComponentStateFromProps = function processComponentStateFromProps(fiber) {
  var typedElement = fiber.element;
  var Component = fiber.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
  var typedComponent = Component;
  var typedInstance = fiber.instance;
  var props = Object.assign({}, typedElement.props);
  var state = Object.assign({}, typedInstance.state);

  if (typeof typedComponent.getDerivedStateFromProps === 'function') {
    var payloadState = typedComponent.getDerivedStateFromProps(props, state);

    if (payloadState) {
      typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
    }
  }
};

var processComponentInstanceOnMount = function processComponentInstanceOnMount(fiber) {
  var typedElement = fiber.element;
  var Component = fiber.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
  var typedComponent = Component;
  var ProviderFiber = getContextFiber(fiber, typedComponent.contextType);
  var context = getContextValue(ProviderFiber, typedComponent.contextType);
  var props = Object.assign({}, typedElement.props);
  var instance = new typedComponent(props, context);
  instance.props = props;
  instance.context = context;
  fiber.installInstance(instance);
  instance.setFiber(fiber);
  instance.setContext(ProviderFiber);
};

var processComponentFiberOnUpdate = function processComponentFiberOnUpdate(fiber) {
  var typedInstance = fiber.instance;
  typedInstance.setFiber(fiber);
};

var processComponentRenderOnMountAndUpdate = function processComponentRenderOnMountAndUpdate(fiber) {
  var typedInstance = fiber.instance;
  var children = typedInstance.render();
  fiber.__dynamicChildren__ = children;
  return nextWorkCommon(fiber);
};

var processComponentDidMountOnMount = function processComponentDidMountOnMount(fiber) {
  var typedInstance = fiber.instance;

  if (typedInstance.componentDidMount && !typedInstance.__pendingEffect__) {
    typedInstance.__pendingEffect__ = true;
    globalDispatch.current.pendingLayoutEffect(fiber, function () {
      typedInstance.__pendingEffect__ = false;
      typedInstance.componentDidMount == null ? void 0 : typedInstance.componentDidMount();
    });
  }
};

var processComponentContextOnUpdate = function processComponentContextOnUpdate(fiber) {
  var typedElement = fiber.element;
  var Component = fiber.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
  var typedInstance = fiber.instance;
  var typedComponent = Component;

  if (!(typedInstance != null && typedInstance.__context__) || !typedInstance.__context__.mount) {
    var ProviderFiber = getContextFiber(fiber, typedComponent.contextType);
    var context = getContextValue(ProviderFiber, typedComponent.contextType);
    typedInstance == null ? void 0 : typedInstance.setContext(ProviderFiber);
    return context;
  } else {
    var _context = getContextValue(typedInstance.__context__, typedComponent.contextType);

    return _context;
  }
};

var processComponentShouldUpdateOnUpdate = function processComponentShouldUpdateOnUpdate(fiber, _ref) {
  var nextState = _ref.nextState,
      nextProps = _ref.nextProps,
      nextContext = _ref.nextContext;
  var typedInstance = fiber.instance;
  if (fiber.__needTrigger__) return true;

  if (typedInstance.shouldComponentUpdate) {
    return typedInstance.shouldComponentUpdate(nextProps, nextState, nextContext);
  }

  return true;
};

var processComponentDidUpdateOnUpdate = function processComponentDidUpdateOnUpdate(fiber, _ref2) {
  var baseState = _ref2.baseState,
      baseProps = _ref2.baseProps,
      baseContext = _ref2.baseContext,
      callback = _ref2.callback;
  var typedInstance = fiber.instance;
  var hasEffect = typedInstance.componentDidUpdate || callback.length; // TODO it is necessary to use __pendingEffect__ field ?

  if (hasEffect && !typedInstance.__pendingEffect__) {
    typedInstance.__pendingEffect__ = true;
    globalDispatch.current.pendingLayoutEffect(fiber, function () {
      typedInstance.__pendingEffect__ = false;
      callback.forEach(function (c) {
        return c.call(null);
      });
      typedInstance.componentDidUpdate == null ? void 0 : typedInstance.componentDidUpdate(baseProps, baseState, baseContext);
    });
  }
};

var classComponentMount = function classComponentMount(fiber) {
  processComponentInstanceOnMount(fiber);
  processComponentStateFromProps(fiber);
  var children = processComponentRenderOnMountAndUpdate(fiber);
  processComponentDidMountOnMount(fiber);
  return children;
};
var classComponentUpdate = function classComponentUpdate(fiber) {
  processComponentFiberOnUpdate(fiber);
  processComponentStateFromProps(fiber);

  var _processComponentUpda = processComponentUpdateQueue(fiber),
      newState = _processComponentUpda.newState,
      isForce = _processComponentUpda.isForce,
      callback = _processComponentUpda.callback;

  var typedInstance = fiber.instance;
  var baseState = typedInstance.state;
  var baseProps = typedInstance.props;
  var baseContext = typedInstance.context;
  var nextState = Object.assign({}, baseState, newState);
  var nextProps = Object.assign({}, fiber.__props__);
  var nextContext = processComponentContextOnUpdate(fiber);
  var shouldUpdate = isForce;

  if (!shouldUpdate) {
    shouldUpdate = processComponentShouldUpdateOnUpdate(fiber, {
      nextState: nextState,
      nextProps: nextProps,
      nextContext: nextContext
    });
  }

  typedInstance.state = nextState;
  typedInstance.props = nextProps;
  typedInstance.context = nextContext;

  if (shouldUpdate) {
    var children = processComponentRenderOnMountAndUpdate(fiber);
    processComponentDidUpdateOnUpdate(fiber, {
      baseContext: baseContext,
      baseProps: baseProps,
      baseState: baseState,
      callback: callback
    });
    return children;
  } else {
    return [];
  }
};

var reconcileMount = function reconcileMount(fiber, hydrate) {
  globalDispatch.current.reconcileCommit(fiber, hydrate, fiber);
};

var startRender = function startRender(fiber, hydrate) {
  if (hydrate === void 0) {
    hydrate = false;
  }

  globalLoop.current = true;
  safeCall(function () {
    return mountLoopSync(fiber);
  });
  reconcileMount(fiber, hydrate);
  isAppMounted.current = true;
  globalLoop.current = false;
};

var createPortal = function createPortal(element, container) {
  var _createElement;

  return createElement((_createElement = {}, _createElement['$$typeof'] = My_React_Portal, _createElement), {
    container: container
  }, element);
};

var isInternal = function isInternal(key) {
  return key.startsWith('_');
};
var isChildren = function isChildren(key) {
  return key === 'children' || key === 'dangerouslySetInnerHTML';
};
var isEvent = function isEvent(key) {
  return key.startsWith('on');
};
var isStyle = function isStyle(key) {
  return key === 'style';
};
var isProperty = function isProperty(key) {
  return !isChildren(key) && !isEvent(key) && !isStyle(key) && !isInternal(key);
};
var isNew = function isNew(oldProps, newProps) {
  return function (key) {
    return oldProps[key] !== newProps[key];
  };
};
var isGone = function isGone(newProps) {
  return function (key) {
    return !(key in newProps);
  };
};

var findDOMFromFiber = function findDOMFromFiber(fiber) {
  var currentArray = [fiber];

  while (currentArray.length) {
    var next = currentArray.shift();
    if (next != null && next.dom) return next.dom;
    currentArray.push.apply(currentArray, (next == null ? void 0 : next.children) || []);
  }

  return null;
};

var findDOMFromComponentFiber = function findDOMFromComponentFiber(fiber) {
  if (fiber) {
    if (fiber.dom) return fiber.dom;

    for (var i = 0; i < fiber.children.length; i++) {
      var dom = findDOMFromFiber(fiber.children[i]);
      if (dom) return dom;
    }
  }

  return null;
};

var findDOMNode = function findDOMNode(instance) {
  if (instance instanceof MyReactComponent && instance.__fiber__) {
    return findDOMFromComponentFiber(instance.__fiber__);
  } else {
    return null;
  }
};

var updateEntry = function updateEntry() {
  if (globalLoop.current) return;

  if (enableAsyncUpdate.current) {
    globalDispatch.current.updateAllAsync();
  } else {
    globalDispatch.current.updateAllSync();
  }
};

var asyncUpdate = function asyncUpdate() {
  return Promise.resolve().then(updateEntry);
};

var triggerUpdate = function triggerUpdate(fiber) {
  var canUpdate = cannotUpdate();

  if (canUpdate) {
    fiber.triggerUpdate();
    pendingModifyFiberArray.current.push(fiber);
    asyncUpdate();
  }
};

var clearFiberDom = function clearFiberDom(fiber) {
  if (fiber.dom) {
    if (!fiber.__isPortal__ && !fiber.__root__) {
      var _fiber$dom;

      (_fiber$dom = fiber.dom) == null ? void 0 : _fiber$dom.remove();
    } else {
      fiber.children.forEach(clearFiberDom);
    }
  } else {
    fiber.children.forEach(clearFiberDom);
  }
};

var _unmount = function _unmount(fiber) {
  unmountFiber(fiber);
  clearFiberDom(fiber);
};
var unmount = function unmount(fiber) {
  var allUnmountFiber = fiber.__unmountQueue__.slice(0);

  if (allUnmountFiber.length) {
    mapFiber(allUnmountFiber, function (f) {
      return _unmount(f);
    });
  }

  fiber.__unmountQueue__ = [];
};

var unmountComponentAtNode = function unmountComponentAtNode(container) {
  var fiber = container.__fiber__;

  if (fiber instanceof MyReactFiberNode) {
    _unmount(fiber);
  }
};

var reconcileUpdate = function reconcileUpdate() {
  var allPendingList = pendingUpdateFiberListArray.current.slice(0);
  allPendingList.forEach(function (l) {
    return globalDispatch.current.reconcileCreate(l);
  });
  allPendingList.forEach(function (l) {
    return globalDispatch.current.reconcileUpdate(l);
  });
  pendingUpdateFiberListArray.current = [];
};

var getFiberWithDom = function getFiberWithDom(fiber, transform) {
  if (fiber) {
    if (fiber.dom) return fiber;
    return getFiberWithDom(transform(fiber), transform);
  }

  return null;
};

var currentYield = null;
var updateFiberController = {
  setYield: function setYield(fiber) {
    if (fiber) {
      currentYield = fiber;
    } else {
      currentYield = null;
      globalDispatch.current.endProgressList();
    }
  },
  getNext: function getNext() {
    if (isAppCrash.current) return null;
    var yieldFiber = currentYield;
    currentYield = null;
    if (yieldFiber) return yieldFiber;

    while (pendingModifyFiberArray.current.length) {
      var newProgressFiber = pendingModifyFiberArray.current.shift();

      if (newProgressFiber != null && newProgressFiber.mount) {
        globalDispatch.current.beginProgressList();
        pendingModifyTopLevelFiber.current = newProgressFiber;
        return newProgressFiber;
      }
    }

    return null;
  },
  getUpdateList: function getUpdateList(fiber) {
    globalDispatch.current.generateUpdateList(fiber);
  },
  hasNext: function hasNext() {
    if (isAppCrash.current) return false;
    return currentYield !== null || pendingModifyFiberArray.current.length > 0;
  },
  doesPause: function doesPause() {
    return currentYield !== null;
  }
};

var updateAllSync = function updateAllSync() {
  globalLoop.current = true;
  updateLoopSync(updateFiberController, reconcileUpdate);
  globalLoop.current = false;
  Promise.resolve().then(function () {
    if (updateFiberController.hasNext()) {
      updateAllSync();
    }
  });
};
var updateAllAsync = function updateAllAsync() {
  globalLoop.current = true;
  updateLoopAsync(updateFiberController, shouldPauseAsyncUpdate, reconcileUpdate);
  globalLoop.current = false;
  Promise.resolve().then(function () {
    if (updateFiberController.hasNext()) {
      updateAllAsync();
    }
  });
};

var append = function append(fiber, parentFiberWithDom) {
  if (fiber.__pendingAppend__) {
    if (!fiber.dom || !parentFiberWithDom.dom) throw new Error('append error, dom not exist');
    var parentDom = parentFiberWithDom.dom;

    if (!Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, parentDom.tagName.toLowerCase())) {
      parentDom.appendChild(fiber.dom);
    }

    fiber.__pendingAppend__ = false;
  }
};

var context = function context(fiber) {
  if (fiber.__pendingContext__) {
    var allListeners = fiber.__dependence__.slice(0);

    Promise.resolve().then(function () {
      allListeners.map(function (f) {
        return f.__fiber__;
      }).forEach(function (f) {
        return (f == null ? void 0 : f.mount) && f.update();
      });
    });
    fiber.__pendingContext__ = false;
  }
};

var getNextHydrateDom = function getNextHydrateDom(parentDom) {
  var children = Array.from(parentDom.childNodes);
  return children.find(function (dom) {
    return dom.nodeType !== document.COMMENT_NODE && !dom.__hydrate__;
  });
};

var checkHydrateDom = function checkHydrateDom(fiber, dom) {
  if (!dom) {
    log({
      fiber: fiber,
      level: 'error',
      message: 'hydrate error, dom not render from server'
    });
    return false;
  }

  if (fiber.__isTextNode__) {
    if (dom.nodeType !== Node.TEXT_NODE) {
      log({
        fiber: fiber,
        level: 'error',
        message: "hydrate error, dom not match from server. server: " + dom.nodeName.toLowerCase() + ", client: " + fiber.element
      });
      return false;
    }

    return true;
  }

  if (fiber.__isPlainNode__) {
    var typedElement = fiber.element;

    if (dom.nodeType !== Node.ELEMENT_NODE) {
      log({
        fiber: fiber,
        level: 'error',
        message: "hydrate error, dom not match from server. server: " + dom.nodeName.toLowerCase() + ", client: " + typedElement.type.toString()
      });
      return false;
    }

    if (typedElement.type.toString() !== dom.nodeName.toLowerCase()) {
      log({
        fiber: fiber,
        level: 'error',
        message: "hydrate error, dom not match from server. server: " + dom.nodeName.toLowerCase() + ", client: " + typedElement.type.toString()
      });
      return false;
    }

    return true;
  }

  throw new Error('hydrate error, look like a bug');
};

var getHydrateDom = function getHydrateDom(fiber, parentDom) {
  if (IS_SINGLE_ELEMENT[parentDom.tagName.toLowerCase()]) return {
    result: true
  };
  var dom = getNextHydrateDom(parentDom);
  var result = checkHydrateDom(fiber, dom);

  if (result) {
    var typedDom = dom;
    fiber.dom = typedDom;
    return {
      dom: typedDom,
      result: result
    };
  } else {
    return {
      dom: dom,
      result: result
    };
  }
};

// import { fallback } from './fallback';
var hydrateCreate = function hydrateCreate(fiber, parentFiberWithDom) {
  if (fiber.__isTextNode__ || fiber.__isPlainNode__) {
    var _getHydrateDom = getHydrateDom(fiber, parentFiberWithDom.dom),
        result = _getHydrateDom.result;

    return result;
  }

  throw new Error('hydrate error, portal element can not hydrate');
};

var nativeCreate = function nativeCreate(fiber) {
  if (fiber.__isTextNode__) {
    fiber.dom = document.createTextNode(fiber.element);
  } else if (fiber.__isPlainNode__) {
    var typedElement = fiber.element;

    if (fiber.nameSpace) {
      fiber.dom = document.createElementNS(fiber.nameSpace, typedElement.type);
    } else {
      fiber.dom = document.createElement(typedElement.type);
    }
  } else {
    fiber.dom = fiber.__props__.container;
  }
};

// for invalid dom structure

var validDomNesting = function validDomNesting(fiber) {
  if (!enableAllCheck.current) return;

  if (fiber.__isPlainNode__) {
    var typedElement = fiber.element;

    if (typedElement.type === 'p') {
      var parent = fiber.parent;

      while (parent && parent.__isPlainNode__) {
        var typedParentElement = parent.element;

        if (typedParentElement.type === 'p') {
          log({
            fiber: fiber,
            level: 'warn',
            triggerOnce: true,
            message: "invalid dom nesting: <p> cannot appear as a child of <p>"
          });
        }

        parent = parent.parent;
      }
    }
  }
};

var create = function create(fiber, hydrate, parentFiberWithDom) {
  if (fiber.__pendingCreate__) {
    var re = false;
    validDomNesting(fiber);

    if (hydrate) {
      var result = hydrateCreate(fiber, parentFiberWithDom);

      if (!result) {
        nativeCreate(fiber);
      }

      re = result;
    } else {
      nativeCreate(fiber);
    }

    if (isHydrateRender.current) {
      var typedDom = fiber.dom;
      typedDom.__hydrate__ = true;

      if (enableAllCheck.current && fiber.__isPlainNode__) {
        if (!re) {
          typedDom.setAttribute('debug_hydrate', 'fail');
        } else {
          typedDom.setAttribute('debug_hydrate', 'success');
        }
      }
    }

    fiber.__pendingCreate__ = false;
    return re;
  }

  return hydrate;
};

var layoutEffect = function layoutEffect(fiber) {
  var allLayoutEffect = fiber.__layoutEffectQueue__.slice(0);

  allLayoutEffect.forEach(function (layoutEffect) {
    return layoutEffect.call(null);
  });
  fiber.__layoutEffectQueue__ = [];
};
var effect = function effect(fiber) {
  var allEffect = fiber.__effectQueue__.slice(0);

  allEffect.forEach(function (effect) {
    return effect.call(null);
  });
  fiber.__effectQueue__ = [];
};

var fallback = function fallback(fiber) {
  if (isHydrateRender.current && fiber.__isPlainNode__) {
    var dom = fiber.dom;
    var children = Array.from(dom.childNodes);
    children.forEach(function (node) {
      var typedNode = node;

      if (typedNode.nodeType !== document.COMMENT_NODE && !typedNode.__hydrate__) {
        node.remove();
      }

      delete typedNode['__hydrate__'];
    });
  }
};

var append$1 = function append(fiber, parentDOM) {
  if (!fiber) throw new Error('position error, look like a bug');
  fiber.__pendingAppend__ = false;
  fiber.__pendingPosition__ = false;
  if (fiber.__isPortal__) return;

  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    parentDOM.appendChild(fiber.dom);
    return;
  }

  var child = fiber.child;

  while (child) {
    append(child, parentDOM);
    child = child.sibling;
  }
};

var getFiberWithDom$1 = function getFiberWithDom(fiber, transform) {
  if (transform === void 0) {
    transform = function transform(f) {
      return f.parent;
    };
  }

  if (!fiber) return null;
  if (fiber.__isPortal__) return null;
  if (fiber.dom) return fiber;
  var nextFibers = transform(fiber);

  if (Array.isArray(nextFibers)) {
    return nextFibers.reduce(function (p, c) {
      if (p) return p;
      p = getFiberWithDom(c, transform);
      return p;
    }, null);
  } else {
    return getFiberWithDom(nextFibers, transform);
  }
};

var getInsertBeforeDomFromSibling = function getInsertBeforeDomFromSibling(fiber) {
  if (!fiber) return null;
  var sibling = fiber.sibling;

  if (sibling) {
    return getFiberWithDom$1(sibling, function (f) {
      return f.children;
    }) || getInsertBeforeDomFromSibling(sibling);
  } else {
    return null;
  }
};

var getInsertBeforeDomFromSiblingAndParent = function getInsertBeforeDomFromSiblingAndParent(fiber, parentFiber) {
  if (!fiber) return null;
  if (fiber === parentFiber) return null;
  var beforeDom = getInsertBeforeDomFromSibling(fiber);
  if (beforeDom) return beforeDom;
  return getInsertBeforeDomFromSiblingAndParent(fiber.parent, parentFiber);
};

var insertBefore = function insertBefore(fiber, beforeDOM, parentDOM) {
  if (!fiber) throw new Error('position error, look like a bug');
  fiber.__pendingAppend__ = false;
  fiber.__pendingPosition__ = false;
  if (fiber.__isPortal__) return;

  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    parentDOM.insertBefore(fiber.dom, beforeDOM);
    return;
  }

  var child = fiber.child;

  while (child) {
    insertBefore(child, beforeDOM, parentDOM);
    child = child.sibling;
  } // fiber.children.forEach((f) => insertBefore(f, beforeDOM, parentDOM));

};

var position = function position(fiber, parentFiberWithDom) {
  if (fiber.__pendingPosition__) {
    var beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithDom);

    if (beforeFiberWithDom) {
      insertBefore(fiber, beforeFiberWithDom.dom, parentFiberWithDom.dom);
    } else {
      append$1(fiber, parentFiberWithDom.dom);
    }

    fiber.__pendingPosition__ = false;
  }
};

var getNativeEventName = function getNativeEventName(eventName, tagName, props) {
  var isCapture = false;
  var nativeName = eventName;

  if (eventName.endsWith('Capture')) {
    isCapture = true;
    nativeName = eventName.split('Capture')[0];
  }

  if (nativeName === 'DoubleClick') {
    nativeName = 'dblclick';
  } else if (nativeName === 'Change') {
    if (tagName === 'input') {
      if (props.type === 'radio' || props.type === 'checkbox') {
        nativeName = 'click';
      } else {
        nativeName = 'input';
      }
    } else {
      nativeName = 'change';
    }
  } else {
    nativeName = nativeName.toLowerCase();
  }

  return {
    nativeName: nativeName,
    isCapture: isCapture
  };
};

var controlElementTag = {
  input: true
};
var addEventListener = function addEventListener(fiber, dom, key) {
  var typedElement = fiber.element;
  var callback = typedElement.props[key];

  var _getNativeEventName = getNativeEventName(key.slice(2), typedElement.type, typedElement.props),
      nativeName = _getNativeEventName.nativeName,
      isCapture = _getNativeEventName.isCapture;

  if (enableEventSystem.current) {
    var eventState = fiber.__internal_node_event__;
    var eventName = nativeName + "_" + isCapture;

    if (eventState[eventName]) {
      var _eventState$eventName;

      (_eventState$eventName = eventState[eventName].cb) == null ? void 0 : _eventState$eventName.push(callback);
    } else {
      var handler = function handler() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var e = args[0];
        e.nativeEvent = e;
        safeCallWithFiber({
          action: function action() {
            var _handler$cb;

            return (_handler$cb = handler.cb) == null ? void 0 : _handler$cb.forEach(function (cb) {
              return typeof cb === 'function' && cb.call.apply(cb, [null].concat(args));
            });
          },
          fiber: fiber
        });

        if (enableControlComponent) {
          if (controlElementTag[typedElement.type] && typeof typedElement.props['value'] !== 'undefined') {
            dom['value'] = typedElement.props['value'];
            dom.setAttribute('value', typedElement.props['value']);
          }
        }
      };

      handler.cb = [callback];
      eventState[eventName] = handler;
      dom.addEventListener(nativeName, handler, isCapture);
    }
  } else {
    dom.addEventListener(nativeName, callback, isCapture);
  }
};

var removeEventListener = function removeEventListener(fiber, dom, key) {
  var typedElement = fiber.__prevVdom__;
  var callback = typedElement.props[key];

  var _getNativeEventName = getNativeEventName(key.slice(2), typedElement.type, typedElement.props),
      nativeName = _getNativeEventName.nativeName,
      isCapture = _getNativeEventName.isCapture;

  if (enableEventSystem.current) {
    var _eventState$eventName;

    var eventState = fiber.__internal_node_event__;
    var eventName = nativeName + "_" + isCapture;
    if (!eventState[eventName]) return;
    eventState[eventName].cb = (_eventState$eventName = eventState[eventName].cb) == null ? void 0 : _eventState$eventName.filter(function (c) {
      return c !== callback || typeof c !== 'function';
    });
  } else {
    dom.removeEventListener(nativeName, callback, isCapture);
  }
};

var domPropsHydrate = function domPropsHydrate(fiber, dom) {
  if (fiber.__isTextNode__) {
    if (dom.textContent !== String(fiber.element)) {
      if (dom.textContent === ' ' && fiber.element === '') {
        dom.textContent = '';
      } else {
        log({
          fiber: fiber,
          message: "hydrate warning, text not match from server. server: " + dom.textContent + ", client: " + fiber.element
        });
        dom.textContent = fiber.element;
      }
    }
  } else if (fiber.__isPlainNode__) {
    var typedElement = fiber.element;
    var props = typedElement.props;
    Object.keys(props).filter(isProperty).forEach(function (key) {
      if (props[key] !== null && props[key] !== false && props[key] !== undefined) {
        if (key === 'className') {
          if (fiber.nameSpace) {
            var _dom$getAttribute;

            var v = (_dom$getAttribute = dom.getAttribute('class')) == null ? void 0 : _dom$getAttribute.toString();

            if (v !== String(props[key])) {
              log({
                fiber: fiber,
                message: "hydrate warning, dom " + key + " not match from server. server: " + v + ", client: " + props[key]
              });
              dom.setAttribute('class', props[key]);
            }
          } else {
            if (dom[key].toString() !== String(props[key])) {
              log({
                fiber: fiber,
                message: "hydrate warning, dom " + key + " not match from server. server: " + dom[key] + ", client: " + props[key]
              });
            }
          }
        } else {
          if (key in dom && !fiber.nameSpace) {
            if (dom[key].toString() !== String(props[key])) {
              log({
                fiber: fiber,
                message: "hydrate warning, dom " + key + " props not match from server. server: " + dom[key] + ", client: " + props[key]
              });
              dom[key] = props[key];
            }
          } else {
            var _v = dom.getAttribute(key);

            if ((_v == null ? void 0 : _v.toString()) !== String(props[key])) {
              log({
                fiber: fiber,
                message: "hydrate warning, dom " + _v + " attr not match from server. server: " + _v + ", client: " + props[key]
              });
              dom.setAttribute(key, props[key]);
            }
          }
        }
      }
    });
  }
};

var domStyleHydrate = function domStyleHydrate(fiber, dom) {
  if (fiber.__isPlainNode__) {
    var typedElement = fiber.element;
    var props = typedElement.props;
    Object.keys(props).filter(isStyle).forEach(function (styleKey) {
      var typedProps = props[styleKey] || {};
      Object.keys(typedProps).forEach(function (styleName) {
        if (Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedProps[styleName] === 'number') {
          dom[styleKey][styleName] = typedProps[styleName] + "px";
          return;
        }

        if (typedProps[styleName] !== null && typedProps[styleName] !== undefined) {
          dom[styleKey][styleName] = typedProps[styleName];
        }
      });
    });
  }
};

var domEventHydrate = function domEventHydrate(fiber, dom) {
  if (fiber.__isPlainNode__) {
    var typedElement = fiber.element;
    var props = typedElement.props;
    Object.keys(props).filter(isEvent).forEach(function (key) {
      addEventListener(fiber, dom, key);
    });
  }
};

var hydrateUpdate = function hydrateUpdate(fiber) {
  var dom = fiber.dom; // for now it is necessary to judge

  if (dom) {
    domPropsHydrate(fiber, dom);
    domStyleHydrate(fiber, dom);
    domEventHydrate(fiber, dom);
    debugWithDOM(fiber);
  }

  fiber.__pendingCreate__ = false;
  fiber.__pendingUpdate__ = false;
  fiber.__pendingAppend__ = false;
  fiber.__pendingPosition__ = false;
};

var HighLight = function HighLight() {
  var _this = this;

  this.map = [];
  this.container = null;
  this.range = document.createRange();
  this.__pendingUpdate__ = [];

  this.createHighLight = function () {
    var _this$container;

    var element = document.createElement('div');
    (_this$container = _this.container) == null ? void 0 : _this$container.append(element);
    return element;
  };

  this.getHighLight = function () {
    if (_this.map.length > 0) {
      return _this.map.shift();
    }

    return _this.createHighLight();
  };

  this.highLight = function (fiber) {
    if (fiber.dom) {
      var typedDom = fiber.dom;

      if (!typedDom.__pendingHighLight__) {
        typedDom.__pendingHighLight__ = true;

        _this.startHighLight(fiber);
      }
    }
  };

  this.startHighLight = function (fiber) {
    _this.__pendingUpdate__.push(fiber);

    _this.flashPending();
  };

  this.flashPending = function () {
    Promise.resolve().then(function () {
      var allFiber = _this.__pendingUpdate__.slice(0);

      _this.__pendingUpdate__ = [];
      var allWrapper = [];
      allFiber.forEach(function (f) {
        var _document$scrollingEl, _document$scrollingEl2;

        var wrapperDom = _this.getHighLight();

        allWrapper.push(wrapperDom);
        f.__isTextNode__ ? _this.range.selectNodeContents(f.dom) : _this.range.selectNode(f.dom);

        var rect = _this.range.getBoundingClientRect();

        var left = rect.left + (((_document$scrollingEl = document.scrollingElement) == null ? void 0 : _document$scrollingEl.scrollLeft) || 0);
        var top = rect.top + (((_document$scrollingEl2 = document.scrollingElement) == null ? void 0 : _document$scrollingEl2.scrollTop) || 0);
        var width = rect.width + 4;
        var height = rect.height + 4;
        var positionLeft = left - 2;
        var positionTop = top - 2;
        wrapperDom.style.cssText = "\n          position: absolute;\n          width: " + width + "px;\n          height: " + height + "px;\n          left: " + positionLeft + "px;\n          top: " + positionTop + "px;\n          pointer-events: none;\n          box-shadow: 0.0625rem 0.0625rem 0.0625rem red, -0.0625rem -0.0625rem 0.0625rem red;\n          ";
      });
      setTimeout(function () {
        allWrapper.forEach(function (wrapperDom) {
          wrapperDom.style.boxShadow = 'none';

          _this.map.push(wrapperDom);
        });
        allFiber.forEach(function (f) {
          return f.dom.__pendingHighLight__ = false;
        });
      }, 100);
    });
  };

  this.container = document.createElement('div');
  this.container.setAttribute('debug_highlight', 'MyReact');
  this.container.style.cssText = "\n      position: absolute;\n      z-index: 999999;\n      width: 100%;\n      left: 0;\n      top: 0;\n      pointer-events: none;\n      ";
  document.body.append(this.container);
};
/**
 * @type HighLight
 */

HighLight.instance = undefined;
/**
 *
 * @returns HighLight
 */

HighLight.getHighLightInstance = function () {
  HighLight.instance = HighLight.instance || new HighLight();
  return HighLight.instance;
};

var nativeUpdate = function nativeUpdate(fiber) {
  if (!fiber.dom) throw new Error('update error, dom not exist');

  if (fiber.__isTextNode__) {
    if (fiber.__vdom__ !== fiber.__prevVdom__) {
      fiber.dom.textContent = fiber.element;
    }
  } else {
    var dom = fiber.dom;
    var oldProps = fiber.__prevProps__ || {};
    var newProps = fiber.__props__ || {};
    Object.keys(oldProps).filter(isEvent).filter(function (key) {
      return isGone(newProps)(key) || isNew(oldProps, newProps)(key);
    }).forEach(function (key) {
      return removeEventListener(fiber, dom, key);
    });
    Object.keys(oldProps).filter(isProperty).filter(isGone(newProps)).forEach(function (key) {
      if (key === 'className') {
        if (fiber.nameSpace) {
          dom.removeAttribute('class');
        } else {
          dom[key] = '';
        }
      } else {
        if (key in dom && !fiber.nameSpace) {
          dom[key] = '';
        } else {
          dom.removeAttribute(key);
        }
      }
    });
    Object.keys(oldProps).filter(isStyle).forEach(function (styleKey) {
      Object.keys(oldProps[styleKey] || {}).filter(isGone(newProps[styleKey] || {})).forEach(function (styleName) {
        dom.style[styleName] = '';
      });
    });
    Object.keys(newProps).filter(isEvent).filter(isNew(oldProps, newProps)).forEach(function (key) {
      return addEventListener(fiber, dom, key);
    });
    Object.keys(newProps).filter(isProperty).filter(isNew(oldProps, newProps)).forEach(function (key) {
      if (key === 'className') {
        if (fiber.nameSpace) {
          dom.setAttribute('class', newProps[key] || '');
        } else {
          dom[key] = newProps[key] || '';
        }
      } else {
        if (key in dom && !fiber.nameSpace) {
          if (newProps[key] !== null && newProps[key] !== false && newProps[key] !== undefined) {
            dom[key] = newProps[key];
          } else {
            dom[key] = '';
          }
        } else {
          if (newProps[key] !== null && newProps[key] !== false && newProps[key] !== undefined) {
            dom.setAttribute(key, String(newProps[key]));
          } else {
            dom.removeAttribute(key);
          }
        }

        if ((key === 'autofocus' || key === 'autoFocus') && newProps[key]) {
          Promise.resolve().then(function () {
            return dom.focus();
          });
        }
      }
    });
    Object.keys(newProps).filter(isStyle).forEach(function (styleKey) {
      var typedNewProps = newProps[styleKey];
      var typedOldProps = oldProps[styleKey];
      Object.keys(typedNewProps || {}).filter(isNew(typedOldProps || {}, typedNewProps)).forEach(function (styleName) {
        if (!Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedNewProps[styleName] === 'number') {
          dom[styleKey][styleName] = typedNewProps[styleName] + "px";
          return;
        }

        if (typedNewProps[styleName] !== null && typedNewProps[styleName] !== undefined) {
          dom[styleKey][styleName] = typedNewProps[styleName];
        } else {
          dom[styleKey][styleName] = '';
        }
      });
    });

    if (newProps['dangerouslySetInnerHTML'] && newProps['dangerouslySetInnerHTML'] !== oldProps['dangerouslySetInnerHTML']) {
      var typedProps = newProps['dangerouslySetInnerHTML'];
      dom.innerHTML = typedProps.__html;
    }
  }

  debugWithDOM(fiber);

  if (isAppMounted.current && !isHydrateRender.current && !isServerRender.current && (enableHighlight.current || window.__highlight__)) {
    HighLight.getHighLightInstance().highLight(fiber);
  }
};

var update = function update(fiber, hydrate) {
  if (fiber.__pendingUpdate__) {
    if (hydrate) {
      hydrateUpdate(fiber);
    } else {
      nativeUpdate(fiber);
    }

    fiber.applyVDom();
    fiber.__pendingUpdate__ = false;
  }
};

var ClientDispatch = /*#__PURE__*/function () {
  function ClientDispatch() {}

  var _proto = ClientDispatch.prototype;

  _proto.trigger = function trigger(_fiber) {
    triggerUpdate(_fiber);
  };

  _proto.beginProgressList = function beginProgressList() {
    pendingUpdateFiberList.current = new LinkTreeList();
  };

  _proto.endProgressList = function endProgressList() {
    var _pendingUpdateFiberLi;

    if ((_pendingUpdateFiberLi = pendingUpdateFiberList.current) != null && _pendingUpdateFiberLi.length) {
      pendingUpdateFiberListArray.current.push(pendingUpdateFiberList.current);
    }

    pendingUpdateFiberList.current = null;
  };

  _proto.generateUpdateList = function generateUpdateList(_fiber) {
    if (_fiber) {
      if (pendingUpdateFiberList.current) {
        if (_fiber.__pendingCreate__ || _fiber.__pendingUpdate__ || _fiber.__pendingAppend__ || _fiber.__pendingContext__ || _fiber.__pendingPosition__ || _fiber.__effectQueue__.length || _fiber.__unmountQueue__.length || _fiber.__layoutEffectQueue__.length) {
          pendingUpdateFiberList.current.append(_fiber, _fiber.fiberIndex);
        }
      } else {
        throw new Error('error');
      }
    }
  };

  _proto.reconcileCommit = function reconcileCommit(_fiber, _hydrate, _parentFiberWithDom) {
    var _result = safeCallWithFiber({
      fiber: _fiber,
      action: function action() {
        return create(_fiber, _hydrate, _parentFiberWithDom);
      }
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: function action() {
        return update(_fiber, _result);
      }
    });
    safeCallWithFiber({
      fiber: _fiber,
      action: function action() {
        return append(_fiber, _parentFiberWithDom);
      }
    });
    var _final = _hydrate;

    if (_fiber.child) {
      _final = this.reconcileCommit(_fiber.child, _result, _fiber.dom ? _fiber : _parentFiberWithDom);
      fallback(_fiber);
    }

    safeCallWithFiber({
      fiber: _fiber,
      action: function action() {
        return layoutEffect(_fiber);
      }
    });
    Promise.resolve().then(function () {
      return safeCallWithFiber({
        fiber: _fiber,
        action: function action() {
          return effect(_fiber);
        }
      });
    });

    if (_fiber.sibling) {
      this.reconcileCommit(_fiber.sibling, _fiber.dom ? _result : _final, _parentFiberWithDom);
    }

    if (_fiber.dom) {
      return _result;
    } else {
      return _final;
    }
  };

  _proto.reconcileCreate = function reconcileCreate(_list) {
    _list.listToFoot(function (_fiber) {
      safeCallWithFiber({
        fiber: _fiber,
        action: function action() {
          return create(_fiber, false, _fiber);
        }
      });
      safeCallWithFiber({
        fiber: _fiber,
        action: function action() {
          return update(_fiber, false);
        }
      });
      safeCallWithFiber({
        fiber: _fiber,
        action: function action() {
          return unmount(_fiber);
        }
      });
      safeCallWithFiber({
        fiber: _fiber,
        action: function action() {
          return context(_fiber);
        }
      });
    });
  };

  _proto.reconcileUpdate = function reconcileUpdate(_list) {
    _list.listToHead(function (_fiber) {
      var _parentFiberWithDom = getFiberWithDom(_fiber.parent, function (f) {
        return f.parent;
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: function action() {
          return position(_fiber, _parentFiberWithDom);
        }
      });
    });

    _list.listToFoot(function (_fiber) {
      var _parentFiberWithDom = getFiberWithDom(_fiber.parent, function (f) {
        return f.parent;
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: function action() {
          return append(_fiber, _parentFiberWithDom);
        }
      });
    });

    _list.reconcile(function (_fiber) {
      safeCallWithFiber({
        fiber: _fiber,
        action: function action() {
          return layoutEffect(_fiber);
        }
      });
      Promise.resolve().then(function () {
        return safeCallWithFiber({
          fiber: _fiber,
          action: function action() {
            return effect(_fiber);
          }
        });
      });
    });
  };

  _proto.pendingCreate = function pendingCreate(_fiber) {
    if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__ && !_fiber.__isPortal__) return;
    _fiber.__pendingCreate__ = true;
  };

  _proto.pendingUpdate = function pendingUpdate(_fiber) {
    if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__) return;
    _fiber.__pendingUpdate__ = true;
  };

  _proto.pendingAppend = function pendingAppend(_fiber) {
    if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__) return;
    _fiber.__pendingAppend__ = true;
  };

  _proto.pendingContext = function pendingContext(_fiber) {
    _fiber.__pendingContext__ = true;
  };

  _proto.pendingPosition = function pendingPosition(_fiber) {
    _fiber.__pendingPosition__ = true;
  };

  _proto.pendingUnmount = function pendingUnmount(_fiber, _pendingUnmount) {
    _fiber.__unmountQueue__.push(_pendingUnmount);
  };

  _proto.pendingLayoutEffect = function pendingLayoutEffect(_fiber, _layoutEffect) {
    _fiber.__layoutEffectQueue__.push(_layoutEffect);
  };

  _proto.pendingEffect = function pendingEffect(_fiber, _effect) {
    _fiber.__effectQueue__.push(_effect);
  };

  _proto.updateAllSync = function updateAllSync$1() {
    updateAllSync();
  };

  _proto.updateAllAsync = function updateAllAsync$1() {
    updateAllAsync();
  };

  return ClientDispatch;
}();

var render = function render(element, container) {
  globalDispatch.current = new ClientDispatch();
  isAppCrash.current = false;
  var containerFiber = container.__fiber__;

  if (containerFiber instanceof MyReactFiberNode) {
    if (containerFiber.checkIsSameType(element)) {
      containerFiber.installVDom(element);
      containerFiber.update();
      return;
    } else {
      unmountComponentAtNode(container);
    }
  }

  Array.from(container.children).forEach(function (n) {
    return n.remove == null ? void 0 : n.remove();
  });
  var fiber = createFiberNode({
    fiberIndex: 0,
    parent: null
  }, element);
  fiber.dom = container;
  fiber.__root__ = true;
  container.setAttribute == null ? void 0 : container.setAttribute('render', 'MyReact');
  container.__fiber__ = fiber;
  startRender(fiber);
};

var hydrate = function hydrate(element, container) {
  globalDispatch.current = new ClientDispatch();
  isHydrateRender.current = true;
  var fiber = createFiberNode({
    fiberIndex: 0,
    parent: null
  }, element);
  fiber.dom = container;
  fiber.__root__ = true;
  container.setAttribute == null ? void 0 : container.setAttribute('hydrate', 'MyReact');
  container.__fiber__ = fiber;
  startRender(fiber, true);
  isHydrateRender.current = false;
};

var append$2 = function append(fiber, parentFiberWithDom) {
  if (fiber.__pendingAppend__) {
    if (!fiber.dom || !parentFiberWithDom.dom) throw new Error('append error');
    var parentDom = parentFiberWithDom.dom;

    if (fiber.dom) {
      parentDom.appendChild(fiber.dom);
    }

    fiber.__pendingAppend__ = false;
  }
};

var TextElement = /*#__PURE__*/function () {
  function TextElement(content) {
    this.content = '';
    this.content = content === '' ? ' ' : content;
  }

  var _proto = TextElement.prototype;

  _proto.toString = function toString() {
    return this.content.toString();
  };

  return TextElement;
}();

var PlainElement = /*#__PURE__*/function () {
  function PlainElement(type) {
    this.className = null; // attrs

    this.style = {};
    this.attrs = {};
    this.children = [];
    this.type = type;
  }

  var _proto = PlainElement.prototype;

  _proto.addEventListener = function addEventListener() {
  };

  _proto.removeEventListener = function removeEventListener() {
  };

  _proto.removeAttribute = function removeAttribute(key) {
    delete this.attrs[key];
  };

  _proto.setAttribute = function setAttribute(key, value) {
    if (value !== false && value !== null && value !== undefined) {
      this.attrs[key] = value.toString();
    }
  }
  /**
   *
   * @param {Element} dom
   */
  ;

  _proto.append = function append() {
    var _this = this;

    for (var _len = arguments.length, dom = new Array(_len), _key = 0; _key < _len; _key++) {
      dom[_key] = arguments[_key];
    }

    dom.forEach(function (d) {
      return _this.appendChild(d);
    });
  };

  _proto.appendChild = function appendChild(dom) {
    if (Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, this.type)) return;

    if (dom instanceof PlainElement || dom instanceof TextElement || typeof dom === 'string') {
      this.children.push(dom);
      return dom;
    } else {
      throw new Error('element instance error');
    }
  };

  _proto.serializeStyle = function serializeStyle() {
    var _this2 = this;

    var styleKeys = Object.keys(this.style).filter(function (key) {
      return _this2.style[key] !== null && _this2.style[key] !== undefined;
    });

    if (styleKeys.length) {
      return "style=\"" + styleKeys.map(function (key) {
        var _this2$style$key;

        return key + ": " + ((_this2$style$key = _this2.style[key]) == null ? void 0 : _this2$style$key.toString()) + ";";
      }).reduce(function (p, c) {
        return p + c;
      }, '') + "\"";
    }

    return '';
  };

  _proto.serializeAttrs = function serializeAttrs() {
    var _this3 = this;

    var attrsKeys = Object.keys(this.attrs);

    if (attrsKeys.length) {
      return attrsKeys.map(function (key) {
        var _this3$attrs$key;

        return key + "='" + ((_this3$attrs$key = _this3.attrs[key]) == null ? void 0 : _this3$attrs$key.toString()) + "'";
      }).reduce(function (p, c) {
        return p + " " + c;
      }, '');
    } else {
      return '';
    }
  };

  _proto.serializeProps = function serializeProps() {
    var props = '';

    if (this.className !== undefined && this.className !== null) {
      props += " class=\"" + this.className + "\"";
    }

    return props;
  };

  _proto.serialize = function serialize() {
    return this.serializeProps() + " " + this.serializeStyle() + " " + this.serializeAttrs();
  };

  _proto.toString = function toString() {
    if (Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, this.type)) {
      return "<" + this.type + " " + this.serialize() + " />";
    } else {
      if (this.type) {
        return "<" + this.type + " " + this.serialize() + " >" + this.children.reduce(function (p, c) {
          if (p.length && c instanceof TextElement && p[p.length - 1] instanceof TextElement) {
            p.push('<!-- -->');
            p.push(c);
          } else {
            p.push(c);
          }

          return p;
        }, []).map(function (dom) {
          return dom.toString();
        }).reduce(function (p, c) {
          return p + c;
        }, '') + "</" + this.type + ">";
      } else {
        return this.children.reduce(function (p, c) {
          if (p.length && c instanceof TextElement && p[p.length - 1] instanceof TextElement) {
            p.push('<!-- -->');
            p.push(c);
          } else {
            p.push(c);
          }

          return p;
        }, []).map(function (dom) {
          return dom.toString();
        }).reduce(function (p, c) {
          return p + c;
        }, '');
      }
    }
  };

  return PlainElement;
}();

var create$1 = function create(fiber) {
  if (fiber.__pendingCreate__) {
    if (fiber.__isTextNode__) {
      fiber.dom = new TextElement(fiber.element);
    } else if (fiber.__isPlainNode__) {
      var typedElement = fiber.element;
      fiber.dom = new PlainElement(typedElement.type);
    } else {
      throw new Error('createPortal() can not call on the server');
    }

    fiber.__pendingCreate__ = false;
  }
};

var update$1 = function update(fiber) {
  if (fiber.__pendingUpdate__) {
    if (fiber.__isPlainNode__) {
      var dom = fiber.dom;
      var props = fiber.__props__ || {};
      Object.keys(props).filter(isProperty).forEach(function (key) {
        if (key === 'className') {
          dom[key] = props[key];
        } else {
          dom.setAttribute(key, props[key]);
        }
      });
      Object.keys(props).filter(isStyle).forEach(function (styleKey) {
        var typedProps = props[styleKey] || {};
        Object.keys(typedProps).forEach(function (styleName) {
          if (!Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedProps[styleName] === 'number') {
            dom[styleKey][styleName] = typedProps[styleName] + "px";
            return;
          }

          dom[styleKey][styleName] = typedProps[styleName];
        });
      });

      if (props['dangerouslySetInnerHTML']) {
        var typedProps = props['dangerouslySetInnerHTML'];
        dom.append(typedProps.__html);
      }
    }

    fiber.__pendingUpdate__ = false;
  }
};

var ServerDispatch = /*#__PURE__*/function () {
  function ServerDispatch() {}

  var _proto = ServerDispatch.prototype;

  _proto.trigger = function trigger(_fiber) {
  };

  _proto.reconcileCommit = function reconcileCommit(_fiber, _hydrate, _parentFiberWithDom) {
    safeCallWithFiber({
      fiber: _fiber,
      action: function action() {
        return create$1(_fiber);
      }
    });
    safeCallWithFiber({
      fiber: _fiber,
      action: function action() {
        return update$1(_fiber);
      }
    });
    safeCallWithFiber({
      fiber: _fiber,
      action: function action() {
        return append$2(_fiber, _parentFiberWithDom);
      }
    });

    if (_fiber.child) {
      this.reconcileCommit(_fiber.child, _hydrate, _fiber.dom ? _fiber : _parentFiberWithDom);
    }

    if (_fiber.sibling) {
      this.reconcileCommit(_fiber.sibling, _hydrate, _parentFiberWithDom);
    }

    return true;
  };

  _proto.reconcileCreate = function reconcileCreate(_list) {
  };

  _proto.reconcileUpdate = function reconcileUpdate(_list) {
  };

  _proto.beginProgressList = function beginProgressList() {
  };

  _proto.endProgressList = function endProgressList() {
  };

  _proto.generateUpdateList = function generateUpdateList(_fiber) {
  };

  _proto.pendingCreate = function pendingCreate(_fiber) {
    if (_fiber.__isPortal__) {
      throw new Error('should not use portal element on the server');
    }

    if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__) return;
    _fiber.__pendingCreate__ = true;
  };

  _proto.pendingUpdate = function pendingUpdate(_fiber) {
    if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__) return;
    _fiber.__pendingUpdate__ = true;
  };

  _proto.pendingAppend = function pendingAppend(_fiber) {
    if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__) return;
    _fiber.__pendingAppend__ = true;
  };

  _proto.pendingContext = function pendingContext(_fiber) {
  };

  _proto.pendingPosition = function pendingPosition(_fiber) {
  };

  _proto.pendingUnmount = function pendingUnmount(_fiber, _pendingUnmount) {
  };

  _proto.pendingLayoutEffect = function pendingLayoutEffect(_fiber, _layoutEffect) {
  };

  _proto.pendingEffect = function pendingEffect(_fiber, _effect) {
  };

  _proto.updateAllSync = function updateAllSync() {
  };

  _proto.updateAllAsync = function updateAllAsync() {
  };

  return ServerDispatch;
}();

var renderToString = function renderToString(element) {
  globalDispatch.current = new ServerDispatch();
  isServerRender.current = true;
  var container = new PlainElement('');
  var fiber = createFiberNode({
    fiberIndex: 0,
    parent: null
  }, element);
  fiber.dom = container;
  fiber.__root__ = true;
  startRender(fiber, false);
  isServerRender.current = false;
  return container.toString();
};

var MyReactHookNode = /*#__PURE__*/function (_MyReactInternalInsta) {
  _inheritsLoose(MyReactHookNode, _MyReactInternalInsta);

  function MyReactHookNode(hookIndex, hookType, value, reducer, deps) {
    var _this;

    _this = _MyReactInternalInsta.call(this) || this;
    _this.hookIndex = 0;
    _this.hookNext = null;
    _this.hookPrev = null;
    _this.hookType = null;
    _this.cancel = null;
    _this.effect = false;
    _this.value = null;
    _this.deps = [];
    _this.result = null;

    _this.dispatch = function (action) {
      var _this$__fiber__;

      var updater = {
        type: 'hook',
        trigger: _assertThisInitialized(_this),
        action: action
      };
      (_this$__fiber__ = _this.__fiber__) == null ? void 0 : _this$__fiber__.__hookUpdateQueue__.push(updater);
      Promise.resolve().then(function () {
        var _this$__fiber__2;

        (_this$__fiber__2 = _this.__fiber__) == null ? void 0 : _this$__fiber__2.update();
      });
    };

    _this.deps = deps;
    _this.value = value;
    _this.reducer = reducer;
    _this.hookType = hookType;
    _this.hookIndex = hookIndex;
    return _this;
  }

  var _proto = MyReactHookNode.prototype;

  _proto.initialResult = function initialResult() {
    if (this.hookType === 'useMemo' || this.hookType === 'useState' || this.hookType === 'useReducer') {
      this.result = this.value.call(null);
      return;
    }

    if (this.hookType === 'useEffect' || this.hookType === 'useLayoutEffect' || this.hookType === 'useImperativeHandle') {
      this.effect = true;
      return;
    }

    if (this.hookType === 'useRef' || this.hookType === 'useCallback') {
      this.result = this.value;
      return;
    }

    if (this.hookType === 'useContext') {
      var ProviderFiber = getContextFiber(this.__fiber__, this.value);
      this.setContext(ProviderFiber);
      this.result = getContextValue(ProviderFiber, this.value);
      this.context = this.result;
      return;
    }
  };

  _proto.updateResult = function updateResult(newValue, newReducer, newDeps) {
    if (this.hookType === 'useMemo' || this.hookType === 'useEffect' || this.hookType === 'useCallback' || this.hookType === 'useLayoutEffect' || this.hookType === 'useImperativeHandle') {
      if (newDeps && !this.deps) {
        throw new Error('deps state change');
      }

      if (!newDeps && this.deps) {
        throw new Error('deps state change');
      }
    }

    if (this.hookType === 'useEffect' || this.hookType === 'useLayoutEffect' || this.hookType === 'useImperativeHandle') {
      if (!newDeps) {
        this.value = newValue;
        this.reducer = newReducer || this.reducer;
        this.deps = newDeps;
        this.effect = true;
      } else if (!isArrayEquals(this.deps, newDeps)) {
        this.value = newValue;
        this.reducer = newReducer || this.reducer;
        this.deps = newDeps;
        this.effect = true;
      }

      return;
    }

    if (this.hookType === 'useCallback') {
      if (!isArrayEquals(this.deps, newDeps)) {
        this.value = newValue;
        this.result = newValue;
        this.deps = newDeps;
      }

      return;
    }

    if (this.hookType === 'useMemo') {
      if (!isArrayEquals(this.deps, newDeps)) {
        this.value = newValue;
        this.result = newValue.call(null);
        this.deps = newDeps;
      }

      return;
    }

    if (this.hookType === 'useContext') {
      if (!this.__context__ || !this.__context__.mount || !Object.is(this.value, newValue)) {
        this.value = newValue;
        var ProviderFiber = getContextFiber(this.__fiber__, this.value);
        this.setContext(ProviderFiber);
        this.result = getContextValue(ProviderFiber, this.value);
        this.context = this.result;
      } else {
        this.result = getContextValue(this.__context__, this.value);
        this.context = this.result;
      }

      return;
    }

    if (this.hookType === 'useReducer') {
      this.value = newValue;
      this.reducer = newReducer;
    }
  };

  _proto.unmount = function unmount() {
    if (this.hookType === 'useEffect' || this.hookType === 'useLayoutEffect') {
      this.effect = false;
      this.cancel && this.cancel();
      return;
    }

    if (this.hookType === 'useContext') {
      var _this$__context__;

      (_this$__context__ = this.__context__) == null ? void 0 : _this$__context__.removeDependence(this);
    }
  };

  return MyReactHookNode;
}(MyReactInternalInstance);

var effect$1 = function effect(fiber, hookNode) {
  if (hookNode.effect && !hookNode.__pendingEffect__) {
    hookNode.__pendingEffect__ = true;

    if (hookNode.hookType === 'useEffect') {
      globalDispatch.current.pendingEffect(fiber, function () {
        var _hookNode$__fiber__;

        hookNode.cancel && hookNode.cancel();
        if ((_hookNode$__fiber__ = hookNode.__fiber__) != null && _hookNode$__fiber__.mount) hookNode.cancel = hookNode.value();
        hookNode.effect = false;
        hookNode.__pendingEffect__ = false;
      });
    }

    if (hookNode.hookType === 'useLayoutEffect') {
      globalDispatch.current.pendingLayoutEffect(fiber, function () {
        var _hookNode$__fiber__2;

        hookNode.cancel && hookNode.cancel();
        if ((_hookNode$__fiber__2 = hookNode.__fiber__) != null && _hookNode$__fiber__2.mount) hookNode.cancel = hookNode.value();
        hookNode.effect = false;
        hookNode.__pendingEffect__ = false;
      });
    }

    if (hookNode.hookType === 'useImperativeHandle') {
      globalDispatch.current.pendingLayoutEffect(fiber, function () {
        if (hookNode.value && typeof hookNode.value === 'object') hookNode.value.current = hookNode.reducer.call(null);
        hookNode.effect = false;
        hookNode.__pendingEffect__ = false;
      });
    }
  }
};

var defaultReducer = function defaultReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
};

var createHookNode = function createHookNode(_ref, fiber) {
  var hookIndex = _ref.hookIndex,
      hookType = _ref.hookType,
      value = _ref.value,
      reducer = _ref.reducer,
      deps = _ref.deps;
  var newHookNode = new MyReactHookNode(hookIndex, hookType, value, reducer || defaultReducer, deps);
  newHookNode.setFiber(fiber);
  fiber.addHook(newHookNode);
  fiber.checkHook(newHookNode);
  newHookNode.initialResult();
  return newHookNode;
};
var getHookNode = function getHookNode(_ref2, fiber) {
  var hookIndex = _ref2.hookIndex,
      hookType = _ref2.hookType,
      value = _ref2.value,
      reducer = _ref2.reducer,
      deps = _ref2.deps;
  if (!fiber) throw new Error('can not use hook out of component');
  var currentHook = null;

  if (fiber.hookList.length > hookIndex) {
    currentHook = fiber.hookList[hookIndex];

    if (currentHook.hookType !== hookType) {
      var array = fiber.hookType.slice(0, hookIndex);
      throw new Error(getHookTree([].concat(array, [currentHook.hookType]), [].concat(array, [hookType])));
    }

    currentHook.setFiber(fiber);
    currentHook.updateResult(value, reducer || defaultReducer, deps);
  } else if (!fiber.__isUpdateRender__) {
    currentHook = createHookNode({
      hookIndex: hookIndex,
      hookType: hookType,
      value: value,
      reducer: reducer,
      deps: deps
    }, fiber);
  } else {
    throw new Error(getHookTree([].concat(fiber.hookType), [].concat(fiber.hookType, [hookType])));
  }

  effect$1(fiber, currentHook);
  return currentHook;
};

var useState = function useState(initial) {
  var currentHookNode = getHookNode({
    hookIndex: currentHookDeepIndex.current++,
    hookType: 'useState',
    value: typeof initial === 'function' ? initial : function () {
      return initial;
    },
    reducer: null,
    deps: []
  }, currentFunctionFiber.current);
  return [currentHookNode.result, currentHookNode.dispatch];
};
var useEffect = function useEffect(action, deps) {
  getHookNode({
    hookIndex: currentHookDeepIndex.current++,
    hookType: 'useEffect',
    value: action,
    reducer: null,
    deps: deps
  }, currentFunctionFiber.current);
};
var useLayoutEffect = function useLayoutEffect(action, deps) {
  getHookNode({
    hookIndex: currentHookDeepIndex.current++,
    hookType: 'useLayoutEffect',
    value: action,
    reducer: null,
    deps: deps
  }, currentFunctionFiber.current);
};
var useCallback = function useCallback(callback, deps) {
  return getHookNode({
    hookIndex: currentHookDeepIndex.current++,
    hookType: 'useCallback',
    value: callback,
    reducer: null,
    deps: deps
  }, currentFunctionFiber.current).result;
};
var useMemo = function useMemo(action, deps) {
  return getHookNode({
    hookIndex: currentHookDeepIndex.current++,
    hookType: 'useMemo',
    value: action,
    reducer: null,
    deps: deps
  }, currentFunctionFiber.current).result;
};
var useRef = function useRef(value) {
  return getHookNode({
    hookIndex: currentHookDeepIndex.current++,
    hookType: 'useRef',
    value: createRef(value),
    reducer: null,
    deps: []
  }, currentFunctionFiber.current).result;
};
var useContext = function useContext(Context) {
  return getHookNode({
    hookIndex: currentHookDeepIndex.current++,
    hookType: 'useContext',
    value: Context,
    reducer: null,
    deps: []
  }, currentFunctionFiber.current).result;
};
var useReducer = function useReducer(reducer, initialArgs, init) {
  var currentHookNode = getHookNode({
    hookIndex: currentHookDeepIndex.current++,
    hookType: 'useReducer',
    value: typeof init === 'function' ? function () {
      return init(initialArgs);
    } : function () {
      return initialArgs;
    },
    reducer: reducer,
    deps: []
  }, currentFunctionFiber.current);
  return [currentHookNode.result, currentHookNode.dispatch];
};
var useImperativeHandle = function useImperativeHandle(ref, createHandle, deps) {
  getHookNode({
    hookIndex: currentHookDeepIndex.current++,
    hookType: 'useImperativeHandle',
    value: ref,
    reducer: createHandle,
    deps: deps
  }, currentFunctionFiber.current);
};
var useDebugValue = function useDebugValue() {
  if (enableDebugLog.current) {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (_console = console).log.apply(_console, ["[debug]: "].concat(args, [getFiberTree(currentFunctionFiber.current)]));
  }
};

var unstable_batchedUpdates = safeCall;
var Component = MyReactComponent;
var PureComponent = MyReactPureComponent;
var Children = {
  map: map,
  only: only,
  count: count,
  toArray: toArray,
  forEach: forEach
};
var React = {
  Component: Component,
  PureComponent: PureComponent,
  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: isValidElement,
  lazy: lazy,
  memo: memo,
  createRef: createRef,
  forwardRef: forwardRef,
  createContext: createContext,
  Portal: My_React_Portal,
  Element: My_React_Element,
  Provider: My_React_Provider,
  Consumer: My_React_Consumer,
  Fragment: My_React_Fragment,
  Suspense: My_React_Suspense,
  StrictMode: My_React_Strict,
  ForwardRef: My_React_ForwardRef,
  useRef: useRef,
  useMemo: useMemo,
  useState: useState,
  useEffect: useEffect,
  useReducer: useReducer,
  useContext: useContext,
  useCallback: useCallback,
  useDebugValue: useDebugValue,
  useLayoutEffect: useLayoutEffect,
  useImperativeHandle: useImperativeHandle,
  Children: Children,
  version: '0.0.1'
};
var ReactDOM = {
  render: render,
  hydrate: hydrate,
  findDOMNode: findDOMNode,
  createPortal: createPortal,
  renderToString: renderToString,
  unmountComponentAtNode: unmountComponentAtNode,
  unstable_batchedUpdates: unstable_batchedUpdates,
  version: '0.0.1'
};

var mixin = /*#__PURE__*/_extends({}, React, ReactDOM);

globalThis.React = React;
globalThis.ReactDOM = ReactDOM;

export default mixin;
export { Children, Component, My_React_Consumer as Consumer, My_React_Element as Element, My_React_ForwardRef as ForwardRef, My_React_Fragment as Fragment, My_React_Portal as Portal, My_React_Provider as Provider, PureComponent, React, ReactDOM, My_React_Strict as StrictMode, My_React_Suspense as Suspense, cloneElement, createContext, createElement, createPortal, createRef, findDOMNode, forwardRef, hydrate, isValidElement, lazy, memo, render, renderToString, unmountComponentAtNode, unstable_batchedUpdates, useCallback, useContext, useDebugValue, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState };
//# sourceMappingURL=myreact.esm.js.map
