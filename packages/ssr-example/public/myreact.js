(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.React = {}));
})(this, (function (exports) { 'use strict';

    var PATCH_TYPE;
    (function (PATCH_TYPE) {
        PATCH_TYPE[PATCH_TYPE["__initial__"] = 0] = "__initial__";
        PATCH_TYPE[PATCH_TYPE["__pendingCreate__"] = 1] = "__pendingCreate__";
        PATCH_TYPE[PATCH_TYPE["__pendingUpdate__"] = 2] = "__pendingUpdate__";
        PATCH_TYPE[PATCH_TYPE["__pendingAppend__"] = 4] = "__pendingAppend__";
        PATCH_TYPE[PATCH_TYPE["__pendingPosition__"] = 8] = "__pendingPosition__";
        PATCH_TYPE[PATCH_TYPE["__pendingContext__"] = 16] = "__pendingContext__";
        PATCH_TYPE[PATCH_TYPE["__pendingEffect__"] = 32] = "__pendingEffect__";
        PATCH_TYPE[PATCH_TYPE["__pendingLayoutEffect__"] = 64] = "__pendingLayoutEffect__";
        PATCH_TYPE[PATCH_TYPE["__pendingUnmount__"] = 128] = "__pendingUnmount__";
        PATCH_TYPE[PATCH_TYPE["__pendingDeactivate__"] = 256] = "__pendingDeactivate__";
    })(PATCH_TYPE || (PATCH_TYPE = {}));

    var NODE_TYPE;
    (function (NODE_TYPE) {
        NODE_TYPE[NODE_TYPE["__initial__"] = 0] = "__initial__";
        // ==== component node ==== //
        NODE_TYPE[NODE_TYPE["__isClassComponent__"] = 1] = "__isClassComponent__";
        NODE_TYPE[NODE_TYPE["__isFunctionComponent__"] = 2] = "__isFunctionComponent__";
        NODE_TYPE[NODE_TYPE["__isDynamicNode__"] = 3] = "__isDynamicNode__";
        // ==== object node, use create function to define node ==== //
        NODE_TYPE[NODE_TYPE["__isLazy__"] = 4] = "__isLazy__";
        NODE_TYPE[NODE_TYPE["__isMemo__"] = 8] = "__isMemo__";
        NODE_TYPE[NODE_TYPE["__isPortal__"] = 16] = "__isPortal__";
        NODE_TYPE[NODE_TYPE["__isSuspense__"] = 32] = "__isSuspense__";
        NODE_TYPE[NODE_TYPE["__isForwardRef__"] = 64] = "__isForwardRef__";
        NODE_TYPE[NODE_TYPE["__isContextProvider__"] = 128] = "__isContextProvider__";
        NODE_TYPE[NODE_TYPE["__isContextConsumer__"] = 256] = "__isContextConsumer__";
        NODE_TYPE[NODE_TYPE["__isObjectNode__"] = 508] = "__isObjectNode__";
        NODE_TYPE[NODE_TYPE["__isNullNode__"] = 512] = "__isNullNode__";
        NODE_TYPE[NODE_TYPE["__isTextNode__"] = 1024] = "__isTextNode__";
        NODE_TYPE[NODE_TYPE["__isEmptyNode__"] = 2048] = "__isEmptyNode__";
        NODE_TYPE[NODE_TYPE["__isPlainNode__"] = 4096] = "__isPlainNode__";
        NODE_TYPE[NODE_TYPE["__isStrictNode__"] = 8192] = "__isStrictNode__";
        NODE_TYPE[NODE_TYPE["__isFragmentNode__"] = 16384] = "__isFragmentNode__";
        NODE_TYPE[NODE_TYPE["__isKeepLiveNode__"] = 32768] = "__isKeepLiveNode__";
    })(NODE_TYPE || (NODE_TYPE = {}));

    var UPDATE_TYPE;
    (function (UPDATE_TYPE) {
        UPDATE_TYPE[UPDATE_TYPE["__initial__"] = 0] = "__initial__";
        UPDATE_TYPE[UPDATE_TYPE["__update__"] = 1] = "__update__";
        UPDATE_TYPE[UPDATE_TYPE["__trigger__"] = 2] = "__trigger__";
    })(UPDATE_TYPE || (UPDATE_TYPE = {}));

    var HOOK_TYPE;
    (function (HOOK_TYPE) {
        HOOK_TYPE["useRef"] = "useRef";
        HOOK_TYPE["useMemo"] = "useMemo";
        HOOK_TYPE["useState"] = "useState";
        HOOK_TYPE["useEffect"] = "useEffect";
        HOOK_TYPE["useContext"] = "useContext";
        HOOK_TYPE["useReducer"] = "useReducer";
        HOOK_TYPE["useCallback"] = "useCallback";
        HOOK_TYPE["useDebugValue"] = "useDebugValue";
        HOOK_TYPE["useLayoutEffect"] = "useLayoutEffect";
        HOOK_TYPE["useImperativeHandle"] = "useImperativeHandle";
    })(HOOK_TYPE || (HOOK_TYPE = {}));

    var Effect_TYPE;
    (function (Effect_TYPE) {
        Effect_TYPE[Effect_TYPE["__initial__"] = 0] = "__initial__";
        Effect_TYPE[Effect_TYPE["__pendingEffect__"] = 1] = "__pendingEffect__";
    })(Effect_TYPE || (Effect_TYPE = {}));

    var isNormalEquals = function (src, target, children) {
        if (children === void 0) { children = true; }
        if (typeof src === "object" && typeof target === "object" && src !== null && target !== null) {
            var srcKeys = Object.keys(src);
            var targetKeys = Object.keys(target);
            if (srcKeys.length !== targetKeys.length)
                return false;
            var res = true;
            for (var key in src) {
                if (key === "children") {
                    if (children) {
                        res = res && Object.is(src[key], target[key]);
                    }
                    else {
                        continue;
                    }
                }
                else {
                    res = res && Object.is(src[key], target[key]);
                }
                if (!res)
                    return res;
            }
            return res;
        }
        return Object.is(src, target);
    };

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __spreadArray$1(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var once = function (action) {
        var called = false;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (called)
                return;
            called = true;
            action.call.apply(action, __spreadArray$1([null], args, false));
        };
    };

    var createRef = function (value) {
        return { current: value };
    };

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var globalLoop = createRef(false);
    var currentRunningFiber = createRef(null);
    var currentComponentFiber = createRef(null);
    var currentFunctionFiber = createRef(null);
    var currentHookDeepIndex = createRef(0);
    // ==== feature ==== //
    var enableDebugLog = createRef(false);
    var enableAsyncUpdate = createRef(true);
    var enableKeyDiff = createRef(true);
    // enable react-18 strict lifecycle method
    var enableStrictLifeCycle = createRef(true);

    var getTrackDevLog = function (fiber) {
        var _a, _b, _c, _d;
        {
            var element = fiber.element;
            var source = typeof element === "object" ? element === null || element === void 0 ? void 0 : element["_source"] : null;
            var owner = typeof element === "object" ? element === null || element === void 0 ? void 0 : element["_owner"] : null;
            var preString = "";
            if (source) {
                var _e = source || {}, fileName = _e.fileName, lineNumber = _e.lineNumber;
                preString = "".concat(preString, " (").concat(fileName, ":").concat(lineNumber, ")");
            }
            if (!(fiber.type & NODE_TYPE.__isDynamicNode__) && typeof (owner === null || owner === void 0 ? void 0 : owner.element) === "object" && typeof ((_a = owner === null || owner === void 0 ? void 0 : owner.element) === null || _a === void 0 ? void 0 : _a.type) === "function") {
                var typedType = (_b = owner === null || owner === void 0 ? void 0 : owner.element) === null || _b === void 0 ? void 0 : _b.type;
                // eslint-disable-next-line @typescript-eslint/ban-types
                var name_1 = typedType.displayName || ((_d = (_c = owner === null || owner === void 0 ? void 0 : owner.element) === null || _c === void 0 ? void 0 : _c.type) === null || _d === void 0 ? void 0 : _d.name);
                preString = "".concat(preString, " (render dy ").concat(name_1, ")");
            }
            return preString;
        }
    };
    var getElementName = function (fiber) {
        var _a;
        if (fiber.type & NODE_TYPE.__isMemo__)
            return "<Memo />";
        if (fiber.type & NODE_TYPE.__isLazy__)
            return "<Lazy />";
        if (fiber.type & NODE_TYPE.__isPortal__)
            return "<Portal />";
        if (fiber.type & NODE_TYPE.__isNullNode__)
            return "<Null />";
        if (fiber.type & NODE_TYPE.__isEmptyNode__)
            return "<Empty />";
        if (fiber.type & NODE_TYPE.__isSuspense__)
            return "<Suspense />";
        if (fiber.type & NODE_TYPE.__isStrictNode__)
            return "<Strict />";
        if (fiber.type & NODE_TYPE.__isFragmentNode__)
            return "<Fragment />";
        if (fiber.type & NODE_TYPE.__isKeepLiveNode__)
            return "<KeepAlive />";
        if (fiber.type & NODE_TYPE.__isContextProvider__)
            return "<Provider />";
        if (fiber.type & NODE_TYPE.__isContextConsumer__)
            return "<Consumer />";
        if (fiber.type & NODE_TYPE.__isForwardRef__) {
            var typedType = fiber.element.type;
            if (typedType.render.name) {
                return "<ForwardRef - (".concat(typedType.render.name, ") />");
            }
            else {
                return "<ForwardRef />";
            }
        }
        if (typeof fiber.element === "object" && fiber.element !== null) {
            if (typeof fiber.element.type === "string") {
                return "<".concat(fiber.element.type, " />");
            }
            if (typeof fiber.element.type === "function") {
                var typedType = fiber.element.type;
                var name_2 = typedType.displayName || fiber.element.type.name || "anonymous";
                name_2 = fiber.root === fiber ? "".concat(name_2, " (root)") : name_2;
                return "<".concat(name_2, "* />");
            }
            return "<unknown* />";
        }
        else {
            return "<text (".concat((_a = fiber.element) === null || _a === void 0 ? void 0 : _a.toString(), ") />");
        }
    };
    var getFiberNodeName = function (fiber) { return "".concat(getElementName(fiber)).concat(getTrackDevLog(fiber)); };
    var getFiberTree = function (fiber) {
        if (fiber) {
            var preString = "".padEnd(4) + "at".padEnd(4);
            var parent_1 = fiber.parent;
            var res = "".concat(preString).concat(getFiberNodeName(fiber));
            while (parent_1) {
                res = "".concat(preString).concat(getFiberNodeName(parent_1), "\n").concat(res);
                parent_1 = parent_1.parent;
            }
            return "\n".concat(res);
        }
        return "";
    };
    var getHookTree = function (hookType, newType) {
        var re = "\n" + "".padEnd(6) + "Prev render:".padEnd(20) + "Next render:".padEnd(10) + "\n";
        for (var key in hookType) {
            var c = hookType[key];
            var n = newType[key];
            re += (+key + 1).toString().padEnd(6) + (c === null || c === void 0 ? void 0 : c.padEnd(20)) + (n === null || n === void 0 ? void 0 : n.padEnd(10)) + "\n";
        }
        re += "".padEnd(6) + "^".repeat(30) + "\n";
        return re;
    };
    var logHook = function (oldType, newType) { return getHookTree(oldType, newType); };
    var cache = {};
    var log = function (_a) {
        var fiber = _a.fiber, message = _a.message, _b = _a.level, level = _b === void 0 ? "warn" : _b, _c = _a.triggerOnce, triggerOnce = _c === void 0 ? false : _c;
        var tree = getFiberTree(fiber || currentRunningFiber.current);
        if (triggerOnce) {
            if (cache[tree])
                return;
            cache[tree] = true;
        }
        console[level]("[".concat(level, "]:"), "\n-----------------------------------------\n", "".concat(typeof message === "string" ? message : message.stack || message.message), "\n-----------------------------------------\n", "Render Tree:", tree);
    };
    var safeCall = function (action) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        try {
            return action.call.apply(action, __spreadArray([null], args, false));
        }
        catch (e) {
            log({ message: e, level: "error" });
            var fiber = currentRunningFiber.current;
            if (fiber)
                fiber.root.scope.isAppCrash = true;
            throw new Error(e.message);
        }
    };
    var safeCallWithFiber = function (_a) {
        var action = _a.action, fiber = _a.fiber;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        try {
            return action.call.apply(action, __spreadArray([null], args, false));
        }
        catch (e) {
            log({ message: e, level: "error", fiber: fiber });
            fiber.root.scope.isAppCrash = true;
            throw new Error(e.message);
        }
    };

    var My_React_Element = Symbol.for("react.element");
    var My_React_Memo = Symbol.for("react.memo");
    var My_React_ForwardRef = Symbol.for("react.forward_ref");
    var My_React_Portal = Symbol.for("react.portal");
    var My_React_Fragment = Symbol.for("react.fragment");
    var My_React_Context = Symbol.for("react.context");
    var My_React_Provider = Symbol.for("react.provider");
    var My_React_Consumer = Symbol.for("react.consumer");
    var My_React_Lazy = Symbol.for("react.lazy");
    var My_React_Suspense = Symbol.for("react.suspense");
    var My_React_Strict = Symbol.for("react.strict");
    var My_React_KeepLive = Symbol.for("react.keep_live");

    function isValidElement(element) {
        return (typeof element === "object" &&
            !Array.isArray(element) &&
            ((element === null || element === void 0 ? void 0 : element.$$typeof) === My_React_Element ||
                (element === null || element === void 0 ? void 0 : element.$$typeof) === My_React_Context ||
                (element === null || element === void 0 ? void 0 : element.$$typeof) === My_React_Consumer ||
                (element === null || element === void 0 ? void 0 : element.$$typeof) === My_React_Provider ||
                (element === null || element === void 0 ? void 0 : element.$$typeof) === My_React_ForwardRef ||
                (element === null || element === void 0 ? void 0 : element.$$typeof) === My_React_Memo ||
                (element === null || element === void 0 ? void 0 : element.$$typeof) === My_React_Lazy ||
                (element === null || element === void 0 ? void 0 : element.$$typeof) === My_React_Portal));
    }
    function getTypeFromElement(element) {
        var _a;
        var nodeTypeSymbol = NODE_TYPE.__initial__;
        if (isValidElement(element)) {
            var rawType = element.type;
            // object node
            if (typeof rawType === "object") {
                var typedRawType = rawType;
                switch (typedRawType["$$typeof"]) {
                    case My_React_Provider:
                        nodeTypeSymbol |= NODE_TYPE.__isContextProvider__;
                        break;
                    case My_React_Consumer:
                        nodeTypeSymbol |= NODE_TYPE.__isContextConsumer__;
                        break;
                    case My_React_Portal:
                        nodeTypeSymbol |= NODE_TYPE.__isPortal__;
                        break;
                    case My_React_Memo:
                        nodeTypeSymbol |= NODE_TYPE.__isMemo__;
                        break;
                    case My_React_ForwardRef:
                        nodeTypeSymbol |= NODE_TYPE.__isForwardRef__;
                        break;
                    case My_React_Lazy:
                        nodeTypeSymbol |= NODE_TYPE.__isLazy__;
                        break;
                    default:
                        throw new Error("invalid object element type ".concat(typedRawType["$$typeof"].toString()));
                }
            }
            else if (typeof rawType === "function") {
                if ((_a = rawType.prototype) === null || _a === void 0 ? void 0 : _a.isMyReactComponent) {
                    nodeTypeSymbol |= NODE_TYPE.__isClassComponent__;
                }
                else {
                    nodeTypeSymbol |= NODE_TYPE.__isFunctionComponent__;
                }
            }
            else if (typeof rawType === "symbol") {
                switch (rawType) {
                    case My_React_KeepLive:
                        nodeTypeSymbol |= NODE_TYPE.__isKeepLiveNode__;
                        break;
                    case My_React_Fragment:
                        nodeTypeSymbol |= NODE_TYPE.__isFragmentNode__;
                        break;
                    case My_React_Strict:
                        nodeTypeSymbol |= NODE_TYPE.__isStrictNode__;
                        break;
                    case My_React_Suspense:
                        nodeTypeSymbol |= NODE_TYPE.__isSuspense__;
                        break;
                    default:
                        throw new Error("invalid symbol element type ".concat(rawType.toString()));
                }
            }
            else if (typeof rawType === "string") {
                nodeTypeSymbol |= NODE_TYPE.__isPlainNode__;
            }
            else {
                {
                    log({ message: "invalid element type ".concat(String(rawType)), level: "warn", triggerOnce: true });
                }
                nodeTypeSymbol |= NODE_TYPE.__isEmptyNode__;
            }
        }
        else {
            if (typeof element === "object" && element !== null) {
                {
                    log({ message: "invalid object element type ".concat(JSON.stringify(element)), level: "warn", triggerOnce: true });
                }
                nodeTypeSymbol |= NODE_TYPE.__isEmptyNode__;
            }
            else if (element === null || element === undefined || typeof element === "boolean") {
                nodeTypeSymbol |= NODE_TYPE.__isNullNode__;
            }
            else {
                nodeTypeSymbol |= NODE_TYPE.__isTextNode__;
            }
        }
        return nodeTypeSymbol;
    }
    var checkValidKey = function (children) {
        var obj = {};
        var onceWarnDuplicate = once(log);
        var onceWarnUndefined = once(log);
        var validElement = children.filter(function (c) { return isValidElement(c); });
        if (validElement.length > 1) {
            validElement.forEach(function (c) {
                if (!c._store["validKey"]) {
                    if (typeof c.key === "string") {
                        if (obj[c.key]) {
                            onceWarnDuplicate({ message: "array child have duplicate key" });
                        }
                        obj[c.key] = true;
                    }
                    else {
                        onceWarnUndefined({
                            message: "each array child must have a unique key props",
                            triggerOnce: true,
                        });
                    }
                    c._store["validKey"] = true;
                }
            });
        }
    };
    var checkArrayChildrenKey = function (children) {
        children.forEach(function (child) {
            if (Array.isArray(child)) {
                checkValidKey(child);
            }
            else {
                if (isValidElement(child))
                    child._store["validKey"] = true;
            }
        });
    };
    var checkSingleChildrenKey = function (children) {
        if (Array.isArray(children)) {
            checkValidKey(children);
        }
        else {
            if (isValidElement(children))
                children._store["validKey"] = true;
        }
    };

    var createMyReactElement = function (_a) {
        var _b;
        var type = _a.type, key = _a.key, ref = _a.ref, props = _a.props, _self = _a._self, _source = _a._source, _owner = _a._owner;
        var element = (_b = {},
            _b["$$typeof"] = My_React_Element,
            _b.type = type,
            _b.key = key,
            _b.ref = ref,
            _b.props = props,
            _b._owner = _owner,
            _b._self = _self,
            _b._source = _source,
            _b._store = {},
            _b);
        if (typeof Object.freeze === "function") {
            Object.freeze(element.props);
            Object.freeze(element);
        }
        return element;
    };
    function createElement(type, config, children) {
        var key = null;
        var ref = null;
        var self = null;
        var source = null;
        var props = {};
        if (config !== null && config !== undefined) {
            var _ref = config.ref, _key = config.key, __self = config.__self, __source = config.__source, resProps_1 = __rest(config, ["ref", "key", "__self", "__source"]);
            ref = _ref === undefined ? null : _ref;
            key = _key === undefined ? null : _key + "";
            self = __self === undefined ? null : __self;
            source = __source === undefined ? null : __source;
            Object.keys(resProps_1).forEach(function (key) { return (props[key] = resProps_1[key]); });
        }
        if (typeof type === "function" || typeof type === "object") {
            var typedType_1 = type;
            Object.keys((typedType_1 === null || typedType_1 === void 0 ? void 0 : typedType_1.defaultProps) || {}).forEach(function (key) {
                var _a;
                props[key] = props[key] === undefined ? (_a = typedType_1.defaultProps) === null || _a === void 0 ? void 0 : _a[key] : props[key];
            });
        }
        var childrenLength = arguments.length - 2;
        if (childrenLength > 1) {
            children = Array.from(arguments).slice(2);
            {
                checkArrayChildrenKey(children);
            }
            props.children = children;
        }
        else if (childrenLength === 1) {
            {
                checkSingleChildrenKey(children);
            }
            props.children = children;
        }
        return createMyReactElement({
            type: type,
            key: key,
            ref: ref,
            props: props,
            _self: self,
            _source: source,
            _owner: currentComponentFiber.current,
        });
    }
    function cloneElement(element, config, children) {
        if (isValidElement(element)) {
            var props = Object.assign({}, element.props);
            var key = element.key;
            var ref = element.ref;
            var type = element.type;
            var self_1 = element._self;
            var source = element._source;
            var owner = element._owner;
            if (config !== null && config !== undefined) {
                var _ref = config.ref, _key = config.key; config.__self; config.__source; var resProps = __rest(config, ["ref", "key", "__self", "__source"]);
                if (_ref !== undefined) {
                    ref = _ref;
                    owner = currentComponentFiber.current;
                }
                if (_key !== undefined) {
                    key = _key + "";
                }
                var defaultProps = {};
                if (typeof element.type === "function" || typeof element.type === "object") {
                    var typedType = element.type;
                    defaultProps = typedType === null || typedType === void 0 ? void 0 : typedType.defaultProps;
                }
                for (var key_1 in resProps) {
                    if (Object.prototype.hasOwnProperty.call(resProps, key_1)) {
                        if (resProps[key_1] === undefined && defaultProps) {
                            props[key_1] = defaultProps[key_1];
                        }
                        else {
                            props[key_1] = resProps[key_1];
                        }
                    }
                }
            }
            var childrenLength = arguments.length - 2;
            if (childrenLength > 1) {
                children = Array.from(arguments).slice(2);
                {
                    checkArrayChildrenKey(children);
                }
                props.children = children;
            }
            else if (childrenLength === 1) {
                {
                    checkSingleChildrenKey(children);
                }
                props.children = children;
            }
            var clonedElement = createMyReactElement({
                type: type,
                key: key,
                ref: ref,
                props: props,
                _self: self_1,
                _source: source,
                _owner: owner,
            });
            clonedElement._store["clonedEle"] = true;
            return clonedElement;
        }
        else {
            throw new Error("cloneElement() need valid element as args");
        }
    }

    var MyReactInternalInstance = /** @class */ (function () {
        function MyReactInternalInstance() {
            this.mode = Effect_TYPE.__initial__;
            this.context = null;
            this._contextFiber = null;
            this._ownerFiber = null;
        }
        Object.defineProperty(MyReactInternalInstance.prototype, "isMyReactInstance", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        MyReactInternalInstance.prototype.setContext = function (fiber) {
            var _a, _b, _c, _d;
            (_a = this._ownerFiber) === null || _a === void 0 ? void 0 : _a.removeContext(this._contextFiber);
            (_b = this._contextFiber) === null || _b === void 0 ? void 0 : _b.removeDependence(this);
            this._contextFiber = fiber;
            (_c = this._contextFiber) === null || _c === void 0 ? void 0 : _c.addDependence(this);
            (_d = this._ownerFiber) === null || _d === void 0 ? void 0 : _d.addContext(this._contextFiber);
        };
        MyReactInternalInstance.prototype.setOwner = function (fiber) {
            this._ownerFiber = fiber;
        };
        MyReactInternalInstance.prototype.unmount = function () {
            var _a, _b;
            this.mode = Effect_TYPE.__initial__;
            (_a = this._contextFiber) === null || _a === void 0 ? void 0 : _a.removeDependence(this);
            (_b = this._ownerFiber) === null || _b === void 0 ? void 0 : _b.removeContext(this._contextFiber);
        };
        return MyReactInternalInstance;
    }());

    var contextId = 0;
    var createContext = function (value) {
        var _a, _b, _c;
        var ContextObject = (_a = {},
            _a["$$typeof"] = My_React_Context,
            _a.id = contextId++,
            _a.Provider = {},
            _a.Consumer = {},
            _a);
        var Provider = (_b = {},
            _b["$$typeof"] = My_React_Provider,
            _b.value = value,
            _b.Context = { id: 0 },
            _b);
        var Consumer = (_c = {},
            _c["$$typeof"] = My_React_Consumer,
            _c.Internal = MyReactInternalInstance,
            _c.Context = { id: 0 },
            _c);
        Object.defineProperty(Provider, "Context", {
            get: function () {
                return ContextObject;
            },
            enumerable: false,
            configurable: false,
        });
        Object.defineProperty(Consumer, "Context", {
            get: function () {
                return ContextObject;
            },
            enumerable: false,
            configurable: false,
        });
        ContextObject.Provider = Provider;
        ContextObject.Consumer = Consumer;
        return ContextObject;
    };
    var forwardRef = function (render) {
        var _a;
        return _a = {},
            _a["$$typeof"] = My_React_ForwardRef,
            _a.render = render,
            _a;
    };
    var memo = function (render) {
        var _a;
        return _a = {}, _a["$$typeof"] = My_React_Memo, _a.render = render, _a;
    };
    var lazy = function (loader) {
        var _a;
        return _a = {},
            _a["$$typeof"] = My_React_Lazy,
            _a.loader = loader,
            _a._loading = false,
            _a._loaded = false,
            _a.render = null,
            _a;
    };

    var flatten = function (children) {
        if (Array.isArray(children)) {
            return children.reduce(function (p, c) { return p.concat(flatten(c)); }, []);
        }
        return [children];
    };
    var mapByJudge = function (arrayLike, judge, action) {
        var arrayChildren = flatten(arrayLike);
        return arrayChildren.map(function (v, index) {
            if (judge(v)) {
                return action.call(null, v, index, arrayChildren);
            }
            else {
                return v;
            }
        });
    };

    var map = function (arrayLike, action) {
        return mapByJudge(arrayLike, function (v) { return v !== undefined && v !== null; }, action);
    };
    var toArray = function (arrayLike) {
        return map(arrayLike, function (element, index) {
            return cloneElement(element, {
                key: (element === null || element === void 0 ? void 0 : element.key) !== undefined ? ".$".concat(element.key) : ".".concat(index),
            });
        });
    };
    var forEach = function (arrayLike, action) {
        mapByJudge(arrayLike, function (v) { return v !== undefined && v !== null; }, action);
    };
    var count = function (arrayLike) {
        if (Array.isArray(arrayLike)) {
            return arrayLike.reduce(function (p, c) { return p + count(c); }, 0);
        }
        return 1;
    };
    var only = function (child) {
        if (isValidElement(child))
            return child;
        if (typeof child === "string" || typeof child === "number" || typeof child === "boolean")
            return true;
        throw new Error("Children.only() expected to receive a single MyReact element child.");
    };

    var DEFAULT_RESULT = {
        newState: null,
        isForce: false,
        callback: [],
    };
    var MyReactComponent = /** @class */ (function (_super) {
        __extends(MyReactComponent, _super);
        function MyReactComponent(props, context) {
            var _this = _super.call(this) || this;
            _this.state = null;
            _this.props = null;
            _this.context = null;
            // for queue update
            _this.result = DEFAULT_RESULT;
            _this.setState = function (payLoad, callback) {
                var _a;
                var updater = {
                    type: "component",
                    payLoad: payLoad,
                    callback: callback,
                    trigger: _this,
                };
                (_a = _this._ownerFiber) === null || _a === void 0 ? void 0 : _a.updateQueue.push(updater);
                Promise.resolve().then(function () { var _a; return (_a = _this._ownerFiber) === null || _a === void 0 ? void 0 : _a.update(); });
            };
            _this.forceUpdate = function () {
                var _a;
                var updater = {
                    type: "component",
                    isForce: true,
                    trigger: _this,
                };
                (_a = _this._ownerFiber) === null || _a === void 0 ? void 0 : _a.updateQueue.push(updater);
                Promise.resolve().then(function () { var _a; return (_a = _this._ownerFiber) === null || _a === void 0 ? void 0 : _a.update(); });
            };
            _this.props = props || null;
            _this.context = context || null;
            return _this;
        }
        Object.defineProperty(MyReactComponent.prototype, "isReactComponent", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyReactComponent.prototype, "isMyReactComponent", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        MyReactComponent.prototype.unmount = function () {
            var _a;
            _super.prototype.unmount.call(this);
            var instance = this;
            (_a = instance.componentWillUnmount) === null || _a === void 0 ? void 0 : _a.call(instance);
        };
        return MyReactComponent;
    }(MyReactInternalInstance));
    var MyReactPureComponent = /** @class */ (function (_super) {
        __extends(MyReactPureComponent, _super);
        function MyReactPureComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MyReactPureComponent.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
            return !isNormalEquals(nextProps, this.props) || !isNormalEquals(nextState, this.state) || !isNormalEquals(nextContext, this.context);
        };
        return MyReactPureComponent;
    }(MyReactComponent));

    var EmptyDispatch = /** @class */ (function () {
        function EmptyDispatch() {
            this.strictMap = {};
            this.keepLiveMap = {};
            this.suspenseMap = {};
            this.effectMap = {};
            this.layoutEffectMap = {};
            this.contextMap = {};
            this.unmountMap = {};
            this.eventMap = {};
        }
        EmptyDispatch.prototype.trigger = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveLazy = function () {
            return false;
        };
        EmptyDispatch.prototype.resolveRef = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveHook = function (_fiber, _hookParams) {
            return null;
        };
        EmptyDispatch.prototype.resolveStrictMap = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveKeepLiveMap = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveKeepLive = function (_fiber, _element) {
            return null;
        };
        EmptyDispatch.prototype.resolveMemorizeProps = function (_fiber) {
            return {};
        };
        EmptyDispatch.prototype.resolveStrictValue = function (_fiber) {
            return false;
        };
        EmptyDispatch.prototype.resolveSuspenseMap = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveSuspenseElement = function (_fiber) {
            return null;
        };
        EmptyDispatch.prototype.resolveContextMap = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveContextFiber = function (_fiber, _contextObject) {
            return null;
        };
        EmptyDispatch.prototype.resolveContextValue = function (_fiber, _contextObject) {
            return null;
        };
        EmptyDispatch.prototype.resolveComponentQueue = function (_fiber) {
            return void 0;
        };
        EmptyDispatch.prototype.resolveHookQueue = function (_fiber) {
            return void 0;
        };
        // TODO this part of logic should not include global dispatch interface
        // start
        EmptyDispatch.prototype.reconcileCommit = function (_fiber, _hydrate, _parentFiberWithDom) {
            return false;
        };
        EmptyDispatch.prototype.reconcileUpdate = function (_list) {
        };
        EmptyDispatch.prototype.beginProgressList = function (_scope) {
        };
        EmptyDispatch.prototype.endProgressList = function (_scope) {
        };
        EmptyDispatch.prototype.generateUpdateList = function (_fiber, _scope) {
        };
        // end
        EmptyDispatch.prototype.pendingCreate = function (_fiber) {
        };
        EmptyDispatch.prototype.pendingUpdate = function (_fiber) {
        };
        EmptyDispatch.prototype.pendingAppend = function (_fiber) {
        };
        EmptyDispatch.prototype.pendingContext = function (_fiber) {
        };
        EmptyDispatch.prototype.pendingPosition = function (_fiber) {
        };
        EmptyDispatch.prototype.pendingUnmount = function (_fiber, _pendingUnmount) {
        };
        EmptyDispatch.prototype.pendingDeactivate = function (_fiber) {
        };
        EmptyDispatch.prototype.pendingLayoutEffect = function (_fiber, _layoutEffect) {
        };
        EmptyDispatch.prototype.pendingEffect = function (_fiber, _effect) {
        };
        EmptyDispatch.prototype.removeFiber = function (_fiber) {
        };
        return EmptyDispatch;
    }());

    var EmptyRenderScope = /** @class */ (function () {
        function EmptyRenderScope() {
            this.rootFiber = null;
            this.rootContainer = {};
            this.isAppMounted = false;
            this.isAppCrash = false;
            this.modifyFiberArray = [];
            this.modifyFiberRoot = null;
            this.updateFiberListArray = [];
            this.updateFiberList = null;
        }
        return EmptyRenderScope;
    }());

    var checkFiberElement = function (fiber) {
        var element = fiber.element;
        if (isValidElement(element)) {
            var typedElement = element;
            if (!typedElement._store["validType"]) {
                if (fiber.type & NODE_TYPE.__isContextConsumer__) {
                    if (typeof typedElement.props.children !== "function") {
                        throw new Error("Consumer need a function children");
                    }
                }
                if (fiber.type & (NODE_TYPE.__isMemo__ | NODE_TYPE.__isForwardRef__)) {
                    var typedType = typedElement.type;
                    if (typeof typedType.render !== "function" && typeof typedType.render !== "object") {
                        throw new Error("invalid render type");
                    }
                    if (fiber.type & NODE_TYPE.__isForwardRef__ && typeof typedType.render !== "function") {
                        throw new Error("forwardRef() need a function component");
                    }
                }
                if (fiber.type & NODE_TYPE.__isKeepLiveNode__) {
                    if (Array.isArray(element.props.children))
                        throw new Error("<KeepLive /> expected to receive a single MyReact element child");
                }
                if (typedElement.ref) {
                    if (typeof typedElement.ref !== "object" && typeof typedElement.ref !== "function") {
                        throw new Error("unSupport ref usage, should be a function or a object like `{current: any}`");
                    }
                }
                if (typedElement.key && typeof typedElement.key !== "string") {
                    throw new Error("invalid key type, ".concat(typedElement.key));
                }
                if (typedElement.props.children && typedElement.props["dangerouslySetInnerHTML"]) {
                    throw new Error("can not render contain `children` and `dangerouslySetInnerHTML` for current element");
                }
                if (typedElement.props["dangerouslySetInnerHTML"]) {
                    if (typeof typedElement.props["dangerouslySetInnerHTML"] !== "object" ||
                        !Object.prototype.hasOwnProperty.call(typedElement.props["dangerouslySetInnerHTML"], "__html")) {
                        throw new Error("invalid dangerouslySetInnerHTML props, should like {__html: string}");
                    }
                }
                typedElement._store["validType"] = true;
            }
        }
    };
    var checkFiberHook = function (fiber) {
        var hookNode = fiber.hookListFoot;
        if (hookNode.hookType === HOOK_TYPE.useMemo ||
            hookNode.hookType === HOOK_TYPE.useEffect ||
            hookNode.hookType === HOOK_TYPE.useCallback ||
            hookNode.hookType === HOOK_TYPE.useLayoutEffect) {
            if (typeof hookNode.value !== "function") {
                throw new Error("".concat(hookNode.hookType, " initial error"));
            }
        }
        if (hookNode.hookType === HOOK_TYPE.useContext) {
            if (typeof hookNode.value !== "object" || hookNode.value === null) {
                throw new Error("".concat(hookNode.hookType, " initial error"));
            }
        }
    };

    var fiberId = 0;
    var MyReactFiberNode = /** @class */ (function () {
        function MyReactFiberNode(fiberIndex, parent, element) {
            var _a;
            this.mounted = true;
            this.activated = true;
            this.invoked = false;
            this.node = null;
            this.children = [];
            this.renderedChildren = [];
            this.childListHead = null;
            this.childListFoot = null;
            this.child = null;
            this.parent = null;
            this.sibling = null;
            this.instance = null;
            // current fiber all the context
            this.context = [];
            this.dependence = [];
            this.hookNodeArray = [];
            this.hookTypeArray = [];
            this.hookListHead = null;
            this.hookListFoot = null;
            this.type = NODE_TYPE.__initial__;
            this.patch = PATCH_TYPE.__initial__;
            this.mode = UPDATE_TYPE.__initial__;
            this.updateQueue = [];
            this.pendingProps = {};
            this.memoizedProps = null;
            this.uid = "my_react_" + fiberId++;
            this.fiberIndex = fiberIndex;
            this.parent = parent;
            this.element = element;
            this.root = ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.root) || this;
            this.initialPops();
        }
        MyReactFiberNode.prototype.addChild = function (child) {
            this.children.push(child);
            if (this.childListFoot) {
                this.childListFoot.sibling = child;
                this.childListFoot = child;
            }
            else {
                this.child = child;
                this.childListHead = child;
                this.childListFoot = child;
            }
        };
        MyReactFiberNode.prototype.initialParent = function () {
            if (this.parent) {
                this.parent.addChild(this);
            }
            var globalDispatch = this.root.dispatch;
            globalDispatch.resolveSuspenseMap(this);
            globalDispatch.resolveContextMap(this);
            globalDispatch.resolveStrictMap(this);
        };
        MyReactFiberNode.prototype.installParent = function (parent) {
            this.parent = parent;
            this.sibling = null;
            this.initialParent();
        };
        MyReactFiberNode.prototype.addDependence = function (node) {
            if (this.dependence.every(function (n) { return n !== node; }))
                this.dependence.push(node);
        };
        MyReactFiberNode.prototype.removeDependence = function (node) {
            this.dependence = this.dependence.filter(function (n) { return n !== node; });
        };
        MyReactFiberNode.prototype.addContext = function (fiber) {
            if (!fiber)
                return;
            this.context.push(fiber);
        };
        MyReactFiberNode.prototype.removeContext = function (fiber) {
            if (!fiber)
                return;
            var index = this.context.indexOf(fiber);
            if (index !== -1)
                this.context.splice(index, 1);
        };
        MyReactFiberNode.prototype.beforeUpdate = function () {
            this.child = null;
            this.children = [];
            this.childListHead = null;
            this.childListFoot = null;
            this.renderedChildren = [];
        };
        MyReactFiberNode.prototype.triggerUpdate = function () {
            var updateSymbol = UPDATE_TYPE.__initial__;
            updateSymbol |= UPDATE_TYPE.__update__;
            updateSymbol |= UPDATE_TYPE.__trigger__;
            this.mode = updateSymbol;
        };
        MyReactFiberNode.prototype.prepareUpdate = function () {
            var updateSymbol = UPDATE_TYPE.__initial__;
            updateSymbol |= UPDATE_TYPE.__update__;
            this.mode = updateSymbol;
        };
        MyReactFiberNode.prototype.afterUpdate = function () {
            this.mode = UPDATE_TYPE.__initial__;
        };
        MyReactFiberNode.prototype.installElement = function (element) {
            this.element = element;
            this.initialPops();
        };
        MyReactFiberNode.prototype.initialPops = function () {
            var element = this.element;
            if (isValidElement(element)) {
                this.pendingProps = Object.assign({}, element.props);
            }
            else {
                this.pendingProps = {};
            }
        };
        // TODO
        MyReactFiberNode.prototype.checkElement = function () {
            {
                checkFiberElement(this);
            }
        };
        MyReactFiberNode.prototype.initialType = function () {
            var element = this.element;
            var type = getTypeFromElement(element);
            this.type = type;
        };
        MyReactFiberNode.prototype.checkIsSameType = function (element) {
            // if (this.mode & UPDATE_TYPE.__trigger__) return true;
            var type = getTypeFromElement(element);
            var result = type === this.type;
            var typedIncomingElement = element;
            var typedExistElement = this.element;
            if (result) {
                if (this.type & (NODE_TYPE.__isDynamicNode__ | NODE_TYPE.__isPlainNode__)) {
                    return Object.is(typedExistElement.type, typedIncomingElement.type);
                }
                if (this.type & NODE_TYPE.__isObjectNode__ && typeof typedIncomingElement.type === "object" && typeof typedExistElement.type === "object") {
                    return Object.is(typedExistElement.type["$$typeof"], typedIncomingElement.type["$$typeof"]);
                }
            }
            return result;
        };
        MyReactFiberNode.prototype.addHook = function (hookNode) {
            this.hookNodeArray.push(hookNode);
            this.hookTypeArray.push(hookNode.hookType);
            if (!this.hookListFoot) {
                this.hookListFoot = hookNode;
                this.hookListHead = hookNode;
            }
            else {
                this.hookListFoot.hookNext = hookNode;
                hookNode.hookPrev = this.hookListFoot;
                this.hookListFoot = hookNode;
            }
        };
        // TODO
        MyReactFiberNode.prototype.checkHook = function () {
            {
                checkFiberHook(this);
            }
        };
        MyReactFiberNode.prototype.applyElement = function () {
            this.memoizedProps = Object.assign({}, this.pendingProps);
        };
        MyReactFiberNode.prototype.installInstance = function (instance) {
            this.instance = instance;
        };
        // TODO
        MyReactFiberNode.prototype.checkInstance = function () {
        };
        MyReactFiberNode.prototype.update = function () {
            this.root.dispatch.trigger(this);
        };
        MyReactFiberNode.prototype.unmount = function () {
            this.hookNodeArray.forEach(function (hook) { return hook.unmount(); });
            this.instance && this.instance.unmount();
            this.mounted = false;
            this.mode = UPDATE_TYPE.__initial__;
            this.patch = PATCH_TYPE.__initial__;
        };
        MyReactFiberNode.prototype.deactivate = function () {
            this.hookNodeArray.forEach(function (hook) { return hook.unmount(); });
            this.instance && this.instance.unmount();
            this.activated = false;
            this.mode = UPDATE_TYPE.__initial__;
            this.patch = PATCH_TYPE.__initial__;
        };
        return MyReactFiberNode;
    }());
    var MyReactFiberNodeRoot = /** @class */ (function (_super) {
        __extends(MyReactFiberNodeRoot, _super);
        function MyReactFiberNodeRoot() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.dispatch = new EmptyDispatch();
            _this.scope = new EmptyRenderScope();
            return _this;
        }
        return MyReactFiberNodeRoot;
    }(MyReactFiberNode));
    /** @class */ ((function (_super) {
        __extends(MyReactFiberNodeDev, _super);
        function MyReactFiberNodeDev() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._debugRenderState = {
                renderCount: 0,
                mountTime: 0,
                prevUpdateTime: 0,
                updateTimeStep: 0,
                currentUpdateTime: 0,
            };
            _this._debugContextMap = {};
            _this._debugGlobalDispatch = null;
            _this._debugStrict = false;
            _this._debugEventMap = {};
            return _this;
        }
        return MyReactFiberNodeDev;
    })(MyReactFiberNode));

    var initialFiberNode = function (fiber) {
        fiber.initialType();
        {
            fiber.checkElement();
        }
        fiber.initialParent();
        var globalDispatch = fiber.root.dispatch;
        globalDispatch.pendingCreate(fiber);
        globalDispatch.pendingUpdate(fiber);
        globalDispatch.pendingAppend(fiber);
        var element = fiber.element;
        if (fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isClassComponent__)) {
            if (typeof element === "object" && element !== null && element.ref) {
                globalDispatch.pendingLayoutEffect(fiber, function () { return globalDispatch.resolveRef(fiber); });
            }
        }
        return fiber;
    };

    var createFiberNode = function (_a, element) {
        var fiberIndex = _a.fiberIndex, parent = _a.parent, _b = _a.type, type = _b === void 0 ? "append" : _b;
        var newFiberNode = new MyReactFiberNode(fiberIndex, parent, element);
        newFiberNode.initialType();
        {
            newFiberNode.checkElement();
        }
        newFiberNode.initialParent();
        var globalDispatch = newFiberNode.root.dispatch;
        globalDispatch.pendingCreate(newFiberNode);
        globalDispatch.pendingUpdate(newFiberNode);
        if (type === "append") {
            globalDispatch.pendingAppend(newFiberNode);
        }
        else {
            globalDispatch.pendingPosition(newFiberNode);
        }
        if (newFiberNode.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isClassComponent__)) {
            if (element.ref) {
                globalDispatch.pendingLayoutEffect(newFiberNode, function () { return globalDispatch.resolveRef(newFiberNode); });
            }
        }
        return newFiberNode;
    };

    var updateFiberNode = function (_a, nextElement) {
        var fiber = _a.fiber, parent = _a.parent, prevFiber = _a.prevFiber;
        var prevElement = fiber.element;
        fiber.applyElement();
        // make sure invoke `installParent` after `installElement`
        fiber.installElement(nextElement);
        fiber.installParent(parent);
        var globalDispatch = fiber.root.dispatch;
        {
            fiber.checkElement();
        }
        if (prevElement !== nextElement) {
            if (fiber.type & NODE_TYPE.__isMemo__) {
                var typedPrevElement = prevElement;
                var typedNextElement = nextElement;
                if (!(fiber.mode & UPDATE_TYPE.__trigger__) && isNormalEquals(typedPrevElement.props, typedNextElement.props)) {
                    fiber.afterUpdate();
                }
                else {
                    fiber.prepareUpdate();
                }
            }
            else {
                fiber.prepareUpdate();
                if (fiber.type & NODE_TYPE.__isContextProvider__) {
                    var typedPrevElement = prevElement;
                    var typedNextElement = nextElement;
                    if (!isNormalEquals(typedPrevElement.props.value, typedNextElement.props.value)) {
                        globalDispatch.pendingContext(fiber);
                    }
                }
                if (fiber.type & NODE_TYPE.__isPlainNode__) {
                    var typedPrevElement = prevElement;
                    var typedNextElement = nextElement;
                    if (!isNormalEquals(typedPrevElement.props, typedNextElement.props, false)) {
                        globalDispatch.pendingUpdate(fiber);
                    }
                }
                if (fiber.type & NODE_TYPE.__isTextNode__) {
                    globalDispatch.pendingUpdate(fiber);
                }
            }
        }
        if (fiber !== prevFiber) {
            globalDispatch.pendingPosition(fiber);
        }
        return fiber;
    };

    var MyReactHookNode = /** @class */ (function (_super) {
        __extends(MyReactHookNode, _super);
        function MyReactHookNode(hookIndex, hookType, value, reducer, deps) {
            var _this = _super.call(this) || this;
            _this.hookIndex = 0;
            _this.hookNext = null;
            _this.hookPrev = null;
            _this.cancel = null;
            _this.effect = false;
            _this.value = null;
            _this.deps = [];
            _this.result = null;
            _this.dispatch = function (action) {
                var _a;
                var updater = {
                    type: "hook",
                    trigger: _this,
                    payLoad: action,
                };
                (_a = _this._ownerFiber) === null || _a === void 0 ? void 0 : _a.updateQueue.push(updater);
                Promise.resolve().then(function () {
                    var _a;
                    (_a = _this._ownerFiber) === null || _a === void 0 ? void 0 : _a.update();
                });
            };
            _this.deps = deps;
            _this.value = value;
            _this.reducer = reducer;
            _this.hookType = hookType;
            _this.hookIndex = hookIndex;
            return _this;
        }
        Object.defineProperty(MyReactHookNode.prototype, "isMyReactHook", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        MyReactHookNode.prototype.unmount = function () {
            _super.prototype.unmount.call(this);
            if (this.hookType === HOOK_TYPE.useEffect || this.hookType === HOOK_TYPE.useLayoutEffect) {
                this.effect = false;
                this.cancel && this.cancel();
                return;
            }
        };
        return MyReactHookNode;
    }(MyReactInternalInstance));

    var defaultReducer = function (state, action) {
        return typeof action === "function" ? action(state) : action;
    };
    var createHookNode = function (_a, fiber) {
        var hookIndex = _a.hookIndex, hookType = _a.hookType, value = _a.value, reducer = _a.reducer, deps = _a.deps;
        var newHookNode = new MyReactHookNode(hookIndex, hookType, value, reducer || defaultReducer, deps);
        newHookNode.setOwner(fiber);
        fiber.addHook(newHookNode);
        {
            fiber.checkHook();
        }
        return newHookNode;
    };

    var emptyDeps = [];
    var useState = function (initial) {
        var currentFiber = currentFunctionFiber.current;
        if (!currentFiber)
            throw new Error("can not use hook outside of component");
        var globalDispatch = currentFiber.root.dispatch;
        var currentIndex = currentHookDeepIndex.current++;
        var currentHookNode = globalDispatch.resolveHook(currentFiber, {
            hookIndex: currentIndex,
            hookType: HOOK_TYPE.useState,
            value: typeof initial === "function" ? initial : function () { return initial; },
            reducer: null,
            deps: emptyDeps,
        });
        return [currentHookNode.result, currentHookNode.dispatch];
    };
    var useEffect = function (action, deps) {
        var currentFiber = currentFunctionFiber.current;
        if (!currentFiber)
            throw new Error("can not use hook outside of component");
        var globalDispatch = currentFiber.root.dispatch;
        var currentIndex = currentHookDeepIndex.current++;
        globalDispatch.resolveHook(currentFiber, {
            hookIndex: currentIndex,
            hookType: HOOK_TYPE.useEffect,
            value: action,
            reducer: null,
            deps: deps,
        });
    };
    var useLayoutEffect = function (action, deps) {
        var currentFiber = currentFunctionFiber.current;
        if (!currentFiber)
            throw new Error("can not use hook outside of component");
        var globalDispatch = currentFiber.root.dispatch;
        var currentIndex = currentHookDeepIndex.current++;
        globalDispatch.resolveHook(currentFiber, {
            hookIndex: currentIndex,
            hookType: HOOK_TYPE.useLayoutEffect,
            value: action,
            reducer: null,
            deps: deps,
        });
    };
    var useCallback = function (callback, deps) {
        var currentFiber = currentFunctionFiber.current;
        if (!currentFiber)
            throw new Error("can not use hook outside of component");
        var globalDispatch = currentFiber.root.dispatch;
        var currentIndex = currentHookDeepIndex.current++;
        var currentHookNode = globalDispatch.resolveHook(currentFiber, {
            hookIndex: currentIndex,
            hookType: HOOK_TYPE.useCallback,
            value: callback,
            reducer: null,
            deps: deps,
        });
        return currentHookNode.result;
    };
    var useMemo = function (action, deps) {
        var currentFiber = currentFunctionFiber.current;
        if (!currentFiber)
            throw new Error("can not use hook outside of component");
        var globalDispatch = currentFiber.root.dispatch;
        var currentIndex = currentHookDeepIndex.current++;
        var currentHookNode = globalDispatch.resolveHook(currentFiber, {
            hookIndex: currentIndex,
            hookType: HOOK_TYPE.useMemo,
            value: action,
            reducer: null,
            deps: deps,
        });
        return currentHookNode.result;
    };
    var useRef = function (value) {
        var currentFiber = currentFunctionFiber.current;
        if (!currentFiber)
            throw new Error("can not use hook outside of component");
        var globalDispatch = currentFiber.root.dispatch;
        var currentIndex = currentHookDeepIndex.current++;
        var currentHookNode = globalDispatch.resolveHook(currentFiber, {
            hookIndex: currentIndex,
            hookType: HOOK_TYPE.useRef,
            value: createRef(value),
            reducer: null,
            deps: emptyDeps,
        });
        return currentHookNode.result;
    };
    var useContext = function (Context) {
        var currentFiber = currentFunctionFiber.current;
        if (!currentFiber)
            throw new Error("can not use hook outside of component");
        var globalDispatch = currentFiber.root.dispatch;
        var currentIndex = currentHookDeepIndex.current++;
        var currentHookNode = globalDispatch.resolveHook(currentFiber, {
            hookIndex: currentIndex,
            hookType: HOOK_TYPE.useContext,
            value: Context,
            reducer: null,
            deps: emptyDeps,
        });
        return currentHookNode.result;
    };
    var useReducer = function (reducer, initialArgs, init) {
        var currentFiber = currentFunctionFiber.current;
        if (!currentFiber)
            throw new Error("can not use hook outside of component");
        var globalDispatch = currentFiber.root.dispatch;
        var currentIndex = currentHookDeepIndex.current++;
        var currentHookNode = globalDispatch.resolveHook(currentFiber, {
            hookIndex: currentIndex,
            hookType: HOOK_TYPE.useReducer,
            value: typeof init === "function" ? function () { return init(initialArgs); } : function () { return initialArgs; },
            reducer: reducer,
            deps: emptyDeps,
        });
        return [currentHookNode.result, currentHookNode.dispatch];
    };
    var useImperativeHandle = function (ref, createHandle, deps) {
        var currentFiber = currentFunctionFiber.current;
        if (!currentFiber)
            throw new Error("can not use hook outside of component");
        var globalDispatch = currentFiber.root.dispatch;
        var currentIndex = currentHookDeepIndex.current++;
        globalDispatch.resolveHook(currentFiber, {
            hookIndex: currentIndex,
            hookType: HOOK_TYPE.useImperativeHandle,
            value: ref,
            reducer: createHandle,
            deps: deps,
        });
    };
    var useDebugValue = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (enableDebugLog.current) {
            console.log.apply(console, __spreadArray(__spreadArray(["[debug]: "], args, false), [getFiberTree(currentFunctionFiber.current)], false));
        }
    };

    var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true,
    };
    // todo
    var jsx = function (type, config, maybeKey, source, self) {
        var _a;
        var props = {};
        var key = null;
        var ref = null;
        if (maybeKey !== undefined) {
            key = "" + maybeKey;
        }
        // <div {...props} /> we can not make sure this usage will contain `key` of not
        if (config === null || config === void 0 ? void 0 : config.key) {
            key = "" + config.key;
        }
        if (config === null || config === void 0 ? void 0 : config.ref) {
            ref = config.ref;
        }
        for (var propsName in config) {
            if (Object.prototype.hasOwnProperty.call(config, propsName) && !Object.prototype.hasOwnProperty.call(RESERVED_PROPS, propsName)) {
                props[propsName] = config[propsName];
            }
        }
        if (type && (typeof type === "function" || typeof type === "object")) {
            var typedType_1 = type;
            Object.keys((typedType_1 === null || typedType_1 === void 0 ? void 0 : typedType_1.defaultProps) || {}).forEach(function (key) {
                var _a;
                props[key] = props[key] === undefined ? (_a = typedType_1.defaultProps) === null || _a === void 0 ? void 0 : _a[key] : props[key];
            });
        }
        var element = (_a = {},
            _a["$$typeof"] = My_React_Element,
            _a.type = type,
            _a.key = key,
            _a.ref = ref,
            _a.props = props,
            _a._jsx = true,
            _a._self = self,
            _a._source = source,
            _a._owner = currentComponentFiber.current,
            _a._store = {},
            _a);
        if (typeof Object.freeze === "function") {
            Object.freeze(element.props);
            Object.freeze(element);
        }
        return element;
    };
    var jsxDEV = function (type, config, key, isStaticChildren, source, self) {
        var element = jsx(type, config, key, source, self);
        if (config.children) {
            var children = config.children;
            if (isStaticChildren) {
                checkSingleChildrenKey(children);
                if (!Array.isArray(children)) {
                    log({ message: "Static children should always be an array.", level: "warn" });
                }
            }
            else {
                checkSingleChildrenKey(children);
            }
        }
        return element;
    };
    var jsxs = function (type, config, key, source, self) {
        return jsxDEV(type, config, key, true, source, self);
    };

    var Component = MyReactComponent;
    var PureComponent = MyReactPureComponent;
    var version = "0.0.1";
    var __my_react_shared__ = {
        log: log,
        logHook: logHook,
        safeCall: safeCall,
        createFiberNode: createFiberNode,
        updateFiberNode: updateFiberNode,
        initialFiberNode: initialFiberNode,
        createHookNode: createHookNode,
        getTypeFromElement: getTypeFromElement,
        safeCallWithFiber: safeCallWithFiber,
        enableAsyncUpdate: enableAsyncUpdate,
        enableKeyDiff: enableKeyDiff,
        enableStrictLifeCycle: enableStrictLifeCycle,
    };
    var __my_react_internal__ = {
        MyReactComponent: MyReactComponent,
        MyReactFiberNode: MyReactFiberNode,
        MyReactFiberNodeRoot: MyReactFiberNodeRoot,
        MyReactInternalInstance: MyReactInternalInstance,
        globalLoop: globalLoop,
        currentRunningFiber: currentRunningFiber,
        currentHookDeepIndex: currentHookDeepIndex,
        currentFunctionFiber: currentFunctionFiber,
        currentComponentFiber: currentComponentFiber,
    };
    var Children = {
        map: map,
        only: only,
        count: count,
        toArray: toArray,
        forEach: forEach,
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
        KeepLive: My_React_KeepLive,
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
    };

    exports.Children = Children;
    exports.Component = Component;
    exports.Consumer = My_React_Consumer;
    exports.Element = My_React_Element;
    exports.ForwardRef = My_React_ForwardRef;
    exports.Fragment = My_React_Fragment;
    exports.KeepLive = My_React_KeepLive;
    exports.Portal = My_React_Portal;
    exports.Provider = My_React_Provider;
    exports.PureComponent = PureComponent;
    exports.StrictMode = My_React_Strict;
    exports.Suspense = My_React_Suspense;
    exports.__my_react_internal__ = __my_react_internal__;
    exports.__my_react_shared__ = __my_react_shared__;
    exports.cloneElement = cloneElement;
    exports.createContext = createContext;
    exports.createElement = createElement;
    exports.createRef = createRef;
    exports["default"] = React;
    exports.forwardRef = forwardRef;
    exports.isValidElement = isValidElement;
    exports.jsx = jsx;
    exports.jsxDEV = jsxDEV;
    exports.jsxs = jsxs;
    exports.lazy = lazy;
    exports.memo = memo;
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
    exports.version = version;

}));
//# sourceMappingURL=index.development.js.map
