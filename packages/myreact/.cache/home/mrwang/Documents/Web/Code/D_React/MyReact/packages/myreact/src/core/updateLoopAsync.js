import { safeCall } from "../share";
import { nextWorkAsync } from "./invoke";
export const updateLoopAsync = (loopController, shouldPause, reconcileUpdate) => {
    while (loopController.hasNext() && !shouldPause()) {
        const fiber = loopController.getNext();
        if (fiber) {
            const nextFiber = safeCall(() => nextWorkAsync(fiber, loopController.getTopLevel()));
            loopController.getUpdateList(fiber);
            loopController.setYield(nextFiber);
        }
    }
    if (!loopController.doesPause()) {
        reconcileUpdate();
    }
};
//# sourceMappingURL=updateLoopAsync.js.map