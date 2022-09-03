export var getContextFiber = function (fiber, ContextObject) {
    if (ContextObject && fiber) {
        var id = ContextObject.id;
        var contextFiber = fiber.__contextMap__[id];
        return contextFiber;
    }
    return null;
};
export var getContextValue = function (fiber, ContextObject) {
    var contextValue = (fiber ? fiber.__props__.value : ContextObject === null || ContextObject === void 0 ? void 0 : ContextObject.Provider.value);
    return contextValue;
};
//# sourceMappingURL=context.js.map