import { __rest } from "tslib";
/* eslint-disable prefer-rest-params */
import { currentFunctionFiber, My_React_Element } from "../share";
import { checkArrayChildrenKey, checkSingleChildrenKey, isValidElement } from "./tool";
var MyReactVDom = /** @class */ (function () {
    function MyReactVDom(type, key, ref, props, _self, _source, _owner) {
        this.type = type;
        this.key = key;
        this.ref = ref;
        this.props = props;
        this._self = _self;
        this._source = _source;
        this._owner = _owner;
        this["$$typeof"] = My_React_Element;
        this._store = {};
    }
    return MyReactVDom;
}());
export { MyReactVDom };
var createVDom = function (_a) {
    var _b;
    var type = _a.type, key = _a.key, ref = _a.ref, props = _a.props, _self = _a._self, _source = _a._source, _owner = _a._owner;
    return _b = {},
        _b["$$typeof"] = My_React_Element,
        _b.type = type,
        _b.key = key,
        _b.ref = ref,
        _b.props = props,
        _b._owner = _owner,
        _b._self = _self,
        _b._source = _source,
        _b._store = {},
        _b;
};
export function createElement(type, config, children) {
    var key = null;
    var ref = null;
    var self = null;
    var source = null;
    var props = {};
    if (config !== null && config !== undefined) {
        var _ref = config.ref, _key = config.key, __self = config.__self, __source = config.__source, resProps_1 = __rest(config, ["ref", "key", "__self", "__source"]);
        ref = _ref === undefined ? null : _ref;
        key = _key === undefined ? null : _key + "";
        self = __self === undefined ? null : __self;
        source = __source === undefined ? null : __source;
        Object.keys(resProps_1).forEach(function (key) { return (props[key] = resProps_1[key]); });
    }
    if (typeof type === "function" || typeof type === "object") {
        var typedType_1 = type;
        Object.keys((typedType_1 === null || typedType_1 === void 0 ? void 0 : typedType_1.defaultProps) || {}).forEach(function (key) {
            var _a;
            props[key] = props[key] === undefined ? (_a = typedType_1.defaultProps) === null || _a === void 0 ? void 0 : _a[key] : props[key];
        });
    }
    var childrenLength = arguments.length - 2;
    if (childrenLength > 1) {
        children = Array.from(arguments).slice(2);
        checkArrayChildrenKey(children);
        props.children = children;
    }
    else if (childrenLength === 1) {
        checkSingleChildrenKey(children);
        props.children = children;
    }
    return createVDom({
        type: type,
        key: key,
        ref: ref,
        props: props,
        _self: self,
        _source: source,
        _owner: currentFunctionFiber.current,
    });
}
export function cloneElement(element, config, children) {
    if (isValidElement(element)) {
        var props = Object.assign({}, element.props);
        var key = element.key;
        var ref = element.ref;
        var type = element.type;
        var self_1 = element._self;
        var source = element._source;
        var owner = element._owner;
        if (config !== null && config !== undefined) {
            var _ref = config.ref, _key = config.key, __self = config.__self, __source = config.__source, resProps = __rest(config, ["ref", "key", "__self", "__source"]);
            if (_ref !== undefined) {
                ref = _ref;
                owner = currentFunctionFiber.current;
            }
            if (_key !== undefined) {
                key = _key + "";
            }
            var defaultProps = {};
            if (typeof element.type === "function" || typeof element.type === "object") {
                var typedType = element.type;
                defaultProps = typedType === null || typedType === void 0 ? void 0 : typedType.defaultProps;
            }
            for (var key_1 in resProps) {
                if (Object.prototype.hasOwnProperty.call(resProps, key_1)) {
                    if (resProps[key_1] === undefined && defaultProps) {
                        props[key_1] = defaultProps[key_1];
                    }
                    else {
                        props[key_1] = resProps[key_1];
                    }
                }
            }
        }
        var childrenLength = arguments.length - 2;
        if (childrenLength > 1) {
            children = Array.from(arguments).slice(2);
            checkArrayChildrenKey(children);
            props.children = children;
        }
        else if (childrenLength === 1) {
            checkSingleChildrenKey(children);
            props.children = children;
        }
        var clonedElement = createVDom({
            type: type,
            key: key,
            ref: ref,
            props: props,
            _self: self_1,
            _source: source,
            _owner: owner,
        });
        clonedElement._store["clonedEle"] = true;
        return clonedElement;
    }
    else {
        throw new Error("cloneElement() need valid element as args");
    }
}
//# sourceMappingURL=instance.js.map