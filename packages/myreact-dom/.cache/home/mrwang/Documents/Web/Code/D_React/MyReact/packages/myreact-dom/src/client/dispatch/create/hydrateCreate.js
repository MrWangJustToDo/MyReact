import { getHydrateDom } from "./getHydrateDom";
export var hydrateCreate = function (fiber, parentFiberWithDom) {
    if (fiber.__isTextNode__ || fiber.__isPlainNode__) {
        var result = getHydrateDom(fiber, parentFiberWithDom.dom).result;
        return result;
    }
    throw new Error("hydrate error, portal element can not hydrate");
};
//# sourceMappingURL=hydrateCreate.js.map