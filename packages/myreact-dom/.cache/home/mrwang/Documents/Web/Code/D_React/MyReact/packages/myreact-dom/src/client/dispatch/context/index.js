export var context = function (fiber) {
    if (fiber.__pendingContext__) {
        var allListeners_1 = fiber.__dependence__.slice(0);
        Promise.resolve().then(function () {
            allListeners_1.map(function (f) { return f.__fiber__; }).forEach(function (f) { return (f === null || f === void 0 ? void 0 : f.mount) && f.update(); });
        });
        fiber.__pendingContext__ = false;
    }
};
//# sourceMappingURL=index.js.map