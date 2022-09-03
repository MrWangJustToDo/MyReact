export var layoutEffect = function (fiber) {
    var allLayoutEffect = fiber.__layoutEffectQueue__.slice(0);
    allLayoutEffect.forEach(function (layoutEffect) { return layoutEffect.call(null); });
    fiber.__layoutEffectQueue__ = [];
};
export var effect = function (fiber) {
    var allEffect = fiber.__effectQueue__.slice(0);
    allEffect.forEach(function (effect) { return effect.call(null); });
    fiber.__effectQueue__ = [];
};
//# sourceMappingURL=feature.js.map