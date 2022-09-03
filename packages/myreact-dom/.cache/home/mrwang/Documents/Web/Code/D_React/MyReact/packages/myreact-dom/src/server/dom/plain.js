import { IS_SINGLE_ELEMENT } from "@ReactDOM_shared";
import { TextElement } from "./text";
var PlainElement = /** @class */ (function () {
    function PlainElement(type) {
        this.className = null;
        // attrs
        this.style = {};
        this.attrs = {};
        this.children = [];
        this.type = type;
    }
    PlainElement.prototype.addEventListener = function () {
        void 0;
    };
    PlainElement.prototype.removeEventListener = function () {
        void 0;
    };
    PlainElement.prototype.removeAttribute = function (key) {
        delete this.attrs[key];
    };
    PlainElement.prototype.setAttribute = function (key, value) {
        if (value !== false && value !== null && value !== undefined) {
            this.attrs[key] = value.toString();
        }
    };
    /**
     *
     * @param {Element} dom
     */
    PlainElement.prototype.append = function () {
        var _this = this;
        var dom = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dom[_i] = arguments[_i];
        }
        dom.forEach(function (d) { return _this.appendChild(d); });
    };
    PlainElement.prototype.appendChild = function (dom) {
        if (Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, this.type))
            return;
        if (dom instanceof PlainElement || dom instanceof TextElement || typeof dom === "string") {
            this.children.push(dom);
            return dom;
        }
        else {
            throw new Error("element instance error");
        }
    };
    PlainElement.prototype.serializeStyle = function () {
        var _this = this;
        var styleKeys = Object.keys(this.style).filter(function (key) { return _this.style[key] !== null && _this.style[key] !== undefined; });
        if (styleKeys.length) {
            return "style=\"".concat(styleKeys.map(function (key) { var _a; return "".concat(key, ": ").concat((_a = _this.style[key]) === null || _a === void 0 ? void 0 : _a.toString(), ";"); }).reduce(function (p, c) { return p + c; }, ""), "\"");
        }
        return "";
    };
    PlainElement.prototype.serializeAttrs = function () {
        var _this = this;
        var attrsKeys = Object.keys(this.attrs);
        if (attrsKeys.length) {
            return attrsKeys.map(function (key) { var _a; return "".concat(key, "='").concat((_a = _this.attrs[key]) === null || _a === void 0 ? void 0 : _a.toString(), "'"); }).reduce(function (p, c) { return "".concat(p, " ").concat(c); }, "");
        }
        else {
            return "";
        }
    };
    PlainElement.prototype.serializeProps = function () {
        var props = "";
        if (this.className !== undefined && this.className !== null) {
            props += " class=\"".concat(this.className, "\"");
        }
        return props;
    };
    PlainElement.prototype.serialize = function () {
        return "".concat(this.serializeProps(), " ").concat(this.serializeStyle(), " ").concat(this.serializeAttrs());
    };
    PlainElement.prototype.toString = function () {
        if (Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, this.type)) {
            return "<".concat(this.type, " ").concat(this.serialize(), " />");
        }
        else {
            if (this.type) {
                return "<".concat(this.type, " ").concat(this.serialize(), " >").concat(this.children
                    .reduce(function (p, c) {
                    if (p.length && c instanceof TextElement && p[p.length - 1] instanceof TextElement) {
                        p.push("<!-- -->");
                        p.push(c);
                    }
                    else {
                        p.push(c);
                    }
                    return p;
                }, [])
                    .map(function (dom) { return dom.toString(); })
                    .reduce(function (p, c) { return p + c; }, ""), "</").concat(this.type, ">");
            }
            else {
                return this.children
                    .reduce(function (p, c) {
                    if (p.length && c instanceof TextElement && p[p.length - 1] instanceof TextElement) {
                        p.push("<!-- -->");
                        p.push(c);
                    }
                    else {
                        p.push(c);
                    }
                    return p;
                }, [])
                    .map(function (dom) { return dom.toString(); })
                    .reduce(function (p, c) { return p + c; }, "");
            }
        }
    };
    return PlainElement;
}());
export { PlainElement };
//# sourceMappingURL=plain.js.map