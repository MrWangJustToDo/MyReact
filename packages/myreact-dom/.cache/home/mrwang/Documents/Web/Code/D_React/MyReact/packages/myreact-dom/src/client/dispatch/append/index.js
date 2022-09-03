import { IS_SINGLE_ELEMENT } from "@ReactDOM_shared";
export var append = function (fiber, parentFiberWithDom) {
    if (fiber.__pendingAppend__) {
        if (!fiber.dom || !parentFiberWithDom.dom)
            throw new Error("append error, dom not exist");
        var parentDom = parentFiberWithDom.dom;
        if (!Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, parentDom.tagName.toLowerCase())) {
            parentDom.appendChild(fiber.dom);
        }
        fiber.__pendingAppend__ = false;
    }
};
//# sourceMappingURL=index.js.map