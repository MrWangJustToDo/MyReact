export var isNormalEquals = function (src, target, children) {
    if (children === void 0) { children = true; }
    if (typeof src === "object" && typeof target === "object" && src !== null && target !== null) {
        var srcKeys = Object.keys(src);
        var targetKeys = Object.keys(target);
        if (srcKeys.length !== targetKeys.length)
            return false;
        var res = true;
        for (var key in src) {
            if (key === "children") {
                if (children) {
                    res = res && Object.is(src[key], target[key]);
                }
                else {
                    continue;
                }
            }
            else {
                res = res && Object.is(src[key], target[key]);
            }
            if (!res)
                return res;
        }
        return res;
    }
    return Object.is(src, target);
};
export var isArrayEquals = function (src, target) {
    if (Array.isArray(src) && Array.isArray(target) && src.length === target.length) {
        var re = true;
        for (var key in src) {
            re = re && Object.is(src[key], target[key]);
            if (!re)
                return re;
        }
        return re;
    }
    return false;
};
//# sourceMappingURL=isEquals.js.map