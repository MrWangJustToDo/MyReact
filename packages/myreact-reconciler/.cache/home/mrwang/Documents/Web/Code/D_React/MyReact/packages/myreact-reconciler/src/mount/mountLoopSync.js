import { nextWorkSync } from "../generate";
import { cRoundTransformFiberArray, nRoundTransformFiberArray } from "../share";
var loopStart = function (fiber) {
    var _a;
    (_a = cRoundTransformFiberArray.current).push.apply(_a, nextWorkSync(fiber));
};
var loopCurrent = function () {
    var _a;
    while (cRoundTransformFiberArray.current.length) {
        var fiber = cRoundTransformFiberArray.current.shift();
        if (fiber) {
            (_a = nRoundTransformFiberArray.current).push.apply(_a, nextWorkSync(fiber));
        }
    }
};
var loopNext = function () {
    var _a;
    while (nRoundTransformFiberArray.current.length) {
        var fiber = nRoundTransformFiberArray.current.shift();
        if (fiber) {
            (_a = cRoundTransformFiberArray.current).push.apply(_a, nextWorkSync(fiber));
        }
    }
};
var loopToEnd = function () {
    loopCurrent();
    loopNext();
    if (cRoundTransformFiberArray.current.length) {
        loopToEnd();
    }
};
var loopAll = function (fiber) {
    loopStart(fiber);
    loopToEnd();
};
export var mountLoopSync = function (fiber) { return loopAll(fiber); };
//# sourceMappingURL=mountLoopSync.js.map