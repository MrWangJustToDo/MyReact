var TextElement = /** @class */ (function () {
    function TextElement(content) {
        this.content = "";
        this.content = content === "" ? " " : content;
    }
    TextElement.prototype.toString = function () {
        return this.content.toString();
    };
    return TextElement;
}());
export { TextElement };
//# sourceMappingURL=text.js.map