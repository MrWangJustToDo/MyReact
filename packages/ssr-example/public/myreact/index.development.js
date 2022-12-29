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
        PATCH_TYPE[PATCH_TYPE["__pendingRef__"] = 512] = "__pendingRef__";
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
        NODE_TYPE[NODE_TYPE["__isReactive__"] = 32] = "__isReactive__";
        NODE_TYPE[NODE_TYPE["__isForwardRef__"] = 64] = "__isForwardRef__";
        NODE_TYPE[NODE_TYPE["__isContextProvider__"] = 128] = "__isContextProvider__";
        NODE_TYPE[NODE_TYPE["__isContextConsumer__"] = 256] = "__isContextConsumer__";
        NODE_TYPE[NODE_TYPE["__isObjectNode__"] = 508] = "__isObjectNode__";
        NODE_TYPE[NODE_TYPE["__isNullNode__"] = 512] = "__isNullNode__";
        NODE_TYPE[NODE_TYPE["__isTextNode__"] = 1024] = "__isTextNode__";
        NODE_TYPE[NODE_TYPE["__isEmptyNode__"] = 2048] = "__isEmptyNode__";
        NODE_TYPE[NODE_TYPE["__isPlainNode__"] = 4096] = "__isPlainNode__";
        NODE_TYPE[NODE_TYPE["__isStrictNode__"] = 8192] = "__isStrictNode__";
        NODE_TYPE[NODE_TYPE["__isSuspenseNode__"] = 16384] = "__isSuspenseNode__";
        NODE_TYPE[NODE_TYPE["__isFragmentNode__"] = 32768] = "__isFragmentNode__";
        NODE_TYPE[NODE_TYPE["__isKeepLiveNode__"] = 65536] = "__isKeepLiveNode__";
        NODE_TYPE[NODE_TYPE["__isScopeNode__"] = 131072] = "__isScopeNode__";
        NODE_TYPE[NODE_TYPE["__isCommentNode__"] = 262144] = "__isCommentNode__";
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

    function isObject(target) {
        return typeof target === "object" && target !== null;
    }
    function isFunction(target) {
        return typeof target === "function";
    }
    function isArray(target) {
        return Array.isArray(target);
    }
    function isInteger(target) {
        return Number.isInteger(Number(target));
    }
    function isCollection(target) {
        return target instanceof Map || target instanceof Set || target instanceof WeakMap || target instanceof WeakSet;
    }

    var isNormalEquals = function (src, target, isSkipKey) {
        if (isSkipKey === void 0) { isSkipKey = function () { return false; }; }
        if (typeof src === "object" && typeof target === "object" && src !== null && target !== null) {
            var srcKeys = Object.keys(src);
            var targetKeys = Object.keys(target);
            if (srcKeys.length !== targetKeys.length)
                return false;
            var res = true;
            for (var key in src) {
                if (isSkipKey(key)) {
                    continue;
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
            if (typeof action === "function") {
                action.call.apply(action, __spreadArray$1([null], args, false));
            }
        };
    };

    var globalDepsMap = new WeakMap();
    var globalReactiveMap = new WeakMap();
    var globalReadOnlyMap = new WeakMap();
    var globalShallowReactiveMap = new WeakMap();
    var globalShallowReadOnlyMap = new WeakMap();

    var createRef$1 = function (value) {
        return { current: value };
    };

    var _a$2;
    var globalEffectRef = createRef$1(null);
    var ReactiveEffect = /** @class */ (function () {
        function ReactiveEffect(_action, _scheduler) {
            this._action = _action;
            this._scheduler = _scheduler;
            this._active = true;
            this._parent = null;
            this[_a$2] = true;
            this._depsSetArray = [];
        }
        ReactiveEffect.prototype.cleanDeps = function () {
            var _this = this;
            // delete current effect deps
            this._depsSetArray.forEach(function (set) { return set.delete(_this); });
            // clean the dep array
            this._depsSetArray.length = 0;
        };
        ReactiveEffect.prototype.addDeps = function (set) {
            this._depsSetArray.push(set);
        };
        ReactiveEffect.prototype.entryScope = function () {
            this._parent = globalEffectRef.current;
            globalEffectRef.current = this;
        };
        ReactiveEffect.prototype.exitScope = function () {
            globalEffectRef.current = this._parent;
            this._parent = null;
        };
        ReactiveEffect.prototype.run = function () {
            this.entryScope();
            this.cleanDeps();
            var re = null;
            try {
                re = this._action();
            }
            catch (e) {
                console.error(e);
            }
            finally {
                this.exitScope();
            }
            return re;
        };
        ReactiveEffect.prototype.update = function (newValue, oldValue) {
            if (!this._active)
                return this._action();
            this.entryScope();
            this.cleanDeps();
            var re = null;
            try {
                if (this._scheduler) {
                    re = this._scheduler(newValue, oldValue);
                }
                else {
                    re = this._action();
                }
            }
            catch (e) {
                console.error(e);
            }
            finally {
                this.exitScope();
            }
            return re;
        };
        ReactiveEffect.prototype.stop = function () {
            if (this._active) {
                this._active = false;
                this.cleanDeps();
            }
        };
        ReactiveEffect.prototype.active = function () {
            if (!this._active) {
                this._active = true;
            }
        };
        return ReactiveEffect;
    }());
    _a$2 = "__my_effect__" /* EffectFlags.Effect_key */;
    var shouldTrackRef = createRef$1(true);
    var trackStack = [];
    var shouldTriggerRef = createRef$1(true);
    var triggerStack = [];
    function pauseTracking() {
        trackStack.push(shouldTrackRef.current);
        shouldTrackRef.current = false;
    }
    function pauseTrigger() {
        triggerStack.push(shouldTriggerRef.current);
        shouldTriggerRef.current = false;
    }
    function enableTracking() {
        trackStack.push(shouldTrackRef.current);
        shouldTrackRef.current = true;
    }
    function enableTrigger() {
        triggerStack.push(shouldTriggerRef.current);
        shouldTriggerRef.current = true;
    }
    function resetTracking() {
        var last = trackStack.pop();
        shouldTrackRef.current = last === undefined ? true : last;
    }
    function resetTrigger() {
        var last = triggerStack.pop();
        shouldTriggerRef.current = last === undefined ? true : last;
    }
    function track(target, type, key) {
        if (!globalEffectRef.current || !shouldTrackRef.current)
            return;
        var depsMap = globalDepsMap.get(target);
        if (!depsMap) {
            globalDepsMap.set(target, (depsMap = new Map()));
        }
        var depsSet = depsMap.get(key);
        if (!depsSet) {
            depsMap.set(key, (depsSet = new Set()));
        }
        trackEffects(depsSet);
    }
    function trackEffects(set) {
        if (!globalEffectRef.current || !shouldTrackRef.current)
            return;
        if (!set.has(globalEffectRef.current)) {
            set.add(globalEffectRef.current);
            globalEffectRef.current.addDeps(set);
        }
    }
    function trigger(target, type, key, newValue, oldValue) {
        if (!shouldTriggerRef.current)
            return;
        var depsMap = globalDepsMap.get(target);
        if (!depsMap)
            return;
        if (isArray(target)) {
            // 直接修改length
            if (key === "length") {
                depsMap.forEach(function (depsSet, _key) {
                    if (_key === "length") {
                        if (depsSet)
                            triggerEffects(depsSet, newValue, oldValue);
                    }
                    if (Number(_key) >= newValue) {
                        if (depsSet)
                            triggerEffects(depsSet);
                    }
                });
            }
            if (isInteger(key)) {
                var depsSet = depsMap.get(key);
                if (depsSet)
                    triggerEffects(depsSet, oldValue, newValue);
                // 数组调用了push等方法
                if (type === "add") {
                    var depsSet_1 = depsMap.get("length");
                    if (depsSet_1)
                        triggerEffects(depsSet_1);
                }
            }
        }
        else {
            var depsSet = depsMap.get(key);
            if (depsSet)
                triggerEffects(depsSet, newValue, oldValue);
        }
    }
    function triggerEffects(set, oldValue, newValue) {
        if (!shouldTriggerRef.current)
            return;
        var allReactiveEffect = new Set(set);
        allReactiveEffect.forEach(function (reactiveEffect) {
            if (!Object.is(reactiveEffect, globalEffectRef.current)) {
                reactiveEffect.update(oldValue, newValue);
            }
        });
    }
    function effect(action) {
        var effectObject = new ReactiveEffect(action);
        effectObject.run();
        var runner = effectObject.update.bind(effectObject);
        runner.effect = effectObject;
        return runner;
    }

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

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var _a$1, _b$1;
    function ref(value) {
        if (isRef(value))
            return value;
        return new RefImpl(value);
    }
    function isRef(value) {
        return isObject(value) && !!value["__my_ref__" /* RefFlags.Ref_key */];
    }
    function toRefs(reactiveValue) {
        if (isObject(reactiveValue)) {
            if (isReactive(reactiveValue)) {
                if (isArray(reactiveValue)) {
                    return reactiveValue.map(function (_, index) { return toRef(reactiveValue, index); });
                }
                return Object.keys(reactiveValue).reduce(function (p, c) {
                    var _c;
                    return (__assign(__assign({}, p), (_c = {}, _c[c] = toRef(reactiveValue, c), _c)));
                }, {});
            }
            else {
                throw new Error("expects a reactive object but received a plain object");
            }
        }
        throw new Error("expects a reactive object but received a plain value");
    }
    // 支持解构一层 就是把原始的ReactiveObject的属性访问转换到target.value的形式访问
    function toRef(object, key) {
        var value = object[key];
        if (isRef(value))
            return value;
        return new ObjectRefImpl(object, key);
    }
    function unRef(refObject) {
        if (isRef(refObject))
            return refObject.value;
        return refObject;
    }
    var unwrapRefGerHandler = function (target, key, receiver) { return unRef(Reflect.get(target, key, receiver)); };
    var unwrapRefSetHandler = function (target, key, value, receiver) {
        var oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
        }
        else {
            return Reflect.set(target, key, value, receiver);
        }
    };
    function proxyRefs(objectWithRefs) {
        if (isObject(objectWithRefs)) {
            if (isReactive(objectWithRefs))
                return objectWithRefs;
            return new Proxy(objectWithRefs, {
                get: unwrapRefGerHandler,
                set: unwrapRefSetHandler,
            });
        }
        throw new Error("expect a object but received a plain value");
    }
    var RefImpl = /** @class */ (function () {
        function RefImpl(_rawValue) {
            this._rawValue = _rawValue;
            this[_a$1] = true;
            this._depsSet = new Set();
            if (isObject(_rawValue)) {
                this._value = reactive(_rawValue);
            }
            else {
                this._value = _rawValue;
            }
        }
        Object.defineProperty(RefImpl.prototype, "value", {
            get: function () {
                trackEffects(this._depsSet);
                return this._value;
            },
            set: function (newValue) {
                if (!Object.is(newValue, this._rawValue)) {
                    this._rawValue = newValue;
                    this._value = isObject(newValue) ? reactive(newValue) : newValue;
                    triggerEffects(this._depsSet);
                }
            },
            enumerable: false,
            configurable: true
        });
        RefImpl.prototype.toString = function () {
            return this._value;
        };
        return RefImpl;
    }());
    _a$1 = "__my_ref__" /* RefFlags.Ref_key */;
    var ObjectRefImpl = /** @class */ (function () {
        function ObjectRefImpl(_object, _key) {
            this._object = _object;
            this._key = _key;
            this[_b$1] = true;
        }
        Object.defineProperty(ObjectRefImpl.prototype, "value", {
            get: function () {
                return this._object[this._key];
            },
            set: function (newValue) {
                this._object[this._key] = newValue;
            },
            enumerable: false,
            configurable: true
        });
        return ObjectRefImpl;
    }());
    _b$1 = "__my_ref__" /* RefFlags.Ref_key */;

    /**
     * array method track:
     * const data = {a: 1, b: 2};
     * const arr = reactive([data]);
     * usage effect(() => {
     *  if (arr.includes(data)) {
     *    console.log('foo')
     *  }
     * })
     */
    var generateArrayProxyHandler = function () {
        var methodNames = ["includes", "indexOf", "lastIndexOf", "find", "findIndex", "findLast", "findLastIndex"];
        // 这些方法会修改数组  同时也会访问length属性，对于数组的操作可能会死循环
        var noTrackMethodNames = ["push", "pop", "shift", "unshift", "splice"];
        var handlerObject = {};
        methodNames.reduce(function (p, c) {
            p[c] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var arr = toRaw(this);
                for (var i = 0; i < this.length; i++) {
                    track(arr, "get", i.toString());
                }
                var res = arr[c].apply(arr, args);
                if (res === -1 || res === false) {
                    // if that didn't work, run it again using raw values.
                    return arr[c].apply(arr, args.map(toRaw));
                }
                else {
                    return res;
                }
            };
            return p;
        }, handlerObject);
        noTrackMethodNames.reduce(function (p, c) {
            p[c] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                pauseTracking();
                var arr = toRaw(this);
                var res = arr[c].apply(this, args);
                resetTracking();
                return res;
            };
            return p;
        }, handlerObject);
        return handlerObject;
    };
    var arrayProxyHandler = generateArrayProxyHandler();
    var generateProxyHandler = function (isShallow, isReadOnly) {
        if (isShallow === void 0) { isShallow = false; }
        if (isReadOnly === void 0) { isReadOnly = false; }
        var deletePropertyHandler = createDeletePropertyHandler(isReadOnly);
        var getHandler = createGetHandler(isShallow, isReadOnly);
        var setHandler = createSetHandler(isShallow, isReadOnly);
        var ownKeysHandler = createOwnKeysHandler();
        var hasHandler = createHasHandler();
        return {
            deleteProperty: deletePropertyHandler,
            ownKeys: ownKeysHandler,
            get: getHandler,
            set: setHandler,
            has: hasHandler,
        };
    };
    var createObjectGetHandler = function (isShallow, isReadOnly) {
        return function (target, key, receiver) {
            var res = Reflect.get(target, key, receiver);
            if (!isReadOnly) {
                track(target, "get", key);
            }
            if (isShallow)
                return res;
            if (isRef(res))
                return res.value;
            if (isObject(res)) {
                return isReadOnly ? readonly(res) : reactive(res);
            }
            return res;
        };
    };
    var createArrayGetHandler = function (isShallow, isReadOnly) {
        return function (target, key, receiver) {
            if (!isReadOnly && Reflect.has(arrayProxyHandler, key)) {
                return Reflect.get(arrayProxyHandler, key, receiver);
            }
            var res = Reflect.get(target, key, receiver);
            if (!isReadOnly) {
                track(target, "get", key);
            }
            if (isShallow)
                return res;
            if (isRef(res)) {
                return isInteger(key) ? res : res.value;
            }
            if (isObject(res)) {
                return isReadOnly ? readonly(res) : reactive(res);
            }
            return res;
        };
    };
    var createGetHandler = function (isShallow, isReadOnly) {
        var objectGetHandler = createObjectGetHandler(isShallow, isReadOnly);
        var arrayGetHandler = createArrayGetHandler(isShallow, isReadOnly);
        return function (target, key, receiver) {
            if (key === "__my_effect__" /* EffectFlags.Effect_key */ || key === "__my_ref__" /* RefFlags.Ref_key */ || key === "__my_computed__" /* ComputedFlags.Computed_key */)
                return Reflect.get(target, key, receiver);
            if (key === "__my_reactive__" /* ReactiveFlags.Reactive_key */)
                return !isReadOnly;
            if (key === "__my_readonly__" /* ReactiveFlags.Readonly_key */)
                return isReadOnly;
            if (key === "__my_shallow__" /* ReactiveFlags.Shallow_key */)
                return isShallow;
            if (key === "__my_raw__" /* ReactiveFlags.Raw_key */ && receiver === getProxyCacheMap(isShallow, isReadOnly).get(target)) {
                return target;
            }
            if (isArray(target)) {
                return arrayGetHandler(target, key, receiver);
            }
            if (isCollection(target)) {
                throw new Error("current not support collection object");
            }
            return objectGetHandler(target, key, receiver);
        };
    };
    var createDeletePropertyHandler = function (isReadonly) {
        return function (target, key) {
            if (isReadonly) {
                console.warn("current object is readonly object");
                return true;
            }
            var hasKey = Reflect.has(target, key);
            var oldValue = target[key];
            var result = Reflect.deleteProperty(target, key);
            if (result && hasKey) {
                trigger(target, "delete", key, undefined, oldValue);
            }
            return result;
        };
    };
    var createHasHandler = function () {
        return function (target, key) {
            var result = Reflect.has(target, key);
            track(target, "has", key);
            return result;
        };
    };
    var createOwnKeysHandler = function () {
        return function (target) {
            track(target, "iterate", isArray(target) ? "length" : "collection");
            return Reflect.ownKeys(target);
        };
    };
    var createSetHandler = function (isShallow$1, isReadOnly) {
        return function (target, key, value, receiver) {
            if (key === "__my_reactive__" /* ReactiveFlags.Reactive_key */ || key === "__my_readonly__" /* ReactiveFlags.Readonly_key */ || key === "__my_shallow__" /* ReactiveFlags.Shallow_key */ || key === "__my_raw__" /* ReactiveFlags.Raw_key */) {
                throw new Error("can not set internal ".concat(key, " field for current object"));
            }
            if (isReadOnly) {
                throw new Error("can not set ".concat(key, " field for readonly object"));
            }
            var targetIsArray = isArray(target);
            var oldValue = target[key];
            // TODO from source code
            if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
                return false;
            }
            // TODO from source code
            if (!isShallow$1) {
                if (!isShallow(value) && !isReadonly(value)) {
                    oldValue = toRaw(oldValue);
                    value = toRaw(value);
                }
                if (!targetIsArray && isRef(oldValue) && !isRef(value)) {
                    oldValue.value = value;
                    return true;
                }
            }
            var hadKey = targetIsArray && isInteger(key) ? Number(key) < target.length : Reflect.has(target, key);
            var res = Reflect.set(target, key, value, receiver);
            // 原型链的proxy set方法会按层级触发
            if (Object.is(target, toRaw(receiver))) {
                if (!hadKey) {
                    trigger(target, "add", key, value, oldValue);
                }
                else if (!Object.is(oldValue, value)) {
                    trigger(target, "set", key, value, oldValue);
                }
            }
            return res;
        };
    };

    var getProxyCacheMap = function (isShallow, isReadOnly) {
        if (isShallow && isReadOnly)
            return globalShallowReadOnlyMap;
        if (isShallow)
            return globalShallowReactiveMap;
        if (isReadOnly)
            return globalReadOnlyMap;
        return globalReactiveMap;
    };
    var createReactive$1 = function (target, cacheMap, proxyHandler) {
        if (target["__my_skip__" /* ReactiveFlags.Skip_key */])
            return target;
        if (!Object.isExtensible(target))
            return target;
        if (cacheMap.has(target))
            return cacheMap.get(target);
        var proxy = new Proxy(target, proxyHandler);
        cacheMap.set(target, proxy);
        return proxy;
    };
    function createReactiveWithCache(target, isShallow, isReadOnly) {
        return createReactive$1(target, getProxyCacheMap(isShallow, isReadOnly), generateProxyHandler(isShallow, isReadOnly));
    }

    function reactive(target) {
        if (isObject(target)) {
            if (isReactive(target))
                return target;
            // from source code
            if (isReadonly(target))
                return target;
            return createReactiveWithCache(target, false, false);
        }
        else {
            throw new Error("reactive() only accept a object value");
        }
    }
    function readonly(target) {
        if (isObject(target)) {
            if (isReadonly(target))
                return target;
            return createReactiveWithCache(target, false, true);
        }
        else {
            throw new Error("readonly() only accept a object value");
        }
    }
    function shallowReactive(target) {
        if (isObject(target)) {
            if (isReactive(target) && isShallow(target))
                return target;
            return createReactiveWithCache(target, true, false);
        }
        else {
            throw new Error("shallowReactive() only accept a object value");
        }
    }
    function shallowReadonly(target) {
        if (isObject(target)) {
            if (isReadonly(target) && isShallow(target))
                return target;
            return createReactiveWithCache(target, true, true);
        }
        else {
            throw new Error("shallowReadonly() only accept a object value");
        }
    }
    function isReactive(target) {
        return isObject(target) && !!target["__my_reactive__" /* ReactiveFlags.Reactive_key */];
    }
    function isReadonly(target) {
        return isObject(target) && !!target["__my_readonly__" /* ReactiveFlags.Readonly_key */];
    }
    function isShallow(target) {
        return isObject(target) && !!target["__my_shallow__" /* ReactiveFlags.Shallow_key */];
    }
    function isProxy(target) {
        return isReactive(target) || isReadonly(target);
    }
    function toReactive(value) {
        return isObject(value) ? reactive(value) : value;
    }
    function toReadonly(value) {
        return isObject(value) ? readonly(value) : value;
    }
    function toRaw(observed) {
        var raw = isObject(observed) && observed["__my_raw__" /* ReactiveFlags.Raw_key */];
        return raw ? toRaw(raw) : observed;
    }
    function markRaw(value) {
        Object.defineProperty(value, "__my_skip__" /* ReactiveFlags.Skip_key */, {
            value: value,
            configurable: true,
            enumerable: false,
        });
        return value;
    }

    var _a, _b;
    var computed = function (getterOrOption) {
        var getter;
        var setter = function () {
            console.warn("current computed is readonly");
        };
        if (isFunction(getterOrOption)) {
            getter = getterOrOption;
        }
        else {
            getter = getterOrOption.get;
            setter = getterOrOption.set;
        }
        return new ComputedRefImpl(getter, setter);
    };
    var ComputedRefImpl = /** @class */ (function () {
        function ComputedRefImpl(_getter, _setter) {
            var _this = this;
            this._getter = _getter;
            this._setter = _setter;
            this._dirty = true;
            this._value = null;
            this[_a] = true;
            this[_b] = true;
            this._depsSet = new Set();
            this._effect = new ReactiveEffect(_getter, function () {
                if (!_this._dirty) {
                    _this._dirty = true;
                    triggerEffects(_this._depsSet);
                }
            });
        }
        Object.defineProperty(ComputedRefImpl.prototype, "value", {
            get: function () {
                trackEffects(this._depsSet);
                if (this._dirty) {
                    this._dirty = false;
                    this._value = this._effect.run();
                }
                return this._value;
            },
            set: function (v) {
                // TODO
                this._setter(v);
            },
            enumerable: false,
            configurable: true
        });
        return ComputedRefImpl;
    }());
    _a = "__my_ref__" /* RefFlags.Ref_key */, _b = "__my_computed__" /* ComputedFlags.Computed_key */;

    function traversal(target, set) {
        if (set === void 0) { set = new Set(); }
        if (isObject(target)) {
            if (set.has(target))
                return target;
            set.add(target);
            for (var key in target) {
                traversal(target[key], set);
            }
            return target;
        }
        else {
            return target;
        }
    }
    function watch(source, cb) {
        var effectAction = function () { return void 0; };
        if (isReactive(source)) {
            effectAction = function () { return traversal(source); };
        }
        else if (isFunction(source)) {
            effectAction = source;
        }
        else {
            return;
        }
        var cleanUp = null;
        var onCleanUp = function (fn) {
            cleanUp = fn;
        };
        var oldValue = null;
        var effect = new ReactiveEffect(effectAction, function () {
            if (cleanUp) {
                cleanUp();
                cleanUp = null;
            }
            var newValue = effect.run();
            cb(newValue, oldValue, onCleanUp);
            oldValue = newValue;
        });
        oldValue = effect.run();
        return effect;
    }

    var reactiveApi = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ReactiveEffect: ReactiveEffect,
        computed: computed,
        effect: effect,
        enableTracking: enableTracking,
        enableTrigger: enableTrigger,
        isProxy: isProxy,
        isReactive: isReactive,
        isReadonly: isReadonly,
        isRef: isRef,
        isShallow: isShallow,
        markRaw: markRaw,
        pauseTracking: pauseTracking,
        pauseTrigger: pauseTrigger,
        proxyRefs: proxyRefs,
        reactive: reactive,
        readonly: readonly,
        ref: ref,
        resetTracking: resetTracking,
        resetTrigger: resetTrigger,
        shallowReactive: shallowReactive,
        shallowReadonly: shallowReadonly,
        shouldTrackRef: shouldTrackRef,
        shouldTriggerRef: shouldTriggerRef,
        toRaw: toRaw,
        toReactive: toReactive,
        toReadonly: toReadonly,
        toRef: toRef,
        toRefs: toRefs,
        watch: watch
    });

    var createRef = function (value) {
        return { current: value };
    };

    var getTrackDevLog = function (fiber) {
        {
            var element = fiber.element;
            var source = typeof element === "object" ? element === null || element === void 0 ? void 0 : element["_source"] : null;
            var owner = typeof element === "object" ? element === null || element === void 0 ? void 0 : element["_owner"] : null;
            var preString = "";
            if (source) {
                var _a = source || {}, fileName = _a.fileName, lineNumber = _a.lineNumber;
                preString = "".concat(preString, " (").concat(fileName, ":").concat(lineNumber, ")");
            }
            if (owner) {
                var ownerElement = owner.element;
                var ownerElementType = ownerElement.type;
                if (typeof ownerElementType === "function") {
                    var typedOwnerElementType = ownerElementType;
                    var name_1 = typedOwnerElementType.name || typedOwnerElementType.displayName;
                    preString = "".concat(preString, " (render dy ").concat(name_1, ")");
                }
            }
            return preString;
        }
    };
    var getElementName = function (fiber) {
        var _a;
        if (fiber.type & NODE_TYPE.__isMemo__) {
            var typedElement = fiber.element;
            var typedType = typedElement.type;
            var targetRender = typedType === null || typedType === void 0 ? void 0 : typedType.render;
            if (typeof targetRender === "function") {
                if (targetRender === null || targetRender === void 0 ? void 0 : targetRender.name)
                    return "<Memo - (".concat(targetRender.name, ") />");
                if (targetRender === null || targetRender === void 0 ? void 0 : targetRender.displayName)
                    return "<Memo -(".concat(targetRender.displayName, ") />");
            }
            if (typeof targetRender === "object") {
                var typedTargetRender = targetRender;
                if (typedTargetRender === null || typedTargetRender === void 0 ? void 0 : typedTargetRender.name)
                    return "<Memo - (".concat(typedTargetRender.name, ") />");
            }
            return "<Memo />";
        }
        if (fiber.type & NODE_TYPE.__isLazy__) {
            var typedElement = fiber.element;
            var typedType = typedElement.type;
            var typedRender = typedType === null || typedType === void 0 ? void 0 : typedType.render;
            if (typedRender === null || typedRender === void 0 ? void 0 : typedRender.name)
                return "<Lazy - (".concat(typedRender.name, ") />");
            if (typedRender === null || typedRender === void 0 ? void 0 : typedRender.displayName)
                return "<Lazy -(".concat(typedRender.displayName, ") />");
            return "<Lazy />";
        }
        if (fiber.type & NODE_TYPE.__isReactive__) {
            var typedElement = fiber.element;
            var typedType = typedElement.type;
            if (typedType === null || typedType === void 0 ? void 0 : typedType.name)
                return "<Reactive* - (".concat(typedType.name, ") />");
            return "<Reactive* />";
        }
        if (fiber.type & NODE_TYPE.__isPortal__)
            return "<Portal />";
        if (fiber.type & NODE_TYPE.__isNullNode__)
            return "<Null />";
        if (fiber.type & NODE_TYPE.__isEmptyNode__)
            return "<Empty />";
        if (fiber.type & NODE_TYPE.__isScopeNode__)
            return "<Scope />";
        if (fiber.type & NODE_TYPE.__isStrictNode__)
            return "<Strict />";
        if (fiber.type & NODE_TYPE.__isSuspenseNode__)
            return "<Suspense />";
        if (fiber.type & NODE_TYPE.__isFragmentNode__)
            return "<Fragment />";
        if (fiber.type & NODE_TYPE.__isKeepLiveNode__)
            return "<KeepAlive />";
        if (fiber.type & NODE_TYPE.__isContextProvider__)
            return "<Provider />";
        if (fiber.type & NODE_TYPE.__isContextConsumer__)
            return "<Consumer />";
        if (fiber.type & NODE_TYPE.__isCommentNode__)
            return "<Comment />";
        if (fiber.type & NODE_TYPE.__isForwardRef__) {
            var typedElement = fiber.element;
            var typedType = typedElement.type;
            if (typedType.render.name)
                return "<ForwardRef - (".concat(typedType.render.name, ") />");
            if (typedType.render.displayName)
                return "<ForwardRef -(".concat(typedType.render.displayName, ") />");
            return "<ForwardRef />";
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
        {
            if (fiber) {
                var preString = "".padEnd(4) + "at".padEnd(4);
                var parent_1 = fiber.parent;
                var res = "".concat(preString).concat(getFiberNodeName(fiber));
                while (parent_1) {
                    res += "\n".concat(preString).concat(getFiberNodeName(parent_1));
                    parent_1 = parent_1.parent;
                }
                return "\n".concat(res);
            }
            return "";
        }
    };
    var getHookTree = function (hookNodes, currentIndex, newHookType) {
        var _a, _b;
        var re = "\n" + "".padEnd(6) + "Prev render:".padEnd(20) + "Next render:".padEnd(10) + "\n";
        for (var index = 0; index <= currentIndex; index++) {
            if (index < currentIndex) {
                var currentType = ((_a = hookNodes[index]) === null || _a === void 0 ? void 0 : _a.hookType) || "undefined";
                re += (index + 1).toString().padEnd(6) + currentType.padEnd(20) + currentType.padEnd(10) + "\n";
            }
            else {
                var currentType = ((_b = hookNodes[index]) === null || _b === void 0 ? void 0 : _b.hookType) || "undefined";
                re += (index + 1).toString().padEnd(6) + currentType.padEnd(20) + newHookType.padEnd(10) + "\n";
            }
        }
        re += "".padEnd(6) + "^".repeat(30) + "\n";
        return re;
    };

    var globalLoop = createRef(false);
    var currentRunningFiber = createRef(null);
    var currentComponentFiber = createRef(null);
    var currentFunctionFiber = createRef(null);
    var currentReactiveInstance = createRef(null);
    var currentHookDeepIndex = createRef(0);
    // ==== feature ==== //
    var enableDebugLog = createRef(false);
    var enableConcurrentMode = createRef(true);
    var enableKeyDiff = createRef(true);
    // support unsafe_ lifecycle
    var enableLegacyLifeCycle = createRef(true);
    // enable react-18 strict lifecycle method
    var enableStrictLifeCycle = createRef(false);

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
    var My_React_Reactive = Symbol.for("react.reactive");
    var My_React_Scope = Symbol.for("react.scope");
    var My_React_Comment = Symbol.for("react.comment");

    function isValidElement(element) {
        return typeof element === "object" && !Array.isArray(element) && (element === null || element === void 0 ? void 0 : element.$$typeof) === My_React_Element;
    }
    function getTypeFromElement(element) {
        var _a, _b;
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
                    case My_React_Reactive:
                        nodeTypeSymbol |= NODE_TYPE.__isReactive__;
                        break;
                    default:
                        throw new Error("invalid object element type ".concat((_a = typedRawType["$$typeof"]) === null || _a === void 0 ? void 0 : _a.toString()));
                }
            }
            else if (typeof rawType === "function") {
                if ((_b = rawType.prototype) === null || _b === void 0 ? void 0 : _b.isMyReactComponent) {
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
                        nodeTypeSymbol |= NODE_TYPE.__isSuspenseNode__;
                        break;
                    case My_React_Scope:
                        nodeTypeSymbol |= NODE_TYPE.__isScopeNode__;
                        break;
                    case My_React_Comment:
                        nodeTypeSymbol |= NODE_TYPE.__isCommentNode__;
                        break;
                    default:
                        throw new Error("invalid symbol element type ".concat(rawType === null || rawType === void 0 ? void 0 : rawType.toString()));
                }
            }
            else if (typeof rawType === "string") {
                nodeTypeSymbol |= NODE_TYPE.__isPlainNode__;
            }
            else {
                {
                    var fiber = currentRunningFiber.current;
                    fiber === null || fiber === void 0 ? void 0 : fiber.root.globalPlatform.log({ message: "invalid element type ".concat(String(rawType)), level: "warn", triggerOnce: true });
                }
                nodeTypeSymbol |= NODE_TYPE.__isEmptyNode__;
            }
        }
        else {
            if (typeof element === "object" && element !== null) {
                {
                    var fiber = currentRunningFiber.current;
                    fiber === null || fiber === void 0 ? void 0 : fiber.root.globalPlatform.log({ message: "invalid object element type ".concat(JSON.stringify(element)), level: "warn", triggerOnce: true });
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
        var fiber = currentRunningFiber.current;
        var onceWarnDuplicate = once(fiber === null || fiber === void 0 ? void 0 : fiber.root.globalPlatform.log);
        var onceWarnUndefined = once(fiber === null || fiber === void 0 ? void 0 : fiber.root.globalPlatform.log);
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
    function createElement(type, config) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
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
        // const childrenLength = arguments.length - 2;
        var childrenLength = children.length;
        if (childrenLength > 1) {
            // children = Array.from(arguments).slice(2);
            {
                checkArrayChildrenKey(children);
            }
            props.children = children;
        }
        else if (childrenLength === 1) {
            {
                checkSingleChildrenKey(children[0]);
            }
            props.children = children[0];
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
            var _a, _b;
            (_a = this._contextFiber) === null || _a === void 0 ? void 0 : _a.removeDependence(this);
            this._contextFiber = fiber;
            (_b = this._contextFiber) === null || _b === void 0 ? void 0 : _b.addDependence(this);
        };
        MyReactInternalInstance.prototype.setOwner = function (fiber) {
            this._ownerFiber = fiber;
        };
        MyReactInternalInstance.prototype.unmount = function () {
            var _a;
            this.mode = Effect_TYPE.__initial__;
            (_a = this._contextFiber) === null || _a === void 0 ? void 0 : _a.removeDependence(this);
        };
        return MyReactInternalInstance;
    }());

    var contextId = 0;
    var defaultObject = { id: 0 };
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
            _b.Context = defaultObject,
            _b);
        var Consumer = (_c = {},
            _c["$$typeof"] = My_React_Consumer,
            _c.Internal = MyReactInternalInstance,
            _c.Context = defaultObject,
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
                key: typeof (element === null || element === void 0 ? void 0 : element.key) === "string" ? ".$".concat(element.key) : ".".concat(index),
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
            _this._result = DEFAULT_RESULT;
            _this.setState = function (payLoad, callback) {
                var _a;
                var updater = {
                    type: "component",
                    payLoad: payLoad,
                    callback: callback,
                    trigger: _this,
                };
                (_a = _this._ownerFiber) === null || _a === void 0 ? void 0 : _a.updateQueue.push(updater);
                // this._ownerFiber?.update();
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
                // this._ownerFiber?.update();
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
        MyReactComponent.prototype.render = function () {
            return void 0;
        };
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
            this.scopeIdMap = {};
            this.errorBoundariesMap = {};
            this.keepLiveMap = {};
            this.suspenseMap = {};
            this.effectMap = {};
            this.layoutEffectMap = {};
            this.contextMap = {};
            this.unmountMap = {};
            this.eventMap = {};
        }
        EmptyDispatch.prototype.triggerUpdate = function (_fiber) {
        };
        EmptyDispatch.prototype.triggerError = function (_fiber, _error) {
        };
        EmptyDispatch.prototype.resolveLazyElement = function (_fiber) {
            return null;
        };
        EmptyDispatch.prototype.resolveLazyElementAsync = function (_fiber) {
            return null;
        };
        EmptyDispatch.prototype.resolveHook = function (_fiber, _hookParams) {
            return null;
        };
        EmptyDispatch.prototype.resolveScopeIdMap = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveScopeId = function (_fiber) {
            return "";
        };
        EmptyDispatch.prototype.resolveStrictMap = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveStrictValue = function (_fiber) {
            return false;
        };
        EmptyDispatch.prototype.resolveKeepLiveMap = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveKeepLive = function (_fiber, _element) {
            return null;
        };
        EmptyDispatch.prototype.resolveElementTypeMap = function (_fiber) {
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
        EmptyDispatch.prototype.resolveErrorBoundaries = function (_fiber) {
            return null;
        };
        EmptyDispatch.prototype.resolveErrorBoundariesMap = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveComponentQueue = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveHookQueue = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveFiberUpdate = function (_fiber) {
        };
        EmptyDispatch.prototype.resolveMemorizedProps = function (_fiber) {
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
        EmptyDispatch.prototype.pendingRef = function (_fiber) {
        };
        EmptyDispatch.prototype.removeFiber = function (_fiber) {
        };
        return EmptyDispatch;
    }());

    var EmptyPlatform = /** @class */ (function () {
        function EmptyPlatform() {
            this.name = "empty";
            this.log = function () { return void 0; };
        }
        return EmptyPlatform;
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

    var fiberId = 0;
    var MyReactFiberNode = /** @class */ (function () {
        function MyReactFiberNode(parent, element) {
            var _a;
            this.isMounted = true;
            this.isActivated = true;
            this.isInvoked = false;
            this.node = null;
            this.children = [];
            this.return = null;
            this.child = null;
            this.parent = null;
            this.sibling = null;
            this.instance = null;
            this.dependence = [];
            this.hookNodes = [];
            this.type = NODE_TYPE.__initial__;
            this.patch = PATCH_TYPE.__initial__;
            this.mode = UPDATE_TYPE.__initial__;
            this.updateQueue = [];
            this.pendingProps = {};
            this.memoizedProps = null;
            this.uid = "fiber_" + fiberId++;
            this.parent = parent;
            this.element = element;
            this.root = ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.root) || this;
            this.initialPops();
        }
        MyReactFiberNode.prototype.addChild = function (child) {
            var globalDispatch = this.root.globalDispatch;
            if (!this.child)
                globalDispatch.resolveErrorBoundariesMap(this);
            var last = this.children[this.children.length - 1];
            if (last) {
                last.sibling = child;
            }
            else {
                this.child = child;
            }
            this.children.push(child);
        };
        MyReactFiberNode.prototype.initialParent = function () {
            if (this.parent)
                this.parent.addChild(this);
            var globalDispatch = this.root.globalDispatch;
            globalDispatch.resolveElementTypeMap(this);
            globalDispatch.resolveSuspenseMap(this);
            globalDispatch.resolveContextMap(this);
            globalDispatch.resolveStrictMap(this);
            globalDispatch.resolveScopeIdMap(this);
        };
        // TODO change name to `updateParent`
        MyReactFiberNode.prototype.installParent = function (parent) {
            var _a;
            this.parent = parent;
            this.sibling = null;
            (_a = this.parent) === null || _a === void 0 ? void 0 : _a.addChild(this);
        };
        MyReactFiberNode.prototype.addDependence = function (node) {
            if (this.dependence.every(function (n) { return n !== node; }))
                this.dependence.push(node);
        };
        MyReactFiberNode.prototype.removeDependence = function (node) {
            this.dependence = this.dependence.filter(function (n) { return n !== node; });
        };
        MyReactFiberNode.prototype.beforeUpdate = function () {
            this.child = null;
            this.children = [];
            this.return = null;
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
        MyReactFiberNode.prototype.initialType = function () {
            var element = this.element;
            var type = getTypeFromElement(element);
            this.type = type;
        };
        MyReactFiberNode.prototype.addHook = function (hookNode) {
            this.hookNodes.push(hookNode);
        };
        MyReactFiberNode.prototype.applyElement = function () {
            this.memoizedProps = Object.assign({}, this.pendingProps);
        };
        MyReactFiberNode.prototype.installInstance = function (instance) {
            this.instance = instance;
        };
        MyReactFiberNode.prototype.update = function () {
            if (!this.isActivated || !this.isMounted)
                return;
            this.root.globalDispatch.triggerUpdate(this);
        };
        MyReactFiberNode.prototype.error = function (error) {
            this.root.globalDispatch.triggerError(this, error);
        };
        MyReactFiberNode.prototype.unmount = function () {
            if (!this.isMounted)
                return;
            this.hookNodes.forEach(function (hook) { return hook.unmount(); });
            this.instance && this.instance.unmount();
            this.isMounted = false;
            this.mode = UPDATE_TYPE.__initial__;
            this.patch = PATCH_TYPE.__initial__;
            this.root.globalDispatch.removeFiber(this);
        };
        MyReactFiberNode.prototype.deactivate = function () {
            if (!this.isActivated)
                return;
            this.hookNodes.forEach(function (hook) { return hook.unmount(); });
            this.instance && this.instance.unmount();
            this.isActivated = false;
            this.mode = UPDATE_TYPE.__initial__;
            this.patch = PATCH_TYPE.__initial__;
        };
        return MyReactFiberNode;
    }());
    var MyReactFiberNodeRoot = /** @class */ (function (_super) {
        __extends(MyReactFiberNodeRoot, _super);
        function MyReactFiberNodeRoot() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.globalDispatch = new EmptyDispatch();
            _this.globalScope = new EmptyRenderScope();
            _this.globalPlatform = new EmptyPlatform();
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
            _this._debugHookTypes = [];
            _this._debugContextMap = {};
            _this._debugGlobalDispatch = null;
            _this._debugStrict = false;
            _this._debugEventMap = {};
            return _this;
        }
        return MyReactFiberNodeDev;
    })(MyReactFiberNode));

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
        var hookNode = fiber.hookNodes[fiber.hookNodes.length - 1];
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

    var initialFiberNode = function (fiber) {
        fiber.initialType();
        checkFiberElement(fiber);
        fiber.initialParent();
        var globalDispatch = fiber.root.globalDispatch;
        globalDispatch.pendingCreate(fiber);
        globalDispatch.pendingUpdate(fiber);
        globalDispatch.pendingAppend(fiber);
        globalDispatch.pendingRef(fiber);
        globalDispatch.resolveMemorizedProps(fiber);
        return fiber;
    };

    var createFiberNode = function (_a, element) {
        var parent = _a.parent, _b = _a.type, type = _b === void 0 ? "append" : _b;
        var newFiberNode = new MyReactFiberNode(parent, element);
        newFiberNode.initialType();
        checkFiberElement(newFiberNode);
        newFiberNode.initialParent();
        var globalDispatch = newFiberNode.root.globalDispatch;
        globalDispatch.pendingCreate(newFiberNode);
        globalDispatch.pendingUpdate(newFiberNode);
        if (type === "append") {
            globalDispatch.pendingAppend(newFiberNode);
        }
        else {
            globalDispatch.pendingPosition(newFiberNode);
        }
        globalDispatch.pendingRef(newFiberNode);
        globalDispatch.resolveMemorizedProps(newFiberNode);
        return newFiberNode;
    };

    var updateFiberNode = function (_a, nextElement) {
        var fiber = _a.fiber, parent = _a.parent, prevFiber = _a.prevFiber;
        var prevElement = fiber.element;
        // make sure invoke `installParent` after `installElement`
        fiber.installElement(nextElement);
        fiber.installParent(parent);
        var globalDispatch = fiber.root.globalDispatch;
        checkFiberElement(fiber);
        globalDispatch.resolveFiberUpdate;
        if (prevElement !== nextElement || !fiber.isActivated) {
            globalDispatch.resolveFiberUpdate(fiber);
            globalDispatch.resolveMemorizedProps(fiber);
        }
        if (isValidElement(prevElement) && isValidElement(nextElement) && prevElement.ref !== nextElement.ref) {
            globalDispatch.pendingRef(fiber);
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
                    var fiber = _this._ownerFiber;
                    if (fiber) {
                        fiber.root.globalDispatch.resolveHookQueue(fiber);
                    }
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
        checkFiberHook(fiber);
        return newHookNode;
    };

    var emptyDeps = [];
    var useState = function (initial) {
        var currentFiber = currentFunctionFiber.current;
        if (!currentFiber)
            throw new Error("can not use hook outside of component");
        var globalDispatch = currentFiber.root.globalDispatch;
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
        var globalDispatch = currentFiber.root.globalDispatch;
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
        var globalDispatch = currentFiber.root.globalDispatch;
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
        var globalDispatch = currentFiber.root.globalDispatch;
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
        var globalDispatch = currentFiber.root.globalDispatch;
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
        var globalDispatch = currentFiber.root.globalDispatch;
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
        var globalDispatch = currentFiber.root.globalDispatch;
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
        var globalDispatch = currentFiber.root.globalDispatch;
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
        var globalDispatch = currentFiber.root.globalDispatch;
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

    // hook api like `Vue`
    var onBeforeMount = function (cb) {
        var reactiveInstance = currentReactiveInstance.current;
        if (reactiveInstance) {
            reactiveInstance.beforeMountHooks.push(cb);
        }
        else {
            throw new Error("can not use hook without setup function");
        }
    };
    var onMounted = function (cb) {
        var reactiveInstance = currentReactiveInstance.current;
        if (reactiveInstance) {
            reactiveInstance.mountedHooks.push(cb);
        }
        else {
            throw new Error("can not use hook without setup function");
        }
    };
    var onBeforeUpdate = function (cb) {
        var reactiveInstance = currentReactiveInstance.current;
        if (reactiveInstance) {
            reactiveInstance.beforeUpdateHooks.push(cb);
        }
        else {
            throw new Error("can not use hook without setup function");
        }
    };
    var onUpdated = function (cb) {
        var reactiveInstance = currentReactiveInstance.current;
        if (reactiveInstance) {
            reactiveInstance.updatedHooks.push(cb);
        }
        else {
            throw new Error("can not use hook without setup function");
        }
    };
    var onBeforeUnmount = function (cb) {
        var reactiveInstance = currentReactiveInstance.current;
        if (reactiveInstance) {
            reactiveInstance.beforeUnmountHooks.push(cb);
        }
        else {
            throw new Error("can not use hook without setup function");
        }
    };
    var onUnmounted = function (cb) {
        var reactiveInstance = currentReactiveInstance.current;
        if (reactiveInstance) {
            reactiveInstance.unmountedHooks.push(cb);
        }
        else {
            throw new Error("can not use hook without setup function");
        }
    };

    function createReactive(props) {
        var _a;
        return _a = {},
            _a["$$typeof"] = My_React_Reactive,
            _a.name = typeof props === "function" ? props.name : props === null || props === void 0 ? void 0 : props.name,
            _a.setup = typeof props === "function" ? props : props === null || props === void 0 ? void 0 : props.setup,
            _a.render = typeof props === "function" ? null : props === null || props === void 0 ? void 0 : props.render,
            _a.contextType = typeof props === "function" ? null : props === null || props === void 0 ? void 0 : props.contextType,
            _a;
    }

    var MyReactReactiveInstance = /** @class */ (function (_super) {
        __extends(MyReactReactiveInstance, _super);
        function MyReactReactiveInstance(props, context) {
            var _this = _super.call(this) || this;
            _this.beforeMountHooks = [];
            _this.mountedHooks = [];
            _this.beforeUpdateHooks = [];
            _this.updatedHooks = [];
            _this.beforeUnmountHooks = [];
            _this.unmountedHooks = [];
            _this.props = props;
            _this.context = context;
            return _this;
        }
        Object.defineProperty(MyReactReactiveInstance.prototype, "isMyReactReactive", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        MyReactReactiveInstance.prototype.createSetupState = function (setup, render) {
            var _a = this, props = _a.props, context = _a.context;
            this.setup = setup;
            this.staticRender = render;
            var data = (setup === null || setup === void 0 ? void 0 : setup(props, context)) || {};
            this.state = proxyRefs(data);
        };
        MyReactReactiveInstance.prototype.createEffectUpdate = function (scheduler) {
            var _this = this;
            this.effect = new ReactiveEffect(function () {
                var render = _this.staticRender ? _this.staticRender : typeof _this.props.children === "function" ? _this.props.children : function () { return null; };
                return render(_this.state, _this.props, _this.context);
            }, scheduler);
        };
        MyReactReactiveInstance.prototype.unmount = function () {
            var _this = this;
            _super.prototype.unmount.call(this);
            this.beforeUnmountHooks.forEach(function (f) { return f === null || f === void 0 ? void 0 : f(); });
            this.effect.stop();
            Promise.resolve().then(function () { return _this.unmountedHooks.forEach(function (f) { return f === null || f === void 0 ? void 0 : f(); }); });
        };
        return MyReactReactiveInstance;
    }(MyReactInternalInstance));

    var Component = MyReactComponent;
    var PureComponent = MyReactPureComponent;
    var version = "0.0.3";
    var __my_react_shared__ = {
        getHookTree: getHookTree,
        getFiberTree: getFiberTree,
        getElementName: getElementName,
        getFiberNodeName: getFiberNodeName,
        createFiberNode: createFiberNode,
        updateFiberNode: updateFiberNode,
        initialFiberNode: initialFiberNode,
        createHookNode: createHookNode,
        getTypeFromElement: getTypeFromElement,
        enableKeyDiff: enableKeyDiff,
        enableConcurrentMode: enableConcurrentMode,
        enableLegacyLifeCycle: enableLegacyLifeCycle,
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
        currentReactiveInstance: currentReactiveInstance,
    };
    // reactive component
    // 实验性🧪
    var __my_react_reactive__ = {
        MyReactReactiveInstance: MyReactReactiveInstance,
        onBeforeMount: onBeforeMount,
        onBeforeUnmount: onBeforeUnmount,
        onBeforeUpdate: onBeforeUpdate,
        onMounted: onMounted,
        onUnmounted: onUnmounted,
        onUpdated: onUpdated,
        reactiveApi: reactiveApi,
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
        createReactive: createReactive,
        Scope: My_React_Scope,
        Portal: My_React_Portal,
        Element: My_React_Element,
        Provider: My_React_Provider,
        Consumer: My_React_Consumer,
        Fragment: My_React_Fragment,
        Suspense: My_React_Suspense,
        Reactive: My_React_Reactive,
        KeepLive: My_React_KeepLive,
        StrictMode: My_React_Strict,
        ForwardRef: My_React_ForwardRef,
        Comment: My_React_Comment,
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
        __my_react_internal__: __my_react_internal__,
        __my_react_shared__: __my_react_shared__,
        __my_react_reactive__: __my_react_reactive__,
        version: version,
    };

    exports.Children = Children;
    exports.Comment = My_React_Comment;
    exports.Component = Component;
    exports.Consumer = My_React_Consumer;
    exports.Element = My_React_Element;
    exports.ForwardRef = My_React_ForwardRef;
    exports.Fragment = My_React_Fragment;
    exports.KeepLive = My_React_KeepLive;
    exports.Portal = My_React_Portal;
    exports.Provider = My_React_Provider;
    exports.PureComponent = PureComponent;
    exports.Reactive = My_React_Reactive;
    exports.Scope = My_React_Scope;
    exports.StrictMode = My_React_Strict;
    exports.Suspense = My_React_Suspense;
    exports.__my_react_internal__ = __my_react_internal__;
    exports.__my_react_reactive__ = __my_react_reactive__;
    exports.__my_react_shared__ = __my_react_shared__;
    exports.cloneElement = cloneElement;
    exports.createContext = createContext;
    exports.createElement = createElement;
    exports.createReactive = createReactive;
    exports.createRef = createRef;
    exports.default = React;
    exports.forwardRef = forwardRef;
    exports.isValidElement = isValidElement;
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
