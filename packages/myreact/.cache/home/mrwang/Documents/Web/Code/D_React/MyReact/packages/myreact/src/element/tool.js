import { log, once, My_React_Consumer, My_React_Element, My_React_ForwardRef, My_React_Fragment, My_React_Lazy, My_React_Memo, My_React_Portal, My_React_Provider, My_React_Strict, My_React_Suspense, } from "../share";
export function isValidElement(element) {
    return typeof element === "object" && !Array.isArray(element) && (element === null || element === void 0 ? void 0 : element.$$typeof) === My_React_Element;
}
export function getTypeFromVDom(element) {
    var _a;
    var nodeType = {};
    if (isValidElement(element)) {
        var rawType = element.type;
        if (typeof rawType === "object") {
            nodeType.__isObjectNode__ = true;
            var typedRawType = rawType;
            switch (typedRawType["$$typeof"]) {
                case My_React_Provider:
                    nodeType.__isContextProvider__ = true;
                    break;
                case My_React_Consumer:
                    nodeType.__isContextConsumer__ = true;
                    break;
                case My_React_Portal:
                    nodeType.__isPortal__ = true;
                    break;
                case My_React_Memo:
                    nodeType.__isMemo__ = true;
                    break;
                case My_React_ForwardRef:
                    nodeType.__isForwardRef__ = true;
                    break;
                case My_React_Lazy:
                    nodeType.__isLazy__ = true;
                    break;
                default:
                    throw new Error("invalid object element type ".concat(typedRawType["$$typeof"].toString()));
            }
        }
        else if (typeof rawType === "function") {
            nodeType.__isDynamicNode__ = true;
            if ((_a = rawType.prototype) === null || _a === void 0 ? void 0 : _a.isMyReactComponent) {
                nodeType.__isClassComponent__ = true;
            }
            else {
                nodeType.__isFunctionComponent__ = true;
            }
        }
        else if (typeof rawType === "symbol") {
            switch (rawType) {
                case My_React_Fragment:
                    nodeType.__isFragmentNode__ = true;
                    break;
                case My_React_Strict:
                    nodeType.__isStrictNode__ = true;
                    break;
                case My_React_Suspense:
                    nodeType.__isSuspense__ = true;
                    break;
                default:
                    throw new Error("invalid symbol element type ".concat(rawType.toString()));
            }
        }
        else if (typeof rawType === "string") {
            nodeType.__isPlainNode__ = true;
        }
        else {
            throw new Error("invalid element type ".concat(rawType));
        }
    }
    else {
        if (typeof element === "object" && element !== null) {
            nodeType.__isEmptyNode__ = true;
        }
        else if (element === null || element === undefined || element === false) {
            nodeType.__isNullNode__ = true;
        }
        else {
            nodeType.__isTextNode__ = true;
        }
    }
    return nodeType;
}
export var checkValidKey = function (children) {
    var obj = {};
    var onceWarnDuplicate = once(log);
    var onceWarnUndefined = once(log);
    children.forEach(function (c) {
        if (isValidElement(c) && !c._store["validKey"]) {
            if (typeof c.key === "string") {
                if (obj[c.key]) {
                    onceWarnDuplicate({ message: "array child have duplicate key" });
                }
                obj[c.key] = true;
            }
            else {
                onceWarnUndefined({
                    message: "each array child must have a unique key props",
                    triggerOnce: true,
                });
            }
            c._store["validKey"] = true;
        }
    });
};
export var checkArrayChildrenKey = function (children) {
    if (__DEV__) {
        children.forEach(function (child) {
            if (Array.isArray(child)) {
                checkValidKey(child);
            }
            else {
                if (isValidElement(child))
                    child._store["validKey"] = true;
            }
        });
    }
};
export var checkSingleChildrenKey = function (children) {
    if (__DEV__) {
        if (Array.isArray(children)) {
            checkValidKey(children);
        }
        else {
            if (isValidElement(children))
                children._store["validKey"] = true;
        }
    }
};
//# sourceMappingURL=tool.js.map