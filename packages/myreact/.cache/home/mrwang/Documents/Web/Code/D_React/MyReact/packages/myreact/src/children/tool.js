import { flattenChildren } from "../share";
export var mapByJudge = function (arrayLike, judge, action) {
    var arrayChildren = flattenChildren(arrayLike);
    return arrayChildren.map(function (v, index) {
        if (judge(v)) {
            return action.call(null, v, index, arrayChildren);
        }
        else {
            return v;
        }
    });
};
//# sourceMappingURL=tool.js.map