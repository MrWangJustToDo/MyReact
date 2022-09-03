import { MyReactInternalInstance } from "../internal";
import { My_React_Consumer, My_React_Context, My_React_ForwardRef, My_React_Lazy, My_React_Memo, My_React_Provider, } from "../share";
var contextId = 0;
export var createContext = function (value) {
    var _a, _b, _c;
    var ContextObject = (_a = {},
        _a["$$typeof"] = My_React_Context,
        _a.id = contextId++,
        _a.Provider = {},
        _a.Consumer = {},
        _a);
    var Provider = (_b = {},
        _b["$$typeof"] = My_React_Provider,
        _b.value = value,
        _b.Context = { id: 0 },
        _b);
    var Consumer = (_c = {},
        _c["$$typeof"] = My_React_Consumer,
        _c.Internal = MyReactInternalInstance,
        _c.Context = { id: 0 },
        _c);
    Object.defineProperty(Provider, "Context", {
        get: function () {
            return ContextObject;
        },
        enumerable: false,
        configurable: false,
    });
    Object.defineProperty(Consumer, "Context", {
        get: function () {
            return ContextObject;
        },
        enumerable: false,
        configurable: false,
    });
    ContextObject.Provider = Provider;
    ContextObject.Consumer = Consumer;
    return ContextObject;
};
export var forwardRef = function (render) {
    var _a;
    return _a = {},
        _a["$$typeof"] = My_React_ForwardRef,
        _a.render = render,
        _a;
};
export var memo = function (render) {
    var _a;
    return _a = {}, _a["$$typeof"] = My_React_Memo, _a.render = render, _a;
};
export var lazy = function (loader) {
    var _a;
    return _a = {},
        _a["$$typeof"] = My_React_Lazy,
        _a.loader = loader,
        _a._loading = false,
        _a._loaded = false,
        _a.render = null,
        _a;
};
//# sourceMappingURL=feature.js.map