import { __extends } from "tslib";
import { getTypeFromVDom, isValidElement } from "../element";
import { MyReactInternalType } from "../internal";
import { globalDispatch } from "../share";
var MyReactFiberInternal = /** @class */ (function (_super) {
    __extends(MyReactFiberInternal, _super);
    function MyReactFiberInternal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
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
            __root__: false,
        };
        _this.__internal_node_state__ = {
            __pendingCreate__: false,
            __pendingUpdate__: false,
            __pendingAppend__: false,
            __pendingPosition__: false,
            __pendingContext__: false,
        };
        _this.__internal_node_event__ = {};
        _this.__internal_node_context__ = {
            __dependence__: [],
            __contextMap__: {},
        };
        _this.__internal_node_props__ = {
            __vdom__: null,
            __prevVdom__: null,
            __props__: {},
            __prevProps__: {},
            __children__: null,
        };
        // __internal_node_dom__: {
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
            hookType: [],
        };
        _this.__internal_node_update__ = {
            __compUpdateQueue__: [],
            __hookUpdateQueue__: [],
        };
        _this.__internal_node_effect__ = {
            __effectQueue__: [],
            __layoutEffectQueue__: [],
        };
        _this.__internal_node_unmount__ = {
            __unmountQueue__: [],
        };
        return _this;
    }
    Object.defineProperty(MyReactFiberInternal.prototype, "__isUpdateRender__", {
        get: function () {
            return this.__internal_node_diff__.__isUpdateRender__;
        },
        set: function (v) {
            this.__internal_node_diff__.__isUpdateRender__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__isRenderDynamic__", {
        get: function () {
            return this.__internal_node_diff__.__isRenderDynamic__;
        },
        set: function (v) {
            this.__internal_node_diff__.__isRenderDynamic__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__renderedCount__", {
        get: function () {
            return this.__internal_node_diff__.__renderedCount__;
        },
        set: function (v) {
            this.__internal_node_diff__.__renderedCount__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__renderedChildren__", {
        get: function () {
            return this.__internal_node_diff__.__renderedChildren__;
        },
        set: function (v) {
            this.__internal_node_diff__.__renderedChildren__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__renderedChildHead__", {
        get: function () {
            return this.__internal_node_diff__.__renderedChildHead__;
        },
        set: function (v) {
            this.__internal_node_diff__.__renderedChildHead__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__renderedChildFoot__", {
        get: function () {
            return this.__internal_node_diff__.__renderedChildFoot__;
        },
        set: function (v) {
            this.__internal_node_diff__.__renderedChildFoot__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__dynamicChildren__", {
        get: function () {
            return this.__internal_node_diff__.__dynamicChildren__;
        },
        set: function (v) {
            this.__internal_node_diff__.__dynamicChildren__ = v;
            this.__internal_node_diff__.__isRenderDynamic__ = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__updateTimeStep__", {
        get: function () {
            return this.__internal_node_diff__.__updateTimeStep__;
        },
        set: function (v) {
            var diff = this.__internal_node_diff__;
            var lastTimeStep = diff.__updateTimeStep__;
            var nowTimeStep = v;
            diff.__lastUpdateTimeStep__ = lastTimeStep;
            diff.__updateTimeStep__ = nowTimeStep;
            diff.__updateTimeSpace__ = nowTimeStep - lastTimeStep;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__fallback__", {
        get: function () {
            return this.__internal_node_diff__.__fallback__;
        },
        set: function (v) {
            this.__internal_node_diff__.__fallback__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__root__", {
        get: function () {
            return this.__internal_node_diff__.__root__;
        },
        set: function (v) {
            this.__internal_node_diff__.__root__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__pendingCreate__", {
        get: function () {
            return this.__internal_node_state__.__pendingCreate__;
        },
        set: function (v) {
            this.__internal_node_state__.__pendingCreate__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__pendingUpdate__", {
        get: function () {
            return this.__internal_node_state__.__pendingUpdate__;
        },
        set: function (v) {
            this.__internal_node_state__.__pendingUpdate__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__pendingAppend__", {
        get: function () {
            return this.__internal_node_state__.__pendingAppend__;
        },
        set: function (v) {
            this.__internal_node_state__.__pendingAppend__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__pendingPosition__", {
        get: function () {
            return this.__internal_node_state__.__pendingPosition__;
        },
        set: function (v) {
            this.__internal_node_state__.__pendingPosition__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__pendingContext__", {
        get: function () {
            return this.__internal_node_state__.__pendingContext__;
        },
        set: function (v) {
            this.__internal_node_state__.__pendingContext__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__dependence__", {
        get: function () {
            return this.__internal_node_context__.__dependence__;
        },
        set: function (v) {
            this.__internal_node_context__.__dependence__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__contextMap__", {
        get: function () {
            return this.__internal_node_context__.__contextMap__;
        },
        set: function (v) {
            this.__internal_node_context__.__contextMap__ = v;
        },
        enumerable: false,
        configurable: true
    });
    MyReactFiberInternal.prototype.addDependence = function (node) {
        var dependence = this.__dependence__;
        if (dependence.every(function (n) { return n !== node; })) {
            dependence.push(node);
        }
    };
    MyReactFiberInternal.prototype.removeDependence = function (node) {
        var dependence = this.__dependence__;
        this.__dependence__ = dependence.filter(function (n) { return n !== node; });
    };
    Object.defineProperty(MyReactFiberInternal.prototype, "__vdom__", {
        get: function () {
            return this.__internal_node_props__.__vdom__;
        },
        set: function (v) {
            var props = this.__internal_node_props__;
            props.__vdom__ = v;
            props.__props__ = typeof v === "object" ? (v === null || v === void 0 ? void 0 : v.props) || {} : {};
            props.__children__ = typeof v === "object" ? v === null || v === void 0 ? void 0 : v.props.children : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__props__", {
        get: function () {
            return this.__internal_node_props__.__props__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__children__", {
        get: function () {
            return this.__internal_node_props__.__children__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__prevVdom__", {
        get: function () {
            return this.__internal_node_props__.__prevVdom__;
        },
        set: function (v) {
            var props = this.__internal_node_props__;
            props.__prevVdom__ = v;
            props.__prevProps__ = typeof v === "object" ? (v === null || v === void 0 ? void 0 : v.props) || {} : {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__prevProps__", {
        get: function () {
            return this.__internal_node_props__.__prevProps__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "hookHead", {
        get: function () {
            return this.__internal_node_hook__.hookHead;
        },
        set: function (v) {
            this.__internal_node_hook__.hookHead = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "hookFoot", {
        get: function () {
            return this.__internal_node_hook__.hookFoot;
        },
        set: function (v) {
            this.__internal_node_hook__.hookFoot = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "hookList", {
        get: function () {
            return this.__internal_node_hook__.hookList;
        },
        set: function (v) {
            this.__internal_node_hook__.hookList = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "hookType", {
        get: function () {
            return this.__internal_node_hook__.hookType;
        },
        set: function (v) {
            this.__internal_node_hook__.hookType = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__compUpdateQueue__", {
        get: function () {
            return this.__internal_node_update__.__compUpdateQueue__;
        },
        set: function (v) {
            this.__internal_node_update__.__compUpdateQueue__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__hookUpdateQueue__", {
        get: function () {
            return this.__internal_node_update__.__hookUpdateQueue__;
        },
        set: function (v) {
            this.__internal_node_update__.__hookUpdateQueue__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__unmountQueue__", {
        get: function () {
            return this.__internal_node_unmount__.__unmountQueue__;
        },
        set: function (v) {
            this.__internal_node_unmount__.__unmountQueue__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__effectQueue__", {
        get: function () {
            return this.__internal_node_effect__.__effectQueue__;
        },
        set: function (v) {
            this.__internal_node_effect__.__effectQueue__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactFiberInternal.prototype, "__layoutEffectQueue__", {
        get: function () {
            return this.__internal_node_effect__.__layoutEffectQueue__;
        },
        set: function (v) {
            this.__internal_node_effect__.__layoutEffectQueue__ = v;
        },
        enumerable: false,
        configurable: true
    });
    return MyReactFiberInternal;
}(MyReactInternalType));
var MyReactFiberNode = /** @class */ (function (_super) {
    __extends(MyReactFiberNode, _super);
    function MyReactFiberNode(index, parent, element) {
        var _this = _super.call(this) || this;
        _this.fiberIndex = 0;
        _this.mount = true;
        _this.dom = null;
        _this.nameSpace = null;
        _this.children = [];
        _this.child = null;
        _this.parent = null;
        _this.sibling = null;
        _this.instance = null;
        _this.__needUpdate__ = true;
        _this.__needTrigger__ = false;
        _this.parent = parent;
        _this.fiberIndex = index;
        _this.element = element;
        _this.__vdom__ = element;
        return _this;
    }
    MyReactFiberNode.prototype.addChild = function (child) {
        this.children.push(child);
        if (this.__renderedChildFoot__) {
            this.__renderedChildFoot__.sibling = child;
            this.__renderedChildFoot__ = child;
        }
        else {
            this.child = child;
            this.__renderedChildHead__ = child;
            this.__renderedChildFoot__ = child;
        }
    };
    MyReactFiberNode.prototype.initialParent = function () {
        var _a;
        if (this.parent) {
            this.parent.addChild(this);
            if (this.parent.nameSpace) {
                this.nameSpace = this.parent.nameSpace;
            }
            if (this.parent.__isSuspense__) {
                this.__fallback__ = this.parent.__props__.fallback;
            }
            else {
                this.__fallback__ = this.parent.__fallback__;
            }
            var contextMap = Object.assign({}, this.parent.__contextMap__, this.__contextMap__);
            if (typeof this.element === "object" && typeof ((_a = this.element) === null || _a === void 0 ? void 0 : _a.type) === "object" && this.__isContextProvider__) {
                var typedElementType = this.element.type;
                var contextObj = typedElementType["Context"];
                var contextId = contextObj["id"];
                contextMap[contextId] = this;
            }
            this.__contextMap__ = contextMap;
        }
    };
    MyReactFiberNode.prototype.installParent = function (newParent) {
        this.parent = newParent;
        this.sibling = null;
        this.initialParent();
    };
    MyReactFiberNode.prototype.updateRenderState = function () {
        if (__DEV__) {
            this.__renderedCount__ += 1;
            this.__updateTimeStep__ = Date.now();
        }
    };
    MyReactFiberNode.prototype.beforeUpdate = function () {
        this.child = null;
        this.children = [];
        this.__renderedChildHead__ = null;
        this.__renderedChildFoot__ = null;
    };
    MyReactFiberNode.prototype.triggerUpdate = function () {
        this.__needUpdate__ = true;
        this.__needTrigger__ = true;
        this.__isUpdateRender__ = true;
    };
    MyReactFiberNode.prototype.prepareUpdate = function () {
        this.__needUpdate__ = true;
        this.__isUpdateRender__ = true;
    };
    MyReactFiberNode.prototype.afterUpdate = function () {
        this.__needUpdate__ = false;
        this.__needTrigger__ = false;
        this.__isUpdateRender__ = false;
        this.__isRenderDynamic__ = false;
    };
    // when update, install new vdom
    MyReactFiberNode.prototype.installVDom = function (vdom) {
        this.element = vdom;
        this.__vdom__ = vdom;
    };
    // TODO
    MyReactFiberNode.prototype.checkVDom = function () {
        if (__DEV__) {
            var vdom = this.element;
            if (isValidElement(vdom)) {
                var typedVDom = vdom;
                if (!typedVDom._store["validType"]) {
                    if (this.__isContextConsumer__) {
                        if (typeof typedVDom.props.children !== "function") {
                            throw new Error("Consumer need a function children");
                        }
                    }
                    if (this.__isMemo__ || this.__isForwardRef__) {
                        var typedType = typedVDom.type;
                        if (typeof typedType.render !== "function" && typeof typedType.render !== "object") {
                            throw new Error("invalid render type");
                        }
                        if (this.__isForwardRef__ && typeof typedType.render !== "function") {
                            throw new Error("forwardRef() need a function component");
                        }
                    }
                    if (typedVDom.ref) {
                        if (typeof typedVDom.ref !== "object" && typeof typedVDom.ref !== "function") {
                            throw new Error("unSupport ref usage, should be a function or a object like {current: any}");
                        }
                    }
                    if (typedVDom.key && typeof typedVDom.key !== "string") {
                        throw new Error("invalid key type, ".concat(typedVDom.key));
                    }
                    if (typedVDom.props.children && typedVDom.props["dangerouslySetInnerHTML"]) {
                        throw new Error("can not render contain `children` and `dangerouslySetInnerHTML`");
                    }
                    if (typedVDom.props["dangerouslySetInnerHTML"]) {
                        if (typeof typedVDom.props["dangerouslySetInnerHTML"] !== "object" ||
                            !Object.prototype.hasOwnProperty.call(typedVDom.props["dangerouslySetInnerHTML"], "__html")) {
                            throw new Error("invalid dangerouslySetInnerHTML props, should like {__html: string}");
                        }
                    }
                    typedVDom._store["validType"] = true;
                }
            }
        }
    };
    MyReactFiberNode.prototype.initialType = function () {
        var vdom = this.element;
        var nodeType = getTypeFromVDom(vdom);
        this.setNodeType(nodeType);
        if (isValidElement(vdom)) {
            if (vdom.type === "svg")
                this.nameSpace = "http://www.w3.org/2000/svg";
        }
    };
    MyReactFiberNode.prototype.checkIsSameType = function (vdom) {
        if (this.__needTrigger__)
            return true;
        var nodeType = getTypeFromVDom(vdom);
        var result = this.isSameType(nodeType);
        var element = vdom;
        var currentElement = this.element;
        if (result) {
            if (this.__isDynamicNode__ || this.__isPlainNode__) {
                return Object.is(currentElement.type, element.type);
            }
            if (this.__isObjectNode__ && typeof element.type === "object" && typeof currentElement.type === "object") {
                return Object.is(element.type["$$typeof"], currentElement.type["$$typeof"]);
            }
            return true;
        }
        else {
            return false;
        }
    };
    MyReactFiberNode.prototype.addHook = function (hookNode) {
        this.hookList.push(hookNode);
        this.hookType.push(hookNode.hookType);
        if (!this.hookHead) {
            this.hookHead = hookNode;
            this.hookFoot = hookNode;
        }
        else if (this.hookFoot) {
            this.hookFoot.hookNext = hookNode;
            hookNode.hookPrev = this.hookFoot;
            this.hookFoot = hookNode;
        }
    };
    MyReactFiberNode.prototype.checkHook = function (hookNode) {
        if (__DEV__) {
            if (hookNode.hookType === "useMemo" ||
                hookNode.hookType === "useEffect" ||
                hookNode.hookType === "useCallback" ||
                hookNode.hookType === "useLayoutEffect") {
                if (typeof hookNode.value !== "function") {
                    throw new Error("".concat(hookNode.hookType, " initial error"));
                }
            }
            if (hookNode.hookType === "useContext") {
                if (typeof hookNode.value !== "object" || hookNode.value === null) {
                    throw new Error("".concat(hookNode.hookType, " initial error"));
                }
            }
        }
    };
    MyReactFiberNode.prototype.applyRef = function () {
        if (this.__isPlainNode__) {
            var typedElement = this.element;
            if (this.dom) {
                var ref = typedElement.ref;
                if (typeof ref === "object" && ref !== null) {
                    ref.current = this.dom;
                }
                else if (typeof ref === "function") {
                    ref(this.dom);
                }
            }
            else {
                throw new Error("do not have a dom for plain node");
            }
        }
        if (this.__isClassComponent__) {
            var typedElement = this.element;
            if (this.instance) {
                var ref = typedElement.ref;
                if (typeof ref === "object" && ref !== null) {
                    ref.current = this.instance;
                }
                else if (typeof ref === "function") {
                    ref(this.instance);
                }
            }
        }
    };
    MyReactFiberNode.prototype.applyVDom = function () {
        this.__prevVdom__ = this.__isTextNode__ ? this.__vdom__ : Object.assign({}, this.__vdom__);
    };
    MyReactFiberNode.prototype.installInstance = function (instance) {
        this.instance = instance;
    };
    MyReactFiberNode.prototype.update = function () {
        globalDispatch.current.trigger(this);
    };
    MyReactFiberNode.prototype.unmount = function () {
        this.hookList.forEach(function (hook) { return hook.unmount(); });
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
}(MyReactFiberInternal));
export { MyReactFiberNode };
//# sourceMappingURL=instance.js.map