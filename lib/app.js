(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        "use strict";

        function _typeof(obj) {
          "@babel/helpers - typeof";
          return (
            (_typeof =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (obj) {
                    return typeof obj;
                  }
                : function (obj) {
                    return obj &&
                      "function" == typeof Symbol &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                      ? "symbol"
                      : typeof obj;
                  }),
            _typeof(obj)
          );
        }

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.MyReactPureComponent = exports.MyReactComponent = void 0;
        exports.classComponentMount = classComponentMount;
        exports.classComponentUpdate = classComponentUpdate;

        var _core = require("./core.js");

        var _fiber = require("./fiber.js");

        var _share = require("./share.js");

        var _tools = require("./tools.js");

        var _update = require("./update.js");

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

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
          Object.defineProperty(Constructor, "prototype", { writable: false });
          return Constructor;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function"
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                writable: true,
                configurable: true,
              },
            }
          );
          Object.defineProperty(subClass, "prototype", { writable: false });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf =
            Object.setPrototypeOf ||
            function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();
          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
              result;
            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;
              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }
            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (
            call &&
            (_typeof(call) === "object" || typeof call === "function")
          ) {
            return call;
          } else if (call !== void 0) {
            throw new TypeError(
              "Derived constructors may only return object or undefined"
            );
          }
          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          }
          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct)
            return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;
          try {
            Boolean.prototype.valueOf.call(
              Reflect.construct(Boolean, [], function () {})
            );
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
              };
          return _getPrototypeOf(o);
        }

        function _defineProperty(obj, key, value) {
          if (key in obj) {
            Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true,
            });
          } else {
            obj[key] = value;
          }
          return obj;
        }

        var MyReactComponent = /*#__PURE__*/ (function (_MyReactInstance) {
          _inherits(MyReactComponent, _MyReactInstance);

          var _super = _createSuper(MyReactComponent);

          function MyReactComponent(props, context) {
            var _this;

            _classCallCheck(this, MyReactComponent);

            _this = _super.call(this);

            _defineProperty(
              _assertThisInitialized(_this),
              "__prevProps__",
              null
            );

            _defineProperty(
              _assertThisInitialized(_this),
              "__nextProps__",
              null
            );

            _defineProperty(
              _assertThisInitialized(_this),
              "__prevContext__",
              null
            );

            _defineProperty(
              _assertThisInitialized(_this),
              "__nextContext__",
              null
            );

            _defineProperty(
              _assertThisInitialized(_this),
              "__prevState__",
              null
            );

            _defineProperty(
              _assertThisInitialized(_this),
              "__nextState__",
              null
            );

            _defineProperty(
              _assertThisInitialized(_this),
              "__pendingEffect__",
              false
            );

            _defineProperty(
              _assertThisInitialized(_this),
              "setState",
              function (newValue) {
                var newState = newValue;

                if (typeof newValue === "function") {
                  newState = newValue(_this.state);
                }

                _this.__nextState__ = newState;

                if (!Object.is(_this.state, _this.__nextState__)) {
                  _this.forceUpdate();
                }
              }
            );

            _defineProperty(
              _assertThisInitialized(_this),
              "forceUpdate",
              function () {
                Promise.resolve().then(function () {
                  return _this.__fiber__.update();
                });
              }
            );

            _this.props = props;
            _this.context = context;
            return _this;
          }

          _createClass(MyReactComponent, [
            {
              key: "isMyReactComponent",
              get: function get() {
                return true;
              },
            },
            {
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

                this.__nextProps__ = null;
                this.__nextState__ = null;
                this.__nextContext__ = null;
                this.__fiber__.memoProps = this.props;
                this.__fiber__.memoState = this.state;
              },
            },
          ]);

          return MyReactComponent;
        })(_share.MyReactInstance);

        exports.MyReactComponent = MyReactComponent;

        var MyReactPureComponent = /*#__PURE__*/ (function (_MyReactComponent) {
          _inherits(MyReactPureComponent, _MyReactComponent);

          var _super2 = _createSuper(MyReactPureComponent);

          function MyReactPureComponent() {
            _classCallCheck(this, MyReactPureComponent);

            return _super2.apply(this, arguments);
          }

          _createClass(MyReactPureComponent, [
            {
              key: "shouldComponentUpdate",
              value: function shouldComponentUpdate(
                nextProps,
                nextState,
                nextContext
              ) {
                return (
                  !(0, _tools.isNormalEqual)(this.props, nextProps) ||
                  !(0, _tools.isNormalEqual)(this.state, nextState) ||
                  !(0, _tools.isNormalEqual)(this.context, nextContext)
                );
              },
            },
          ]);

          return MyReactPureComponent;
        })(MyReactComponent);
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        exports.MyReactPureComponent = MyReactPureComponent;

        function processStateFromProps(fiber) {
          var Component = fiber.__vdom__.type;
          var newState = null;

          if (typeof Component.getDerivedStateFromProps === "function") {
            newState = Component.getDerivedStateFromProps(
              fiber.__vdom__.props,
              fiber.instance.state
            );
          }

          return newState;
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function processStateFromPropsMountLifeCircle(fiber) {
          var newState = processStateFromProps(fiber);
          fiber.instance.updateInstance(
            Object.assign(
              {},
              fiber.instance.state,
              newState,
              fiber.instance.__nextState__
            )
          );
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function processStateFromPropsUpdateLiftCircle(fiber) {
          var newState = processStateFromProps(fiber);
          return Object.assign(
            {},
            fiber.instance.state,
            newState,
            fiber.instance.__nextState__
          );
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function processComponentInstanceLifeCircle(fiber) {
          var Component = fiber.__vdom__.type;
          var providerFiber = (0, _tools.getContextFiber)(
            fiber,
            Component.contextType
          );
          var instance = new Component(
            fiber.__vdom__.props,
            providerFiber === null || providerFiber === void 0
              ? void 0
              : providerFiber.__vdom__.props.value
          );
          fiber.installInstance(instance);
          instance.updateDependence(fiber, providerFiber);
          providerFiber === null || providerFiber === void 0
            ? void 0
            : providerFiber.addListener(instance);
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function processComponentRenderLifeCircle(fiber) {
          var children = fiber.instance.render();
          fiber.__vdom__.children = children;
          return (0, _core.nextWorkCommon)(fiber);
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function processComponentDidMountLiftCircle(fiber) {
          if (
            !fiber.instance.__pendingEffect__ &&
            typeof fiber.instance.componentDidMount === "function"
          ) {
            fiber.instance.__pendingEffect__ = true;
            (0, _update.pushLayoutEffect)(fiber, function () {
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
          processStateFromPropsMountLifeCircle(fiber);
          var children = processComponentRenderLifeCircle(fiber);
          processComponentDidMountLiftCircle(fiber);
          return children;
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function processComponentContextUpdate(fiber) {
          if (fiber.instance.__context__ && !fiber.instance.__context__.mount) {
            var providerFiber = fiber.instance.processContext(
              fiber.__vdom__.type.contextType
            );
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
            return fiber.instance.shouldComponentUpdate(
              fiber.instance.__nextProps__,
              fiber.instance.__nextState__,
              fiber.instance.__nextContext__
            );
          }

          return true;
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function processComponentDidUpdateLiftCircle(fiber) {
          if (
            !fiber.instance.__pendingEffect__ &&
            typeof fiber.instance.componentDidUpdate === "function"
          ) {
            fiber.instance.__pendingEffect__ = true;
            (0, _update.pushLayoutEffect)(fiber, function () {
              fiber.instance.componentDidUpdate(
                fiber.instance.__prevProps__,
                fiber.instance.__prevState__,
                fiber.instance.__prevContext__
              );
              fiber.instance.__prevProps__ = null;
              fiber.instance.__prevState__ = null;
              fiber.instance.__prevContext__ = null;
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
            fiber.stopUpdate();
            return [];
          }
        }
      },
      {
        "./core.js": 2,
        "./fiber.js": 5,
        "./share.js": 10,
        "./tools.js": 11,
        "./update.js": 12,
      },
    ],
    2: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.nextWork = nextWork;
        exports.nextWorkCommon = nextWorkCommon;
        exports.transformChildrenFiber = transformChildrenFiber;

        var _component = require("./component.js");

        var _env = require("./env.js");

        var _fiber2 = require("./fiber.js");

        var _tools = require("./tools.js");

        var _update = require("./update.js");

        var _vdom = require("./vdom.js");

        function _typeof(obj) {
          "@babel/helpers - typeof";
          return (
            (_typeof =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (obj) {
                    return typeof obj;
                  }
                : function (obj) {
                    return obj &&
                      "function" == typeof Symbol &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                      ? "symbol"
                      : typeof obj;
                  }),
            _typeof(obj)
          );
        }

        /**
         *
         * @param {MyReactVDom | MyReactVDom[]} newVDom
         * @param {MyReactFiberNode} parentFiber
         * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
         * @param {boolean} isSameType
         * @returns
         */
        function getNewFiberWithUpdate(
          newVDom,
          parentFiber,
          previousRenderChild,
          isSameType
        ) {
          if (isSameType) {
            if (Array.isArray(newVDom)) {
              if (newVDom.length < previousRenderChild.length) {
                (0, _update.pushUnmount)(
                  previousRenderChild.slice(newVDom.length)
                );
              }

              return newVDom.map(function (v, index) {
                return getNewFiberWithUpdate(
                  v,
                  parentFiber,
                  previousRenderChild[index],
                  isSameTypeNode(v, previousRenderChild[index])
                );
              });
            }

            if (!previousRenderChild) return null;

            if (
              previousRenderChild.__isTextNode__ &&
              previousRenderChild.__vdom__ === newVDom
            ) {
              return (0, _fiber2.updateFiberNode)(
                previousRenderChild,
                parentFiber,
                newVDom
              );
            }

            if (
              previousRenderChild.__isPlainNode__ &&
              (0, _tools.isEqual)(
                previousRenderChild.__vdom__.props,
                newVDom.props
              )
            ) {
              return (0, _fiber2.updateFiberNode)(
                previousRenderChild,
                parentFiber,
                newVDom
              );
            } // 优化Provider更新，方法之一

            if (
              previousRenderChild.__isContextProvider__ &&
              (0, _tools.isNormalEqual)(
                previousRenderChild.__vdom__.props.value,
                newVDom.props.value
              )
            ) {
              return (0, _fiber2.updateFiberNode)(
                previousRenderChild,
                parentFiber,
                newVDom
              );
            }

            var _fiber = (0, _fiber2.createFiberNode)(
              {
                fiberParent: parentFiber,
                deepIndex: parentFiber.deepIndex + 1,
                fiberAlternate: previousRenderChild,
                dom: previousRenderChild.dom,
                hookHead: previousRenderChild.hookHead,
                hookFoot: previousRenderChild.hookFoot,
                hookList: previousRenderChild.hookList,
                listeners: previousRenderChild.listeners,
                instance: previousRenderChild.instance,
                effect:
                  previousRenderChild.__isTextNode__ ||
                  previousRenderChild.__isPlainNode__
                    ? "UPDATE"
                    : null,
              },
              newVDom === false || newVDom === null ? "" : newVDom
            );

            if (_env.isMounted.current && _fiber.dom && _fiber.effect) {
              (0, _update.pushUpdate)(_fiber);
            }

            return _fiber;
          }

          if (previousRenderChild) {
            (0, _update.pushUnmount)(previousRenderChild);
          }

          if (Array.isArray(newVDom)) {
            return newVDom.map(function (v) {
              return getNewFiberWithUpdate(v, parentFiber, null, isSameType);
            });
          }

          if (newVDom === undefined) return null;
          var fiber = (0, _fiber2.createFiberNode)(
            {
              fiberParent: parentFiber,
              deepIndex: parentFiber.deepIndex + 1,
              effect: newVDom.__isPortal__ ? "PORTAL" : "PLACEMENT",
            },
            newVDom === false || newVDom === null ? "" : newVDom
          );

          if (_env.isMounted.current) {
            fiber.diffMount = true;
            fiber.fiberPrevRender = previousRenderChild;
            (0, _update.pushPosition)(fiber.fiberParent);
          }

          return fiber;
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

          if (newVDom === undefined) return null; // throw new Error("return null if need render empty element");

          var fiber = (0, _fiber2.createFiberNode)(
            {
              fiberParent: parentFiber,
              deepIndex: parentFiber.deepIndex + 1,
              effect: newVDom.__isPortal__ ? "PORTAL" : "PLACEMENT",
            },
            newVDom === false || newVDom === null ? "" : newVDom
          );

          if (_env.isMounted.current && fiber.dom && fiber.effect) {
            (0, _update.pushUpdate)(fiber);
          }

          return fiber;
        }
        /**
         *
         * @param {MyReactVDom | MyReactVDom[]} newVDom
         * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
         */

        function isSameTypeNode(newVDom, previousRenderChild) {
          if (Array.isArray(newVDom) && Array.isArray(previousRenderChild))
            return true;
          var previousRenderChildVDom =
            previousRenderChild === null || previousRenderChild === void 0
              ? void 0
              : previousRenderChild.__vdom__;

          if (
            newVDom instanceof _vdom.MyReactVDom &&
            previousRenderChildVDom instanceof _vdom.MyReactVDom
          ) {
            if (newVDom.__isDynamicNode__ || newVDom.__isPlainNode__)
              return newVDom.type === previousRenderChildVDom.type;
            if (newVDom.__isObjectNode__)
              return (
                previousRenderChildVDom.__isObjectNode__ &&
                newVDom.type.type === previousRenderChildVDom.type.type
              );
            if (newVDom.__isEmptyNode__)
              return previousRenderChildVDom.__isEmptyNode__;
            if (newVDom.__isFragmentNode__)
              return previousRenderChildVDom.__isFragmentNode__;
          }

          if (newVDom instanceof _vdom.MyReactVDom) return false;
          if (previousRenderChildVDom instanceof _vdom.MyReactVDom)
            return false;
          if (_typeof(newVDom) !== "object")
            return previousRenderChild && previousRenderChild.__isTextNode__;
          if (newVDom === null) return previousRenderChild === null;
          return false;
        }
        /**
         *
         * @param {MyReactFiberNode} parentFiber
         * @param {MyReactVDom[]} children
         */

        function transformChildrenFiber(parentFiber, _children) {
          var _parentFiber$fiberAlt;

          var index = 0;
          var isNewChildren = !Boolean(parentFiber.fiberAlternate);
          var previousRenderChildren =
            ((_parentFiber$fiberAlt = parentFiber.fiberAlternate) === null ||
            _parentFiber$fiberAlt === void 0
              ? void 0
              : _parentFiber$fiberAlt.renderedChildren) || [];
          parentFiber.reset();
          var children = Array.isArray(_children) ? _children : [_children];

          while (
            index < children.length ||
            index < previousRenderChildren.length
          ) {
            var newChild = children[index];
            var previousRenderChild = previousRenderChildren[index];
            var isSameType =
              _env.isMounted.current &&
              isSameTypeNode(newChild, previousRenderChild);
            var newFiber = isNewChildren
              ? getNewFiberWithInitial(newChild, parentFiber)
              : getNewFiberWithUpdate(
                  newChild,
                  parentFiber,
                  previousRenderChild,
                  isSameType
                );
            parentFiber.renderedChildren.push(newFiber);
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
          fiber.__vdom__.children = children;
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
          if (fiber.__vdom__.children !== undefined) {
            return transformChildrenFiber(fiber, fiber.__vdom__.children);
          }

          if (fiber.__vdom__.props.children !== undefined) {
            throw new Error("预料之外的错误");
          }

          return [];
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
          fiber.__vdom__.children = children;
          return nextWorkCommon(fiber);
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function nextWorkProvider(fiber) {
          if (fiber.initial) {
            console.log("更新");
            var listenerFibers = fiber.listeners.map(function (it) {
              return it.__fiber__;
            }); // update only alive fiber

            Promise.resolve().then(function () {
              return listenerFibers
                .filter(function (f) {
                  return f.mount;
                })
                .forEach(function (f) {
                  return f.update();
                });
            });
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

          if (
            !fiber.instance.__context__ ||
            !fiber.instance.__context__.mount
          ) {
            var providerFiber = fiber.instance.processContext(
              fiber.__vdom__.type.Context
            );
            fiber.instance.context = providerFiber.__vdom__.props.value;
          }

          var children = fiber.__vdom__.children(fiber.instance.context);

          fiber.__vdom__.children = children;
          return nextWorkCommon(fiber);
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
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function nextWork(fiber) {
          _env.currentRunningFiber.current = fiber;
          var children = [];
          if (fiber.__isDynamicNode__) children = nextWorkComponent(fiber);
          else if (fiber.__isObjectNode__) children = nextWorkObject(fiber);
          else if (!fiber.__isTextNode__) children = nextWorkCommon(fiber);
          !fiber.effect && (fiber.fiberAlternate = null);
          fiber.initial = false;
          fiber.__needUpdate__ = false;
          return children;
        }
      },
      {
        "./component.js": 1,
        "./env.js": 4,
        "./fiber.js": 5,
        "./tools.js": 11,
        "./update.js": 12,
        "./vdom.js": 13,
      },
    ],
    3: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.createContext = createContext;
        exports.createDom = createDom;
        exports.createPortal = createPortal;
        exports.forwardRef = forwardRef;
        exports.render = render;
        exports.updateDom = updateDom;

        var _env = require("./env.js");

        var _fiber = require("./fiber.js");

        var _render = require("./render.js");

        var _share = require("./share.js");

        var _tools = require("./tools.js");

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
            Object.keys(oldProps)
              .filter(_tools.isEvent)
              .filter(function (key) {
                return (
                  (0, _tools.isGone)(newProps)(key) ||
                  (0, _tools.isNew)(oldProps, newProps)(key)
                );
              })
              .forEach(function (key) {
                var eventName = (0, _tools.getNativeEventName)(key.slice(2));
                element.removeEventListener(eventName, oldProps[key]);
              });
            Object.keys(oldProps)
              .filter(_tools.isProperty)
              .filter((0, _tools.isGone)(newProps))
              .forEach(function (key) {
                if (key === "className") {
                  element[key] = "";
                } else {
                  element.removeAttribute(key);
                }
              });
            Object.keys(newProps)
              .filter(_tools.isProperty)
              .filter((0, _tools.isNew)(oldProps, newProps))
              .forEach(function (key) {
                if (key === "className") {
                  element[key] = newProps[key];
                } else {
                  element.setAttribute(key, newProps[key]);
                }
              });
            Object.keys(newProps)
              .filter(_tools.isEvent)
              .filter((0, _tools.isNew)(oldProps, newProps))
              .forEach(function (key) {
                var eventName = (0, _tools.getNativeEventName)(key.slice(2));
                element.addEventListener(eventName, newProps[key]);
              });
            Object.keys(newProps)
              .filter(_tools.isStyle)
              .forEach(function (styleKey) {
                Object.keys(newProps[styleKey])
                  .filter(
                    (0, _tools.isNew)(
                      oldProps[styleKey] || _env.empty,
                      newProps[styleKey]
                    )
                  )
                  .forEach(function (styleName) {
                    element.style[styleName] = newProps[styleKey][styleName];
                  });
              });
          }

          return element;
        }

        function createDom(fiber) {
          var dom = fiber.__isTextNode__
            ? document.createTextNode(fiber.__vdom__)
            : document.createElement(fiber.__vdom__.type);
          updateDom(
            dom,
            _env.empty,
            fiber.__isTextNode__ ? _env.empty : fiber.__vdom__.props,
            fiber
          );
          return dom;
        }

        function render(element, container) {
          _env.rootContainer.current = container;
          var rootElement = (0, _vdom.createElement)(null, null, element);

          var _rootFiber = (0, _fiber.createFiberNode)(
            {
              deepIndex: 0,
            },
            rootElement
          );

          _rootFiber.__root__ = true;
          _env.rootFiber.current = _rootFiber;
          (0, _render.startRender)(_rootFiber);
        }

        function createPortal(element, container) {
          return (0, _vdom.createElement)(
            {
              type: _tools.Portal,
            },
            {
              container: container,
            },
            element
          );
        }

        function createContext(value) {
          var ContextObject = {
            type: _tools.Context,
          };
          var ProviderObject = {
            type: _tools.Provider,
            value: value,
          };
          var ConsumerObject = {
            type: _tools.Consumer,
            Internal: _share.MyReactInstance,
          };
          Object.defineProperty(ConsumerObject, "Context", {
            get: function get() {
              return ContextObject;
            },
            enumerable: false,
            configurable: false,
          });
          Object.defineProperty(ProviderObject, "Context", {
            get: function get() {
              return ContextObject;
            },
            enumerable: false,
            configurable: false,
          });
          ContextObject.Provider = ProviderObject;
          ContextObject.Consumer = ConsumerObject;
          return ContextObject;
        }

        function forwardRef(ForwardRefRender) {
          return {
            type: _tools.ForwardRef,
            render: ForwardRefRender,
          };
        }
      },
      {
        "./env.js": 4,
        "./fiber.js": 5,
        "./render.js": 9,
        "./share.js": 10,
        "./tools.js": 11,
        "./vdom.js": 13,
      },
    ],
    4: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.rootFiber =
          exports.rootContainer =
          exports.pendingUpdateFiberArray =
          exports.pendingUnmountFiberArray =
          exports.pendingPositionFiberArray =
          exports.pendingModifyFiberArray =
          exports.pendingLayoutEffectArray =
          exports.pendingEffectArray =
          exports.nextTransformFiberArray =
          exports.needLoop =
          exports.isMounted =
          exports.empty =
          exports.currentTransformFiberArray =
          exports.currentRunningFiber =
          exports.currentHookDeepIndex =
          exports.currentFunctionFiber =
            void 0;

        var _tools = require("./tools.js");

        var empty = {};
        exports.empty = empty;
        var needLoop = (0, _tools.createRef)(false);
        exports.needLoop = needLoop;
        var rootFiber = (0, _tools.createRef)(null);
        exports.rootFiber = rootFiber;
        var rootContainer = (0, _tools.createRef)(null);
        exports.rootContainer = rootContainer;
        var currentRunningFiber = (0, _tools.createRef)(null);
        exports.currentRunningFiber = currentRunningFiber;
        var isMounted = (0, _tools.createRef)(false);
        exports.isMounted = isMounted;
        var currentHookDeepIndex = (0, _tools.createRef)(0);
        exports.currentHookDeepIndex = currentHookDeepIndex;
        var currentFunctionFiber = (0, _tools.createRef)(null);
        exports.currentFunctionFiber = currentFunctionFiber;
        var nextTransformFiberArray = (0, _tools.createRef)([]);
        exports.nextTransformFiberArray = nextTransformFiberArray;
        var currentTransformFiberArray = (0, _tools.createRef)([]);
        exports.currentTransformFiberArray = currentTransformFiberArray;
        var pendingLayoutEffectArray = (0, _tools.createRef)([]);
        exports.pendingLayoutEffectArray = pendingLayoutEffectArray;
        var pendingEffectArray = (0, _tools.createRef)([]);
        exports.pendingEffectArray = pendingEffectArray;
        var pendingUpdateFiberArray = (0, _tools.createRef)([]);
        exports.pendingUpdateFiberArray = pendingUpdateFiberArray;
        var pendingModifyFiberArray = (0, _tools.createRef)([]);
        exports.pendingModifyFiberArray = pendingModifyFiberArray;
        var pendingUnmountFiberArray = (0, _tools.createRef)([]);
        exports.pendingUnmountFiberArray = pendingUnmountFiberArray;
        var pendingPositionFiberArray = (0, _tools.createRef)([]);
        exports.pendingPositionFiberArray = pendingPositionFiberArray;
      },
      { "./tools.js": 11 },
    ],
    5: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.MyReactFiberNode = void 0;
        exports.createFiberNode = createFiberNode;
        exports.updateFiberNode = updateFiberNode;

        var _component = require("./component.js");

        var _dom = require("./dom.js");

        var _hook = require("./hook.js");

        var _share = require("./share.js");

        var _update = require("./update.js");

        var _vdom = require("./vdom.js");

        function _typeof(obj) {
          "@babel/helpers - typeof";
          return (
            (_typeof =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (obj) {
                    return typeof obj;
                  }
                : function (obj) {
                    return obj &&
                      "function" == typeof Symbol &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                      ? "symbol"
                      : typeof obj;
                  }),
            _typeof(obj)
          );
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

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
          Object.defineProperty(Constructor, "prototype", { writable: false });
          return Constructor;
        }

        function _defineProperty(obj, key, value) {
          if (key in obj) {
            Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true,
            });
          } else {
            obj[key] = value;
          }
          return obj;
        }

        var MyReactFiberNode = /*#__PURE__*/ (function () {
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
           * @type MyReactFiberNode[]
           */

          /**
           * @type MyReactFiberNode[]
           */

          /**
           * @type MyReactFiberNode
           */

          /**
           * @type MyReactVDom
           */
          function MyReactFiberNode(
            key,
            deepIndex,
            /**
             * @type MyReactFiberNode
             */
            fiberParent,
            /**
             * @type MyReactFiberNode
             */
            fiberAlternate,
            effect,
            dom,
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
            hookList,
            listeners,
            /**
             * @type MyReactInstance & MyReactComponent
             */
            instance
          ) {
            _classCallCheck(this, MyReactFiberNode);

            _defineProperty(this, "mount", true);

            _defineProperty(this, "initial", true);

            _defineProperty(this, "memoProps", null);

            _defineProperty(this, "memoState", null);

            _defineProperty(this, "fiberFirstChild", null);

            _defineProperty(this, "fiberLastChild", null);

            _defineProperty(this, "fiberPrevRender", null);

            _defineProperty(this, "diffMount", false);

            _defineProperty(this, "children", []);

            _defineProperty(this, "renderedChildren", []);

            _defineProperty(this, "fiberNext", null);

            _defineProperty(this, "__vdom__", null);

            _defineProperty(this, "__needUpdate__", false);

            _defineProperty(this, "__pendingPosition__", false);

            _defineProperty(this, "__pendingUpdate__", false);

            _defineProperty(this, "__pendingUnmount__", false);

            _defineProperty(this, "__renderCount__", 1);

            _defineProperty(this, "__highLightCover__", null);

            _defineProperty(this, "__updateTimeStep__", Date.now());

            _defineProperty(this, "__lastUpdateTimeStep__", null);

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

            this._initialState();

            this._initialUpdate();

            this._initialType();

            this._initialParent();
          }

          _createClass(MyReactFiberNode, [
            {
              key: "_initialState",
              value: function _initialState() {
                this.hookList = this.hookList || [];
                this.listeners = this.listeners || [];
              },
            },
            {
              key: "_initialUpdate",
              value: function _initialUpdate() {
                if (this.fiberAlternate) {
                  this.fiberAlternate.mount = false;
                  this.fiberAlternate.fiberAlternate = null; // no need
                  // this.__needUpdate__ = this.fiberAlternate.__needUpdate__;

                  this.fiberAlternate.__needUpdate__ = false;
                  this.__renderCount__ =
                    this.fiberAlternate.__renderCount__ + 1;
                  this.__lastUpdateTimeStep__ =
                    this.fiberAlternate.__updateTimeStep__;
                }
              },
            },
            {
              key: "_initialType",
              value: function _initialType() {
                this.__isEmptyNode__ = false;
                this.__isTextNode__ = false;
                this.__isPlainNode__ = false;
                this.__isClonedNode__ = false;
                this.__isFragmentNode__ = false; // 对象转换为节点   //

                this.__isObjectNode__ = false;
                this.__isForwardRef__ = false;
                this.__isPortal__ = false;
                this.__isMemo__ = false;
                this.__isContextProvider__ = false;
                this.__isContextConsumer__ = false; // 动态节点 //

                this.__isDynamicNode__ = false;
                this.__isClassComponent__ = false;
                this.__isFunctionComponent__ = false;
              },
            },
            {
              key: "_initialParent",
              value: function _initialParent() {
                if (this.fiberParent) {
                  this.fiberParent.addChild(this);
                }
              },
            },
            {
              key: "_processType",
              value: function _processType() {
                var VDom = this.__vdom__;

                if ((0, _vdom.isValidElement)(VDom)) {
                  this.__isEmptyNode__ = VDom.__isEmptyNode__;
                  this.__isPlainNode__ = VDom.__isPlainNode__;
                  this.__isFragmentNode__ = VDom.__isFragmentNode__;
                  this.__isDynamicNode__ = VDom.__isDynamicNode__;
                  this.__isObjectNode__ = VDom.__isObjectNode__;
                  this.__isPortal__ = VDom.__isPortal__;
                  this.__isMemo__ = VDom.__isMemo__;
                  this.__isForwardRef__ = VDom.__isForwardRef__;
                  this.__isClassComponent__ = VDom.__isClassComponent__;
                  this.__isFunctionComponent__ = VDom.__isFunctionComponent__;
                  this.__isContextProvider__ = VDom.__isContextProvider__;
                  this.__isContextConsumer__ = VDom.__isContextConsumer__;
                } else {
                  if (_typeof(VDom) === "object") {
                    this.__isEmptyNode__ = true;
                  } else {
                    this.__isTextNode__ = true;
                  }
                }
              },
            },
            {
              key: "_processDom",
              value: function _processDom() {
                if (this.__isTextNode__ || this.__isPlainNode__) {
                  this.dom = this.dom || (0, _dom.createDom)(this);
                }

                if (this.__isPortal__) {
                  if (!this.__vdom__.props.container) {
                    throw new Error("createPortal() need a dom container");
                  }

                  this.dom = this.__vdom__.props.container;
                }
              },
            },
            {
              key: "_processRef",
              value: function _processRef() {
                if (this.__isPlainNode__) {
                  var ref = this.__vdom__.ref;

                  if (_typeof(ref) === "object") {
                    ref.current = this.dom;
                  } else if (typeof ref === "function") {
                    ref.call(null, this.dom);
                  } else if (ref) {
                    throw new Error("unSupport ref usage");
                  }
                }
              },
            },
            {
              key: "_processMemoProps",
              value: function _processMemoProps() {
                this.memoProps = this.__isTextNode__
                  ? null
                  : this.__vdom__.props;
              },
            },
            {
              key: "reset",
              value: function reset() {
                this.fiberFirstChild = null;
                this.fiberLastChild = null;
                this.renderedChildren = [];
                this.children = [];
              },
            },
            {
              key: "stopUpdate",
              value: function stopUpdate() {
                var _this = this;

                var alternate = this.fiberAlternate;

                if (alternate !== this) {
                  this.children = alternate.children;
                  this.fiberFirstChild = alternate.fiberFirstChild;
                  this.fiberLastChild = alternate.fiberLastChild;
                  this.renderedChildren = alternate.renderedChildren;
                  this.children.forEach(function (child) {
                    return (child.fiberParent = _this);
                  });
                } else {
                  throw new Error("预料之外的错误");
                }
              },
            },
            {
              key: "installVDom",
              value: function installVDom(newVDom) {
                this.__vdom__ = newVDom;

                this._processType();

                this._processDom();

                this._processRef();

                this._processMemoProps();
              },
              /**
               *
               * @param {MyReactFiberNode} parentFiber
               */
            },
            {
              key: "installParent",
              value: function installParent(parentFiber) {
                this.fiberParent = parentFiber;

                this._initialParent();
              },
              /**
               *
               * @param {MyReactComponent & MyReactInstance} instance
               */
            },
            {
              key: "installInstance",
              value: function installInstance(instance) {
                this.instance = instance;
              },
              /**
               *
               * @param {MyReactHookNode} hookNode
               */
            },
            {
              key: "installHook",
              value: function installHook(hookNode) {
                this.addHook(hookNode);
              },
            },
            {
              key: "addListener",
              value: function addListener(node) {
                if (
                  this.listeners.every(function (_node) {
                    return _node !== node;
                  })
                ) {
                  this.listeners.push(node);
                }
              },
            },
            {
              key: "removeListener",
              value: function removeListener(node) {
                this.listeners = this.listeners.filter(function (_node) {
                  return _node !== node;
                });
              },
              /**
               *
               * @param {MyReactFiberNode} childFiber
               */
            },
            {
              key: "addChild",
              value: function addChild(childFiber) {
                this.children.push(childFiber);

                if (!this.fiberFirstChild) {
                  this.fiberFirstChild = childFiber;
                  this.fiberLastChild = childFiber;
                } else {
                  this.fiberLastChild.fiberNext = childFiber;
                  this.fiberLastChild = childFiber;
                }
              },
              /**
               *
               * @param {MyReactHookNode} hookNode
               */
            },
            {
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
              },
            },
            {
              key: "update",
              value: function update() {
                if (this.mount) {
                  (0, _update.pushFiber)(this);
                } else {
                  console.error("update a unmount fiber");
                }
              },
            },
          ]);

          return MyReactFiberNode;
        })();
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
            hookList = _ref.hookList,
            listeners = _ref.listeners,
            instance = _ref.instance;
          var newFiberNode = new MyReactFiberNode(
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
          );
          newFiberNode.installVDom(newVDom);
          return newFiberNode;
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         * @param {MyReactFiberNode} parentFiber
         * @param {MyReactVDom} vdom
         */

        function updateFiberNode(fiber, parentFiber, vdom) {
          fiber.fiberAlternate = fiber;
          fiber.installVDom(vdom);
          fiber.installParent(parentFiber);
          return fiber;
        }
      },
      {
        "./component.js": 1,
        "./dom.js": 3,
        "./hook.js": 6,
        "./share.js": 10,
        "./update.js": 12,
        "./vdom.js": 13,
      },
    ],
    6: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.MyReactHookNode = void 0;
        exports.useCallback = useCallback;
        exports.useContext = useContext;
        exports.useEffect = useEffect;
        exports.useLayoutEffect = useLayoutEffect;
        exports.useMemo = useMemo;
        exports.useRef = useRef;
        exports.useState = useState;

        var _env = require("./env.js");

        var _fiber = require("./fiber.js");

        var _share = require("./share.js");

        var _tools = require("./tools.js");

        var _update = require("./update.js");

        function _typeof(obj) {
          "@babel/helpers - typeof";
          return (
            (_typeof =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (obj) {
                    return typeof obj;
                  }
                : function (obj) {
                    return obj &&
                      "function" == typeof Symbol &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                      ? "symbol"
                      : typeof obj;
                  }),
            _typeof(obj)
          );
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

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
          Object.defineProperty(Constructor, "prototype", { writable: false });
          return Constructor;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function"
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                writable: true,
                configurable: true,
              },
            }
          );
          Object.defineProperty(subClass, "prototype", { writable: false });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf =
            Object.setPrototypeOf ||
            function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();
          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
              result;
            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;
              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }
            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (
            call &&
            (_typeof(call) === "object" || typeof call === "function")
          ) {
            return call;
          } else if (call !== void 0) {
            throw new TypeError(
              "Derived constructors may only return object or undefined"
            );
          }
          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          }
          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct)
            return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;
          try {
            Boolean.prototype.valueOf.call(
              Reflect.construct(Boolean, [], function () {})
            );
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
              };
          return _getPrototypeOf(o);
        }

        function _defineProperty(obj, key, value) {
          if (key in obj) {
            Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true,
            });
          } else {
            obj[key] = value;
          }
          return obj;
        }

        var MyReactHookNode = /*#__PURE__*/ (function (_MyReactInstance) {
          _inherits(MyReactHookNode, _MyReactInstance);

          var _super = _createSuper(MyReactHookNode);

          function MyReactHookNode(
            hookIndex,
            _value,
            depArray,
            hookType,
            hookNext,
            hookPrev,
            cancel,
            effect
          ) {
            var _this;

            _classCallCheck(this, MyReactHookNode);

            _this = _super.call(this);

            _defineProperty(
              _assertThisInitialized(_this),
              "__pendingEffect__",
              false
            );

            _defineProperty(
              _assertThisInitialized(_this),
              "setValue",
              function (value) {
                _this.value = value;
                _this.prevResult = _this.result;

                if (typeof value === "function") {
                  _this.result = value(_this.result);
                } else {
                  _this.result = value;
                }

                if (!Object.is(_this.result, _this.prevResult)) {
                  Promise.resolve().then(function () {
                    return _this.__fiber__.update();
                  });
                }
              }
            );

            _this.hookIndex = hookIndex;
            _this.value = _value;
            _this.depArray = depArray;
            _this.hookType = hookType;
            _this.hookNext = hookNext;
            _this.hookPrev = hookPrev;
            _this.cancel = cancel;
            _this.effect = effect;

            _this._initialResult();

            _this._checkValidHook();

            return _this;
          }

          _createClass(MyReactHookNode, [
            {
              key: "_initialResult",
              value: function _initialResult() {
                this.result = null;
                this.prevResult = null;
              },
            },
            {
              key: "_checkValidHook",
              value: function _checkValidHook() {
                if (
                  this.hookType === "useMemo" ||
                  this.hookType === "seEffect" ||
                  this.hookType === "useCallback" ||
                  this.hookType === "useLayoutEffect"
                ) {
                  if (typeof this.value !== "function") {
                    throw new Error(
                      "".concat(
                        this.hookType,
                        " \u521D\u59CB\u5316\u9519\u8BEF"
                      )
                    );
                  }
                }

                if (this.hookType === "useContext") {
                  if (_typeof(this.value) !== "object" || this.value === null) {
                    throw new Error(
                      "".concat(
                        this.hookType,
                        " \u521D\u59CB\u5316\u9519\u8BEF"
                      )
                    );
                  }
                }
              },
            },
            {
              key: "_processContext",
              value: function _processContext() {
                var providerFiber = this.processContext(this.value);
                this.result = providerFiber.__vdom__.props.value;
              },
            },
            {
              key: "initialResult",
              value: function initialResult() {
                if (this.hookType === "useState") {
                  this.result =
                    typeof this.value === "function"
                      ? this.value.call(null)
                      : this.value;
                } else if (
                  this.hookType === "useEffect" ||
                  this.hookType === "useLayoutEffect"
                ) {
                  this.effect = true;
                } else if (this.hookType === "useCallback") {
                  this.result = this.value;
                } else if (this.hookType === "useMemo") {
                  this.result = this.value.call(null);
                } else if (this.hookType === "useContext") {
                  this._processContext();
                } else if (this.hookType === "useRef") {
                  this.result = this.value;
                } else {
                  throw new Error("无效的hook");
                }
              },
            },
            {
              key: "update",
              value: function update(
                newAction,
                newDepArray,
                newHookType,
                newFiber
              ) {
                this.updateDependence(newFiber);

                if (
                  this.hookType === "useEffect" ||
                  this.hookType === "useLayoutEffect" ||
                  this.hookType === "useMemo" ||
                  this.hookType === "useCallback"
                ) {
                  if (newDepArray && !this.depArray) {
                    throw new Error("依赖状态变更");
                  }

                  if (!newDepArray && this.depArray) {
                    throw new Error("依赖状态变更");
                  }
                }

                if (
                  this.hookType === "useEffect" ||
                  this.hookType === "useLayoutEffect"
                ) {
                  if (!newDepArray) {
                    this.value = newAction;
                    this.effect = true;
                  } else if (
                    !(0, _tools.isNormalEqual)(this.depArray, newDepArray)
                  ) {
                    console.log(this.depArray, newDepArray);
                    this.value = newAction;
                    this.depArray = newDepArray;
                    this.effect = true;
                  }
                }

                if (this.hookType === "useCallback") {
                  if (!(0, _tools.isNormalEqual)(this.depArray, newDepArray)) {
                    this.value = newAction;
                    this.result = newAction;
                    this.depArray = newDepArray;
                  }
                }

                if (this.hookType === "useMemo") {
                  if (!(0, _tools.isNormalEqual)(this.depArray, newDepArray)) {
                    this.value = newAction;
                    this.result = newAction.call(null);
                    this.depArray = newDepArray;
                  }
                }

                if (this.hookType === "useContext") {
                  if (
                    !this.__context__.mount ||
                    !Object.is(this.value, newAction)
                  ) {
                    this.value = newAction;

                    this._processContext();
                  }
                }
              },
            },
          ]);

          return MyReactHookNode;
        })(_share.MyReactInstance);
        /**
         *
         * @param {{hookIndex: number, value: any, depArray: any[], hookType: string}} param
         * @param {MyReactFiberNode} fiber
         */

        exports.MyReactHookNode = MyReactHookNode;

        function createHookNode(_ref, fiber) {
          var hookIndex = _ref.hookIndex,
            value = _ref.value,
            depArray = _ref.depArray,
            hookType = _ref.hookType;
          var newHookNode = new MyReactHookNode(
            hookIndex,
            value,
            depArray,
            hookType
          );
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
              (0, _update.pushEffect)(hookNode.__fiber__, hookNode);
            } else {
              (0, _update.pushLayoutEffect)(hookNode.__fiber__, hookNode);
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

        function getHookNode(fiber, hookIndex, value, depArray, hookType) {
          if (!fiber) throw new Error("hook使用必须在函数组件中");
          var currentHookNode = null;

          if (fiber.hookList.length > hookIndex) {
            currentHookNode = fiber.hookList[hookIndex];
            currentHookNode.update(value, depArray, hookType, fiber);
          } else {
            currentHookNode = createHookNode(
              {
                hookIndex: hookIndex,
                hookType: hookType,
                value: value,
                depArray: depArray,
              },
              fiber
            );
          }

          if (currentHookNode.effect) {
            pushHookEffect(currentHookNode);
          }

          return currentHookNode;
        }

        function useState(initialValue) {
          var currentHookNode = getHookNode(
            _env.currentFunctionFiber.current,
            _env.currentHookDeepIndex.current++,
            initialValue,
            null,
            "useState"
          );
          return [currentHookNode.result, currentHookNode.setValue];
        }

        function useEffect(action, depArray) {
          getHookNode(
            _env.currentFunctionFiber.current,
            _env.currentHookDeepIndex.current++,
            action,
            depArray,
            "useEffect"
          );
        }

        function useLayoutEffect(action, depArray) {
          getHookNode(
            _env.currentFunctionFiber.current,
            _env.currentHookDeepIndex.current++,
            action,
            depArray,
            "useLayoutEffect"
          );
        }

        function useCallback(action, depArray) {
          return getHookNode(
            _env.currentFunctionFiber.current,
            _env.currentHookDeepIndex.current++,
            action,
            depArray,
            "useCallback"
          ).result;
        }

        function useMemo(action, depArray) {
          return getHookNode(
            _env.currentFunctionFiber.current,
            _env.currentHookDeepIndex.current++,
            action,
            depArray,
            "useMemo"
          ).result;
        }

        function useRef(value) {
          return getHookNode(
            _env.currentFunctionFiber.current,
            _env.currentHookDeepIndex.current++,
            (0, _tools.createRef)(value),
            null,
            "useRef"
          ).result;
        }

        function useContext(Context) {
          return getHookNode(
            _env.currentFunctionFiber.current,
            _env.currentHookDeepIndex.current++,
            Context,
            null,
            "useContext"
          ).result;
        }
      },
      {
        "./env.js": 4,
        "./fiber.js": 5,
        "./share.js": 10,
        "./tools.js": 11,
        "./update.js": 12,
      },
    ],
    7: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
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
            mountLoop(
              currentFiber.fiberFirstChild,
              currentFiber.dom || parentDom
            );
            mountLoop(currentFiber.fiberNext, parentDom);
          }
        }

        function mountStart() {
          try {
            mountLoop(
              _env.rootFiber.current,
              (0, _tools.getDom)(
                _env.rootFiber.current.fiberParent,
                function (fiber) {
                  return fiber.fiberParent;
                }
              ) || _env.rootContainer.current
            );
          } catch (e) {
            console.log(e);
          }
        }
      },
      { "./env.js": 4, "./fiber.js": 5, "./tools.js": 11, "./update.js": 12 },
    ],
    8: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.React = void 0;
        Object.defineProperty(exports, "cloneElement", {
          enumerable: true,
          get: function get() {
            return _vdom.cloneElement;
          },
        });
        Object.defineProperty(exports, "createContext", {
          enumerable: true,
          get: function get() {
            return _dom.createContext;
          },
        });
        Object.defineProperty(exports, "createPortal", {
          enumerable: true,
          get: function get() {
            return _dom.createPortal;
          },
        });
        Object.defineProperty(exports, "createRef", {
          enumerable: true,
          get: function get() {
            return _tools.createRef;
          },
        });
        exports["default"] = void 0;
        Object.defineProperty(exports, "forwardRef", {
          enumerable: true,
          get: function get() {
            return _dom.forwardRef;
          },
        });
        Object.defineProperty(exports, "isValidElement", {
          enumerable: true,
          get: function get() {
            return _vdom.isValidElement;
          },
        });
        Object.defineProperty(exports, "memo", {
          enumerable: true,
          get: function get() {
            return _vdom.memo;
          },
        });
        Object.defineProperty(exports, "render", {
          enumerable: true,
          get: function get() {
            return _dom.render;
          },
        });
        Object.defineProperty(exports, "useCallback", {
          enumerable: true,
          get: function get() {
            return _hook.useCallback;
          },
        });
        Object.defineProperty(exports, "useContext", {
          enumerable: true,
          get: function get() {
            return _hook.useContext;
          },
        });
        Object.defineProperty(exports, "useEffect", {
          enumerable: true,
          get: function get() {
            return _hook.useEffect;
          },
        });
        Object.defineProperty(exports, "useLayoutEffect", {
          enumerable: true,
          get: function get() {
            return _hook.useLayoutEffect;
          },
        });
        Object.defineProperty(exports, "useMemo", {
          enumerable: true,
          get: function get() {
            return _hook.useMemo;
          },
        });
        Object.defineProperty(exports, "useRef", {
          enumerable: true,
          get: function get() {
            return _hook.useRef;
          },
        });
        Object.defineProperty(exports, "useState", {
          enumerable: true,
          get: function get() {
            return _hook.useState;
          },
        });

        var _component = require("./component.js");

        var _dom = require("./dom.js");

        var _hook = require("./hook.js");

        var _tools = require("./tools.js");

        var _vdom = require("./vdom.js");

        var React = {
          // core
          render: _dom.render,
          createElement: _vdom.createElement,
          Component: _component.MyReactComponent,
          PureComponent: _component.MyReactPureComponent,
          // feature
          memo: _vdom.memo,
          cloneElement: _vdom.cloneElement,
          isValidElement: _vdom.isValidElement,
          createRef: _tools.createRef,
          createContext: _dom.createContext,
          createPortal: _dom.createPortal,
          forwardRef: _dom.forwardRef,
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
          Children: {
            map: function map(children, action) {
              return (0, _tools.map)(
                children,
                function (vDom) {
                  return vDom instanceof _vdom.MyReactVDom;
                },
                action
              );
            },
          },
        };
        exports.React = React;
        window.React = React;
        window.ReactDOM = React;
        var _default = React;
        exports["default"] = _default;
      },
      {
        "./component.js": 1,
        "./dom.js": 3,
        "./hook.js": 6,
        "./tools.js": 11,
        "./vdom.js": 13,
      },
    ],
    9: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.renderLoopSync = renderLoopSync;
        exports.startRender = startRender;

        var _core = require("./core.js");

        var _env = require("./env.js");

        var _fiber = require("./fiber.js");

        var _mount = require("./mount.js");

        var _tools = require("./tools.js");

        var _update = require("./update.js");

        function _toConsumableArray(arr) {
          return (
            _arrayWithoutHoles(arr) ||
            _iterableToArray(arr) ||
            _unsupportedIterableToArray(arr) ||
            _nonIterableSpread()
          );
        }

        function _nonIterableSpread() {
          throw new TypeError(
            "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        }

        function _unsupportedIterableToArray(o, minLen) {
          if (!o) return;
          if (typeof o === "string") return _arrayLikeToArray(o, minLen);
          var n = Object.prototype.toString.call(o).slice(8, -1);
          if (n === "Object" && o.constructor) n = o.constructor.name;
          if (n === "Map" || n === "Set") return Array.from(o);
          if (
            n === "Arguments" ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          )
            return _arrayLikeToArray(o, minLen);
        }

        function _iterableToArray(iter) {
          if (
            (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null) ||
            iter["@@iterator"] != null
          )
            return Array.from(iter);
        }

        function _arrayWithoutHoles(arr) {
          if (Array.isArray(arr)) return _arrayLikeToArray(arr);
        }

        function _arrayLikeToArray(arr, len) {
          if (len == null || len > arr.length) len = arr.length;
          for (var i = 0, arr2 = new Array(len); i < len; i++) {
            arr2[i] = arr[i];
          }
          return arr2;
        }

        /**
         *
         * @param {MyReactFiberNode} fiber
         */
        function transformStart(fiber) {
          if (fiber.mount) {
            var _currentTransformFibe;

            (_currentTransformFibe =
              _env.currentTransformFiberArray.current).push.apply(
              _currentTransformFibe,
              _toConsumableArray((0, _core.nextWork)(fiber))
            );
          }
        }

        function transformCurrent() {
          while (_env.currentTransformFiberArray.current.length) {
            var _nextTransformFiberAr;

            var fiber = _env.currentTransformFiberArray.current.shift();

            if (fiber.mount)
              (_nextTransformFiberAr =
                _env.nextTransformFiberArray.current).push.apply(
                _nextTransformFiberAr,
                _toConsumableArray((0, _core.nextWork)(fiber))
              );
          }
        }

        function transformNext() {
          while (_env.nextTransformFiberArray.current.length) {
            var _currentTransformFibe2;

            var fiber = _env.nextTransformFiberArray.current.shift();

            if (fiber.mount)
              (_currentTransformFibe2 =
                _env.currentTransformFiberArray.current).push.apply(
                _currentTransformFibe2,
                _toConsumableArray((0, _core.nextWork)(fiber))
              );
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
         * @param {MyReactFiberNode} fiber
         */

        function startRender(fiber) {
          _env.needLoop.current = true;
          (0, _tools.safeCall)(function () {
            return renderLoopSync(fiber);
          });
          (0, _tools.safeCall)(function () {
            return (0, _mount.mountStart)();
          });
          (0, _update.runLayoutEffect)();
          (0, _update.runEffect)();
          _env.isMounted.current = true;
          _env.needLoop.current = false;
        }
      },
      {
        "./core.js": 2,
        "./env.js": 4,
        "./fiber.js": 5,
        "./mount.js": 7,
        "./tools.js": 11,
        "./update.js": 12,
      },
    ],
    10: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.MyReactInstance = void 0;

        var _tools = require("./tools.js");

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

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
          Object.defineProperty(Constructor, "prototype", { writable: false });
          return Constructor;
        }

        function _defineProperty(obj, key, value) {
          if (key in obj) {
            Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true,
            });
          } else {
            obj[key] = value;
          }
          return obj;
        }

        var MyReactInstance = /*#__PURE__*/ (function () {
          function MyReactInstance() {
            _classCallCheck(this, MyReactInstance);

            _defineProperty(this, "__fiber__", null);

            _defineProperty(this, "__context__", null);
          }

          _createClass(MyReactInstance, [
            {
              key: "updateDependence",
              value: function updateDependence(newFiber, newContext) {
                this.__fiber__ = newFiber || this.__fiber__;
                this.__context__ = newContext || this.__context__;
              },
            },
            {
              key: "processContext",
              value: function processContext(ContextObject) {
                if (this.__context__) this.__context__.removeListener(this);
                var providerFiber = (0, _tools.getContextFiber)(
                  this.__fiber__,
                  ContextObject
                );
                providerFiber.addListener(this);
                this.updateDependence(null, providerFiber);
                return providerFiber;
              },
            },
          ]);

          return MyReactInstance;
        })();

        exports.MyReactInstance = MyReactInstance;
      },
      { "./tools.js": 11 },
    ],
    11: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.getNativeEventName =
          exports.getFiberNodeName =
          exports.getDom =
          exports.getContextFiber =
          exports.createRef =
          exports.Provider =
          exports.Portal =
          exports.Memo =
          exports.Fragment =
          exports.ForwardRef =
          exports.Context =
          exports.Consumer =
            void 0;
        exports.isEqual = isEqual;
        exports.isNew = exports.isGone = exports.isEvent = void 0;
        exports.isNormalEqual = isNormalEqual;
        exports.safeCall =
          exports.map =
          exports.logFiber =
          exports.isStyle =
          exports.isProperty =
            void 0;

        var _env = require("./env.js");

        var _fiber = require("./fiber.js");

        function _typeof(obj) {
          "@babel/helpers - typeof";
          return (
            (_typeof =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (obj) {
                    return typeof obj;
                  }
                : function (obj) {
                    return obj &&
                      "function" == typeof Symbol &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                      ? "symbol"
                      : typeof obj;
                  }),
            _typeof(obj)
          );
        }

        var isEvent = function isEvent(key) {
          return key.startsWith("on");
        };

        exports.isEvent = isEvent;

        var isProperty = function isProperty(key) {
          return key !== "children" && !isEvent(key) && !isStyle(key);
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

        var getDom = function getDom(fiber) {
          var transfer =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : function (fiber) {
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

        exports.getDom = getDom;

        var createRef = function createRef(val) {
          return {
            current: val,
          };
        };
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        exports.createRef = createRef;

        var getFiberNodeName = function getFiberNodeName(fiber) {
          if (fiber.__root__) return "<Root />";
          if (fiber.__isTextNode__)
            return "<text - (".concat(fiber.__vdom__, ") />");
          if (fiber.__isPlainNode__)
            return "<".concat(fiber.__vdom__.type, " />");
          if (fiber.__isDynamicNode__)
            return "<".concat(fiber.__vdom__.type.name || "Unknown", " * />");
          if (fiber.__isFragmentNode__) return "<Fragment />";

          if (fiber.__isObjectNode__) {
            if (fiber.__isForwardRef__) return "<ForwardRef />";
            if (fiber.__isPortal__) return "<Portal />";
            if (fiber.__isContextProvider__) return "<Provider />";
            if (fiber.__isContextConsumer__) return "<Consumer />";
          }

          if (fiber.__isEmptyNode__) return "<Empty />";
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
              res =
                "".padStart(12) +
                "".concat(getFiberNodeName(parent), "\n").concat(res);
              parent = parent.fiberParent;
            }

            return "\n" + res;
          } else {
            return "";
          }
        };

        exports.logFiber = logFiber;

        var safeCall = function safeCall(action) {
          try {
            return action();
          } catch (e) {
            console.warn(logFiber(_env.currentRunningFiber.current), "\n", e);
            throw e;
          }
        };

        exports.safeCall = safeCall;

        function isNormalEqual(src, target) {
          if (
            _typeof(src) === "object" &&
            _typeof(target) === "object" &&
            src !== null &&
            target !== null
          ) {
            var flag = true;

            for (var key in src) {
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
          if (_typeof(src) === "object" && _typeof(target) === "object") {
            var flag = true;

            for (var key in src) {
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

        var getProviderFiber = function getProviderFiber(
          fiber,
          providerObject
        ) {
          if (fiber) {
            if (
              fiber.__isObjectNode__ &&
              fiber.__isContextProvider__ &&
              fiber.__vdom__.type === providerObject
            ) {
              return fiber;
            } else {
              return getProviderFiber(fiber.fiberParent, providerObject);
            }
          }
        };

        var getContextFiber = function getContextFiber(fiber, ContextObject) {
          if (!ContextObject) return;
          if (ContextObject.type !== Context) throw new Error("错误的用法");
          var providerFiber = getProviderFiber(fiber, ContextObject.Provider);
          if (!providerFiber) throw new Error("context need provider");
          return providerFiber;
        };

        exports.getContextFiber = getContextFiber;

        var map = function map(arrayLike, judge, action) {
          if (Array.isArray(arrayLike)) {
            arrayLike.forEach(function (item) {
              return map(item, judge, action);
            });
          }

          if (judge(arrayLike)) {
            action.call(null, arrayLike);
          }
        }; // in progress

        exports.map = map;

        var getNativeEventName = function getNativeEventName(eventName) {
          if (eventName === "DoubleClick") {
            return "dblclick";
          }

          return eventName.toLowerCase();
        };

        exports.getNativeEventName = getNativeEventName;
      },
      { "./env.js": 4, "./fiber.js": 5 },
    ],
    12: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.commitUpdate = commitUpdate;
        exports.pushEffect = pushEffect;
        exports.pushFiber = pushFiber;
        exports.pushLayoutEffect = pushLayoutEffect;
        exports.pushPosition = pushPosition;
        exports.pushUnmount = pushUnmount;
        exports.pushUpdate = pushUpdate;
        exports.runEffect = runEffect;
        exports.runLayoutEffect = runLayoutEffect;
        exports.runUnmount = runUnmount;
        exports.runUpdate = runUpdate;

        var _dom = require("./dom.js");

        var _env = require("./env.js");

        var _fiber2 = require("./fiber.js");

        var _render = require("./render.js");

        var _tools = require("./tools.js");

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
              (0, _dom.updateDom)(
                currentFiber.dom,
                currentFiber.__isTextNode__
                  ? _env.empty
                  : currentFiber.fiberAlternate.__vdom__.props,
                currentFiber.__isTextNode__
                  ? _env.empty
                  : currentFiber.__vdom__.props,
                currentFiber
              ); // highLightDom(currentFiber);
            }

            currentFiber.dom.__fiber__ = currentFiber;
            currentFiber.dom.__vdom__ = currentFiber.__vdom__;
            currentFiber.dom.__children__ = currentFiber.children;
          }

          currentFiber.fiberAlternate = null;
          currentFiber.effect = null;
        }

        function startUpdateAll(updateFiberArray) {
          _env.needLoop.current = true;
          (0, _tools.safeCall)(function () {
            return updateFiberArray.forEach(_render.renderLoopSync);
          });
          runPosition();
          runUpdate();
          runUnmount();
          runLayoutEffect();
          runEffect();
          _env.needLoop.current = false;
        }

        function updateStart() {
          if (!_env.needLoop.current) {
            var pendingUpdate = _env.pendingModifyFiberArray.current
              .slice(0)
              .filter(function (f) {
                return f.__needUpdate__ && f.mount;
              });

            pendingUpdate.sort(function (f1, f2) {
              return f1.deepIndex - f2.deepIndex > 0 ? 1 : -1;
            });
            _env.pendingModifyFiberArray.current = [];
            startUpdateAll(pendingUpdate);
          }
        }

        var asyncUpdate = function asyncUpdate() {
          return Promise.resolve().then(updateStart);
        };
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

          asyncUpdate();
        }

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
          prepareEffectArray(
            _env.pendingLayoutEffectArray.current,
            fiber.deepIndex
          ).push(effect);
        }

        function runLayoutEffect() {
          var allLayoutEffectArray =
            _env.pendingLayoutEffectArray.current.slice(0);

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
          prepareEffectArray(
            _env.pendingEffectArray.current,
            fiber.deepIndex
          ).push(effect);
        }

        function runEffect() {
          var allEffectArray = _env.pendingEffectArray.current.slice(0);

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
          _env.pendingEffectArray.current = [];
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

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
              commitUpdate(
                fiber,
                (0, _tools.getDom)(fiber.fiberParent, function (fiber) {
                  return fiber.fiberParent;
                }) || _env.rootContainer.current
              );
            }
          });
        }
        /**
         *
         * @param {MyReactFiberNode | MyReactFiberNode[]} fiber
         */

        function pushUnmount(fiber) {
          (0, _tools.map)(
            fiber,
            function (f) {
              return f instanceof _fiber2.MyReactFiberNode;
            },
            function (f) {
              if (!f.__pendingUnmount__) {
                f.__pendingUnmount__ = true;

                _env.pendingUnmountFiberArray.current.push(f);
              }
            }
          );
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function clearFiberNode(fiber) {
          fiber.children.forEach(clearFiberNode);
          fiber.hookList.forEach(function (hook) {
            if (
              hook.hookType === "useEffect" ||
              hook.hookType === "useLayoutEffect"
            ) {
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
          var allUnmountFiberArray =
            _env.pendingUnmountFiberArray.current.slice(0);

          allUnmountFiberArray.forEach(function (fiber) {
            fiber.__pendingUnmount__ = false;
            clearFiberNode(fiber);
            clearFiberDom(fiber);
          });
          _env.pendingUnmountFiberArray.current = [];
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         * @param {HTMLElement} beforeDom
         * @param {HTMLElement} parentDom
         */

        function insertBefore(fiber, beforeDom, parentDom) {
          if (!fiber) throw new Error("意料之外的错误");
          fiber.effect = null;

          if (fiber.dom) {
            if (!fiber.__isPortal__) {
              parentDom.insertBefore(fiber.dom, beforeDom);
            }
          } else {
            fiber.children.forEach(function (f) {
              return insertBefore(f, beforeDom, parentDom);
            });
          }
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         * @param {HTMLElement} parentDom
         */

        function append(fiber, parentDom) {
          if (!fiber) throw new Error("意料之外的错误");
          fiber.effect = null;

          if (fiber.dom) {
            if (!fiber.__isPortal__) {
              parentDom.append(fiber.dom);
            }
          } else {
            fiber.children.forEach(function (f) {
              return append(f, parentDom);
            });
          }
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
         * @param {MyReactFiberNode} parentFiber
         */

        function appendToFragment(fiber, parentFiber) {
          var nextFiber = parentFiber.fiberNext;
          fiber.effect = null;

          if (nextFiber) {
            insertBefore(
              fiber,
              (0, _tools.getDom)(nextFiber, function (fiber) {
                return fiber.fiberFirstChild;
              }),
              (0, _tools.getDom)(fiber.fiberParent, function (fiber) {
                return fiber.fiberParent;
              }) || _env.rootContainer.current
            );
          } else if (parentFiber.fiberParent) {
            if (parentFiber.fiberParent.__isFragmentNode__) {
              appendToFragment(fiber, parentFiber.fiberParent);
            } else {
              append(
                fiber,
                (0, _tools.getDom)(parentFiber.fiberParent, function (fiber) {
                  return fiber.fiberParent;
                }) || _env.rootContainer.current
              );
            }
          } else {
            console.log("root append");
            append(fiber, _env.rootContainer.current);
          }
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function commitPosition(fiber) {
          var children = fiber.children;

          for (var i = children.length - 1; i >= 0; i--) {
            var _fiber = children[i];

            if (_fiber.diffMount) {
              if (_fiber.fiberPrevRender) {
                insertBefore(
                  _fiber,
                  (0, _tools.getDom)(_fiber.fiberPrevRender, function (fiber) {
                    return fiber.fiberFirstChild;
                  }),
                  (0, _tools.getDom)(_fiber.fiberParent, function (fiber) {
                    return fiber.fiberParent;
                  }) || _env.rootContainer.current
                );
              } else {
                // new create
                if (_fiber.fiberNext) {
                  insertBefore(
                    _fiber,
                    (0, _tools.getDom)(_fiber.fiberNext, function (fiber) {
                      return fiber.fiberFirstChild;
                    }),
                    (0, _tools.getDom)(_fiber.fiberParent, function (fiber) {
                      return fiber.fiberParent;
                    }) || _env.rootContainer.current
                  );
                } else {
                  // last one
                  if (_fiber.fiberParent.__isFragmentNode__) {
                    appendToFragment(_fiber, _fiber.fiberParent);
                  } else {
                    append(
                      _fiber,
                      (0, _tools.getDom)(_fiber.fiberParent, function (fiber) {
                        return fiber.fiberParent;
                      }) || _env.rootContainer.current
                    );
                  }
                }
              }

              _fiber.diffMount = false;
              _fiber.fiberPrevRender = null;
            }
          }
        }
        /**
         *
         * @param {MyReactFiberNode} fiber
         */

        function runPosition(fiber) {
          var allPositionArray =
            _env.pendingPositionFiberArray.current.slice(0);

          allPositionArray.forEach(function (fiber) {
            fiber.__pendingPosition__ = false;
            commitPosition(fiber);
          });
          _env.pendingPositionFiberArray.current = [];
        }
      },
      {
        "./dom.js": 3,
        "./env.js": 4,
        "./fiber.js": 5,
        "./render.js": 9,
        "./tools.js": 11,
      },
    ],
    13: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.MyReactVDom = void 0;
        exports.cloneElement = cloneElement;
        exports.createElement = createElement;
        exports.isValidElement = isValidElement;
        exports.memo = memo;

        var _component = require("./component.js");

        var _fiber = require("./fiber.js");

        var _share = require("./share.js");

        var _tools = require("./tools.js");

        var _excluded = ["key", "ref"];

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function"
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                writable: true,
                configurable: true,
              },
            }
          );
          Object.defineProperty(subClass, "prototype", { writable: false });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf =
            Object.setPrototypeOf ||
            function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();
          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
              result;
            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;
              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }
            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (
            call &&
            (_typeof(call) === "object" || typeof call === "function")
          ) {
            return call;
          } else if (call !== void 0) {
            throw new TypeError(
              "Derived constructors may only return object or undefined"
            );
          }
          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          }
          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct)
            return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;
          try {
            Boolean.prototype.valueOf.call(
              Reflect.construct(Boolean, [], function () {})
            );
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
              };
          return _getPrototypeOf(o);
        }

        function _toConsumableArray(arr) {
          return (
            _arrayWithoutHoles(arr) ||
            _iterableToArray(arr) ||
            _unsupportedIterableToArray(arr) ||
            _nonIterableSpread()
          );
        }

        function _nonIterableSpread() {
          throw new TypeError(
            "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        }

        function _unsupportedIterableToArray(o, minLen) {
          if (!o) return;
          if (typeof o === "string") return _arrayLikeToArray(o, minLen);
          var n = Object.prototype.toString.call(o).slice(8, -1);
          if (n === "Object" && o.constructor) n = o.constructor.name;
          if (n === "Map" || n === "Set") return Array.from(o);
          if (
            n === "Arguments" ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          )
            return _arrayLikeToArray(o, minLen);
        }

        function _iterableToArray(iter) {
          if (
            (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null) ||
            iter["@@iterator"] != null
          )
            return Array.from(iter);
        }

        function _arrayWithoutHoles(arr) {
          if (Array.isArray(arr)) return _arrayLikeToArray(arr);
        }

        function _arrayLikeToArray(arr, len) {
          if (len == null || len > arr.length) len = arr.length;
          for (var i = 0, arr2 = new Array(len); i < len; i++) {
            arr2[i] = arr[i];
          }
          return arr2;
        }

        function ownKeys(object, enumerableOnly) {
          var keys = Object.keys(object);
          if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            enumerableOnly &&
              (symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
              })),
              keys.push.apply(keys, symbols);
          }
          return keys;
        }

        function _objectSpread(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = null != arguments[i] ? arguments[i] : {};
            i % 2
              ? ownKeys(Object(source), !0).forEach(function (key) {
                  _defineProperty(target, key, source[key]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(
                  target,
                  Object.getOwnPropertyDescriptors(source)
                )
              : ownKeys(Object(source)).forEach(function (key) {
                  Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                  );
                });
          }
          return target;
        }

        function _defineProperty(obj, key, value) {
          if (key in obj) {
            Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true,
            });
          } else {
            obj[key] = value;
          }
          return obj;
        }

        function _typeof(obj) {
          "@babel/helpers - typeof";
          return (
            (_typeof =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (obj) {
                    return typeof obj;
                  }
                : function (obj) {
                    return obj &&
                      "function" == typeof Symbol &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                      ? "symbol"
                      : typeof obj;
                  }),
            _typeof(obj)
          );
        }

        function _objectWithoutProperties(source, excluded) {
          if (source == null) return {};
          var target = _objectWithoutPropertiesLoose(source, excluded);
          var key, i;
          if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for (i = 0; i < sourceSymbolKeys.length; i++) {
              key = sourceSymbolKeys[i];
              if (excluded.indexOf(key) >= 0) continue;
              if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue;
              target[key] = source[key];
            }
          }
          return target;
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

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

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
          Object.defineProperty(Constructor, "prototype", { writable: false });
          return Constructor;
        }

        var MyReactVDom = /*#__PURE__*/ (function () {
          function MyReactVDom(
            /**
             * @type typeof MyReactInstance
             */
            type,
            props,
            /**
             * @type MyReactVDom[]
             */
            children
          ) {
            _classCallCheck(this, MyReactVDom);

            var _ref = props || {},
              key = _ref.key,
              ref = _ref.ref,
              resProps = _objectWithoutProperties(_ref, _excluded);

            this.type = type;
            this.key = key;
            this.ref = ref;
            this.props = resProps;
            this.children = children;

            this._initialType();

            this._processType();

            this._initialProps();

            this._checkValidVDom();
          }

          _createClass(MyReactVDom, [
            {
              key: "_initialType",
              value: function _initialType() {
                this.__isEmptyNode__ = false;
                this.__isPlainNode__ = false;
                this.__isClonedNode__ = false;
                this.__isFragmentNode__ = false; // 对象转换为节点   //

                this.__isObjectNode__ = false;
                this.__isForwardRef__ = false;
                this.__isPortal__ = false;
                this.__isMemo__ = false;
                this.__isContextProvider__ = false;
                this.__isContextConsumer__ = false; // 动态节点 //

                this.__isDynamicNode__ = false;
                this.__isClassComponent__ = false;
                this.__isFunctionComponent__ = false;
              },
            },
            {
              key: "_processType",
              value: function _processType() {
                var rawType = this.type;

                if (_typeof(this.type) === "object" && this.type !== null) {
                  this.__isObjectNode__ = true;
                  rawType = this.type.type;
                } // internal element

                switch (rawType) {
                  case _tools.Fragment:
                    this.__isFragmentNode__ = true;
                    return;

                  case _tools.Provider:
                    this.__isContextProvider__ = true;
                    return;

                  case _tools.Consumer:
                    this.__isContextConsumer__ = true;
                    return;

                  case _tools.Portal:
                    this.__isPortal__ = true;
                    return;

                  case _tools.Memo:
                    this.__isMemo__ = true;
                    return;

                  case _tools.ForwardRef:
                    this.__isForwardRef__ = true;
                    return;
                }

                if (typeof rawType === "function") {
                  this.__isDynamicNode__ = true;

                  if (rawType.prototype.isMyReactComponent) {
                    this.__isClassComponent__ = true;
                  } else {
                    this.__isFunctionComponent__ = true;
                  }

                  return;
                } else if (typeof rawType === "string") {
                  this.__isPlainNode__ = true;
                  return;
                }

                this.__isEmptyNode__ = true;
              },
            },
            {
              key: "_initialProps",
              value: function _initialProps() {
                if (
                  this.__isClassComponent__ &&
                  this.type.prototype.isMyReactMemoComponent &&
                  this.type.prototype.isMyReactForwardRefRender
                ) {
                  this.props = _objectSpread(
                    _objectSpread({}, this.props),
                    {},
                    {
                      ref: this.ref,
                    }
                  );
                }
              },
            },
            {
              key: "_checkValidVDom",
              value: function _checkValidVDom() {
                if (this.__isContextConsumer__) {
                  if (typeof this.children !== "function") {
                    throw new Error("Consumer need function as children");
                  }
                }
              },
            },
          ]);

          return MyReactVDom;
        })();

        exports.MyReactVDom = MyReactVDom;

        function createVDom(_ref2) {
          var type = _ref2.type,
            props = _ref2.props,
            children = _ref2.children;
          return new MyReactVDom(type, props, children || props.children);
        }

        function createElement(type, props, children) {
          var childrenLength = arguments.length - 2;
          props = props || {};

          if (childrenLength > 1) {
            children = Array.from(arguments).slice(2);
          } // 将children参数自动添加到props中

          if (
            (Array.isArray(children) && children.length) ||
            (children !== null && children !== undefined)
          ) {
            props.children = children;
          }

          return createVDom({
            type: type,
            props: props,
            children: children,
          });
        }

        function cloneElement(element, props, children) {
          if (element instanceof MyReactVDom) {
            var clonedElement = createElement.apply(
              void 0,
              [
                element.type,
                Object.assign(
                  {},
                  element.props,
                  {
                    key: element.key,
                  },
                  {
                    ref: element.ref,
                  },
                  props
                ),
                children,
              ].concat(_toConsumableArray(Array.from(arguments).slice(3)))
            );
            clonedElement.__isClonedNode__ = true;
            return clonedElement;
          } else {
            return element;
          }
        }

        function isValidElement(element) {
          if (element instanceof MyReactVDom) {
            return true;
          } else {
            return false;
          }
        }

        function memo(MemoRender) {
          var Memo = /*#__PURE__*/ (function (_MyReactPureComponent) {
            _inherits(Memo, _MyReactPureComponent);

            var _super = _createSuper(Memo);

            function Memo() {
              _classCallCheck(this, Memo);

              return _super.apply(this, arguments);
            }

            _createClass(Memo, [
              {
                key: "isMyReactMemoComponent",
                get: function get() {
                  return true;
                },
              },
              {
                key: "isMyReactForwardRefRender",
                get: function get() {
                  return (
                    _typeof(MemoRender) === "object" &&
                    MemoRender.type === _tools.ForwardRef
                  );
                },
              },
              {
                key: "render",
                value: function render() {
                  return createElement(MemoRender, this.props);
                },
              },
            ]);

            return Memo;
          })(_component.MyReactPureComponent);

          return Memo;
        }
      },
      {
        "./component.js": 1,
        "./fiber.js": 5,
        "./share.js": 10,
        "./tools.js": 11,
      },
    ],
  },
  {},
  [8]
);
