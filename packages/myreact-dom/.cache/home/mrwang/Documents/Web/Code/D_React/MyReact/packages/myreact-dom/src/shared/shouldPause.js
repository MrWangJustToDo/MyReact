import { asyncUpdateTimeLimit, asyncUpdateTimeStep } from "./env";
export var shouldPauseAsyncUpdate = function () {
    if (!asyncUpdateTimeStep.current) {
        asyncUpdateTimeStep.current = Date.now();
        return false;
    }
    else {
        var result = Date.now() - asyncUpdateTimeStep.current > asyncUpdateTimeLimit;
        if (result)
            asyncUpdateTimeStep.current = null;
        return result;
    }
};
//# sourceMappingURL=shouldPause.js.map