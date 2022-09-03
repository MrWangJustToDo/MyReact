import { asyncUpdateTimeLimit, asyncUpdateTimeStep } from "./env";
export const shouldPauseAsyncUpdate = () => {
    if (!asyncUpdateTimeStep.current) {
        asyncUpdateTimeStep.current = Date.now();
        return false;
    }
    else {
        const result = Date.now() - asyncUpdateTimeStep.current > asyncUpdateTimeLimit;
        if (result)
            asyncUpdateTimeStep.current = null;
        return result;
    }
};
//# sourceMappingURL=shouldPause.js.map