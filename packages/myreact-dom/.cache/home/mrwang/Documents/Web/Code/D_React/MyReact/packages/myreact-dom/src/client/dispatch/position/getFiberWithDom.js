export var getFiberWithDom = function (fiber, transform) {
    if (transform === void 0) { transform = function (f) { return f.parent; }; }
    if (!fiber)
        return null;
    if (fiber.__isPortal__)
        return null;
    if (fiber.dom)
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
//# sourceMappingURL=getFiberWithDom.js.map