import { safeCall } from "../share";
import { nextWorkAsync } from "./invoke";
export const updateLoopSync = (loopController, reconcileUpdate) => {
    if (loopController.hasNext()) {
        let fiber = loopController.getNext();
        while (fiber) {
            const _fiber = fiber;
            fiber = safeCall(() => nextWorkAsync(_fiber, loopController.getTopLevel()));
            loopController.getUpdateList(_fiber);
            loopController.setYield(fiber);
        }
    }
    reconcileUpdate();
};
//# sourceMappingURL=updateLoopSync.js.map