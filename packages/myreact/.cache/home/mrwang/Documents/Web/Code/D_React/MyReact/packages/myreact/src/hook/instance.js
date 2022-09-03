import { __extends } from "tslib";
import { getContextFiber, getContextValue } from "../fiber";
import { MyReactInternalInstance } from "../internal";
import { isArrayEquals } from "../share";
var MyReactHookNode = /** @class */ (function (_super) {
    __extends(MyReactHookNode, _super);
    function MyReactHookNode(hookIndex, hookType, value, reducer, deps) {
        var _this = _super.call(this) || this;
        _this.hookIndex = 0;
        _this.hookNext = null;
        _this.hookPrev = null;
        _this.hookType = null;
        _this.cancel = null;
        _this.effect = false;
        _this.value = null;
        _this.deps = [];
        _this.result = null;
        _this.dispatch = function (action) {
            var _a;
            var updater = {
                type: "hook",
                trigger: _this,
                action: action,
            };
            (_a = _this.__fiber__) === null || _a === void 0 ? void 0 : _a.__hookUpdateQueue__.push(updater);
            Promise.resolve().then(function () {
                var _a;
                (_a = _this.__fiber__) === null || _a === void 0 ? void 0 : _a.update();
            });
        };
        _this.deps = deps;
        _this.value = value;
        _this.reducer = reducer;
        _this.hookType = hookType;
        _this.hookIndex = hookIndex;
        return _this;
    }
    MyReactHookNode.prototype.initialResult = function () {
        if (this.hookType === "useMemo" || this.hookType === "useState" || this.hookType === "useReducer") {
            this.result = this.value.call(null);
            return;
        }
        if (this.hookType === "useEffect" ||
            this.hookType === "useLayoutEffect" ||
            this.hookType === "useImperativeHandle") {
            this.effect = true;
            return;
        }
        if (this.hookType === "useRef" || this.hookType === "useCallback") {
            this.result = this.value;
            return;
        }
        if (this.hookType === "useContext") {
            var ProviderFiber = getContextFiber(this.__fiber__, this.value);
            this.setContext(ProviderFiber);
            this.result = getContextValue(ProviderFiber, this.value);
            this.context = this.result;
            return;
        }
    };
    MyReactHookNode.prototype.updateResult = function (newValue, newReducer, newDeps) {
        if (this.hookType === "useMemo" ||
            this.hookType === "useEffect" ||
            this.hookType === "useCallback" ||
            this.hookType === "useLayoutEffect" ||
            this.hookType === "useImperativeHandle") {
            if (newDeps && !this.deps) {
                throw new Error("deps state change");
            }
            if (!newDeps && this.deps) {
                throw new Error("deps state change");
            }
        }
        if (this.hookType === "useEffect" ||
            this.hookType === "useLayoutEffect" ||
            this.hookType === "useImperativeHandle") {
            if (!newDeps) {
                this.value = newValue;
                this.reducer = newReducer || this.reducer;
                this.deps = newDeps;
                this.effect = true;
            }
            else if (!isArrayEquals(this.deps, newDeps)) {
                this.value = newValue;
                this.reducer = newReducer || this.reducer;
                this.deps = newDeps;
                this.effect = true;
            }
            return;
        }
        if (this.hookType === "useCallback") {
            if (!isArrayEquals(this.deps, newDeps)) {
                this.value = newValue;
                this.result = newValue;
                this.deps = newDeps;
            }
            return;
        }
        if (this.hookType === "useMemo") {
            if (!isArrayEquals(this.deps, newDeps)) {
                this.value = newValue;
                this.result = newValue.call(null);
                this.deps = newDeps;
            }
            return;
        }
        if (this.hookType === "useContext") {
            if (!this.__context__ || !this.__context__.mount || !Object.is(this.value, newValue)) {
                this.value = newValue;
                var ProviderFiber = getContextFiber(this.__fiber__, this.value);
                this.setContext(ProviderFiber);
                this.result = getContextValue(ProviderFiber, this.value);
                this.context = this.result;
            }
            else {
                this.result = getContextValue(this.__context__, this.value);
                this.context = this.result;
            }
            return;
        }
        if (this.hookType === "useReducer") {
            this.value = newValue;
            this.reducer = newReducer;
        }
    };
    MyReactHookNode.prototype.unmount = function () {
        var _a;
        if (this.hookType === "useEffect" || this.hookType === "useLayoutEffect") {
            this.effect = false;
            this.cancel && this.cancel();
            return;
        }
        if (this.hookType === "useContext") {
            (_a = this.__context__) === null || _a === void 0 ? void 0 : _a.removeDependence(this);
        }
    };
    return MyReactHookNode;
}(MyReactInternalInstance));
export { MyReactHookNode };
//# sourceMappingURL=instance.js.map