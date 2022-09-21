(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@my-react/react')) :
    typeof define === 'function' && define.amd ? define(['exports', '@my-react/react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactDOM = {}, global.React));
})(this, (function (exports, react) { 'use strict';

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

    var MyReactFiberNodeClass$3 = react.__my_react_internal__.MyReactFiberNode, NODE_TYPE$3$1 = react.__my_react_internal__.NODE_TYPE, UPDATE_TYPE$2 = react.__my_react_internal__.UPDATE_TYPE;
    var _updateFiberNode = react.__my_react_shared__.updateFiberNode, _createFiberNode = react.__my_react_shared__.createFiberNode, enableKeyDiff = react.__my_react_shared__.enableKeyDiff;
    var createFiberNode = function () {
        var props = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            props[_i] = arguments[_i];
        }
        var fiber = _createFiberNode.apply(void 0, props);
        {
            var typedFiber = fiber;
            var timeNow = Date.now();
            typedFiber._debugRenderState = {
                renderCount: 0,
                mountTime: timeNow,
                prevUpdateTime: timeNow,
                updateTimeStep: 0,
                currentUpdateTime: timeNow,
            };
            typedFiber._debugGlobalDispatch = typedFiber.root.dispatch;
        }
        return fiber;
    };
    var updateFiberNode = function () {
        var props = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            props[_i] = arguments[_i];
        }
        var fiber = _updateFiberNode.apply(void 0, props);
        {
            var typedFiber = fiber;
            var prevState = typedFiber._debugRenderState || {
                renderCount: 0,
                mountTime: 0,
                prevUpdateTime: 0,
                updateTimeStep: 0,
                currentUpdateTime: 0,
            };
            var timeNow = Date.now();
            typedFiber._debugRenderState = {
                renderCount: prevState.renderCount + 1,
                mountTime: prevState.mountTime,
                prevUpdateTime: prevState.currentUpdateTime,
                updateTimeStep: timeNow - prevState.currentUpdateTime,
                currentUpdateTime: timeNow,
            };
        }
        return fiber;
    };
    var getKeyMatchedChildren = function (newChildren, prevFiberChildren, renderScope) {
        var isAppMounted = renderScope.isAppMounted;
        if (!isAppMounted)
            return prevFiberChildren;
        if (!enableKeyDiff.current)
            return prevFiberChildren;
        if (!prevFiberChildren)
            return prevFiberChildren;
        if (prevFiberChildren.length === 0)
            return prevFiberChildren;
        var tempChildren = prevFiberChildren.slice(0);
        var assignPrevChildren = Array(tempChildren.length).fill(null);
        newChildren.forEach(function (element, index) {
            if (tempChildren.length) {
                if (react.isValidElement(element)) {
                    if (typeof element.key === "string") {
                        var targetIndex = tempChildren.findIndex(function (fiber) { var _a; return fiber instanceof MyReactFiberNodeClass$3 && typeof fiber.element === "object" && ((_a = fiber.element) === null || _a === void 0 ? void 0 : _a.key) === element.key; });
                        if (targetIndex !== -1) {
                            assignPrevChildren[index] = tempChildren[targetIndex];
                            tempChildren.splice(targetIndex, 1);
                        }
                    }
                }
            }
        });
        return assignPrevChildren.map(function (v) {
            if (v)
                return v;
            return tempChildren.shift();
        });
    };
    var getIsSameTypeNode = function (newChild, renderScope, prevFiberChild) {
        var isAppMounted = renderScope.isAppMounted;
        if (!isAppMounted)
            return false;
        var newChildIsArray = Array.isArray(newChild);
        var prevElementChildIsArray = Array.isArray(prevFiberChild);
        if (newChildIsArray && prevElementChildIsArray)
            return true;
        if (newChildIsArray)
            return false;
        if (prevElementChildIsArray)
            return false;
        var typedPrevFiberChild = prevFiberChild;
        var typedNewChild = newChild;
        var prevRenderedChild = typedPrevFiberChild === null || typedPrevFiberChild === void 0 ? void 0 : typedPrevFiberChild.element;
        var result = typedPrevFiberChild === null || typedPrevFiberChild === void 0 ? void 0 : typedPrevFiberChild.checkIsSameType(typedNewChild);
        if (result && enableKeyDiff.current && !(typedPrevFiberChild.type & NODE_TYPE$3$1.__isTextNode__) && !(typedPrevFiberChild.type & NODE_TYPE$3$1.__isNullNode__)) {
            return typedNewChild.key === prevRenderedChild.key;
        }
        else {
            return result;
        }
    };
    var getNewFiberWithUpdate = function (newChild, parentFiber, prevFiberChild, assignPrevFiberChild) {
        var renderScope = parentFiber.root.scope;
        var globalDispatch = parentFiber.root.dispatch;
        var isSameType = getIsSameTypeNode(newChild, renderScope, assignPrevFiberChild);
        if (isSameType) {
            if (Array.isArray(newChild) && Array.isArray(prevFiberChild) && Array.isArray(assignPrevFiberChild)) {
                var assignPrevFiberChildren_1 = getKeyMatchedChildren(newChild, assignPrevFiberChild, renderScope);
                if (newChild.length < assignPrevFiberChildren_1.length) {
                    globalDispatch.pendingUnmount(parentFiber, assignPrevFiberChildren_1.slice(newChild.length));
                }
                return newChild.map(function (v, index) { return getNewFiberWithUpdate(v, parentFiber, prevFiberChild[index], assignPrevFiberChildren_1[index]); });
            }
            return updateFiberNode({
                fiber: assignPrevFiberChild,
                parent: parentFiber,
                prevFiber: prevFiberChild,
            }, newChild);
        }
        else {
            if (assignPrevFiberChild) {
                globalDispatch.pendingUnmount(parentFiber, assignPrevFiberChild);
            }
            if (Array.isArray(newChild)) {
                return newChild.map(function (v) { return getNewFiberWithUpdate(v, parentFiber); });
            }
            return createFiberNode({
                fiberIndex: parentFiber.fiberIndex + 1,
                parent: parentFiber,
                type: "position",
            }, newChild);
        }
    };
    var getNewFiberWithInitial = function (newChild, parentFiber) {
        if (Array.isArray(newChild)) {
            return newChild.map(function (v) { return getNewFiberWithInitial(v, parentFiber); });
        }
        return createFiberNode({ fiberIndex: parentFiber.fiberIndex + 1, parent: parentFiber }, newChild);
    };
    var transformChildrenFiber = function (parentFiber, children) {
        var index = 0;
        var isUpdate = parentFiber.mode & UPDATE_TYPE$2.__update__;
        var newChildren = Array.isArray(children) ? children : [children];
        var prevFiberChildren = isUpdate ? parentFiber.renderedChildren : [];
        var renderScope = parentFiber.root.scope;
        var assignPrevFiberChildren = getKeyMatchedChildren(newChildren, prevFiberChildren, renderScope);
        parentFiber.beforeUpdate();
        while (index < newChildren.length || index < assignPrevFiberChildren.length) {
            var newChild = newChildren[index];
            var prevFiberChild = prevFiberChildren[index];
            var assignPrevFiberChild = assignPrevFiberChildren[index];
            var newFiber = isUpdate
                ? getNewFiberWithUpdate(newChild, parentFiber, prevFiberChild, assignPrevFiberChild)
                : getNewFiberWithInitial(newChild, parentFiber);
            parentFiber.renderedChildren.push(newFiber);
            index++;
        }
        parentFiber.afterUpdate();
        return parentFiber.children;
    };

    var NODE_TYPE$2$1 = react.__my_react_internal__.NODE_TYPE, Effect_TYPE$1 = react.__my_react_internal__.Effect_TYPE, UPDATE_TYPE$1 = react.__my_react_internal__.UPDATE_TYPE;
    var DEFAULT_RESULT = react.__my_react_shared__.DEFAULT_RESULT;
    var processComponentStateFromProps = function (fiber) {
        var typedElement = fiber.element;
        var Component = fiber.type & NODE_TYPE$2$1.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
        var typedComponent = Component;
        var typedInstance = fiber.instance;
        var props = Object.assign({}, typedElement.props);
        var state = Object.assign({}, typedInstance.state);
        if (typeof typedComponent.getDerivedStateFromProps === "function") {
            var payloadState = typedComponent.getDerivedStateFromProps(props, state);
            if (payloadState) {
                typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
            }
        }
    };
    var processComponentInstanceOnMount = function (fiber) {
        var typedElement = fiber.element;
        var globalDispatch = fiber.root.dispatch;
        var Component = fiber.type & NODE_TYPE$2$1.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
        var typedComponent = Component;
        var ProviderFiber = globalDispatch.resolveContextFiber(fiber, typedComponent.contextType);
        var context = globalDispatch.resolveContextValue(ProviderFiber, typedComponent.contextType);
        var props = Object.assign({}, typedElement.props);
        var instance = new typedComponent(props, context);
        instance.props = props;
        instance.context = context;
        fiber.installInstance(instance);
        {
            fiber.checkInstance();
        }
        instance.setOwner(fiber);
        instance.setContext(ProviderFiber);
    };
    var processComponentFiberOnUpdate = function (fiber) {
        var typedInstance = fiber.instance;
        typedInstance.setOwner(fiber);
    };
    var processComponentRenderOnMountAndUpdate = function (fiber) {
        var typedInstance = fiber.instance;
        var children = typedInstance.render();
        var typeFiber = fiber;
        {
            typeFiber._debugDynamicChildren = children;
        }
        return children;
    };
    var processComponentDidMountOnMount = function (fiber) {
        var typedInstance = fiber.instance;
        var globalDispatch = fiber.root.dispatch;
        var strictMod = globalDispatch.resolveStrictValue(fiber);
        if (strictMod) {
            if ((typedInstance.componentDidMount || typedInstance.componentWillUnmount) && !(typedInstance.mode & Effect_TYPE$1.__pendingEffect__)) {
                typedInstance.mode = Effect_TYPE$1.__pendingEffect__;
                globalDispatch.pendingLayoutEffect(fiber, function () {
                    var _a, _b, _c;
                    typedInstance.mode = Effect_TYPE$1.__initial__;
                    (_a = typedInstance.componentDidMount) === null || _a === void 0 ? void 0 : _a.call(typedInstance);
                    (_b = typedInstance.componentWillUnmount) === null || _b === void 0 ? void 0 : _b.call(typedInstance);
                    (_c = typedInstance.componentDidMount) === null || _c === void 0 ? void 0 : _c.call(typedInstance);
                });
            }
        }
        else if (typedInstance.componentDidMount && !(typedInstance.mode & Effect_TYPE$1.__pendingEffect__)) {
            typedInstance.mode = Effect_TYPE$1.__pendingEffect__;
            globalDispatch.pendingLayoutEffect(fiber, function () {
                var _a;
                typedInstance.mode = Effect_TYPE$1.__initial__;
                (_a = typedInstance.componentDidMount) === null || _a === void 0 ? void 0 : _a.call(typedInstance);
            });
        }
    };
    var processComponentContextOnUpdate = function (fiber) {
        var typedElement = fiber.element;
        var globalDispatch = fiber.root.dispatch;
        var Component = fiber.type & NODE_TYPE$2$1.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
        var typedInstance = fiber.instance;
        var typedComponent = Component;
        if (!(typedInstance === null || typedInstance === void 0 ? void 0 : typedInstance._contextFiber) || !typedInstance._contextFiber.mount) {
            var ProviderFiber = globalDispatch.resolveContextFiber(fiber, typedComponent.contextType);
            var context = globalDispatch.resolveContextValue(ProviderFiber, typedComponent.contextType);
            typedInstance === null || typedInstance === void 0 ? void 0 : typedInstance.setContext(ProviderFiber);
            return context;
        }
        else {
            var context = globalDispatch.resolveContextValue(typedInstance._contextFiber, typedComponent.contextType);
            return context;
        }
    };
    var processComponentShouldUpdateOnUpdate = function (fiber, _a) {
        var nextState = _a.nextState, nextProps = _a.nextProps, nextContext = _a.nextContext;
        var typedInstance = fiber.instance;
        if (fiber.mode & UPDATE_TYPE$1.__trigger__)
            return true;
        if (typedInstance.shouldComponentUpdate) {
            return typedInstance.shouldComponentUpdate(nextProps, nextState, nextContext);
        }
        return true;
    };
    var processComponentDidUpdateOnUpdate = function (fiber, _a) {
        var baseState = _a.baseState, baseProps = _a.baseProps, baseContext = _a.baseContext, callback = _a.callback;
        var typedInstance = fiber.instance;
        var globalDispatch = fiber.root.dispatch;
        var hasEffect = typedInstance.componentDidUpdate || callback.length;
        if (hasEffect && !(typedInstance.mode & Effect_TYPE$1.__pendingEffect__)) {
            typedInstance.mode = Effect_TYPE$1.__pendingEffect__;
            globalDispatch.pendingLayoutEffect(fiber, function () {
                var _a;
                typedInstance.mode = Effect_TYPE$1.__initial__;
                callback.forEach(function (c) { return c.call(null); });
                (_a = typedInstance.componentDidUpdate) === null || _a === void 0 ? void 0 : _a.call(typedInstance, baseProps, baseState, baseContext);
            });
        }
    };
    var classComponentMount = function (fiber) {
        processComponentInstanceOnMount(fiber);
        processComponentStateFromProps(fiber);
        var children = processComponentRenderOnMountAndUpdate(fiber);
        processComponentDidMountOnMount(fiber);
        return children;
    };
    var classComponentUpdate = function (fiber) {
        processComponentFiberOnUpdate(fiber);
        processComponentStateFromProps(fiber);
        fiber.root.dispatch.resolveComponentQueue(fiber);
        var typedInstance = fiber.instance;
        var newElement = fiber.element;
        var _a = typedInstance.result, newState = _a.newState, isForce = _a.isForce, callback = _a.callback;
        // maybe could improve here
        typedInstance.result = DEFAULT_RESULT;
        var baseState = typedInstance.state;
        var baseProps = typedInstance.props;
        var baseContext = typedInstance.context;
        var nextState = Object.assign({}, baseState, newState);
        var nextProps = Object.assign({}, typeof newElement === "object" ? newElement === null || newElement === void 0 ? void 0 : newElement["props"] : {});
        var nextContext = processComponentContextOnUpdate(fiber);
        var shouldUpdate = isForce;
        if (!shouldUpdate) {
            shouldUpdate = processComponentShouldUpdateOnUpdate(fiber, {
                nextState: nextState,
                nextProps: nextProps,
                nextContext: nextContext,
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
                callback: callback,
            });
            return { updated: true, children: children };
        }
        else {
            return { updated: false };
        }
    };

    var currentHookDeepIndex = react.__my_react_internal__.currentHookDeepIndex, currentFunctionFiber = react.__my_react_internal__.currentFunctionFiber, currentRunningFiber = react.__my_react_internal__.currentRunningFiber, currentComponentFiber = react.__my_react_internal__.currentComponentFiber, NODE_TYPE$1$1 = react.__my_react_internal__.NODE_TYPE, UPDATE_TYPE = react.__my_react_internal__.UPDATE_TYPE;
    var nextWorkCommon = function (fiber, children) {
        var childrenFiber = transformChildrenFiber(fiber, children);
        {
            var typedFiber = fiber;
            typedFiber._debugDynamicChildren = children;
        }
        return childrenFiber;
    };
    var nextWorkClassComponent = function (fiber) {
        if (!fiber.instance) {
            var children = classComponentMount(fiber);
            return nextWorkCommon(fiber, children);
        }
        else {
            var _a = classComponentUpdate(fiber), updated = _a.updated, children = _a.children;
            if (updated) {
                return nextWorkCommon(fiber, children);
            }
            else {
                fiber.afterUpdate();
                return [];
            }
        }
    };
    var nextWorkFunctionComponent = function (fiber) {
        var globalDispatch = fiber.root.dispatch;
        globalDispatch.resolveHookQueue(fiber);
        currentHookDeepIndex.current = 0;
        currentFunctionFiber.current = fiber;
        var typedElement = fiber.element;
        var typedType = typedElement.type;
        var children = typedType(typedElement.props);
        currentFunctionFiber.current = null;
        currentHookDeepIndex.current = 0;
        return nextWorkCommon(fiber, children);
    };
    var nextWorkComponent = function (fiber) {
        if (fiber.type & NODE_TYPE$1$1.__isFunctionComponent__) {
            currentComponentFiber.current = fiber;
            var res = nextWorkFunctionComponent(fiber);
            currentComponentFiber.current = null;
            return res;
        }
        else {
            currentComponentFiber.current = fiber;
            var res = nextWorkClassComponent(fiber);
            currentComponentFiber.current = null;
            return res;
        }
    };
    var nextWorkMemo = function (fiber) {
        var _a;
        var _b = fiber.element, type = _b.type, ref = _b.ref, props = _b.props;
        var typedType = type;
        var render = typedType.render;
        var isForwardRefRender = false;
        var targetRender = typeof render === "object" ? ((isForwardRefRender = true), render.render) : render;
        var isClassComponent = (_a = targetRender === null || targetRender === void 0 ? void 0 : targetRender.prototype) === null || _a === void 0 ? void 0 : _a.isMyReactComponent;
        if (isClassComponent) {
            currentComponentFiber.current = fiber;
            var res = nextWorkClassComponent(fiber);
            currentComponentFiber.current = null;
            return res;
        }
        else {
            var globalDispatch = fiber.root.dispatch;
            currentComponentFiber.current = fiber;
            globalDispatch.resolveHookQueue(fiber);
            currentHookDeepIndex.current = 0;
            currentFunctionFiber.current = fiber;
            var typedRender = targetRender;
            var children = isForwardRefRender ? typedRender(props, ref) : typedRender(props);
            currentFunctionFiber.current = null;
            currentHookDeepIndex.current = 0;
            currentComponentFiber.current = null;
            return nextWorkCommon(fiber, children);
        }
    };
    var nextWorkLazy = function (fiber) {
        var _a = fiber.element, type = _a.type, props = _a.props;
        var globalDispatch = fiber.root.dispatch;
        var typedType = type;
        if (typedType._loaded === true) {
            var render = typedType.render;
            var children_1 = react.createElement(render, props);
            return nextWorkCommon(fiber, children_1);
        }
        else if (typedType._loading === false) {
            if (globalDispatch.resolveLazy()) {
                typedType._loading = true;
                Promise.resolve()
                    .then(function () { return typedType.loader(); })
                    .then(function (re) {
                    var render = typeof re === "object" && typeof (re === null || re === void 0 ? void 0 : re.default) === "function" ? re.default : re;
                    typedType._loaded = true;
                    typedType._loading = false;
                    typedType.render = render;
                    fiber.update();
                });
            }
        }
        var children = globalDispatch.resolveSuspenseElement(fiber);
        return nextWorkCommon(fiber, children);
    };
    var nextWorkForwardRef = function (fiber) {
        var globalDispatch = fiber.root.dispatch;
        currentComponentFiber.current = fiber;
        globalDispatch.resolveHookQueue(fiber);
        var _a = fiber.element, type = _a.type, ref = _a.ref, props = _a.props;
        var typedType = type;
        var typedRender = typedType.render;
        currentHookDeepIndex.current = 0;
        currentFunctionFiber.current = fiber;
        var children = typedRender(props, ref);
        currentFunctionFiber.current = null;
        currentHookDeepIndex.current = 0;
        currentComponentFiber.current = null;
        return nextWorkCommon(fiber, children);
    };
    var nextWorkNormal = function (fiber) {
        if (react.isValidElement(fiber.element)) {
            var props = fiber.element.props;
            var children = props.children;
            var childrenFiber = transformChildrenFiber(fiber, children);
            return childrenFiber;
        }
        else {
            fiber.afterUpdate();
            return [];
        }
    };
    var nextWorkConsumer = function (fiber) {
        var globalDispatch = fiber.root.dispatch;
        var _a = fiber.element, type = _a.type, props = _a.props;
        var typedType = type;
        fiber.instance = fiber.instance || new typedType.Internal();
        fiber.instance.setOwner(fiber);
        var Context = typedType.Context;
        currentComponentFiber.current = fiber;
        if (!fiber.instance._contextFiber || !fiber.instance._contextFiber.mount) {
            var ProviderFiber = globalDispatch.resolveContextFiber(fiber, Context);
            var context = globalDispatch.resolveContextValue(ProviderFiber, Context);
            fiber.instance.context = context;
            fiber.instance.setContext(ProviderFiber);
        }
        else {
            var context = globalDispatch.resolveContextValue(fiber.instance._contextFiber, Context);
            fiber.instance.context = context;
        }
        var typedChildren = props.children;
        var children = typedChildren(fiber.instance.context);
        currentComponentFiber.current = null;
        return nextWorkCommon(fiber, children);
    };
    var nextWorkObject = function (fiber) {
        if (fiber.type & NODE_TYPE$1$1.__isMemo__)
            return nextWorkMemo(fiber);
        if (fiber.type & NODE_TYPE$1$1.__isLazy__)
            return nextWorkLazy(fiber);
        if (fiber.type & NODE_TYPE$1$1.__isPortal__)
            return nextWorkNormal(fiber);
        if (fiber.type & NODE_TYPE$1$1.__isSuspense__)
            return nextWorkNormal(fiber);
        if (fiber.type & NODE_TYPE$1$1.__isForwardRef__)
            return nextWorkForwardRef(fiber);
        if (fiber.type & NODE_TYPE$1$1.__isContextProvider__)
            return nextWorkNormal(fiber);
        if (fiber.type & NODE_TYPE$1$1.__isContextConsumer__)
            return nextWorkConsumer(fiber);
        throw new Error("unknown element ".concat(fiber.element));
    };
    var nextWorkSync = function (fiber) {
        if (!fiber.mount)
            return [];
        if (fiber.invoked && !(fiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__)))
            return [];
        currentRunningFiber.current = fiber;
        var children = [];
        if (fiber.type & NODE_TYPE$1$1.__isDynamicNode__)
            children = nextWorkComponent(fiber);
        else if (fiber.type & NODE_TYPE$1$1.__isObjectNode__)
            children = nextWorkObject(fiber);
        else
            children = nextWorkNormal(fiber);
        fiber.invoked = true;
        currentRunningFiber.current = null;
        return children;
    };
    var nextWorkAsync = function (fiber, topLevelFiber) {
        if (!fiber.mount)
            return null;
        if (!fiber.invoked || fiber.mode & UPDATE_TYPE.__update__ || fiber.mode & UPDATE_TYPE.__trigger__) {
            currentRunningFiber.current = fiber;
            if (fiber.type & NODE_TYPE$1$1.__isDynamicNode__)
                nextWorkComponent(fiber);
            else if (fiber.type & NODE_TYPE$1$1.__isObjectNode__)
                nextWorkObject(fiber);
            else
                nextWorkNormal(fiber);
            currentRunningFiber.current = null;
            fiber.invoked = true;
            if (fiber.children.length) {
                return fiber.child;
            }
        }
        var nextFiber = fiber;
        while (nextFiber && nextFiber !== topLevelFiber) {
            if (nextFiber.sibling) {
                return nextFiber.sibling;
            }
            nextFiber = nextFiber.parent;
        }
        return null;
    };

    // ==== running ==== //
    var nRoundTransformFiberArray = react.createRef([]);
    var cRoundTransformFiberArray = react.createRef([]);

    var isArrayEquals = function (src, target) {
        if (Array.isArray(src) && Array.isArray(target) && src.length === target.length) {
            var re = true;
            for (var key in src) {
                re = re && Object.is(src[key], target[key]);
                if (!re)
                    return re;
            }
            return re;
        }
        return false;
    };

    var loopStart = function (fiber) {
        var _a;
        (_a = cRoundTransformFiberArray.current).push.apply(_a, nextWorkSync(fiber));
    };
    var loopCurrent = function () {
        var _a;
        while (cRoundTransformFiberArray.current.length) {
            var fiber = cRoundTransformFiberArray.current.shift();
            if (fiber) {
                (_a = nRoundTransformFiberArray.current).push.apply(_a, nextWorkSync(fiber));
            }
        }
    };
    var loopNext = function () {
        var _a;
        while (nRoundTransformFiberArray.current.length) {
            var fiber = nRoundTransformFiberArray.current.shift();
            if (fiber) {
                (_a = cRoundTransformFiberArray.current).push.apply(_a, nextWorkSync(fiber));
            }
        }
    };
    var loopToEnd = function () {
        loopCurrent();
        loopNext();
        if (cRoundTransformFiberArray.current.length) {
            loopToEnd();
        }
    };
    var loopAll = function (fiber) {
        loopStart(fiber);
        loopToEnd();
    };
    var mountLoopSync = function (fiber) { return loopAll(fiber); };

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

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var HOOK_TYPE$1 = react.__my_react_internal__.HOOK_TYPE;
    var _createHookNode = react.__my_react_shared__.createHookNode;
    var createHookNode = function (props, fiber) {
        var globalDispatch = fiber.root.dispatch;
        var hookNode = _createHookNode(props, fiber);
        if (hookNode.hookType === HOOK_TYPE$1.useMemo || hookNode.hookType === HOOK_TYPE$1.useState || hookNode.hookType === HOOK_TYPE$1.useReducer) {
            hookNode.result = hookNode.value.call(null);
            return hookNode;
        }
        if (hookNode.hookType === HOOK_TYPE$1.useEffect || hookNode.hookType === HOOK_TYPE$1.useLayoutEffect || hookNode.hookType === HOOK_TYPE$1.useImperativeHandle) {
            hookNode.effect = true;
            return hookNode;
        }
        if (hookNode.hookType === HOOK_TYPE$1.useRef || hookNode.hookType === HOOK_TYPE$1.useCallback) {
            hookNode.result = hookNode.value;
            return hookNode;
        }
        if (hookNode.hookType === HOOK_TYPE$1.useContext) {
            var ProviderFiber = globalDispatch.resolveContextFiber(hookNode._ownerFiber, hookNode.value);
            var context = globalDispatch.resolveContextValue(ProviderFiber, hookNode.value);
            hookNode.setContext(ProviderFiber);
            hookNode.result = context;
            hookNode.context = context;
            return hookNode;
        }
        return hookNode;
    };

    var Effect_TYPE = react.__my_react_internal__.Effect_TYPE;
    var effect$1 = function (fiber, hookNode) {
        var globalDispatch = fiber.root.dispatch;
        if (hookNode.effect && hookNode.mode === Effect_TYPE.__initial__) {
            hookNode.mode = Effect_TYPE.__pendingEffect__;
            var strictMod_1 = globalDispatch.resolveStrictValue(fiber) ;
            if (hookNode.hookType === "useEffect") {
                var update_1 = function () {
                    var _a;
                    hookNode.cancel && hookNode.cancel();
                    if ((_a = hookNode._ownerFiber) === null || _a === void 0 ? void 0 : _a.mount)
                        hookNode.cancel = hookNode.value();
                    hookNode.effect = false;
                    hookNode.mode = Effect_TYPE.__initial__;
                };
                globalDispatch.pendingEffect(fiber, function () {
                    if (strictMod_1) {
                        update_1();
                        update_1();
                    }
                    else {
                        update_1();
                    }
                });
            }
            if (hookNode.hookType === "useLayoutEffect") {
                var update_2 = function () {
                    var _a;
                    hookNode.cancel && hookNode.cancel();
                    if ((_a = hookNode._ownerFiber) === null || _a === void 0 ? void 0 : _a.mount)
                        hookNode.cancel = hookNode.value();
                    hookNode.effect = false;
                    hookNode.mode = Effect_TYPE.__initial__;
                };
                globalDispatch.pendingLayoutEffect(fiber, function () {
                    if (strictMod_1) {
                        update_2();
                        update_2();
                    }
                    else {
                        update_2();
                    }
                });
            }
            if (hookNode.hookType === "useImperativeHandle") {
                globalDispatch.pendingLayoutEffect(fiber, function () {
                    if (hookNode.value && typeof hookNode.value === "object")
                        hookNode.value.current = hookNode.reducer.call(null);
                    hookNode.effect = false;
                    hookNode.mode = Effect_TYPE.__initial__;
                });
            }
        }
    };

    var logHook$1 = react.__my_react_shared__.logHook;
    var HOOK_TYPE = react.__my_react_internal__.HOOK_TYPE;
    var updateHookNode = function (_a, fiber) {
        var hookIndex = _a.hookIndex, hookType = _a.hookType, value = _a.value, reducer = _a.reducer, deps = _a.deps;
        var globalDispatch = fiber.root.dispatch;
        var currentHook = fiber.hookNodeArray[hookIndex];
        if (hookType !== currentHook.hookType) {
            var array = fiber.hookTypeArray.slice(0, hookIndex);
            throw new Error(logHook$1(__spreadArray(__spreadArray([], array, true), [currentHook.hookType], false), __spreadArray(__spreadArray([], array, true), [hookType], false)));
        }
        currentHook.setOwner(fiber);
        if (currentHook.hookType === HOOK_TYPE.useMemo ||
            currentHook.hookType === HOOK_TYPE.useEffect ||
            currentHook.hookType === HOOK_TYPE.useCallback ||
            currentHook.hookType === HOOK_TYPE.useLayoutEffect ||
            currentHook.hookType === HOOK_TYPE.useImperativeHandle) {
            if (deps && !currentHook.deps) {
                throw new Error("deps state change");
            }
            if (!deps && currentHook.deps) {
                throw new Error("deps state change");
            }
        }
        if (currentHook.hookType === HOOK_TYPE.useEffect ||
            currentHook.hookType === HOOK_TYPE.useLayoutEffect ||
            currentHook.hookType === HOOK_TYPE.useImperativeHandle) {
            if (!deps) {
                currentHook.value = value;
                currentHook.reducer = reducer || currentHook.reducer;
                currentHook.deps = deps;
                currentHook.effect = true;
            }
            else if (!isArrayEquals(currentHook.deps, deps)) {
                currentHook.value = value;
                currentHook.reducer = reducer || currentHook.reducer;
                currentHook.deps = deps;
                currentHook.effect = true;
            }
            return currentHook;
        }
        if (currentHook.hookType === HOOK_TYPE.useCallback) {
            if (!isArrayEquals(currentHook.deps, deps)) {
                currentHook.value = value;
                currentHook.result = value;
                currentHook.deps = deps;
            }
            return currentHook;
        }
        if (currentHook.hookType === HOOK_TYPE.useMemo) {
            if (!isArrayEquals(currentHook.deps, deps)) {
                currentHook.value = value;
                currentHook.result = value.call(null);
                currentHook.deps = deps;
            }
            return currentHook;
        }
        if (currentHook.hookType === HOOK_TYPE.useContext) {
            if (!currentHook._contextFiber || !currentHook._contextFiber.mount || !Object.is(currentHook.value, value)) {
                currentHook.value = value;
                var ProviderFiber = globalDispatch.resolveContextFiber(currentHook._ownerFiber, currentHook.value);
                var context = globalDispatch.resolveContextValue(ProviderFiber, currentHook.value);
                currentHook.setContext(ProviderFiber);
                currentHook.result = context;
                currentHook.context = context;
            }
            else {
                var context = globalDispatch.resolveContextValue(currentHook._contextFiber, currentHook.value);
                currentHook.result = context;
                currentHook.context = context;
            }
            return currentHook;
        }
        if (currentHook.hookType === HOOK_TYPE.useReducer) {
            currentHook.value = value;
            currentHook.reducer = reducer;
            return currentHook;
        }
        return currentHook;
    };

    var logHook = react.__my_react_shared__.logHook;
    var processHookNode = function (fiber, _a) {
        var hookIndex = _a.hookIndex, hookType = _a.hookType, reducer = _a.reducer, value = _a.value, deps = _a.deps;
        if (!fiber)
            throw new Error("can not use hook outside of component");
        var currentHook = null;
        if (fiber.hookNodeArray.length > hookIndex) {
            currentHook = updateHookNode({ hookIndex: hookIndex, hookType: hookType, reducer: reducer, value: value, deps: deps }, fiber);
        }
        else if (!fiber.invoked) {
            currentHook = createHookNode({ hookIndex: hookIndex, hookType: hookType, reducer: reducer, value: value, deps: deps }, fiber);
        }
        else {
            throw new Error(logHook(__spreadArray([], fiber.hookTypeArray, true), __spreadArray(__spreadArray([], fiber.hookTypeArray, true), [hookType], false)));
        }
        effect$1(fiber, currentHook);
        return currentHook;
    };

    var safeCall$1$1 = react.__my_react_shared__.safeCall;
    var updateLoopSync = function (loopController, reconcileUpdate) {
        if (loopController.hasNext()) {
            var fiber = loopController.getNext();
            var _loop_1 = function () {
                var _fiber = fiber;
                fiber = safeCall$1$1(function () { return nextWorkAsync(_fiber, loopController.getTopLevel()); });
                loopController.getUpdateList(_fiber);
                loopController.setYield(fiber);
            };
            while (fiber) {
                _loop_1();
            }
        }
        reconcileUpdate();
    };

    var safeCall$2 = react.__my_react_shared__.safeCall;
    var updateLoopAsync = function (loopController, shouldPause, reconcileUpdate) {
        var _loop_1 = function () {
            var fiber = loopController.getNext();
            if (fiber) {
                var nextFiber = safeCall$2(function () { return nextWorkAsync(fiber, loopController.getTopLevel()); });
                loopController.getUpdateList(fiber);
                loopController.setYield(nextFiber);
            }
        };
        while (loopController.hasNext() && !shouldPause()) {
            _loop_1();
        }
        if (!loopController.doesPause()) {
            reconcileUpdate();
        }
    };

    var processComponentUpdateQueue = function (fiber) {
        var allQueue = fiber.updateQueue.slice(0);
        var lastQueue = [];
        fiber.updateQueue = [];
        var typedInstance = fiber.instance;
        var baseState = Object.assign({}, typedInstance.state);
        var baseProps = Object.assign({}, typedInstance.props);
        allQueue.reduce(function (p, c) {
            if (c.type === "component") {
                var result = {
                    newState: __assign(__assign({}, p.newState), (typeof c.payLoad === "function" ? c.payLoad(baseState, baseProps) : c.payLoad)),
                    isForce: p.isForce || c.isForce || false,
                    callback: c.callback ? p.callback.concat(c.callback) : p.callback,
                };
                if (c.trigger !== typedInstance) {
                    throw new Error("current update not valid, look like a bug for MyReact");
                }
                typedInstance.result = result;
                return result;
            }
            else {
                lastQueue.push(c);
                return p;
            }
        }, { newState: __assign({}, baseState), isForce: false, callback: [] });
        fiber.updateQueue = __spreadArray(__spreadArray([], lastQueue, true), fiber.updateQueue, true);
    };
    var processHookUpdateQueue = function (fiber) {
        var allQueue = fiber.updateQueue.slice(0);
        var lastQueue = [];
        fiber.updateQueue = [];
        allQueue.forEach(function (updater) {
            if (updater.type === "hook") {
                var trigger = updater.trigger, payLoad = updater.payLoad;
                trigger.result = trigger.reducer(trigger.result, payLoad);
            }
            else {
                lastQueue.push(updater);
            }
        });
        fiber.updateQueue = __spreadArray(__spreadArray([], lastQueue, true), fiber.updateQueue, true);
    };

    var NODE_TYPE$i = react.__my_react_internal__.NODE_TYPE;
    var defaultGetContextMapFromMap = function (fiber, map) {
        if (fiber) {
            return map[fiber.uid];
        }
        else {
            return {};
        }
    };
    var defaultGenerateContextMap = function (fiber, map) {
        var parentMap = defaultGetContextMapFromMap(fiber.parent, map);
        var currentMap = defaultGetContextMapFromMap(fiber, map);
        var contextMap = Object.assign({}, parentMap, currentMap);
        var element = fiber.element;
        var id = fiber.uid;
        if (react.isValidElement(element) && typeof element.type === "object" && fiber.type & NODE_TYPE$i.__isContextProvider__) {
            var typedElementType = element.type;
            var contextObj = typedElementType["Context"];
            var contextId = contextObj["id"];
            contextMap[contextId] = fiber;
        }
        map[id] = contextMap;
        {
            var typedFiber = fiber;
            typedFiber._debugContextMap = contextMap;
        }
    };
    var defaultGetContextValue = function (fiber, ContextObject) {
        if (fiber) {
            var typedElement = fiber.element;
            return typedElement.props["value"] || null;
        }
        else {
            return (ContextObject === null || ContextObject === void 0 ? void 0 : ContextObject.Provider["value"]) || null;
        }
    };

    var enableAllCheck = react.createRef(true);
    var asyncUpdateTimeLimit = 8;
    var asyncUpdateTimeStep = react.createRef(null);
    // ==== feature ==== //
    var enableControlComponent = react.createRef(true);
    var enableEventSystem = react.createRef(true);
    var enableHighlight = react.createRef(false);
    // ==== todo ==== //
    var enableFastLoop = react.createRef(false);

    var createDomNode = function (element) { return ({
        memoizedProps: {},
        element: element,
    }); };

    var isInternal = function (key) { return key.startsWith("_"); };
    var isChildren = function (key) { return key === "children" || key === "dangerouslySetInnerHTML"; };
    var isEvent = function (key) { return key.startsWith("on"); };
    var isStyle = function (key) { return key === "style"; };
    var isProperty = function (key) { return !isChildren(key) && !isEvent(key) && !isStyle(key) && !isInternal(key); };
    var isNew = function (oldProps, newProps) { return function (key) { return oldProps[key] !== newProps[key]; }; };
    var isGone = function (newProps) { return function (key) { return !(key in newProps); }; };

    var DomScope = /** @class */ (function () {
        function DomScope() {
            this.rootFiber = null;
            this.rootContainer = {};
            this.isAppMounted = false;
            this.isAppCrash = false;
            this.modifyFiberArray = [];
            this.modifyFiberRoot = null;
            this.updateFiberListArray = [];
            this.updateFiberList = null;
            this.currentYield = null;
            this.isHydrateRender = false;
            this.isServerRender = false;
        }
        return DomScope;
    }());

    var debugWithDOM = function (fiber) {
        if (fiber.node) {
            var element = fiber.node.element;
            var debugDOM = element;
            debugDOM["__fiber__"] = fiber;
            debugDOM["__element__"] = fiber.element;
            debugDOM["__children__"] = fiber.children;
        }
    };

    var createPortal = function (element, container) {
        var _a;
        return react.createElement((_a = {}, _a["$$typeof"] = react.Portal, _a), { container: container }, element);
    };

    var reconcileMount = function (fiber, hydrate) {
        fiber.root.dispatch.reconcileCommit(fiber, hydrate, fiber);
    };

    var globalLoop$2 = react.__my_react_internal__.globalLoop;
    var safeCall$1 = react.__my_react_shared__.safeCall;
    var startRender = function (fiber, hydrate) {
        if (hydrate === void 0) { hydrate = false; }
        globalLoop$2.current = true;
        safeCall$1(function () { return mountLoopSync(fiber); });
        reconcileMount(fiber, hydrate);
        fiber.root.scope.isAppMounted = true;
        globalLoop$2.current = false;
    };

    var MyReactComponent = react.__my_react_internal__.MyReactComponent;
    var findDOMFromFiber = function (fiber) {
        var currentArray = [fiber];
        while (currentArray.length) {
            var next = currentArray.shift();
            if (next === null || next === void 0 ? void 0 : next.node)
                return next.node;
            currentArray.push.apply(currentArray, ((next === null || next === void 0 ? void 0 : next.children) || []));
        }
        return null;
    };
    var findDOMFromComponentFiber = function (fiber) {
        if (fiber) {
            if (fiber.node)
                return fiber.node.element;
            for (var i = 0; i < fiber.children.length; i++) {
                var dom = findDOMFromFiber(fiber.children[i]);
                if (dom)
                    return dom.element;
            }
        }
        return null;
    };
    var findDOMNode = function (instance) {
        if (instance instanceof MyReactComponent && instance._ownerFiber) {
            return findDOMFromComponentFiber(instance._ownerFiber);
        }
        else {
            return null;
        }
    };

    var NODE_TYPE$h = react.__my_react_internal__.NODE_TYPE;
    var clearFiberDom = function (fiber) {
        if (fiber.node) {
            if (!(fiber.type & NODE_TYPE$h.__isPortal__) && fiber !== fiber.root) {
                var dom = fiber.node.element;
                dom.parentElement.removeChild(dom);
            }
            else {
                fiber.children.forEach(clearFiberDom);
            }
        }
        else {
            fiber.children.forEach(clearFiberDom);
        }
    };

    var unmountFiberNode = react.__my_react_shared__.unmountFiberNode;
    var unmountFiber = function (fiber) {
        unmountFiberNode(fiber);
        clearFiberDom(fiber);
    };
    var unmount = function (fiber) {
        var globalDispatch = fiber.root.dispatch;
        var unmountMap = globalDispatch.unmountMap;
        var allUnmountFiber = unmountMap[fiber.uid] || [];
        unmountMap[fiber.uid] = [];
        if (allUnmountFiber.length) {
            mapFiber(allUnmountFiber, function (f) { return unmountFiber(f); });
        }
    };

    var MyReactFiberNodeClass$2 = react.__my_react_internal__.MyReactFiberNode;
    var unmountComponentAtNode = function (container) {
        var fiber = container.__fiber__;
        if (fiber instanceof MyReactFiberNodeClass$2) {
            unmountFiber(fiber);
        }
    };

    var NODE_TYPE$g = react.__my_react_internal__.NODE_TYPE;
    var isSVG = function (_fiber, map) {
        var _isSVG = _fiber.parent ? map[_fiber.parent.uid] : false;
        if (!_isSVG) {
            var element = _fiber.element;
            if (typeof element === "object" && (element === null || element === void 0 ? void 0 : element.type) === "svg") {
                _isSVG = true;
            }
        }
        _isSVG = Boolean(_isSVG);
        map[_fiber.uid] = _isSVG;
        return _isSVG;
    };
    var generateStrictMap = function (_fiber, map) {
        var parent = _fiber.parent;
        var element = _fiber.element;
        if (typeof element === "object" && _fiber.type & NODE_TYPE$g.__isStrictNode__) {
            map[_fiber.uid] = true;
        }
        else {
            if (parent) {
                map[_fiber.uid] = Boolean(map[parent.uid]);
            }
            else {
                map[_fiber.uid] = false;
            }
        }
        {
            var typedFiber = _fiber;
            typedFiber._debugStrict = map[_fiber.uid];
        }
    };
    var generateSuspenseMap = function (_fiber, map) {
        var parent = _fiber.parent;
        var element = _fiber.element;
        if (typeof element === "object" && _fiber.type & NODE_TYPE$g.__isSuspense__) {
            map[_fiber.uid] = element === null || element === void 0 ? void 0 : element.props["fallback"];
        }
        else {
            if (parent) {
                map[_fiber.uid] = map[parent.uid];
            }
            else {
                map[_fiber.uid] = null;
            }
        }
        {
            var typedFiber = _fiber;
            typedFiber._debugSuspense = map[_fiber.uid];
        }
    };
    var setRef = function (_fiber) {
        if (_fiber.type & NODE_TYPE$g.__isPlainNode__) {
            var typedElement = _fiber.element;
            if (_fiber.node) {
                var typedNode = _fiber.node;
                var ref = typedElement.ref;
                if (typeof ref === "object" && ref !== null) {
                    ref.current = typedNode.element;
                }
                else if (typeof ref === "function") {
                    ref(typedNode.element);
                }
            }
            else {
                throw new Error("plain element do not have a native node");
            }
        }
        if (_fiber.type & NODE_TYPE$g.__isClassComponent__) {
            var typedElement = _fiber.element;
            if (_fiber.instance) {
                var ref = typedElement.ref;
                if (typeof ref === "object" && ref !== null) {
                    ref.current = _fiber.instance;
                }
                else if (typeof ref === "function") {
                    ref(_fiber.instance);
                }
            }
            else {
                throw new Error("class component do not have a instance");
            }
        }
    };

    var ListTreeNode = /** @class */ (function () {
        function ListTreeNode(value) {
            this.prev = null;
            this.next = null;
            this.children = [];
            this.value = value;
        }
        return ListTreeNode;
    }());
    var LinkTreeList = /** @class */ (function () {
        function LinkTreeList() {
            this.rawArray = [];
            this.scopeRoot = { index: -1, value: new ListTreeNode(false) };
            this.scopeArray = [];
            this.scopeLength = 0;
            this.length = 0;
            this.head = null;
            this.foot = null;
        }
        LinkTreeList.prototype.scopePush = function (scopeItem) {
            while (this.scopeLength && this.scopeArray[this.scopeLength - 1].index >= scopeItem.index) {
                this.scopeArray.pop();
                this.scopeLength--;
            }
            if (this.scopeLength) {
                this.scopeArray[this.scopeLength - 1].value.children.push(scopeItem.value);
            }
            else {
                this.scopeRoot.value.children.push(scopeItem.value);
            }
            this.scopeArray.push(scopeItem);
            this.scopeLength++;
        };
        LinkTreeList.prototype.append = function (node, index) {
            this.length++;
            this.rawArray.push(node);
            var listNode = new ListTreeNode(node);
            this.push(listNode);
            this.scopePush({ index: index, value: listNode });
        };
        LinkTreeList.prototype.unshift = function (node) {
            if (!this.head) {
                this.head = node;
                this.foot = node;
            }
            else {
                this.head.prev = node;
                node.next = this.head;
                this.head = node;
            }
        };
        LinkTreeList.prototype.shift = function () {
            if (this.head) {
                var re = this.head;
                if (this.head.next) {
                    this.head = this.head.next;
                    re.next = null;
                    this.head.prev = null;
                }
                else {
                    this.head = null;
                    this.foot = null;
                }
                return re;
            }
            else {
                return null;
            }
        };
        LinkTreeList.prototype.push = function (node) {
            if (!this.foot) {
                this.head = node;
                this.foot = node;
            }
            else {
                this.foot.next = node;
                node.prev = this.foot;
                this.foot = node;
            }
        };
        LinkTreeList.prototype.pop = function () {
            if (this.foot) {
                var re = this.foot;
                if (this.foot.prev) {
                    this.foot = this.foot.prev;
                    re.prev = null;
                    this.foot.next = null;
                }
                else {
                    this.head = null;
                    this.foot = null;
                }
                return re;
            }
            else {
                return null;
            }
        };
        LinkTreeList.prototype.pickHead = function () {
            return this.head;
        };
        LinkTreeList.prototype.pickFoot = function () {
            return this.foot;
        };
        LinkTreeList.prototype.listToFoot = function (action) {
            var node = this.head;
            while (node) {
                action(node.value);
                node = node.next;
            }
        };
        LinkTreeList.prototype.listToHead = function (action) {
            var node = this.foot;
            while (node) {
                action(node.value);
                node = node.prev;
            }
        };
        LinkTreeList.prototype.reconcile = function (action) {
            var reconcileScope = function (node) {
                if (node.children) {
                    node.children.forEach(reconcileScope);
                }
                action(node.value);
            };
            if (this.scopeLength) {
                this.scopeRoot.value.children.forEach(reconcileScope);
            }
        };
        LinkTreeList.prototype.has = function () {
            return this.head !== null;
        };
        return LinkTreeList;
    }());

    var MyReactFiberNodeClass$1 = react.__my_react_internal__.MyReactFiberNode;
    var mapFiber = function (arrayLike, action) {
        if (Array.isArray(arrayLike)) {
            arrayLike.forEach(function (f) { return mapFiber(f, action); });
        }
        else {
            if (arrayLike instanceof MyReactFiberNodeClass$1) {
                action(arrayLike);
            }
        }
    };

    var shouldPauseAsyncUpdate = function () {
        if (!asyncUpdateTimeStep.current) {
            asyncUpdateTimeStep.current = Date.now();
            return false;
        }
        else {
            var result = Date.now() - asyncUpdateTimeStep.current > asyncUpdateTimeLimit;
            if (result)
                asyncUpdateTimeStep.current = null;
            return result;
        }
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
        strokeWidth: true,
    };

    var IS_SINGLE_ELEMENT = {
        br: true,
        hr: true,
        img: true,
        input: true,
        param: true,
        meta: true,
        link: true,
    };

    var generateReconcileUpdate = function (globalDispatch, globalScope) { return function () {
        var allPendingList = globalScope.updateFiberListArray.slice(0);
        allPendingList.forEach(function (l) { return globalDispatch.reconcileUpdate(l); });
        globalScope.updateFiberListArray = [];
    }; };

    var getFiberWithDom$1 = function (fiber, transform) {
        if (fiber) {
            if (fiber.node)
                return fiber;
            return getFiberWithDom$1(transform(fiber), transform);
        }
        return null;
    };

    var globalLoop$1 = react.__my_react_internal__.globalLoop;
    var updateAllSync = function (updateFiberController, reconcileUpdate) {
        globalLoop$1.current = true;
        updateLoopSync(updateFiberController, reconcileUpdate);
        globalLoop$1.current = false;
        Promise.resolve().then(function () {
            if (updateFiberController.hasNext())
                updateAllSync(updateFiberController, reconcileUpdate);
        });
    };
    var updateAllAsync = function (updateFiberController, reconcileUpdate) {
        globalLoop$1.current = true;
        updateLoopAsync(updateFiberController, shouldPauseAsyncUpdate, reconcileUpdate);
        globalLoop$1.current = false;
        Promise.resolve().then(function () {
            if (updateFiberController.hasNext()) {
                updateAllAsync(updateFiberController, reconcileUpdate);
            }
        });
    };

    var generateUpdateControllerWithDispatch = function (globalDispatch, globalScope) {
        var controller = {
            setYield: function (fiber) {
                if (fiber) {
                    globalScope.currentYield = fiber;
                }
                else {
                    globalScope.currentYield = null;
                    globalDispatch.endProgressList(globalScope);
                }
            },
            getNext: function () {
                if (globalScope.isAppCrash)
                    return null;
                var yieldFiber = globalScope.currentYield;
                globalScope.currentYield = null;
                if (yieldFiber)
                    return yieldFiber;
                globalScope.modifyFiberRoot = null;
                while (globalScope.modifyFiberArray.length) {
                    var newProgressFiber = globalScope.modifyFiberArray.shift();
                    if (newProgressFiber === null || newProgressFiber === void 0 ? void 0 : newProgressFiber.mount) {
                        globalDispatch.beginProgressList(globalScope);
                        globalScope.modifyFiberRoot = newProgressFiber;
                        return newProgressFiber;
                    }
                }
                return null;
            },
            getUpdateList: function (fiber) {
                globalDispatch.generateUpdateList(fiber, globalScope);
            },
            hasNext: function () {
                if (globalScope.isAppCrash)
                    return false;
                return globalScope.currentYield !== null || globalScope.modifyFiberArray.length > 0;
            },
            doesPause: function () { return globalScope.currentYield !== null; },
            getTopLevel: function () { return globalScope.modifyFiberRoot; },
        };
        return controller;
    };

    var globalLoop = react.__my_react_internal__.globalLoop;
    var enableAsyncUpdate = react.__my_react_shared__.enableAsyncUpdate;
    var updateEntry = function (globalDispatch, globalScope) {
        if (globalLoop.current)
            return;
        var updateFiberController = generateUpdateControllerWithDispatch(globalDispatch, globalScope);
        var reconcileUpdate = generateReconcileUpdate(globalDispatch, globalScope);
        if (enableAsyncUpdate.current) {
            updateAllAsync(updateFiberController, reconcileUpdate);
        }
        else {
            updateAllSync(updateFiberController, reconcileUpdate);
        }
    };
    var asyncUpdate = function (globalDispatch, globalScope) { return Promise.resolve().then(function () { return updateEntry(globalDispatch, globalScope); }); };
    var triggerUpdate = function (fiber) {
        var globalScope = fiber.root.scope;
        var globalDispatch = fiber.root.dispatch;
        if (globalScope.isHydrateRender || globalScope.isServerRender) {
            {
                console.log("can not update component");
            }
            return;
        }
        fiber.triggerUpdate();
        globalScope.modifyFiberArray.push(fiber);
        asyncUpdate(globalDispatch, globalScope);
    };

    var PATCH_TYPE$c = react.__my_react_internal__.PATCH_TYPE;
    var append$2 = function (fiber, parentFiberWithDom) {
        if (fiber.patch & PATCH_TYPE$c.__pendingAppend__) {
            parentFiberWithDom = parentFiberWithDom || getFiberWithDom$1(fiber.parent, function (f) { return f.parent; });
            if (!fiber.node || !parentFiberWithDom.node)
                throw new Error("append error, dom not exist");
            var element = parentFiberWithDom.node.element;
            var parentDom = element;
            var currentDom = fiber.node.element;
            if (!Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, parentDom.tagName.toLowerCase())) {
                parentDom.appendChild(currentDom);
            }
            if (fiber.patch & PATCH_TYPE$c.__pendingAppend__)
                fiber.patch ^= PATCH_TYPE$c.__pendingAppend__;
        }
    };

    var PATCH_TYPE$b = react.__my_react_internal__.PATCH_TYPE;
    var context = function (fiber) {
        if (fiber.patch & PATCH_TYPE$b.__pendingContext__) {
            var allListeners_1 = fiber.dependence.slice(0);
            Promise.resolve().then(function () {
                allListeners_1.map(function (i) { return i._ownerFiber; }).forEach(function (f) { return (f === null || f === void 0 ? void 0 : f.mount) && f.update(); });
            });
            if (fiber.patch & PATCH_TYPE$b.__pendingContext__)
                fiber.patch ^= PATCH_TYPE$b.__pendingContext__;
        }
    };

    var NODE_TYPE$f = react.__my_react_internal__.NODE_TYPE;
    var log$2 = react.__my_react_shared__.log;
    var getNextHydrateDom = function (parentDom) {
        var children = Array.from(parentDom.childNodes);
        return children.find(function (dom) { return dom.nodeType !== document.COMMENT_NODE && !dom.__hydrate__; });
    };
    var checkHydrateDom = function (fiber, dom) {
        if (!dom) {
            log$2({
                fiber: fiber,
                level: "error",
                message: "hydrate error, dom not render from server",
            });
            return false;
        }
        if (fiber.type & NODE_TYPE$f.__isTextNode__) {
            if (dom.nodeType !== Node.TEXT_NODE) {
                log$2({
                    fiber: fiber,
                    level: "error",
                    message: "hydrate error, dom not match from server. server: ".concat(dom.nodeName.toLowerCase(), ", client: ").concat(fiber.element),
                });
                return false;
            }
            return true;
        }
        if (fiber.type & NODE_TYPE$f.__isPlainNode__) {
            var typedElement = fiber.element;
            if (dom.nodeType !== Node.ELEMENT_NODE) {
                log$2({
                    fiber: fiber,
                    level: "error",
                    message: "hydrate error, dom not match from server. server: ".concat(dom.nodeName.toLowerCase(), ", client: ").concat(typedElement.type.toString()),
                });
                return false;
            }
            if (typedElement.type.toString() !== dom.nodeName.toLowerCase()) {
                log$2({
                    fiber: fiber,
                    level: "error",
                    message: "hydrate error, dom not match from server. server: ".concat(dom.nodeName.toLowerCase(), ", client: ").concat(typedElement.type.toString()),
                });
                return false;
            }
            return true;
        }
        throw new Error("hydrate error, look like a bug");
    };
    var getHydrateDom = function (fiber, parentDom) {
        if (IS_SINGLE_ELEMENT[parentDom.tagName.toLowerCase()])
            return { result: true };
        var dom = getNextHydrateDom(parentDom);
        var result = checkHydrateDom(fiber, dom);
        if (result) {
            var typedDom = dom;
            fiber.node = createDomNode(typedDom);
            return { dom: typedDom, result: result };
        }
        else {
            return { dom: dom, result: result };
        }
    };

    var NODE_TYPE$e = react.__my_react_internal__.NODE_TYPE;
    var hydrateCreate = function (fiber, parentFiberWithDom) {
        if (fiber.type & (NODE_TYPE$e.__isTextNode__ | NODE_TYPE$e.__isPlainNode__)) {
            var element = parentFiberWithDom.node.element;
            var result = getHydrateDom(fiber, element).result;
            return result;
        }
        throw new Error("hydrate error, portal element can not hydrate");
    };

    var NODE_TYPE$d = react.__my_react_internal__.NODE_TYPE;
    var nativeCreate = function (fiber, isSVG) {
        if (fiber.type & NODE_TYPE$d.__isTextNode__) {
            fiber.node = createDomNode(document.createTextNode(fiber.element));
        }
        else if (fiber.type & NODE_TYPE$d.__isPlainNode__) {
            var typedElement = fiber.element;
            if (isSVG) {
                fiber.node = createDomNode(document.createElementNS("http://www.w3.org/2000/svg", typedElement.type));
            }
            else {
                fiber.node = createDomNode(document.createElement(typedElement.type));
            }
        }
        else {
            var typedElement = fiber.element;
            fiber.node = createDomNode(typedElement.props["container"]);
        }
    };

    // for invalid dom structure
    var log$1 = react.__my_react_shared__.log;
    var NODE_TYPE$c = react.__my_react_internal__.NODE_TYPE;
    // TODO
    var validDomNesting = function (fiber) {
        if (!enableAllCheck.current)
            return;
        if (fiber.type & NODE_TYPE$c.__isPlainNode__) {
            var typedElement = fiber.element;
            if (typedElement.type === "p") {
                var parent_1 = fiber.parent;
                while (parent_1 && parent_1.type & NODE_TYPE$c.__isPlainNode__) {
                    var typedParentElement = parent_1.element;
                    if (typedParentElement.type === "p") {
                        log$1({
                            fiber: fiber,
                            level: "warn",
                            triggerOnce: true,
                            message: "invalid dom nesting: <p> cannot appear as a child of <p>",
                        });
                    }
                    parent_1 = parent_1.parent;
                }
            }
        }
    };

    var PATCH_TYPE$a = react.__my_react_internal__.PATCH_TYPE, NODE_TYPE$b = react.__my_react_internal__.NODE_TYPE;
    var create$1 = function (fiber, hydrate, parentFiberWithDom, isSVG) {
        if (fiber.patch & PATCH_TYPE$a.__pendingCreate__) {
            var re = false;
            validDomNesting(fiber);
            if (hydrate) {
                var result = hydrateCreate(fiber, parentFiberWithDom);
                if (!result)
                    nativeCreate(fiber, isSVG);
                re = result;
            }
            else {
                nativeCreate(fiber, isSVG);
            }
            var scope = fiber.root.scope;
            if (scope.isHydrateRender) {
                var element = fiber.node.element;
                var typedDom = element;
                typedDom.__hydrate__ = true;
                if (enableAllCheck.current && fiber.type & NODE_TYPE$b.__isPlainNode__) {
                    if (!re) {
                        typedDom.setAttribute("debug_hydrate", "fail");
                    }
                    else {
                        typedDom.setAttribute("debug_hydrate", "success");
                    }
                }
            }
            if (fiber.patch & PATCH_TYPE$a.__pendingCreate__)
                fiber.patch ^= PATCH_TYPE$a.__pendingCreate__;
            return re;
        }
        return hydrate;
    };

    var layoutEffect = function (fiber) {
        var globalDispatch = fiber.root.dispatch;
        var layoutEffectMap = globalDispatch.layoutEffectMap;
        var allLayoutEffect = layoutEffectMap[fiber.uid] || [];
        layoutEffectMap[fiber.uid] = [];
        allLayoutEffect.forEach(function (layoutEffect) { return layoutEffect.call(null); });
    };
    var effect = function (fiber) {
        var globalDispatch = fiber.root.dispatch;
        var effectMap = globalDispatch.effectMap;
        var allEffect = effectMap[fiber.uid] || [];
        effectMap[fiber.uid] = [];
        allEffect.forEach(function (effect) { return effect.call(null); });
    };

    var NODE_TYPE$a = react.__my_react_internal__.NODE_TYPE;
    var fallback = function (fiber) {
        var scope = fiber.root.scope;
        if (scope.isHydrateRender && fiber.type & NODE_TYPE$a.__isPlainNode__) {
            var dom = fiber.node.element;
            var children = Array.from(dom.childNodes);
            children.forEach(function (node) {
                var typedNode = node;
                if (typedNode.nodeType !== document.COMMENT_NODE && !typedNode.__hydrate__)
                    node.remove();
                delete typedNode["__hydrate__"];
            });
        }
    };

    var PATCH_TYPE$9 = react.__my_react_internal__.PATCH_TYPE, NODE_TYPE$9 = react.__my_react_internal__.NODE_TYPE;
    var append$1 = function (fiber, parentFiberWithDom) {
        if (!fiber)
            throw new Error("position error, look like a bug");
        if (fiber.patch & PATCH_TYPE$9.__pendingAppend__)
            fiber.patch ^= PATCH_TYPE$9.__pendingAppend__;
        if (fiber.patch & PATCH_TYPE$9.__pendingPosition__)
            fiber.patch ^= PATCH_TYPE$9.__pendingPosition__;
        if (fiber.type & NODE_TYPE$9.__isPortal__)
            return;
        if (fiber.type & (NODE_TYPE$9.__isPlainNode__ | NODE_TYPE$9.__isTextNode__)) {
            var appended_1 = false;
            var action_1 = function () {
                var parentDOM = parentFiberWithDom.node.element;
                var childDOM = (fiber.node || {}).element;
                if (!appended_1 && childDOM) {
                    appended_1 = true;
                    parentDOM.appendChild(childDOM);
                }
                return Promise.resolve(appended_1);
            };
            action_1().then(function (s) { return !s && action_1(); });
            return;
        }
        var child = fiber.child;
        while (child) {
            append$1(child, parentFiberWithDom);
            child = child.sibling;
        }
    };

    var NODE_TYPE$8 = react.__my_react_internal__.NODE_TYPE;
    var getFiberWithDom = function (fiber, transform) {
        if (transform === void 0) { transform = function (f) { return f.parent; }; }
        if (!fiber)
            return null;
        if (fiber.type & NODE_TYPE$8.__isPortal__)
            return null;
        if (fiber.type & (NODE_TYPE$8.__isPlainNode__ | NODE_TYPE$8.__isTextNode__))
            return fiber;
        var nextFibers = transform(fiber);
        if (Array.isArray(nextFibers)) {
            return nextFibers.reduce(function (p, c) {
                if (p)
                    return p;
                p = getFiberWithDom(c, transform);
                return p;
            }, null);
        }
        else {
            return getFiberWithDom(nextFibers, transform);
        }
    };

    var getInsertBeforeDomFromSibling = function (fiber) {
        if (!fiber)
            return null;
        var sibling = fiber.sibling;
        if (sibling) {
            return getFiberWithDom(sibling, function (f) { return f.children; }) || getInsertBeforeDomFromSibling(sibling);
        }
        else {
            return null;
        }
    };
    var getInsertBeforeDomFromSiblingAndParent = function (fiber, parentFiber) {
        if (!fiber)
            return null;
        if (fiber === parentFiber)
            return null;
        var beforeDom = getInsertBeforeDomFromSibling(fiber);
        if (beforeDom)
            return beforeDom;
        return getInsertBeforeDomFromSiblingAndParent(fiber.parent, parentFiber);
    };

    var PATCH_TYPE$8 = react.__my_react_internal__.PATCH_TYPE, NODE_TYPE$7 = react.__my_react_internal__.NODE_TYPE;
    var insertBefore = function (fiber, beforeFiberWithDom, parentFiberWithDom) {
        if (!fiber)
            throw new Error("position error, look like a bug");
        if (fiber.patch & PATCH_TYPE$8.__pendingAppend__)
            fiber.patch ^= PATCH_TYPE$8.__pendingAppend__;
        if (fiber.patch & PATCH_TYPE$8.__pendingPosition__)
            fiber.patch ^= PATCH_TYPE$8.__pendingPosition__;
        if (fiber.type & NODE_TYPE$7.__isPortal__)
            return;
        if (fiber.type & (NODE_TYPE$7.__isPlainNode__ | NODE_TYPE$7.__isTextNode__)) {
            var inserted_1 = false;
            var action_1 = function () {
                var parentDOM = (parentFiberWithDom.node || {}).element;
                var beforeDOM = (beforeFiberWithDom.node || {}).element;
                var childDOM = (fiber.node || {}).element;
                if (!inserted_1 && beforeDOM && childDOM) {
                    inserted_1 = true;
                    parentDOM.insertBefore(childDOM, beforeDOM);
                }
                return Promise.resolve(inserted_1);
            };
            action_1().then(function (s) { return !s && action_1(); });
            return;
        }
        var child = fiber.child;
        while (child) {
            insertBefore(child, beforeFiberWithDom, parentFiberWithDom);
            child = child.sibling;
        }
    };

    var PATCH_TYPE$7 = react.__my_react_internal__.PATCH_TYPE;
    var position = function (fiber) {
        if (fiber.patch & PATCH_TYPE$7.__pendingPosition__) {
            var parentFiberWithDom = getFiberWithDom$1(fiber.parent, function (f) { return f.parent; });
            if (!parentFiberWithDom.node)
                throw new Error("position error, dom not exist");
            var beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithDom);
            if (beforeFiberWithDom) {
                insertBefore(fiber, beforeFiberWithDom, parentFiberWithDom);
            }
            else {
                append$1(fiber, parentFiberWithDom);
            }
            if (fiber.patch & PATCH_TYPE$7.__pendingPosition__)
                fiber.patch ^= PATCH_TYPE$7.__pendingPosition__;
        }
    };

    var getNativeEventName = function (eventName, tagName, props) {
        var isCapture = false;
        var nativeName = eventName;
        if (eventName.endsWith("Capture")) {
            isCapture = true;
            nativeName = eventName.split("Capture")[0];
        }
        if (nativeName === "DoubleClick") {
            nativeName = "dblclick";
        }
        else if (nativeName === "Change") {
            if (tagName === "input") {
                if (props.type === "radio" || props.type === "checkbox") {
                    nativeName = "click";
                }
                else {
                    nativeName = "input";
                }
            }
            else {
                nativeName = "change";
            }
        }
        else {
            nativeName = nativeName.toLowerCase();
        }
        return { nativeName: nativeName, isCapture: isCapture };
    };

    var safeCallWithFiber$2 = react.__my_react_shared__.safeCallWithFiber;
    var controlElementTag = {
        input: true,
        // textarea: true,
        // select: true,
    };
    var addEventListener = function (fiber, node, key) {
        var _a;
        var globalDispatch = fiber.root.dispatch;
        var typedElement = fiber.element;
        var pendingProps = fiber.pendingProps;
        var callback = pendingProps[key];
        var dom = node.element;
        var _b = getNativeEventName(key.slice(2), typedElement.type, typedElement.props), nativeName = _b.nativeName, isCapture = _b.isCapture;
        if (enableEventSystem.current) {
            var eventMap = globalDispatch.eventMap;
            var eventState = eventMap[fiber.uid] || {};
            var eventName = "".concat(nativeName, "_").concat(isCapture);
            if (eventState[eventName]) {
                (_a = eventState[eventName].cb) === null || _a === void 0 ? void 0 : _a.push(callback);
            }
            else {
                var handler_1 = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var e = args[0];
                    e.nativeEvent = e;
                    safeCallWithFiber$2({
                        action: function () { var _a; return (_a = handler_1.cb) === null || _a === void 0 ? void 0 : _a.forEach(function (cb) { return typeof cb === "function" && cb.call.apply(cb, __spreadArray$1([null], args, false)); }); },
                        fiber: fiber,
                    });
                    if (enableControlComponent.current) {
                        if (controlElementTag[typedElement.type] && typeof typedElement.props["value"] !== "undefined") {
                            dom["value"] = typedElement.props["value"];
                        }
                    }
                };
                handler_1.cb = [callback];
                eventState[eventName] = handler_1;
                dom.addEventListener(nativeName, handler_1, isCapture);
            }
            eventMap[fiber.uid] = eventState;
            {
                var typedFiber = fiber;
                typedFiber._debugEventMap = eventState;
            }
        }
        else {
            dom.addEventListener(nativeName, callback, isCapture);
        }
    };

    var removeEventListener = function (fiber, node, key) {
        var _a;
        var globalDispatch = fiber.root.dispatch;
        var typedElement = fiber.element;
        var currentProps = node.memoizedProps || {};
        var dom = node.element;
        var callback = currentProps[key];
        var _b = getNativeEventName(key.slice(2), typedElement.type, currentProps), nativeName = _b.nativeName, isCapture = _b.isCapture;
        if (enableEventSystem.current) {
            var eventMap = globalDispatch.eventMap;
            var eventState = eventMap[fiber.uid];
            var eventName = "".concat(nativeName, "_").concat(isCapture);
            if (!eventState[eventName])
                return;
            eventState[eventName].cb = (_a = eventState[eventName].cb) === null || _a === void 0 ? void 0 : _a.filter(function (c) { return c !== callback || typeof c !== "function"; });
        }
        else {
            dom.removeEventListener(nativeName, callback, isCapture);
        }
    };

    var log = react.__my_react_shared__.log;
    var NODE_TYPE$6 = react.__my_react_internal__.NODE_TYPE, PATCH_TYPE$6 = react.__my_react_internal__.PATCH_TYPE;
    var domPropsHydrate = function (fiber, node, isSVG) {
        if (fiber.type & NODE_TYPE$6.__isTextNode__) {
            var dom = node.element;
            if (dom.textContent !== String(fiber.element)) {
                if (dom.textContent === " " && fiber.element === "") {
                    dom.textContent = "";
                }
                else {
                    log({
                        fiber: fiber,
                        message: "hydrate warning, text not match from server. server: ".concat(dom.textContent, ", client: ").concat(fiber.element),
                    });
                    dom.textContent = fiber.element;
                }
            }
        }
        else if (fiber.type & NODE_TYPE$6.__isPlainNode__) {
            var dom_1 = node.element;
            var props_1 = fiber.pendingProps;
            Object.keys(props_1)
                .filter(isProperty)
                .forEach(function (key) {
                var _a;
                if (props_1[key] !== null && props_1[key] !== false && props_1[key] !== undefined) {
                    if (key === "className") {
                        if (isSVG) {
                            var v = (_a = dom_1.getAttribute("class")) === null || _a === void 0 ? void 0 : _a.toString();
                            if (v !== String(props_1[key])) {
                                log({
                                    fiber: fiber,
                                    message: "hydrate warning, dom ".concat(key, " not match from server. server: ").concat(v, ", client: ").concat(props_1[key]),
                                });
                                dom_1.setAttribute("class", props_1[key]);
                            }
                        }
                        else {
                            if (dom_1[key].toString() !== String(props_1[key])) {
                                log({
                                    fiber: fiber,
                                    message: "hydrate warning, dom ".concat(key, " not match from server. server: ").concat(dom_1[key], ", client: ").concat(props_1[key]),
                                });
                                dom_1[key] == props_1[key];
                            }
                        }
                    }
                    else {
                        if (key in dom_1 && !isSVG) {
                            if (dom_1[key].toString() !== String(props_1[key])) {
                                log({
                                    fiber: fiber,
                                    message: "hydrate warning, dom ".concat(key, " props not match from server. server: ").concat(dom_1[key], ", client: ").concat(props_1[key]),
                                });
                                dom_1[key] = props_1[key];
                            }
                        }
                        else {
                            var v = dom_1.getAttribute(key);
                            if ((v === null || v === void 0 ? void 0 : v.toString()) !== String(props_1[key])) {
                                log({
                                    fiber: fiber,
                                    message: "hydrate warning, dom ".concat(v, " attr not match from server. server: ").concat(v, ", client: ").concat(props_1[key]),
                                });
                                dom_1.setAttribute(key, props_1[key]);
                            }
                        }
                    }
                }
            });
        }
    };
    var domStyleHydrate = function (fiber, node) {
        if (fiber.type & NODE_TYPE$6.__isPlainNode__) {
            var dom_2 = node.element;
            var props_2 = fiber.pendingProps;
            Object.keys(props_2)
                .filter(isStyle)
                .forEach(function (styleKey) {
                var typedProps = props_2[styleKey] || {};
                Object.keys(typedProps).forEach(function (styleName) {
                    if (Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedProps[styleName] === "number") {
                        dom_2[styleKey][styleName] = "".concat(typedProps[styleName], "px");
                        return;
                    }
                    if (typedProps[styleName] !== null && typedProps[styleName] !== undefined) {
                        dom_2[styleKey][styleName] = typedProps[styleName];
                    }
                });
            });
        }
    };
    var domEventHydrate = function (fiber, node) {
        if (fiber.type & NODE_TYPE$6.__isPlainNode__) {
            var props = fiber.pendingProps;
            Object.keys(props)
                .filter(isEvent)
                .forEach(function (key) {
                addEventListener(fiber, node, key);
            });
        }
    };
    var hydrateUpdate = function (fiber, isSVG) {
        var node = fiber.node;
        // for now it is necessary to judge
        if (node) {
            domPropsHydrate(fiber, node, isSVG);
            domStyleHydrate(fiber, node);
            domEventHydrate(fiber, node);
            {
                debugWithDOM(fiber);
            }
        }
        fiber.patch = PATCH_TYPE$6.__initial__;
    };

    var NODE_TYPE$5 = react.__my_react_internal__.NODE_TYPE;
    var HighLight = /** @class */ (function () {
        function HighLight() {
            var _this = this;
            this.map = [];
            this.container = null;
            this.range = document.createRange();
            this.__pendingUpdate__ = [];
            this.createHighLight = function () {
                var _a;
                var element = document.createElement("div");
                (_a = _this.container) === null || _a === void 0 ? void 0 : _a.append(element);
                return element;
            };
            this.getHighLight = function () {
                if (_this.map.length > 0) {
                    return _this.map.shift();
                }
                return _this.createHighLight();
            };
            this.highLight = function (fiber) {
                if (fiber.node) {
                    var typedDom = fiber.node.element;
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
                        var _a, _b;
                        var wrapperDom = _this.getHighLight();
                        allWrapper.push(wrapperDom);
                        f.type & NODE_TYPE$5.__isTextNode__
                            ? _this.range.selectNodeContents(f.node.element)
                            : _this.range.selectNode(f.node.element);
                        var rect = _this.range.getBoundingClientRect();
                        var left = rect.left + (((_a = document.scrollingElement) === null || _a === void 0 ? void 0 : _a.scrollLeft) || 0);
                        var top = rect.top + (((_b = document.scrollingElement) === null || _b === void 0 ? void 0 : _b.scrollTop) || 0);
                        var width = rect.width + 4;
                        var height = rect.height + 4;
                        var positionLeft = left - 2;
                        var positionTop = top - 2;
                        wrapperDom.style.cssText = "\n          position: absolute;\n          width: ".concat(width, "px;\n          height: ").concat(height, "px;\n          left: ").concat(positionLeft, "px;\n          top: ").concat(positionTop, "px;\n          pointer-events: none;\n          box-shadow: 0.0625rem 0.0625rem 0.0625rem red, -0.0625rem -0.0625rem 0.0625rem red;\n          ");
                    });
                    setTimeout(function () {
                        allWrapper.forEach(function (wrapperDom) {
                            wrapperDom.style.boxShadow = "none";
                            _this.map.push(wrapperDom);
                        });
                        allFiber.forEach(function (f) { return (f.node.element.__pendingHighLight__ = false); });
                    }, 100);
                });
            };
            this.container = document.createElement("div");
            this.container.setAttribute("debug_highlight", "MyReact");
            this.container.style.cssText = "\n      position: absolute;\n      z-index: 999999;\n      width: 100%;\n      left: 0;\n      top: 0;\n      pointer-events: none;\n      ";
            document.body.append(this.container);
        }
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
        return HighLight;
    }());

    var NODE_TYPE$4 = react.__my_react_internal__.NODE_TYPE;
    var nativeUpdate = function (fiber, isSVG) {
        if (!fiber.node)
            throw new Error("update error, dom not exist");
        var scope = fiber.root.scope;
        var node = fiber.node;
        if (fiber.type & NODE_TYPE$4.__isTextNode__) {
            var typedDom = node.element;
            typedDom.textContent = fiber.element;
        }
        else {
            var dom_1 = node.element;
            var oldProps_1 = node.memoizedProps || {};
            var newProps_1 = fiber.pendingProps || {};
            Object.keys(oldProps_1)
                .filter(isEvent)
                .filter(function (key) { return isGone(newProps_1)(key) || isNew(oldProps_1, newProps_1)(key); })
                .forEach(function (key) { return removeEventListener(fiber, node, key); });
            Object.keys(oldProps_1)
                .filter(isProperty)
                .filter(isGone(newProps_1))
                .forEach(function (key) {
                if (key === "className") {
                    if (isSVG) {
                        dom_1.removeAttribute("class");
                    }
                    else {
                        dom_1[key] = "";
                    }
                }
                else {
                    if (key in dom_1 && !isSVG) {
                        dom_1[key] = "";
                    }
                    else {
                        dom_1.removeAttribute(key);
                    }
                }
            });
            Object.keys(oldProps_1)
                .filter(isStyle)
                .forEach(function (styleKey) {
                Object.keys(oldProps_1[styleKey] || {})
                    .filter(isGone(newProps_1[styleKey] || {}))
                    .forEach(function (styleName) {
                    dom_1.style[styleName] = "";
                });
            });
            Object.keys(newProps_1)
                .filter(isEvent)
                .filter(isNew(oldProps_1, newProps_1))
                .forEach(function (key) { return addEventListener(fiber, node, key); });
            Object.keys(newProps_1)
                .filter(isProperty)
                .filter(isNew(oldProps_1, newProps_1))
                .forEach(function (key) {
                if (key === "className") {
                    if (isSVG) {
                        dom_1.setAttribute("class", newProps_1[key] || "");
                    }
                    else {
                        dom_1[key] = newProps_1[key] || "";
                    }
                }
                else {
                    if (key in dom_1 && !isSVG) {
                        if (newProps_1[key] !== null && newProps_1[key] !== false && newProps_1[key] !== undefined) {
                            dom_1[key] = newProps_1[key];
                        }
                        else {
                            dom_1[key] = "";
                        }
                    }
                    else {
                        if (newProps_1[key] !== null && newProps_1[key] !== false && newProps_1[key] !== undefined) {
                            dom_1.setAttribute(key, String(newProps_1[key]));
                        }
                        else {
                            dom_1.removeAttribute(key);
                        }
                    }
                    if ((key === "autofocus" || key === "autoFocus") && newProps_1[key]) {
                        Promise.resolve().then(function () { return dom_1.focus(); });
                    }
                }
            });
            Object.keys(newProps_1)
                .filter(isStyle)
                .forEach(function (styleKey) {
                var typedNewProps = newProps_1[styleKey];
                var typedOldProps = oldProps_1[styleKey];
                Object.keys(typedNewProps || {})
                    .filter(isNew(typedOldProps || {}, typedNewProps))
                    .forEach(function (styleName) {
                    if (!Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedNewProps[styleName] === "number") {
                        dom_1[styleKey][styleName] = "".concat(typedNewProps[styleName], "px");
                        return;
                    }
                    if (typedNewProps[styleName] !== null && typedNewProps[styleName] !== undefined) {
                        dom_1[styleKey][styleName] = typedNewProps[styleName];
                    }
                    else {
                        dom_1[styleKey][styleName] = "";
                    }
                });
            });
            if (newProps_1["dangerouslySetInnerHTML"] && newProps_1["dangerouslySetInnerHTML"] !== oldProps_1["dangerouslySetInnerHTML"]) {
                var typedProps = newProps_1["dangerouslySetInnerHTML"];
                dom_1.innerHTML = typedProps.__html;
            }
        }
        {
            debugWithDOM(fiber);
        }
        if (scope.isAppMounted && !scope.isHydrateRender && !scope.isServerRender && (enableHighlight.current || window.__highlight__)) {
            HighLight.getHighLightInstance().highLight(fiber);
        }
    };

    var PATCH_TYPE$5 = react.__my_react_internal__.PATCH_TYPE;
    var update$1 = function (fiber, hydrate, isSVG) {
        if (fiber.patch & PATCH_TYPE$5.__pendingUpdate__) {
            if (hydrate) {
                hydrateUpdate(fiber, isSVG);
            }
            else {
                nativeUpdate(fiber, isSVG);
            }
            var typedNode = fiber.node;
            typedNode.memoizedProps = fiber.pendingProps;
            if (fiber.patch & PATCH_TYPE$5.__pendingUpdate__)
                fiber.patch ^= PATCH_TYPE$5.__pendingUpdate__;
        }
    };

    var safeCallWithFiber$1 = react.__my_react_shared__.safeCallWithFiber, enableStrictLifeCycle = react.__my_react_shared__.enableStrictLifeCycle;
    var PATCH_TYPE$4 = react.__my_react_internal__.PATCH_TYPE, NODE_TYPE$3 = react.__my_react_internal__.NODE_TYPE;
    var ClientDispatch = /** @class */ (function () {
        function ClientDispatch() {
            this.strictMap = {};
            this.effectMap = {};
            this.layoutEffectMap = {};
            this.suspenseMap = {};
            this.elementTypeMap = {};
            this.contextMap = {};
            this.unmountMap = {};
            this.eventMap = {};
        }
        ClientDispatch.prototype.trigger = function (_fiber) {
            triggerUpdate(_fiber);
        };
        ClientDispatch.prototype.resolveLazy = function () {
            return true;
        };
        ClientDispatch.prototype.resolveRef = function (_fiber) {
            setRef(_fiber);
        };
        ClientDispatch.prototype.resolveHook = function (_fiber, _hookParams) {
            return processHookNode(_fiber, _hookParams);
        };
        ClientDispatch.prototype.resolveStrictMap = function (_fiber) {
            generateStrictMap(_fiber, this.strictMap);
        };
        ClientDispatch.prototype.resolveStrictValue = function (_fiber) {
            return this.strictMap[_fiber.uid] && enableStrictLifeCycle.current;
        };
        ClientDispatch.prototype.resolveSuspenseMap = function (_fiber) {
            generateSuspenseMap(_fiber, this.suspenseMap);
        };
        ClientDispatch.prototype.resolveSuspenseElement = function (_fiber) {
            return react.cloneElement(this.suspenseMap[_fiber.uid]);
        };
        ClientDispatch.prototype.resolveContextMap = function (_fiber) {
            defaultGenerateContextMap(_fiber, this.contextMap);
        };
        ClientDispatch.prototype.resolveContextFiber = function (_fiber, _contextObject) {
            if (_contextObject) {
                var contextMap = defaultGetContextMapFromMap(_fiber.parent, this.contextMap);
                return contextMap[_contextObject.id] || null;
            }
            else {
                return null;
            }
        };
        ClientDispatch.prototype.resolveContextValue = function (_fiber, _contextObject) {
            return defaultGetContextValue(_fiber, _contextObject);
        };
        ClientDispatch.prototype.resolveComponentQueue = function (_fiber) {
            processComponentUpdateQueue(_fiber);
        };
        ClientDispatch.prototype.resolveHookQueue = function (_fiber) {
            processHookUpdateQueue(_fiber);
        };
        ClientDispatch.prototype.beginProgressList = function (_scope) {
            var _a;
            if ((_a = _scope.updateFiberList) === null || _a === void 0 ? void 0 : _a.length) {
                _scope.updateFiberListArray.push(_scope.updateFiberList);
            }
            _scope.updateFiberList = new LinkTreeList();
        };
        ClientDispatch.prototype.endProgressList = function (_scope) {
            var _a;
            if ((_a = _scope.updateFiberList) === null || _a === void 0 ? void 0 : _a.length) {
                _scope.updateFiberListArray.push(_scope.updateFiberList);
            }
            _scope.updateFiberList = null;
        };
        ClientDispatch.prototype.generateUpdateList = function (_fiber, _scope) {
            var _a, _b, _c;
            if (_fiber) {
                _scope.updateFiberList = _scope.updateFiberList || new LinkTreeList();
                if (_fiber.patch & PATCH_TYPE$4.__pendingCreate__ ||
                    _fiber.patch & PATCH_TYPE$4.__pendingUpdate__ ||
                    _fiber.patch & PATCH_TYPE$4.__pendingAppend__ ||
                    _fiber.patch & PATCH_TYPE$4.__pendingContext__ ||
                    _fiber.patch & PATCH_TYPE$4.__pendingPosition__) {
                    _scope.updateFiberList.append(_fiber, _fiber.fiberIndex);
                }
                else if (((_a = this.effectMap[_fiber.uid]) === null || _a === void 0 ? void 0 : _a.length) || ((_b = this.unmountMap[_fiber.uid]) === null || _b === void 0 ? void 0 : _b.length) || ((_c = this.layoutEffectMap[_fiber.uid]) === null || _c === void 0 ? void 0 : _c.length)) {
                    _scope.updateFiberList.append(_fiber, _fiber.fiberIndex);
                }
            }
        };
        ClientDispatch.prototype.reconcileCommit = function (_fiber, _hydrate, _parentFiberWithDom) {
            var _isSVG = isSVG(_fiber, this.elementTypeMap);
            var _result = safeCallWithFiber$1({
                fiber: _fiber,
                action: function () { return create$1(_fiber, _hydrate, _parentFiberWithDom, _isSVG); },
            });
            safeCallWithFiber$1({
                fiber: _fiber,
                action: function () { return update$1(_fiber, _result, _isSVG); },
            });
            safeCallWithFiber$1({
                fiber: _fiber,
                action: function () { return append$2(_fiber, _parentFiberWithDom); },
            });
            var _final = _hydrate;
            if (_fiber.child) {
                _final = this.reconcileCommit(_fiber.child, _result, _fiber.node ? _fiber : _parentFiberWithDom);
                fallback(_fiber);
            }
            safeCallWithFiber$1({ fiber: _fiber, action: function () { return layoutEffect(_fiber); } });
            Promise.resolve().then(function () { return safeCallWithFiber$1({ fiber: _fiber, action: function () { return effect(_fiber); } }); });
            if (_fiber.sibling) {
                this.reconcileCommit(_fiber.sibling, _fiber.node ? _result : _final, _parentFiberWithDom);
            }
            if (_fiber.node) {
                return _result;
            }
            else {
                return _final;
            }
        };
        ClientDispatch.prototype.reconcileUpdate = function (_list) {
            var _this = this;
            if (enableFastLoop.current) {
                _list.listToHead(function (_fiber) {
                    if (_fiber.mount) {
                        safeCallWithFiber$1({
                            fiber: _fiber,
                            action: function () { return position(_fiber); },
                        });
                    }
                });
                _list.listToFoot(function (_fiber) {
                    if (_fiber.mount) {
                        var _isSVG_1 = isSVG(_fiber, _this.elementTypeMap);
                        safeCallWithFiber$1({
                            fiber: _fiber,
                            action: function () { return create$1(_fiber, false, _fiber, _isSVG_1); },
                        });
                        safeCallWithFiber$1({
                            fiber: _fiber,
                            action: function () { return update$1(_fiber, false, _isSVG_1); },
                        });
                        safeCallWithFiber$1({
                            fiber: _fiber,
                            action: function () { return unmount(_fiber); },
                        });
                        safeCallWithFiber$1({ fiber: _fiber, action: function () { return context(_fiber); } });
                        safeCallWithFiber$1({
                            fiber: _fiber,
                            action: function () { return append$2(_fiber); },
                        });
                    }
                });
            }
            else {
                _list.listToFoot(function (_fiber) {
                    if (_fiber.mount) {
                        var _isSVG_2 = isSVG(_fiber, _this.elementTypeMap);
                        safeCallWithFiber$1({
                            fiber: _fiber,
                            action: function () { return create$1(_fiber, false, _fiber, _isSVG_2); },
                        });
                        safeCallWithFiber$1({
                            fiber: _fiber,
                            action: function () { return update$1(_fiber, false, _isSVG_2); },
                        });
                        safeCallWithFiber$1({
                            fiber: _fiber,
                            action: function () { return unmount(_fiber); },
                        });
                        safeCallWithFiber$1({ fiber: _fiber, action: function () { return context(_fiber); } });
                    }
                });
                _list.listToHead(function (_fiber) {
                    if (_fiber.mount) {
                        safeCallWithFiber$1({
                            fiber: _fiber,
                            action: function () { return position(_fiber); },
                        });
                    }
                });
                _list.listToFoot(function (_fiber) {
                    if (_fiber.mount) {
                        safeCallWithFiber$1({
                            fiber: _fiber,
                            action: function () { return append$2(_fiber); },
                        });
                    }
                });
            }
            _list.reconcile(function (_fiber) {
                if (_fiber.mount) {
                    safeCallWithFiber$1({
                        fiber: _fiber,
                        action: function () { return layoutEffect(_fiber); },
                    });
                    Promise.resolve().then(function () { return safeCallWithFiber$1({ fiber: _fiber, action: function () { return effect(_fiber); } }); });
                }
            });
        };
        ClientDispatch.prototype.pendingCreate = function (_fiber) {
            if (_fiber.type & (NODE_TYPE$3.__isTextNode__ | NODE_TYPE$3.__isPlainNode__ | NODE_TYPE$3.__isPortal__)) {
                _fiber.patch |= PATCH_TYPE$4.__pendingCreate__;
            }
        };
        ClientDispatch.prototype.pendingUpdate = function (_fiber) {
            if (_fiber.type & (NODE_TYPE$3.__isTextNode__ | NODE_TYPE$3.__isPlainNode__)) {
                _fiber.patch |= PATCH_TYPE$4.__pendingUpdate__;
            }
        };
        ClientDispatch.prototype.pendingAppend = function (_fiber) {
            if (_fiber.type & (NODE_TYPE$3.__isTextNode__ | NODE_TYPE$3.__isPlainNode__)) {
                _fiber.patch |= PATCH_TYPE$4.__pendingAppend__;
            }
        };
        ClientDispatch.prototype.pendingContext = function (_fiber) {
            _fiber.patch |= PATCH_TYPE$4.__pendingContext__;
        };
        ClientDispatch.prototype.pendingPosition = function (_fiber) {
            _fiber.patch |= PATCH_TYPE$4.__pendingPosition__;
        };
        ClientDispatch.prototype.pendingUnmount = function (_fiber, _pendingUnmount) {
            var exist = this.unmountMap[_fiber.uid] || [];
            this.unmountMap[_fiber.uid] = __spreadArray$1(__spreadArray$1([], exist, true), [_pendingUnmount], false);
        };
        ClientDispatch.prototype.pendingLayoutEffect = function (_fiber, _layoutEffect) {
            var exist = this.layoutEffectMap[_fiber.uid] || [];
            this.layoutEffectMap[_fiber.uid] = __spreadArray$1(__spreadArray$1([], exist, true), [_layoutEffect], false);
        };
        ClientDispatch.prototype.pendingEffect = function (_fiber, _effect) {
            var exist = this.effectMap[_fiber.uid] || [];
            this.effectMap[_fiber.uid] = __spreadArray$1(__spreadArray$1([], exist, true), [_effect], false);
        };
        ClientDispatch.prototype.removeFiber = function (_fiber) {
            delete this.eventMap[_fiber.uid];
            delete this.strictMap[_fiber.uid];
            delete this.effectMap[_fiber.uid];
            delete this.contextMap[_fiber.uid];
            delete this.unmountMap[_fiber.uid];
            delete this.suspenseMap[_fiber.uid];
            delete this.elementTypeMap[_fiber.uid];
            delete this.layoutEffectMap[_fiber.uid];
        };
        return ClientDispatch;
    }());

    var MyReactFiberNodeClass = react.__my_react_internal__.MyReactFiberNode, MyReactFiberNodeRoot$2 = react.__my_react_internal__.MyReactFiberNodeRoot;
    var initialFiberNode$2 = react.__my_react_shared__.initialFiberNode;
    var render = function (element, container) {
        var _a;
        var containerFiber = container.__fiber__;
        if (containerFiber instanceof MyReactFiberNodeClass) {
            containerFiber.root.scope.isAppCrash = false;
            if (containerFiber.checkIsSameType(element)) {
                containerFiber.installElement(element);
                containerFiber.update();
                return;
            }
            else {
                unmountComponentAtNode(container);
            }
        }
        var globalDispatch = new ClientDispatch();
        var globalScope = new DomScope();
        Array.from(container.children).forEach(function (n) { var _a; return (_a = n.remove) === null || _a === void 0 ? void 0 : _a.call(n); });
        var fiber = new MyReactFiberNodeRoot$2(0, null, element);
        fiber.node = createDomNode(container);
        fiber.scope = globalScope;
        fiber.dispatch = globalDispatch;
        globalScope.rootFiber = fiber;
        globalScope.rootContainer = container;
        (_a = container.setAttribute) === null || _a === void 0 ? void 0 : _a.call(container, "render", "MyReact");
        container.__fiber__ = fiber;
        container.__scope__ = globalScope;
        container.__dispatch__ = globalDispatch;
        initialFiberNode$2(fiber);
        startRender(fiber);
    };

    var MyReactFiberNodeRoot$1 = react.__my_react_internal__.MyReactFiberNodeRoot;
    var initialFiberNode$1 = react.__my_react_shared__.initialFiberNode;
    var hydrate = function (element, container) {
        var _a;
        var globalDispatch = new ClientDispatch();
        var globalScope = new DomScope();
        globalScope.isHydrateRender = true;
        var fiber = new MyReactFiberNodeRoot$1(0, null, element);
        fiber.node = createDomNode(container);
        fiber.scope = globalScope;
        fiber.dispatch = globalDispatch;
        globalScope.rootFiber = fiber;
        globalScope.rootContainer = container;
        (_a = container.setAttribute) === null || _a === void 0 ? void 0 : _a.call(container, "hydrate", "MyReact");
        container.__fiber__ = fiber;
        container.__scope__ = globalScope;
        container.__dispatch__ = globalDispatch;
        initialFiberNode$1(fiber);
        startRender(fiber, true);
        globalScope.isHydrateRender = false;
    };

    var PATCH_TYPE$3 = react.__my_react_internal__.PATCH_TYPE;
    var append = function (fiber, parentFiberWithDom) {
        if (fiber.patch & PATCH_TYPE$3.__pendingAppend__) {
            if (!fiber.node || !parentFiberWithDom.node)
                throw new Error("append error");
            var parentDom = parentFiberWithDom.node;
            var currentDom = fiber.node;
            if (currentDom)
                parentDom.appendChild(currentDom);
            if (fiber.patch & PATCH_TYPE$3.__pendingAppend__)
                fiber.patch ^= PATCH_TYPE$3.__pendingAppend__;
        }
    };

    var TextElement = /** @class */ (function () {
        function TextElement(content) {
            this.content = "";
            this.content = content === "" ? " " : content;
        }
        TextElement.prototype.toString = function () {
            return this.content.toString();
        };
        return TextElement;
    }());

    var PlainElement = /** @class */ (function () {
        function PlainElement(type) {
            this.className = null;
            // attrs
            this.style = {};
            this.attrs = {};
            this.children = [];
            this.type = type;
        }
        PlainElement.prototype.addEventListener = function () {
        };
        PlainElement.prototype.removeEventListener = function () {
        };
        PlainElement.prototype.removeAttribute = function (key) {
            delete this.attrs[key];
        };
        PlainElement.prototype.setAttribute = function (key, value) {
            if (value !== false && value !== null && value !== undefined) {
                this.attrs[key] = value.toString();
            }
        };
        /**
         *
         * @param {Element} dom
         */
        PlainElement.prototype.append = function () {
            var _this = this;
            var dom = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                dom[_i] = arguments[_i];
            }
            dom.forEach(function (d) { return _this.appendChild(d); });
        };
        PlainElement.prototype.appendChild = function (dom) {
            if (Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, this.type))
                return;
            if (dom instanceof PlainElement || dom instanceof TextElement || typeof dom === "string") {
                this.children.push(dom);
                return dom;
            }
            else {
                throw new Error("element instance error");
            }
        };
        PlainElement.prototype.serializeStyle = function () {
            var _this = this;
            var styleKeys = Object.keys(this.style).filter(function (key) { return _this.style[key] !== null && _this.style[key] !== undefined; });
            if (styleKeys.length) {
                return "style=\"".concat(styleKeys.map(function (key) { var _a; return "".concat(key, ": ").concat((_a = _this.style[key]) === null || _a === void 0 ? void 0 : _a.toString(), ";"); }).reduce(function (p, c) { return p + c; }, ""), "\"");
            }
            return "";
        };
        PlainElement.prototype.serializeAttrs = function () {
            var _this = this;
            var attrsKeys = Object.keys(this.attrs);
            if (attrsKeys.length) {
                return attrsKeys.map(function (key) { var _a; return "".concat(key, "='").concat((_a = _this.attrs[key]) === null || _a === void 0 ? void 0 : _a.toString(), "'"); }).reduce(function (p, c) { return "".concat(p, " ").concat(c); }, "");
            }
            else {
                return "";
            }
        };
        PlainElement.prototype.serializeProps = function () {
            var props = "";
            if (this.className !== undefined && this.className !== null) {
                props += " class=\"".concat(this.className, "\"");
            }
            return props;
        };
        PlainElement.prototype.serialize = function () {
            return "".concat(this.serializeProps(), " ").concat(this.serializeStyle(), " ").concat(this.serializeAttrs());
        };
        PlainElement.prototype.toString = function () {
            if (Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, this.type)) {
                return "<".concat(this.type, " ").concat(this.serialize(), " />");
            }
            else {
                if (this.type) {
                    return "<".concat(this.type, " ").concat(this.serialize(), " >").concat(this.children
                        .reduce(function (p, c) {
                        if (p.length && c instanceof TextElement && p[p.length - 1] instanceof TextElement) {
                            p.push("<!-- -->");
                            p.push(c);
                        }
                        else {
                            p.push(c);
                        }
                        return p;
                    }, [])
                        .map(function (dom) { return dom.toString(); })
                        .reduce(function (p, c) { return p + c; }, ""), "</").concat(this.type, ">");
                }
                else {
                    return this.children
                        .reduce(function (p, c) {
                        if (p.length && c instanceof TextElement && p[p.length - 1] instanceof TextElement) {
                            p.push("<!-- -->");
                            p.push(c);
                        }
                        else {
                            p.push(c);
                        }
                        return p;
                    }, [])
                        .map(function (dom) { return dom.toString(); })
                        .reduce(function (p, c) { return p + c; }, "");
                }
            }
        };
        return PlainElement;
    }());

    var PATCH_TYPE$2 = react.__my_react_internal__.PATCH_TYPE, NODE_TYPE$2 = react.__my_react_internal__.NODE_TYPE;
    var create = function (fiber) {
        if (fiber.patch & PATCH_TYPE$2.__pendingCreate__) {
            if (fiber.type & NODE_TYPE$2.__isTextNode__) {
                fiber.node = new TextElement(fiber.element);
            }
            else if (fiber.type & NODE_TYPE$2.__isPlainNode__) {
                var typedElement = fiber.element;
                fiber.node = new PlainElement(typedElement.type);
            }
            else {
                throw new Error("createPortal() can not call on the server");
            }
            if (fiber.patch & PATCH_TYPE$2.__pendingCreate__)
                fiber.patch ^= PATCH_TYPE$2.__pendingCreate__;
        }
    };

    var PATCH_TYPE$1 = react.__my_react_internal__.PATCH_TYPE, NODE_TYPE$1 = react.__my_react_internal__.NODE_TYPE;
    var update = function (fiber) {
        if (fiber.patch & PATCH_TYPE$1.__pendingUpdate__) {
            if (fiber.type & NODE_TYPE$1.__isPlainNode__) {
                var dom_1 = fiber.node;
                var props_1 = fiber.pendingProps || {};
                Object.keys(props_1)
                    .filter(isProperty)
                    .forEach(function (key) {
                    if (key === "className") {
                        dom_1[key] = props_1[key];
                    }
                    else {
                        dom_1.setAttribute(key, props_1[key]);
                    }
                });
                Object.keys(props_1)
                    .filter(isStyle)
                    .forEach(function (styleKey) {
                    var typedProps = props_1[styleKey] || {};
                    Object.keys(typedProps).forEach(function (styleName) {
                        if (!Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedProps[styleName] === "number") {
                            dom_1[styleKey][styleName] = "".concat(typedProps[styleName], "px");
                            return;
                        }
                        dom_1[styleKey][styleName] = typedProps[styleName];
                    });
                });
                if (props_1["dangerouslySetInnerHTML"]) {
                    var typedProps = props_1["dangerouslySetInnerHTML"];
                    dom_1.append(new TextElement(typedProps.__html));
                }
            }
            if (fiber.patch & PATCH_TYPE$1.__pendingUpdate__)
                fiber.patch ^= PATCH_TYPE$1.__pendingUpdate__;
        }
    };

    var safeCallWithFiber = react.__my_react_shared__.safeCallWithFiber;
    var NODE_TYPE = react.__my_react_internal__.NODE_TYPE, PATCH_TYPE = react.__my_react_internal__.PATCH_TYPE;
    var ServerDispatch = /** @class */ (function () {
        function ServerDispatch() {
            this.effectMap = {};
            this.strictMap = {};
            this.layoutEffectMap = {};
            this.suspenseMap = {};
            this.elementTypeMap = {};
            this.contextMap = {};
            this.unmountMap = {};
            this.eventMap = {};
        }
        ServerDispatch.prototype.trigger = function (_fiber) {
        };
        ServerDispatch.prototype.resolveLazy = function () {
            return false;
        };
        ServerDispatch.prototype.resolveRef = function (_fiber) {
        };
        ServerDispatch.prototype.resolveStrictMap = function (_fiber) {
        };
        ServerDispatch.prototype.resolveStrictValue = function (_fiber) {
            return false;
        };
        ServerDispatch.prototype.resolveHook = function (_fiber, _hookParams) {
            return processHookNode(_fiber, _hookParams);
        };
        ServerDispatch.prototype.resolveSuspenseMap = function (_fiber) {
            generateSuspenseMap(_fiber, this.suspenseMap);
        };
        ServerDispatch.prototype.resolveSuspenseElement = function (_fiber) {
            return react.cloneElement(this.suspenseMap[_fiber.uid]);
        };
        ServerDispatch.prototype.resolveContextMap = function (_fiber) {
            defaultGenerateContextMap(_fiber, this.contextMap);
        };
        ServerDispatch.prototype.resolveContextFiber = function (_fiber, _contextObject) {
            if (_contextObject) {
                var contextMap = defaultGetContextMapFromMap(_fiber.parent, this.contextMap);
                return contextMap[_contextObject.id] || null;
            }
            else {
                return null;
            }
        };
        ServerDispatch.prototype.resolveContextValue = function (_fiber, _contextObject) {
            return defaultGetContextValue(_fiber, _contextObject);
        };
        ServerDispatch.prototype.resolveComponentQueue = function (_fiber) {
        };
        ServerDispatch.prototype.resolveHookQueue = function (_fiber) {
        };
        ServerDispatch.prototype.reconcileCommit = function (_fiber, _hydrate, _parentFiberWithDom) {
            safeCallWithFiber({ fiber: _fiber, action: function () { return create(_fiber); } });
            safeCallWithFiber({ fiber: _fiber, action: function () { return update(_fiber); } });
            safeCallWithFiber({
                fiber: _fiber,
                action: function () { return append(_fiber, _parentFiberWithDom); },
            });
            if (_fiber.child) {
                this.reconcileCommit(_fiber.child, _hydrate, _fiber.node ? _fiber : _parentFiberWithDom);
            }
            if (_fiber.sibling) {
                this.reconcileCommit(_fiber.sibling, _hydrate, _parentFiberWithDom);
            }
            return true;
        };
        ServerDispatch.prototype.reconcileUpdate = function (_list) {
        };
        ServerDispatch.prototype.beginProgressList = function () {
        };
        ServerDispatch.prototype.endProgressList = function () {
        };
        ServerDispatch.prototype.generateUpdateList = function (_fiber) {
        };
        ServerDispatch.prototype.pendingCreate = function (_fiber) {
            if (_fiber.type & NODE_TYPE.__isPortal__) {
                throw new Error("should not use portal element on the server");
            }
            if (_fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__)) {
                _fiber.patch |= PATCH_TYPE.__pendingCreate__;
            }
        };
        ServerDispatch.prototype.pendingUpdate = function (_fiber) {
            if (_fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__)) {
                _fiber.patch |= PATCH_TYPE.__pendingUpdate__;
            }
        };
        ServerDispatch.prototype.pendingAppend = function (_fiber) {
            if (_fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__)) {
                _fiber.patch |= PATCH_TYPE.__pendingAppend__;
            }
        };
        ServerDispatch.prototype.pendingContext = function (_fiber) {
        };
        ServerDispatch.prototype.pendingPosition = function (_fiber) {
        };
        ServerDispatch.prototype.pendingUnmount = function (_fiber, _pendingUnmount) {
        };
        ServerDispatch.prototype.pendingLayoutEffect = function (_fiber, _layoutEffect) {
        };
        ServerDispatch.prototype.pendingEffect = function (_fiber, _effect) {
        };
        ServerDispatch.prototype.removeFiber = function (_fiber) {
        };
        return ServerDispatch;
    }());

    var MyReactFiberNodeRoot = react.__my_react_internal__.MyReactFiberNodeRoot;
    var initialFiberNode = react.__my_react_shared__.initialFiberNode;
    var renderToString = function (element) {
        var globalDispatch = new ServerDispatch();
        var globalScope = new DomScope();
        globalScope.isServerRender = true;
        var container = new PlainElement("");
        var fiber = new MyReactFiberNodeRoot(0, null, element);
        fiber.node = container;
        fiber.scope = globalScope;
        fiber.dispatch = globalDispatch;
        globalScope.rootFiber = fiber;
        globalScope.rootContainer = container;
        initialFiberNode(fiber);
        startRender(fiber, false);
        globalScope.isServerRender = false;
        return container.toString();
    };

    var safeCall = react.__my_react_shared__.safeCall;
    var version = "0.0.1";
    var unstable_batchedUpdates = safeCall;
    var ReactDOM = {
        render: render,
        hydrate: hydrate,
        findDOMNode: findDOMNode,
        createPortal: createPortal,
        renderToString: renderToString,
        unmountComponentAtNode: unmountComponentAtNode,
    };

    exports.createPortal = createPortal;
    exports["default"] = ReactDOM;
    exports.findDOMNode = findDOMNode;
    exports.hydrate = hydrate;
    exports.render = render;
    exports.renderToString = renderToString;
    exports.unmountComponentAtNode = unmountComponentAtNode;
    exports.unstable_batchedUpdates = unstable_batchedUpdates;
    exports.version = version;

}));
//# sourceMappingURL=index.development.js.map
