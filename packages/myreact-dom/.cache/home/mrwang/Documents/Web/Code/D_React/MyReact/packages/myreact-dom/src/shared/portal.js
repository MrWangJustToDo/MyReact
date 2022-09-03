import { createElement, Portal } from "@my-react/react";
export var createPortal = function (element, container) {
    var _a;
    return createElement((_a = {}, _a["$$typeof"] = Portal, _a), { container: container }, element);
};
//# sourceMappingURL=portal.js.map