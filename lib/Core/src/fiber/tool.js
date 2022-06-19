import { MyReactFiberNode } from "./instance.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {any} providerObject
 * @returns {MyReactFiberNode | null}
 */
const getProviderFiber = (fiber, providerObject) => {
  if (fiber && providerObject) {
    if (
      fiber.__isObjectNode__ &&
      fiber.__isContextProvider__ &&
      fiber.__vdom__.type === providerObject
    ) {
      return fiber;
    } else {
      return getProviderFiber(fiber.fiberParent, providerObject);
    }
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {any} contextObject
 * @returns {MyReactFiberNode | null}
 */
const getContextFiber = (fiber, contextObject) => {
  if (contextObject) {
    const id = contextObject.id;
    const providerFiber = fiber.__contextMap__[id];
    const newestProvider = providerFiber?.__newestFiber__.current;
    if (newestProvider) {
      fiber.__contextMap__[id] = newestProvider;
    }
    return newestProvider;
  }
  // return getProviderFiber(fiber, contextObject?.Provider);
};

export { getContextFiber };
