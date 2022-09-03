import { __myreact_internal__ } from "@my-react/react";
var MyReactComponent = __myreact_internal__.MyReactComponent;
var findDOMFromFiber = function (fiber) {
    var currentArray = [fiber];
    while (currentArray.length) {
        var next = currentArray.shift();
        if (next === null || next === void 0 ? void 0 : next.dom)
            return next.dom;
        currentArray.push.apply(currentArray, ((next === null || next === void 0 ? void 0 : next.children) || []));
    }
    return null;
};
var findDOMFromComponentFiber = function (fiber) {
    if (fiber) {
        if (fiber.dom)
            return fiber.dom;
        for (var i = 0; i < fiber.children.length; i++) {
            var dom = findDOMFromFiber(fiber.children[i]);
            if (dom)
                return dom;
        }
    }
    return null;
};
export var findDOMNode = function (instance) {
    if (instance instanceof MyReactComponent && instance.__fiber__) {
        return findDOMFromComponentFiber(instance.__fiber__);
    }
    else {
        return null;
    }
};
//# sourceMappingURL=findDom.js.map