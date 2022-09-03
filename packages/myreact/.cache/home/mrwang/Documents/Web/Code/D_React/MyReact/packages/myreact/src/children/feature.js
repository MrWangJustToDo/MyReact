import { cloneElement, isValidElement } from "../element";
import { mapByJudge } from "./tool";
export var map = function (arrayLike, action) {
    return mapByJudge(arrayLike, function (v) { return v !== undefined && v !== null; }, action);
};
export var toArray = function (arrayLike) {
    return map(arrayLike, function (element, index) {
        return cloneElement(element, {
            key: (element === null || element === void 0 ? void 0 : element.key) !== undefined ? ".$".concat(element.key) : ".".concat(index),
        });
    });
};
export var forEach = function (arrayLike, action) {
    mapByJudge(arrayLike, function (v) { return v !== undefined && v !== null; }, action);
};
export var count = function (arrayLike) {
    if (Array.isArray(arrayLike)) {
        return arrayLike.reduce(function (p, c) { return p + count(c); }, 0);
    }
    return 1;
};
export var only = function (child) {
    if (isValidElement(child))
        return child;
    if (typeof child === "string" || typeof child === "number" || typeof child === "boolean")
        return true;
    throw new Error("Children.only() expected to receive a single MyReact element child.");
};
//# sourceMappingURL=feature.js.map