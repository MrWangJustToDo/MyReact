export var getFiberWithDom = function (fiber, transform) {
    if (fiber) {
        if (fiber.dom)
            return fiber;
        return getFiberWithDom(transform(fiber), transform);
    }
    return null;
};
//# sourceMappingURL=getFiberWithDom.js.map