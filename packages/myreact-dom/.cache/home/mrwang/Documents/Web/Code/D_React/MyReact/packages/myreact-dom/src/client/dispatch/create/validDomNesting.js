// for invalid dom structure
import { __myreact_shared__ } from "@my-react/react";
import { enableAllCheck } from "@ReactDOM_shared";
var log = __myreact_shared__.log;
// TODO
export var validDomNesting = function (fiber) {
    if (!enableAllCheck.current)
        return;
    if (fiber.__isPlainNode__) {
        var typedElement = fiber.element;
        if (typedElement.type === "p") {
            var parent_1 = fiber.parent;
            while (parent_1 && parent_1.__isPlainNode__) {
                var typedParentElement = parent_1.element;
                if (typedParentElement.type === "p") {
                    log({
                        fiber: fiber,
                        level: "warn",
                        triggerOnce: true,
                        message: "invalid dom nesting: <p> cannot appear as a child of <p>",
                    });
                }
                parent_1 = parent_1.parent;
            }
        }
    }
};
//# sourceMappingURL=validDomNesting.js.map