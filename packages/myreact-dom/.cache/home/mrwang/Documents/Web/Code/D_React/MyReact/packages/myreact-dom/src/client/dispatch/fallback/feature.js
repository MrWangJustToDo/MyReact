import { isHydrateRender } from "@ReactDOM_shared";
export var fallback = function (fiber) {
    if (isHydrateRender.current && fiber.__isPlainNode__) {
        var dom = fiber.dom;
        var children = Array.from(dom.childNodes);
        children.forEach(function (node) {
            var typedNode = node;
            if (typedNode.nodeType !== document.COMMENT_NODE && !typedNode.__hydrate__) {
                node.remove();
            }
            delete typedNode["__hydrate__"];
        });
    }
};
//# sourceMappingURL=feature.js.map