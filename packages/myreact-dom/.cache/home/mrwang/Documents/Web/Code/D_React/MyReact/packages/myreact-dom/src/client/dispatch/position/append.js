export var append = function (fiber, parentDOM) {
    if (!fiber)
        throw new Error("position error, look like a bug");
    fiber.__pendingAppend__ = false;
    fiber.__pendingPosition__ = false;
    if (fiber.__isPortal__)
        return;
    if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
        parentDOM.appendChild(fiber.dom);
        return;
    }
    var child = fiber.child;
    while (child) {
        append(child, parentDOM);
        child = child.sibling;
    }
};
//# sourceMappingURL=append.js.map