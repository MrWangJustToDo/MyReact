import { __spreadArray } from "tslib";
import { getHookTree } from "../share";
import { effect } from "./effect";
import { MyReactHookNode } from "./instance";
var defaultReducer = function (state, action) {
    return typeof action === "function" ? action(state) : action;
};
export var createHookNode = function (_a, fiber) {
    var hookIndex = _a.hookIndex, hookType = _a.hookType, value = _a.value, reducer = _a.reducer, deps = _a.deps;
    var newHookNode = new MyReactHookNode(hookIndex, hookType, value, reducer || defaultReducer, deps);
    newHookNode.setFiber(fiber);
    fiber.addHook(newHookNode);
    fiber.checkHook(newHookNode);
    newHookNode.initialResult();
    return newHookNode;
};
export var getHookNode = function (_a, fiber) {
    var hookIndex = _a.hookIndex, hookType = _a.hookType, value = _a.value, reducer = _a.reducer, deps = _a.deps;
    if (!fiber)
        throw new Error("can not use hook out of component");
    var currentHook = null;
    if (fiber.hookList.length > hookIndex) {
        currentHook = fiber.hookList[hookIndex];
        if (currentHook.hookType !== hookType) {
            var array = fiber.hookType.slice(0, hookIndex);
            throw new Error(getHookTree(__spreadArray(__spreadArray([], array, true), [currentHook.hookType], false), __spreadArray(__spreadArray([], array, true), [hookType], false)));
        }
        currentHook.setFiber(fiber);
        currentHook.updateResult(value, reducer || defaultReducer, deps);
    }
    else if (!fiber.__isUpdateRender__) {
        currentHook = createHookNode({ hookIndex: hookIndex, hookType: hookType, value: value, reducer: reducer, deps: deps }, fiber);
    }
    else {
        throw new Error(getHookTree(__spreadArray([], fiber.hookType, true), __spreadArray(__spreadArray([], fiber.hookType, true), [hookType], false)));
    }
    effect(fiber, currentHook);
    return currentHook;
};
//# sourceMappingURL=create.js.map