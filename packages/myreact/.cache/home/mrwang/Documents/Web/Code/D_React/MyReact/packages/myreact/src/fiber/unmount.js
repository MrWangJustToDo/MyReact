export var unmountFiber = function (fiber) {
    fiber.children.forEach(unmountFiber);
    fiber.unmount();
};
//# sourceMappingURL=unmount.js.map