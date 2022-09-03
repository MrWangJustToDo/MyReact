import { isProperty, isStyle, IS_UNIT_LESS_NUMBER } from "@ReactDOM_shared";
export var update = function (fiber) {
    if (fiber.__pendingUpdate__) {
        if (fiber.__isPlainNode__) {
            var dom_1 = fiber.dom;
            var props_1 = fiber.__props__ || {};
            Object.keys(props_1)
                .filter(isProperty)
                .forEach(function (key) {
                if (key === "className") {
                    dom_1[key] = props_1[key];
                }
                else {
                    dom_1.setAttribute(key, props_1[key]);
                }
            });
            Object.keys(props_1)
                .filter(isStyle)
                .forEach(function (styleKey) {
                var typedProps = props_1[styleKey] || {};
                Object.keys(typedProps).forEach(function (styleName) {
                    if (!Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) &&
                        typeof typedProps[styleName] === "number") {
                        dom_1[styleKey][styleName] = "".concat(typedProps[styleName], "px");
                        return;
                    }
                    dom_1[styleKey][styleName] = typedProps[styleName];
                });
            });
            if (props_1["dangerouslySetInnerHTML"]) {
                var typedProps = props_1["dangerouslySetInnerHTML"];
                dom_1.append(typedProps.__html);
            }
        }
        fiber.__pendingUpdate__ = false;
    }
};
//# sourceMappingURL=update.js.map