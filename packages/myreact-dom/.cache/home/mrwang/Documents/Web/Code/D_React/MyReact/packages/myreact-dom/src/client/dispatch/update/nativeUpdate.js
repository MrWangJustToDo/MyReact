import { __myreact_internal__ } from "@my-react/react";
import { debugWithDOM, enableHighlight, isEvent, isGone, isHydrateRender, isNew, isProperty, isServerRender, isStyle, IS_UNIT_LESS_NUMBER, } from "@ReactDOM_shared";
import { addEventListener, removeEventListener } from "../event";
import { HighLight } from "./highlight";
var isAppMounted = __myreact_internal__.isAppMounted;
export var nativeUpdate = function (fiber) {
    if (!fiber.dom)
        throw new Error("update error, dom not exist");
    if (fiber.__isTextNode__) {
        if (fiber.__vdom__ !== fiber.__prevVdom__) {
            fiber.dom.textContent = fiber.element;
        }
    }
    else {
        var dom_1 = fiber.dom;
        var oldProps_1 = fiber.__prevProps__ || {};
        var newProps_1 = fiber.__props__ || {};
        Object.keys(oldProps_1)
            .filter(isEvent)
            .filter(function (key) { return isGone(newProps_1)(key) || isNew(oldProps_1, newProps_1)(key); })
            .forEach(function (key) { return removeEventListener(fiber, dom_1, key); });
        Object.keys(oldProps_1)
            .filter(isProperty)
            .filter(isGone(newProps_1))
            .forEach(function (key) {
            if (key === "className") {
                if (fiber.nameSpace) {
                    dom_1.removeAttribute("class");
                }
                else {
                    dom_1[key] = "";
                }
            }
            else {
                if (key in dom_1 && !fiber.nameSpace) {
                    dom_1[key] = "";
                }
                else {
                    dom_1.removeAttribute(key);
                }
            }
        });
        Object.keys(oldProps_1)
            .filter(isStyle)
            .forEach(function (styleKey) {
            Object.keys(oldProps_1[styleKey] || {})
                .filter(isGone(newProps_1[styleKey] || {}))
                .forEach(function (styleName) {
                dom_1.style[styleName] = "";
            });
        });
        Object.keys(newProps_1)
            .filter(isEvent)
            .filter(isNew(oldProps_1, newProps_1))
            .forEach(function (key) { return addEventListener(fiber, dom_1, key); });
        Object.keys(newProps_1)
            .filter(isProperty)
            .filter(isNew(oldProps_1, newProps_1))
            .forEach(function (key) {
            if (key === "className") {
                if (fiber.nameSpace) {
                    dom_1.setAttribute("class", newProps_1[key] || "");
                }
                else {
                    dom_1[key] = newProps_1[key] || "";
                }
            }
            else {
                if (key in dom_1 && !fiber.nameSpace) {
                    if (newProps_1[key] !== null && newProps_1[key] !== false && newProps_1[key] !== undefined) {
                        dom_1[key] = newProps_1[key];
                    }
                    else {
                        dom_1[key] = "";
                    }
                }
                else {
                    if (newProps_1[key] !== null && newProps_1[key] !== false && newProps_1[key] !== undefined) {
                        dom_1.setAttribute(key, String(newProps_1[key]));
                    }
                    else {
                        dom_1.removeAttribute(key);
                    }
                }
                if ((key === "autofocus" || key === "autoFocus") && newProps_1[key]) {
                    Promise.resolve().then(function () { return dom_1.focus(); });
                }
            }
        });
        Object.keys(newProps_1)
            .filter(isStyle)
            .forEach(function (styleKey) {
            var typedNewProps = newProps_1[styleKey];
            var typedOldProps = oldProps_1[styleKey];
            Object.keys(typedNewProps || {})
                .filter(isNew(typedOldProps || {}, typedNewProps))
                .forEach(function (styleName) {
                if (!Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) &&
                    typeof typedNewProps[styleName] === "number") {
                    dom_1[styleKey][styleName] = "".concat(typedNewProps[styleName], "px");
                    return;
                }
                if (typedNewProps[styleName] !== null && typedNewProps[styleName] !== undefined) {
                    dom_1[styleKey][styleName] = typedNewProps[styleName];
                }
                else {
                    dom_1[styleKey][styleName] = "";
                }
            });
        });
        if (newProps_1["dangerouslySetInnerHTML"] &&
            newProps_1["dangerouslySetInnerHTML"] !== oldProps_1["dangerouslySetInnerHTML"]) {
            var typedProps = newProps_1["dangerouslySetInnerHTML"];
            dom_1.innerHTML = typedProps.__html;
        }
    }
    debugWithDOM(fiber);
    if (isAppMounted.current &&
        !isHydrateRender.current &&
        !isServerRender.current &&
        (enableHighlight.current || window.__highlight__)) {
        HighLight.getHighLightInstance().highLight(fiber);
    }
};
//# sourceMappingURL=nativeUpdate.js.map