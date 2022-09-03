import { getFiberWithDom } from "./getFiberWithDom";
var getInsertBeforeDomFromSibling = function (fiber) {
    if (!fiber)
        return null;
    var sibling = fiber.sibling;
    if (sibling) {
        return getFiberWithDom(sibling, function (f) { return f.children; }) || getInsertBeforeDomFromSibling(sibling);
    }
    else {
        return null;
    }
};
export var getInsertBeforeDomFromSiblingAndParent = function (fiber, parentFiber) {
    if (!fiber)
        return null;
    if (fiber === parentFiber)
        return null;
    var beforeDom = getInsertBeforeDomFromSibling(fiber);
    if (beforeDom)
        return beforeDom;
    return getInsertBeforeDomFromSiblingAndParent(fiber.parent, parentFiber);
};
//# sourceMappingURL=getInsertBeforeDom.js.map