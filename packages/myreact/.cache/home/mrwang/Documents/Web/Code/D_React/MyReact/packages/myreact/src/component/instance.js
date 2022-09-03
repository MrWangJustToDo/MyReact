import { __extends } from "tslib";
import { MyReactInternalInstance } from "../internal";
import { isNormalEquals } from "../share";
var MyReactComponent = /** @class */ (function (_super) {
    __extends(MyReactComponent, _super);
    function MyReactComponent(props, context) {
        var _this = _super.call(this) || this;
        _this.state = null;
        _this.props = null;
        _this.context = null;
        _this.setState = function (payLoad, callback) {
            var _a;
            var updater = {
                type: "state",
                payLoad: payLoad,
                callback: callback,
                trigger: _this,
            };
            (_a = _this.__fiber__) === null || _a === void 0 ? void 0 : _a.__compUpdateQueue__.push(updater);
            Promise.resolve().then(function () {
                var _a;
                (_a = _this.__fiber__) === null || _a === void 0 ? void 0 : _a.update();
            });
        };
        _this.forceUpdate = function () {
            var _a;
            var updater = {
                type: "state",
                isForce: true,
                trigger: _this,
            };
            (_a = _this.__fiber__) === null || _a === void 0 ? void 0 : _a.__compUpdateQueue__.push(updater);
            Promise.resolve().then(function () {
                var _a;
                (_a = _this.__fiber__) === null || _a === void 0 ? void 0 : _a.update();
            });
        };
        _this.props = props || null;
        _this.context = context || null;
        return _this;
    }
    Object.defineProperty(MyReactComponent.prototype, "isReactComponent", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyReactComponent.prototype, "isMyReactComponent", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    MyReactComponent.prototype.unmount = function () {
        var _a;
        _super.prototype.unmount.call(this);
        var instance = this;
        (_a = instance.componentWillUnmount) === null || _a === void 0 ? void 0 : _a.call(instance);
    };
    return MyReactComponent;
}(MyReactInternalInstance));
export { MyReactComponent };
var MyReactPureComponent = /** @class */ (function (_super) {
    __extends(MyReactPureComponent, _super);
    function MyReactPureComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyReactPureComponent.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
        return (!isNormalEquals(nextProps, this.props) ||
            !isNormalEquals(nextState, this.state) ||
            !isNormalEquals(nextContext, this.context));
    };
    return MyReactPureComponent;
}(MyReactComponent));
export { MyReactPureComponent };
//# sourceMappingURL=instance.js.map