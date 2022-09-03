import { __myreact_shared__ } from "@my-react/react";
import { IS_SINGLE_ELEMENT } from "@ReactDOM_shared";
var log = __myreact_shared__.log;
var getNextHydrateDom = function (parentDom) {
    var children = Array.from(parentDom.childNodes);
    return children.find(function (dom) { return dom.nodeType !== document.COMMENT_NODE && !dom.__hydrate__; });
};
var checkHydrateDom = function (fiber, dom) {
    if (!dom) {
        log({
            fiber: fiber,
            level: "error",
            message: "hydrate error, dom not render from server",
        });
        return false;
    }
    if (fiber.__isTextNode__) {
        if (dom.nodeType !== Node.TEXT_NODE) {
            log({
                fiber: fiber,
                level: "error",
                message: "hydrate error, dom not match from server. server: ".concat(dom.nodeName.toLowerCase(), ", client: ").concat(fiber.element),
            });
            return false;
        }
        return true;
    }
    if (fiber.__isPlainNode__) {
        var typedElement = fiber.element;
        if (dom.nodeType !== Node.ELEMENT_NODE) {
            log({
                fiber: fiber,
                level: "error",
                message: "hydrate error, dom not match from server. server: ".concat(dom.nodeName.toLowerCase(), ", client: ").concat(typedElement.type.toString()),
            });
            return false;
        }
        if (typedElement.type.toString() !== dom.nodeName.toLowerCase()) {
            log({
                fiber: fiber,
                level: "error",
                message: "hydrate error, dom not match from server. server: ".concat(dom.nodeName.toLowerCase(), ", client: ").concat(typedElement.type.toString()),
            });
            return false;
        }
        return true;
    }
    throw new Error("hydrate error, look like a bug");
};
export var getHydrateDom = function (fiber, parentDom) {
    if (IS_SINGLE_ELEMENT[parentDom.tagName.toLowerCase()])
        return { result: true };
    var dom = getNextHydrateDom(parentDom);
    var result = checkHydrateDom(fiber, dom);
    if (result) {
        var typedDom = dom;
        fiber.dom = typedDom;
        return { dom: typedDom, result: result };
    }
    else {
        return { dom: dom, result: result };
    }
};
//# sourceMappingURL=getHydrateDom.js.map