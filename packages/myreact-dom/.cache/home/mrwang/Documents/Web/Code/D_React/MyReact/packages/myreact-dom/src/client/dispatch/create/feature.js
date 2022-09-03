import { enableAllCheck, isHydrateRender } from "@ReactDOM_shared";
import { hydrateCreate } from "./hydrateCreate";
import { nativeCreate } from "./nativeCreate";
import { validDomNesting } from "./validDomNesting";
export var create = function (fiber, hydrate, parentFiberWithDom) {
    if (fiber.__pendingCreate__) {
        var re = false;
        validDomNesting(fiber);
        if (hydrate) {
            var result = hydrateCreate(fiber, parentFiberWithDom);
            if (!result) {
                nativeCreate(fiber);
            }
            re = result;
        }
        else {
            nativeCreate(fiber);
        }
        if (isHydrateRender.current) {
            var typedDom = fiber.dom;
            typedDom.__hydrate__ = true;
            if (enableAllCheck.current && fiber.__isPlainNode__) {
                if (!re) {
                    typedDom.setAttribute("debug_hydrate", "fail");
                }
                else {
                    typedDom.setAttribute("debug_hydrate", "success");
                }
            }
        }
        fiber.__pendingCreate__ = false;
        return re;
    }
    return hydrate;
};
//# sourceMappingURL=feature.js.map