export var debugWithDOM = function (fiber) {
    if (fiber.dom) {
        var debugDOM = fiber.dom;
        debugDOM["__fiber__"] = fiber;
        debugDOM["__element__"] = fiber.element;
        debugDOM["__children__"] = fiber.children;
    }
};
//# sourceMappingURL=debug.js.map