import { isValidElement } from "../element";
import { MyReactFiberNode, createFiberNode, updateFiberNode } from "../fiber";
import { enableKeyDiff, globalDispatch, isAppMounted, isServerRender, isHydrateRender } from "../share";
const getKeyMatchedChildren = (newChildren, prevFiberChildren) => {
    if (!isAppMounted.current)
        return prevFiberChildren;
    if (isServerRender.current)
        return prevFiberChildren;
    if (isHydrateRender.current)
        return prevFiberChildren;
    if (!enableKeyDiff.current)
        return prevFiberChildren;
    if (!prevFiberChildren)
        return prevFiberChildren;
    if (prevFiberChildren.length === 0)
        return prevFiberChildren;
    const tempChildren = prevFiberChildren.slice(0);
    const assignPrevChildren = Array(tempChildren.length).fill(null);
    newChildren.forEach((element, index) => {
        if (tempChildren.length) {
            if (isValidElement(element)) {
                if (typeof element.key === "string") {
                    const targetIndex = tempChildren.findIndex((fiber) => fiber instanceof MyReactFiberNode &&
                        typeof fiber.element === "object" &&
                        fiber.element?.key === element.key);
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
    return assignPrevChildren.map((v) => {
        if (v)
            return v;
        return tempChildren.shift();
    });
};
const getIsSameTypeNode = (newChild, prevFiberChild) => {
    if (!isAppMounted.current)
        return false;
    const newChildIsArray = Array.isArray(newChild);
    const prevElementChildIsArray = Array.isArray(prevFiberChild);
    if (newChildIsArray && prevElementChildIsArray)
        return true;
    if (newChildIsArray)
        return false;
    if (prevElementChildIsArray)
        return false;
    const typedPrevFiberChild = prevFiberChild;
    const typedNewChild = newChild;
    const prevRenderedChild = typedPrevFiberChild?.element;
    const result = typedPrevFiberChild?.checkIsSameType(typedNewChild);
    if (result && enableKeyDiff.current && !typedPrevFiberChild.__isTextNode__ && !typedPrevFiberChild.__isNullNode__) {
        return typedNewChild.key === prevRenderedChild.key;
    }
    else {
        return result;
    }
};
const getNewFiberWithUpdate = (newChild, parentFiber, prevFiberChild, assignPrevFiberChild) => {
    const isSameType = getIsSameTypeNode(newChild, assignPrevFiberChild);
    if (isSameType) {
        if (Array.isArray(newChild) && Array.isArray(prevFiberChild) && Array.isArray(assignPrevFiberChild)) {
            const assignPrevFiberChildren = getKeyMatchedChildren(newChild, assignPrevFiberChild);
            if (newChild.length < assignPrevFiberChildren.length) {
                globalDispatch.current.pendingUnmount(parentFiber, assignPrevFiberChildren.slice(newChild.length));
            }
            return newChild.map((v, index) => getNewFiberWithUpdate(v, parentFiber, prevFiberChild[index], assignPrevFiberChildren[index]));
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
            return newChild.map((v) => getNewFiberWithUpdate(v, parentFiber));
        }
        return createFiberNode({
            fiberIndex: parentFiber.fiberIndex + 1,
            parent: parentFiber,
            type: "position",
        }, newChild);
    }
};
const getNewFiberWithInitial = (newChild, parentFiber) => {
    if (Array.isArray(newChild)) {
        return newChild.map((v) => getNewFiberWithInitial(v, parentFiber));
    }
    return createFiberNode({ fiberIndex: parentFiber.fiberIndex + 1, parent: parentFiber }, newChild);
};
export const transformChildrenFiber = (parentFiber, children) => {
    let index = 0;
    const isUpdate = parentFiber.__isUpdateRender__;
    const newChildren = Array.isArray(children) ? children : [children];
    const prevFiberChildren = isUpdate ? parentFiber.__renderedChildren__ : [];
    const assignPrevFiberChildren = getKeyMatchedChildren(newChildren, prevFiberChildren);
    parentFiber.__renderedChildren__ = [];
    parentFiber.beforeUpdate();
    while (index < newChildren.length || index < assignPrevFiberChildren.length) {
        const newChild = newChildren[index];
        const prevFiberChild = prevFiberChildren[index];
        const assignPrevFiberChild = assignPrevFiberChildren[index];
        const newFiber = isUpdate
            ? getNewFiberWithUpdate(newChild, parentFiber, prevFiberChild, assignPrevFiberChild)
            : getNewFiberWithInitial(newChild, parentFiber);
        parentFiber.__renderedChildren__.push(newFiber);
        index++;
    }
    parentFiber.afterUpdate();
    return parentFiber.children;
};
//# sourceMappingURL=generate.js.map