import { append } from "./append";
import { getInsertBeforeDomFromSiblingAndParent } from "./getInsertBeforeDom";
import { insertBefore } from "./insertBefore";
export var position = function (fiber, parentFiberWithDom) {
    if (fiber.__pendingPosition__) {
        var beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithDom);
        if (beforeFiberWithDom) {
            insertBefore(fiber, beforeFiberWithDom.dom, parentFiberWithDom.dom);
        }
        else {
            append(fiber, parentFiberWithDom.dom);
        }
        fiber.__pendingPosition__ = false;
    }
};
//# sourceMappingURL=feature.js.map