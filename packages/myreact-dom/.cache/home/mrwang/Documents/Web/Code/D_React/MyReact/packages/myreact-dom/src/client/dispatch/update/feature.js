import { hydrateUpdate } from "./hydrateUpdate";
import { nativeUpdate } from "./nativeUpdate";
export var update = function (fiber, hydrate) {
    if (fiber.__pendingUpdate__) {
        if (hydrate) {
            hydrateUpdate(fiber);
        }
        else {
            nativeUpdate(fiber);
        }
        fiber.applyVDom();
        fiber.__pendingUpdate__ = false;
    }
};
//# sourceMappingURL=feature.js.map