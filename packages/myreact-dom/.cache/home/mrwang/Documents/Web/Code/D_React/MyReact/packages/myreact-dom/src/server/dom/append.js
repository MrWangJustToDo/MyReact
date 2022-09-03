export var append = function (fiber, parentFiberWithDom) {
    if (fiber.__pendingAppend__) {
        if (!fiber.dom || !parentFiberWithDom.dom)
            throw new Error("append error");
        var parentDom = parentFiberWithDom.dom;
        if (fiber.dom) {
            parentDom.appendChild(fiber.dom);
        }
        fiber.__pendingAppend__ = false;
    }
};
//# sourceMappingURL=append.js.map