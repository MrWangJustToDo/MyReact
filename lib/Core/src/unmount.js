import { pendingUnmountFiberArray } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { mapFiber } from "./tools.js";

/**
 *
 * @param {MyReactFiberNode | MyReactFiberNode[]} fiber
 */
function pushUnmount(fiber) {
  mapFiber(fiber, (f) => {
    if (!f.__pendingUnmount__) {
      f.__pendingUnmount__ = true;
      pendingUnmountFiberArray.current.push(f);
    }
  });
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function clearFiberNode(fiber) {
  fiber.children.forEach(clearFiberNode);
  fiber.hookList.forEach((hook) => {
    if (hook.hookType === "useEffect" || hook.hookType === "useLayoutEffect") {
      hook.effect = false;
      hook.cancel && hook.cancel();
    }
    if (hook.hookType === "useContext") {
      hook.__context__?.removeListener(hook);
    }
  });
  if (fiber.instance) {
    if (typeof fiber.instance.componentWillUnmount === "function") {
      fiber.instance.componentWillUnmount();
    }
    if (fiber.instance.__context__) {
      fiber.instance.__context__.removeListener(fiber.instance);
    }
  }
  fiber.mount = false;
  fiber.initial = false;
  fiber.__pendingUpdate__ = false;
  fiber.__pendingUnmount__ = false;
  fiber.__pendingPosition__ = false;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function clearFiberDom(fiber) {
  if (fiber.dom) {
    if (!fiber.__isPortal__) {
      fiber.dom.remove();
    } else {
      fiber.children.forEach(clearFiberDom);
    }
  } else {
    fiber.children.forEach(clearFiberDom);
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function runUnmount(fiber) {
  const allUnmountFiberArray = pendingUnmountFiberArray.current.slice(0);
  allUnmountFiberArray.forEach((fiber) => {
    fiber.__pendingUnmount__ = false;
    clearFiberNode(fiber);
    clearFiberDom(fiber);
  });
  pendingUnmountFiberArray.current = [];
}

export { pushUnmount, runUnmount };
