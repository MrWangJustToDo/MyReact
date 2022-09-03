import { getContextFiber, getContextValue, processComponentUpdateQueue } from "../fiber";
import { globalDispatch } from "../share";
const processComponentStateFromProps = (fiber) => {
    const typedElement = fiber.element;
    const Component = fiber.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
    const typedComponent = Component;
    const typedInstance = fiber.instance;
    const props = Object.assign({}, typedElement.props);
    const state = Object.assign({}, typedInstance.state);
    if (typeof typedComponent.getDerivedStateFromProps === "function") {
        const payloadState = typedComponent.getDerivedStateFromProps(props, state);
        if (payloadState) {
            typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
        }
    }
};
const processComponentInstanceOnMount = (fiber) => {
    const typedElement = fiber.element;
    const Component = fiber.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
    const typedComponent = Component;
    const ProviderFiber = getContextFiber(fiber, typedComponent.contextType);
    const context = getContextValue(ProviderFiber, typedComponent.contextType);
    const props = Object.assign({}, typedElement.props);
    const instance = new typedComponent(props, context);
    instance.props = props;
    instance.context = context;
    fiber.installInstance(instance);
    instance.setFiber(fiber);
    instance.setContext(ProviderFiber);
};
const processComponentFiberOnUpdate = (fiber) => {
    const typedInstance = fiber.instance;
    typedInstance.setFiber(fiber);
};
const processComponentRenderOnMountAndUpdate = (fiber) => {
    const typedInstance = fiber.instance;
    const children = typedInstance.render();
    fiber.__dynamicChildren__ = children;
    return children;
};
const processComponentDidMountOnMount = (fiber) => {
    const typedInstance = fiber.instance;
    if (typedInstance.componentDidMount && !typedInstance.__pendingEffect__) {
        typedInstance.__pendingEffect__ = true;
        globalDispatch.current.pendingLayoutEffect(fiber, () => {
            typedInstance.__pendingEffect__ = false;
            typedInstance.componentDidMount?.();
        });
    }
};
const processComponentContextOnUpdate = (fiber) => {
    const typedElement = fiber.element;
    const Component = fiber.__isDynamicNode__ ? typedElement.type : typedElement.type.render;
    const typedInstance = fiber.instance;
    const typedComponent = Component;
    if (!typedInstance?.__context__ || !typedInstance.__context__.mount) {
        const ProviderFiber = getContextFiber(fiber, typedComponent.contextType);
        const context = getContextValue(ProviderFiber, typedComponent.contextType);
        typedInstance?.setContext(ProviderFiber);
        return context;
    }
    else {
        const context = getContextValue(typedInstance.__context__, typedComponent.contextType);
        return context;
    }
};
const processComponentShouldUpdateOnUpdate = (fiber, { nextState, nextProps, nextContext }) => {
    const typedInstance = fiber.instance;
    if (fiber.__needTrigger__)
        return true;
    if (typedInstance.shouldComponentUpdate) {
        return typedInstance.shouldComponentUpdate(nextProps, nextState, nextContext);
    }
    return true;
};
const processComponentDidUpdateOnUpdate = (fiber, { baseState, baseProps, baseContext, callback, }) => {
    const typedInstance = fiber.instance;
    const hasEffect = typedInstance.componentDidUpdate || callback.length;
    // TODO it is necessary to use __pendingEffect__ field ?
    if (hasEffect && !typedInstance.__pendingEffect__) {
        typedInstance.__pendingEffect__ = true;
        globalDispatch.current.pendingLayoutEffect(fiber, () => {
            typedInstance.__pendingEffect__ = false;
            callback.forEach((c) => c.call(null));
            typedInstance.componentDidUpdate?.(baseProps, baseState, baseContext);
        });
    }
};
export const classComponentMount = (fiber) => {
    processComponentInstanceOnMount(fiber);
    processComponentStateFromProps(fiber);
    const children = processComponentRenderOnMountAndUpdate(fiber);
    processComponentDidMountOnMount(fiber);
    return children;
};
export const classComponentUpdate = (fiber) => {
    processComponentFiberOnUpdate(fiber);
    processComponentStateFromProps(fiber);
    const { newState, isForce, callback } = processComponentUpdateQueue(fiber);
    const typedInstance = fiber.instance;
    const baseState = typedInstance.state;
    const baseProps = typedInstance.props;
    const baseContext = typedInstance.context;
    const nextState = Object.assign({}, baseState, newState);
    const nextProps = Object.assign({}, fiber.__props__);
    const nextContext = processComponentContextOnUpdate(fiber);
    let shouldUpdate = isForce;
    if (!shouldUpdate) {
        shouldUpdate = processComponentShouldUpdateOnUpdate(fiber, {
            nextState,
            nextProps,
            nextContext,
        });
    }
    typedInstance.state = nextState;
    typedInstance.props = nextProps;
    typedInstance.context = nextContext;
    if (shouldUpdate) {
        const children = processComponentRenderOnMountAndUpdate(fiber);
        processComponentDidUpdateOnUpdate(fiber, {
            baseContext,
            baseProps,
            baseState,
            callback,
        });
        return children;
    }
    else {
        return [];
    }
};
//# sourceMappingURL=feature.js.map