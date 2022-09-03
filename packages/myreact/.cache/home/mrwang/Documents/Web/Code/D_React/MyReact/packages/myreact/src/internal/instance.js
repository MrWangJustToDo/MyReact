import { NODE_TYPE_KEY } from "./type";
var MyReactInternalInstance = /** @class */ (function () {
    function MyReactInternalInstance() {
        this.__internal_instance_state__ = {
            __fiber__: null,
            __context__: null,
        };
        this.__internal_instance_update__ = {
            __pendingEffect__: false,
        };
        this.context = null;
    }
    Object.defineProperty(MyReactInternalInstance.prototype, "__fiber__", {
        get: function () {
            return this.__internal_instance_state__.__fiber__;
        },
        set: function (v) {
            this.__internal_instance_state__.__fiber__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalInstance.prototype, "__context__", {
        get: function () {
            return this.__internal_instance_state__.__context__;
        },
        set: function (v) {
            this.__internal_instance_state__.__context__ = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalInstance.prototype, "__pendingEffect__", {
        get: function () {
            return this.__internal_instance_update__.__pendingEffect__;
        },
        set: function (v) {
            this.__internal_instance_update__.__pendingEffect__ = v;
        },
        enumerable: false,
        configurable: true
    });
    MyReactInternalInstance.prototype.setContext = function (context) {
        var _a;
        if (this.__context__)
            this.__context__.removeDependence(this);
        this.__context__ = context;
        (_a = this.__context__) === null || _a === void 0 ? void 0 : _a.addDependence(this);
    };
    MyReactInternalInstance.prototype.setFiber = function (fiber) {
        this.__fiber__ = fiber;
    };
    MyReactInternalInstance.prototype.unmount = function () {
        var _a;
        (_a = this.__context__) === null || _a === void 0 ? void 0 : _a.removeDependence(this);
    };
    return MyReactInternalInstance;
}());
export { MyReactInternalInstance };
var MyReactInternalType = /** @class */ (function () {
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
            __isFunctionComponent__: false,
        };
    }
    Object.defineProperty(MyReactInternalType.prototype, "__isNullNode__", {
        get: function () {
            return this.__internal_node_type__.__isNullNode__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isTextNode__", {
        get: function () {
            return this.__internal_node_type__.__isTextNode__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isEmptyNode__", {
        get: function () {
            return this.__internal_node_type__.__isEmptyNode__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isPlainNode__", {
        get: function () {
            return this.__internal_node_type__.__isPlainNode__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isStrictNode__", {
        get: function () {
            return this.__internal_node_type__.__isStrictNode__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isFragmentNode__", {
        get: function () {
            return this.__internal_node_type__.__isFragmentNode__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isObjectNode__", {
        get: function () {
            return this.__internal_node_type__.__isObjectNode__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isForwardRef__", {
        get: function () {
            return this.__internal_node_type__.__isForwardRef__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isPortal__", {
        get: function () {
            return this.__internal_node_type__.__isPortal__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isMemo__", {
        get: function () {
            return this.__internal_node_type__.__isMemo__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isContextProvider__", {
        get: function () {
            return this.__internal_node_type__.__isContextProvider__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isContextConsumer__", {
        get: function () {
            return this.__internal_node_type__.__isContextConsumer__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isLazy__", {
        get: function () {
            return this.__internal_node_type__.__isLazy__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isSuspense__", {
        get: function () {
            return this.__internal_node_type__.__isSuspense__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isDynamicNode__", {
        get: function () {
            return this.__internal_node_type__.__isDynamicNode__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isClassComponent__", {
        get: function () {
            return this.__internal_node_type__.__isClassComponent__;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactInternalType.prototype, "__isFunctionComponent__", {
        get: function () {
            return this.__internal_node_type__.__isFunctionComponent__;
        },
        enumerable: false,
        configurable: true
    });
    MyReactInternalType.prototype.setNodeType = function (props) {
        var _this = this;
        Object.keys(props || {}).forEach(function (key) {
            var typeKey = key;
            _this.__internal_node_type__[typeKey] = (props === null || props === void 0 ? void 0 : props[typeKey]) || false;
        });
    };
    MyReactInternalType.prototype.isSameType = function (props) {
        var _this = this;
        if (props) {
            return NODE_TYPE_KEY.every(function (key) {
                return _this.__internal_node_type__[key] ? Object.is(_this.__internal_node_type__[key], props[key]) : true;
            });
        }
        else {
            return false;
        }
    };
    return MyReactInternalType;
}());
export { MyReactInternalType };
//# sourceMappingURL=instance.js.map