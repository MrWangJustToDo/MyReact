export var clearFiberDom = function (fiber) {
    var _a;
    if (fiber.dom) {
        if (!fiber.__isPortal__ && !fiber.__root__) {
            (_a = fiber.dom) === null || _a === void 0 ? void 0 : _a.remove();
        }
        else {
            fiber.children.forEach(clearFiberDom);
        }
    }
    else {
        fiber.children.forEach(clearFiberDom);
    }
};
//# sourceMappingURL=clearFiberDom.js.map