import { __assign } from "tslib";
export var processComponentUpdateQueue = function (fiber) {
    var allComponentUpdater = fiber.__compUpdateQueue__.slice(0);
    fiber.__compUpdateQueue__ = [];
    var typedInstance = fiber.instance;
    var baseState = Object.assign({}, typedInstance.state);
    var baseProps = Object.assign({}, typedInstance.props);
    return allComponentUpdater.reduce(function (p, c) { return ({
        newState: __assign(__assign({}, p.newState), (typeof c.payLoad === "function" ? c.payLoad(baseState, baseProps) : c.payLoad)),
        isForce: p.isForce || c.isForce || false,
        callback: c.callback ? p.callback.concat(c.callback) : p.callback,
    }); }, { newState: __assign({}, baseState), isForce: false, callback: [] });
};
export var processHookUpdateQueue = function (fiber) {
    var allHookUpdater = fiber.__hookUpdateQueue__.slice(0);
    fiber.__hookUpdateQueue__ = [];
    allHookUpdater.forEach(function (_a) {
        var action = _a.action, trigger = _a.trigger;
        trigger.result = trigger.reducer(trigger.result, action);
    });
};
//# sourceMappingURL=queue.js.map