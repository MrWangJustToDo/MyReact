import { PlainElement } from "./plain";
import { TextElement } from "./text";
export var create = function (fiber) {
    if (fiber.__pendingCreate__) {
        if (fiber.__isTextNode__) {
            fiber.dom = new TextElement(fiber.element);
        }
        else if (fiber.__isPlainNode__) {
            var typedElement = fiber.element;
            fiber.dom = new PlainElement(typedElement.type);
        }
        else {
            throw new Error("createPortal() can not call on the server");
        }
        fiber.__pendingCreate__ = false;
    }
};
//# sourceMappingURL=create.js.map