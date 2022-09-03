import { __myreact_shared__, __myreact_internal__ } from "@my-react/react";
import { nextWorkCommon } from "../generate/invoke";
import { processComponentUpdateQueue } from "../queue";
var globalDispatch = __myreact_internal__.globalDispatch;
var getContextFiber = __myreact_shared__.getContextFiber, getContextValue = __myreact_shared__.getContextValue;
var processComponentStateFromProps = function (fiber) {
    var typedElement = fiber.element;
    var Component = fiber.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
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
var processComponentFiberOnUpdate = function (fiber) {
    var typedInstance = fiber.instance;
    typedInstance.setFiber(fiber);
};
var processComponentRenderOnMountAndUpdate = function (fiber) {
    var typedInstance = fiber.instance;
    var children = typedInstance.render();
    fiber.__dynamicChildren__ = children;
    return nextWorkCommon(fiber);
};
var processComponentDidMountOnMount = function (fiber) {
    var typedInstance = fiber.instance;
    if (typedInstance.componentDidMount && !typedInstance.__pendingEffect__) {
        typedInstance.__pendingEffect__ = true;
        globalDispatch.current.pendingLayoutEffect(fiber, function () {
            var _a;
            typedInstance.__pendingEffect__ = false;
            (_a = typedInstance.componentDidMount) === null || _a === void 0 ? void 0 : _a.call(typedInstance);
        });
    }
};
var processComponentContextOnUpdate = function (fiber) {
    var typedElement = fiber.element;
    var Component = fiber.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
    var typedInstance = fiber.instance;
    var typedComponent = Component;
    if (!(typedInstance === null || typedInstance === void 0 ? void 0 : typedInstance.__context__) || !typedInstance.__context__.mount) {
        var ProviderFiber = getContextFiber(fiber, typedComponent.contextType);
        var context = getContextValue(ProviderFiber, typedComponent.contextType);
        typedInstance === null || typedInstance === void 0 ? void 0 : typedInstance.setContext(ProviderFiber);
        return context;
    }
    else {
        var context = getContextValue(typedInstance.__context__, typedComponent.contextType);
        return context;
    }
};
var processComponentShouldUpdateOnUpdate = function (fiber, _a) {
    var nextState = _a.nextState, nextProps = _a.nextProps, nextContext = _a.nextContext;
    var typedInstance = fiber.instance;
    if (fiber.__needTrigger__)
        return true;
    if (typedInstance.shouldComponentUpdate) {
        return typedInstance.shouldComponentUpdate(nextProps, nextState, nextContext);
    }
    return true;
};
var processComponentDidUpdateOnUpdate = function (fiber, _a) {
    var baseState = _a.baseState, baseProps = _a.baseProps, baseContext = _a.baseContext, callback = _a.callback;
    var typedInstance = fiber.instance;
    var hasEffect = typedInstance.componentDidUpdate || callback.length;
    // TODO it is necessary to use __pendingEffect__ field ?
    if (hasEffect && !typedInstance.__pendingEffect__) {
        typedInstance.__pendingEffect__ = true;
        globalDispatch.current.pendingLayoutEffect(fiber, function () {
            var _a;
            typedInstance.__pendingEffect__ = false;
            callback.forEach(function (c) { return c.call(null); });
            (_a = typedInstance.componentDidUpdate) === null || _a === void 0 ? void 0 : _a.call(typedInstance, baseProps, baseState, baseContext);
        });
    }
};
export var classComponentMount = function (fiber) {
    processComponentInstanceOnMount(fiber);
    processComponentStateFromProps(fiber);
    var children = processComponentRenderOnMountAndUpdate(fiber);
    processComponentDidMountOnMount(fiber);
    return children;
};
export var classComponentUpdate = function (fiber) {
    processComponentFiberOnUpdate(fiber);
    processComponentStateFromProps(fiber);
    var _a = processComponentUpdateQueue(fiber), newState = _a.newState, isForce = _a.isForce, callback = _a.callback;
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
        return children;
    }
    else {
        return [];
    }
};
//# sourceMappingURL=component.js.map