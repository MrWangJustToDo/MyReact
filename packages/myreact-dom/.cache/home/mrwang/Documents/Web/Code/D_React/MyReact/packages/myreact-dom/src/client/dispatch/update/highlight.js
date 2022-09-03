var HighLight = /** @class */ (function () {
    function HighLight() {
        var _this = this;
        this.map = [];
        this.container = null;
        this.range = document.createRange();
        this.__pendingUpdate__ = [];
        this.createHighLight = function () {
            var _a;
            var element = document.createElement("div");
            (_a = _this.container) === null || _a === void 0 ? void 0 : _a.append(element);
            return element;
        };
        this.getHighLight = function () {
            if (_this.map.length > 0) {
                return _this.map.shift();
            }
            return _this.createHighLight();
        };
        this.highLight = function (fiber) {
            if (fiber.dom) {
                var typedDom = fiber.dom;
                if (!typedDom.__pendingHighLight__) {
                    typedDom.__pendingHighLight__ = true;
                    _this.startHighLight(fiber);
                }
            }
        };
        this.startHighLight = function (fiber) {
            _this.__pendingUpdate__.push(fiber);
            _this.flashPending();
        };
        this.flashPending = function () {
            Promise.resolve().then(function () {
                var allFiber = _this.__pendingUpdate__.slice(0);
                _this.__pendingUpdate__ = [];
                var allWrapper = [];
                allFiber.forEach(function (f) {
                    var _a, _b;
                    var wrapperDom = _this.getHighLight();
                    allWrapper.push(wrapperDom);
                    f.__isTextNode__ ? _this.range.selectNodeContents(f.dom) : _this.range.selectNode(f.dom);
                    var rect = _this.range.getBoundingClientRect();
                    var left = rect.left + (((_a = document.scrollingElement) === null || _a === void 0 ? void 0 : _a.scrollLeft) || 0);
                    var top = rect.top + (((_b = document.scrollingElement) === null || _b === void 0 ? void 0 : _b.scrollTop) || 0);
                    var width = rect.width + 4;
                    var height = rect.height + 4;
                    var positionLeft = left - 2;
                    var positionTop = top - 2;
                    wrapperDom.style.cssText = "\n          position: absolute;\n          width: ".concat(width, "px;\n          height: ").concat(height, "px;\n          left: ").concat(positionLeft, "px;\n          top: ").concat(positionTop, "px;\n          pointer-events: none;\n          box-shadow: 0.0625rem 0.0625rem 0.0625rem red, -0.0625rem -0.0625rem 0.0625rem red;\n          ");
                });
                setTimeout(function () {
                    allWrapper.forEach(function (wrapperDom) {
                        wrapperDom.style.boxShadow = "none";
                        _this.map.push(wrapperDom);
                    });
                    allFiber.forEach(function (f) { return (f.dom.__pendingHighLight__ = false); });
                }, 100);
            });
        };
        this.container = document.createElement("div");
        this.container.setAttribute("debug_highlight", "MyReact");
        this.container.style.cssText = "\n      position: absolute;\n      z-index: 999999;\n      width: 100%;\n      left: 0;\n      top: 0;\n      pointer-events: none;\n      ";
        document.body.append(this.container);
    }
    /**
     * @type HighLight
     */
    HighLight.instance = undefined;
    /**
     *
     * @returns HighLight
     */
    HighLight.getHighLightInstance = function () {
        HighLight.instance = HighLight.instance || new HighLight();
        return HighLight.instance;
    };
    return HighLight;
}());
export { HighLight };
//# sourceMappingURL=highlight.js.map