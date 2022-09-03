import { isValidElement, __myreact_internal__, __myreact_shared__ } from "@my-react/react";
import { enableKeyDiff } from "../share";
var isAppMounted = __myreact_internal__.isAppMounted, globalDispatch = __myreact_internal__.globalDispatch, MyReactFiberNodeClass = __myreact_internal__.MyReactFiberNode;
var updateFiberNode = __myreact_shared__.updateFiberNode, createFiberNode = __myreact_shared__.createFiberNode;
var getKeyMatchedChildren = function (newChildren, prevFiberChildren) {
    if (!isAppMounted.current)
        return prevFiberChildren;
    if (!enableKeyDiff.current)
        return prevFiberChildren;
    if (!prevFiberChildren)
        return prevFiberChildren;
    if (prevFiberChildren.length === 0)
        return prevFiberChildren;
    var tempChildren = prevFiberChildren.slice(0);
    var assignPrevChildren = Array(tempChildren.length).fill(null);
    newChildren.forEach(function (element, index) {
        if (tempChildren.length) {
            if (isValidElement(element)) {
                if (typeof element.key === "string") {
                    var targetIndex = tempChildren.findIndex(function (fiber) {
                        var _a;
                        return fiber instanceof MyReactFiberNodeClass &&
                            typeof fiber.element === "object" &&
                            ((_a = fiber.element) === null || _a === void 0 ? void 0 : _a.key) === element.key;
                    });
                    if (targetIndex !== -1) {
                        assignPrevChildren[index] = tempChildren[targetIndex];
                        tempChildren.splice(targetIndex, 1);
                    }
                }
                else {
                    // TODO
                }
            }
        }
    });
    return assignPrevChildren.map(function (v) {
        if (v)
            return v;
        return tempChildren.shift();
    });
};
var getIsSameTypeNode = function (newChild, prevFiberChild) {
    if (!isAppMounted.current)
        return false;
    var newChildIsArray = Array.isArray(newChild);
    var prevElementChildIsArray = Array.isArray(prevFiberChild);
    if (newChildIsArray && prevElementChildIsArray)
        return true;
    if (newChildIsArray)
        return false;
    if (prevElementChildIsArray)
        return false;
    var typedPrevFiberChild = prevFiberChild;
    var typedNewChild = newChild;
    var prevRenderedChild = typedPrevFiberChild === null || typedPrevFiberChild === void 0 ? void 0 : typedPrevFiberChild.element;
    var result = typedPrevFiberChild === null || typedPrevFiberChild === void 0 ? void 0 : typedPrevFiberChild.checkIsSameType(typedNewChild);
    if (result && enableKeyDiff.current && !typedPrevFiberChild.__isTextNode__ && !typedPrevFiberChild.__isNullNode__) {
        return typedNewChild.key === prevRenderedChild.key;
    }
    else {
        return result;
    }
};
var getNewFiberWithUpdate = function (newChild, parentFiber, prevFiberChild, assignPrevFiberChild) {
    var isSameType = getIsSameTypeNode(newChild, assignPrevFiberChild);
    if (isSameType) {
        if (Array.isArray(newChild) && Array.isArray(prevFiberChild) && Array.isArray(assignPrevFiberChild)) {
            var assignPrevFiberChildren_1 = getKeyMatchedChildren(newChild, assignPrevFiberChild);
            if (newChild.length < assignPrevFiberChildren_1.length) {
                globalDispatch.current.pendingUnmount(parentFiber, assignPrevFiberChildren_1.slice(newChild.length));
            }
            return newChild.map(function (v, index) {
                return getNewFiberWithUpdate(v, parentFiber, prevFiberChild[index], assignPrevFiberChildren_1[index]);
            });
        }
        return updateFiberNode({
            fiber: assignPrevFiberChild,
            parent: parentFiber,
            prevFiber: prevFiberChild,
        }, newChild);
    }
    else {
        if (assignPrevFiberChild) {
            globalDispatch.current.pendingUnmount(parentFiber, assignPrevFiberChild);
        }
        if (Array.isArray(newChild)) {
            return newChild.map(function (v) { return getNewFiberWithUpdate(v, parentFiber); });
        }
        return createFiberNode({
            fiberIndex: parentFiber.fiberIndex + 1,
            parent: parentFiber,
            type: "position",
        }, newChild);
    }
};
var getNewFiberWithInitial = function (newChild, parentFiber) {
    if (Array.isArray(newChild)) {
        return newChild.map(function (v) { return getNewFiberWithInitial(v, parentFiber); });
    }
    return createFiberNode({ fiberIndex: parentFiber.fiberIndex + 1, parent: parentFiber }, newChild);
};
export var transformChildrenFiber = function (parentFiber, children) {
    var index = 0;
    var isUpdate = parentFiber.__isUpdateRender__;
    var newChildren = Array.isArray(children) ? children : [children];
    var prevFiberChildren = isUpdate ? parentFiber.__renderedChildren__ : [];
    var assignPrevFiberChildren = getKeyMatchedChildren(newChildren, prevFiberChildren);
    parentFiber.__renderedChildren__ = [];
    parentFiber.beforeUpdate();
    while (index < newChildren.length || index < assignPrevFiberChildren.length) {
        var newChild = newChildren[index];
        var prevFiberChild = prevFiberChildren[index];
        var assignPrevFiberChild = assignPrevFiberChildren[index];
        var newFiber = isUpdate
            ? getNewFiberWithUpdate(newChild, parentFiber, prevFiberChild, assignPrevFiberChild)
            : getNewFiberWithInitial(newChild, parentFiber);
        parentFiber.__renderedChildren__.push(newFiber);
        index++;
    }
    parentFiber.afterUpdate();
    return parentFiber.children;
};
//# sourceMappingURL=generate.js.map