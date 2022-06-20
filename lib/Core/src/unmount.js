import { mapFiber } from "./tool.js";
import { pendingUnmountFiberArray } from "./env.js";
import { MyReactFiberNode } from "./fiber/index.js";

/**
 *
 * @param {MyReactFiberNode | MyReactFiberNode[]} fiber
 */
const pushUnmount = (fiber) => {
  mapFiber(fiber, (f) => {
    if (!f.__pendingUnmount__) {
      f.__pendingUnmount__ = true;
      pendingUnmountFiberArray.current.push(f);
    }
  });
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const clearFiberNode = (fiber) => {
  fiber.children.forEach(clearFiberNode);
  fiber.hookList.forEach((hook) => {
    if (hook.hookType === "useEffect" || hook.hookType === "useLayoutEffect") {
      hook.effect = false;
      hook.cancel && hook.cancel();
    }
    if (hook.hookType === "useContext" && hook.__context__) {
      hook.__context__.removeDependence(hook);
    }
  });
  if (fiber.instance) {
    if (fiber.instance.componentWillUnmount) {
      fiber.instance.componentWillUnmount();
    }
    if (fiber.instance.__context__) {
      fiber.instance.__context__.removeDependence(fiber.instance);
    }
  }
  fiber.mount = false;
  fiber.initial = false;
  fiber.__needUpdate__ = false;
  fiber.__pendingMount__ = false;
  fiber.__pendingUpdate__ = false;
  fiber.__pendingUnmount__ = false;
  fiber.__pendingPosition__ = false;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const clearFiberDom = (fiber) => {
  if (fiber.dom) {
    if (!fiber.__isPortal__) {
      fiber.dom.remove?.();
    } else {
      fiber.children.forEach(clearFiberDom);
    }
  } else {
    fiber.children.forEach(clearFiberDom);
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const unmountFiberNode = (fiber) => {
  clearFiberNode(fiber);
  clearFiberDom(fiber);
};

const runUnmount = () => {
  const allUnmountFiberArray = pendingUnmountFiberArray.current.slice(0);
  allUnmountFiberArray.forEach(unmountFiberNode);
  pendingUnmountFiberArray.current = [];
};

export { pushUnmount, runUnmount, unmountFiberNode };
