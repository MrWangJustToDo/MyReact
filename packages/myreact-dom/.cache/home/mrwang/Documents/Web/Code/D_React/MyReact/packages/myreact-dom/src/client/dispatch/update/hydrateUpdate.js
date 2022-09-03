import { __myreact_shared__ } from "@my-react/react";
import { debugWithDOM, isEvent, isProperty, isStyle, IS_UNIT_LESS_NUMBER } from "@ReactDOM_shared";
import { addEventListener } from "../event";
var log = __myreact_shared__.log;
var domPropsHydrate = function (fiber, dom) {
    if (fiber.__isTextNode__) {
        if (dom.textContent !== String(fiber.element)) {
            if (dom.textContent === " " && fiber.element === "") {
                dom.textContent = "";
            }
            else {
                log({
                    fiber: fiber,
                    message: "hydrate warning, text not match from server. server: ".concat(dom.textContent, ", client: ").concat(fiber.element),
                });
                dom.textContent = fiber.element;
            }
        }
    }
    else if (fiber.__isPlainNode__) {
        var typedElement = fiber.element;
        var props_1 = typedElement.props;
        Object.keys(props_1)
            .filter(isProperty)
            .forEach(function (key) {
            var _a;
            if (props_1[key] !== null && props_1[key] !== false && props_1[key] !== undefined) {
                if (key === "className") {
                    if (fiber.nameSpace) {
                        var v = (_a = dom.getAttribute("class")) === null || _a === void 0 ? void 0 : _a.toString();
                        if (v !== String(props_1[key])) {
                            log({
                                fiber: fiber,
                                message: "hydrate warning, dom ".concat(key, " not match from server. server: ").concat(v, ", client: ").concat(props_1[key]),
                            });
                            dom.setAttribute("class", props_1[key]);
                        }
                    }
                    else {
                        if (dom[key].toString() !== String(props_1[key])) {
                            log({
                                fiber: fiber,
                                message: "hydrate warning, dom ".concat(key, " not match from server. server: ").concat(dom[key], ", client: ").concat(props_1[key]),
                            });
                            dom[key] == props_1[key];
                        }
                    }
                }
                else {
                    if (key in dom && !fiber.nameSpace) {
                        if (dom[key].toString() !== String(props_1[key])) {
                            log({
                                fiber: fiber,
                                message: "hydrate warning, dom ".concat(key, " props not match from server. server: ").concat(dom[key], ", client: ").concat(props_1[key]),
                            });
                            dom[key] = props_1[key];
                        }
                    }
                    else {
                        var v = dom.getAttribute(key);
                        if ((v === null || v === void 0 ? void 0 : v.toString()) !== String(props_1[key])) {
                            log({
                                fiber: fiber,
                                message: "hydrate warning, dom ".concat(v, " attr not match from server. server: ").concat(v, ", client: ").concat(props_1[key]),
                            });
                            dom.setAttribute(key, props_1[key]);
                        }
                    }
                }
            }
        });
    }
};
var domStyleHydrate = function (fiber, dom) {
    if (fiber.__isPlainNode__) {
        var typedElement = fiber.element;
        var props_2 = typedElement.props;
        Object.keys(props_2)
            .filter(isStyle)
            .forEach(function (styleKey) {
            var typedProps = props_2[styleKey] || {};
            Object.keys(typedProps).forEach(function (styleName) {
                if (Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) &&
                    typeof typedProps[styleName] === "number") {
                    dom[styleKey][styleName] = "".concat(typedProps[styleName], "px");
                    return;
                }
                if (typedProps[styleName] !== null && typedProps[styleName] !== undefined) {
                    dom[styleKey][styleName] = typedProps[styleName];
                }
            });
        });
    }
};
var domEventHydrate = function (fiber, dom) {
    if (fiber.__isPlainNode__) {
        var typedElement = fiber.element;
        var props = typedElement.props;
        Object.keys(props)
            .filter(isEvent)
            .forEach(function (key) {
            addEventListener(fiber, dom, key);
        });
    }
};
export var hydrateUpdate = function (fiber) {
    var dom = fiber.dom;
    // for now it is necessary to judge
    if (dom) {
        domPropsHydrate(fiber, dom);
        domStyleHydrate(fiber, dom);
        domEventHydrate(fiber, dom);
        debugWithDOM(fiber);
    }
    fiber.__pendingCreate__ = false;
    fiber.__pendingUpdate__ = false;
    fiber.__pendingAppend__ = false;
    fiber.__pendingPosition__ = false;
};
//# sourceMappingURL=hydrateUpdate.js.map