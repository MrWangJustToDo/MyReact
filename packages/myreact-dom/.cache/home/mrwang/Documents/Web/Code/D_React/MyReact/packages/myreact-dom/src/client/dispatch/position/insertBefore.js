export var insertBefore = function (fiber, beforeDOM, parentDOM) {
    if (!fiber)
        throw new Error("position error, look like a bug");
    fiber.__pendingAppend__ = false;
    fiber.__pendingPosition__ = false;
    if (fiber.__isPortal__)
        return;
    if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
        parentDOM.insertBefore(fiber.dom, beforeDOM);
        return;
    }
    var child = fiber.child;
    while (child) {
        insertBefore(child, beforeDOM, parentDOM);
        child = child.sibling;
    }
    // fiber.children.forEach((f) => insertBefore(f, beforeDOM, parentDOM));
};
//# sourceMappingURL=insertBefore.js.map