export var nativeCreate = function (fiber) {
    if (fiber.__isTextNode__) {
        fiber.dom = document.createTextNode(fiber.element);
    }
    else if (fiber.__isPlainNode__) {
        var typedElement = fiber.element;
        if (fiber.nameSpace) {
            fiber.dom = document.createElementNS(fiber.nameSpace, typedElement.type);
        }
        else {
            fiber.dom = document.createElement(typedElement.type);
        }
    }
    else {
        fiber.dom = fiber.__props__.container;
    }
};
//# sourceMappingURL=nativeCreate.js.map