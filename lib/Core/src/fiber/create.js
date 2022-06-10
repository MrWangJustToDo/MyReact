import { pushMount } from "../mount/index.js";
import { pushPosition } from "../position.js";
import { MyReactVDom } from "../vdom/index.js";
import { pushUpdate } from "../update/index.js";
import { MyReactFiberNode } from "./instance.js";

/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, effect: 'PLACEMENT' | 'UPDATE' | 'POSITION', dom: HTMLElement}} param
 * @param {MyReactVDom} vdom
 */
const createNewFiberNode = (
  { key, deepIndex, fiberParent, effect, dom },
  vdom
) => {
  const newFiber = new MyReactFiberNode(
    key,
    deepIndex,
    fiberParent,
    null,
    effect
  );

  newFiber.dom = dom;

  newFiber.initialParent();

  newFiber.updateFromAlternate();

  newFiber.installVDom(vdom);

  newFiber.checkVDom(vdom);

  newFiber.initialType();

  newFiber.resetEffect();

  return newFiber;
};

/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, effect: 'PLACEMENT' | 'UPDATE' | 'POSITION', dom: HTMLElement}} param
 * @param {MyReactVDom} vdom
 */
const createNewFiberNodeWithMount = (
  { key, deepIndex, fiberParent, effect, dom },
  vdom
) => {
  const newFiber = createNewFiberNode(
    { key, deepIndex, fiberParent, effect, dom },
    vdom
  );

  pushMount(newFiber);

  return newFiber;
};

/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, effect: 'PLACEMENT' | 'UPDATE' | 'POSITION', dom: HTMLElement}} param
 * @param {MyReactVDom} vdom
 * @param {MyReactFiberNode} previousRenderFiber
 */
const createNewFiberNodeWithPosition = (
  { key, deepIndex, fiberParent, effect, dom },
  vdom,
  previousRenderFiber
) => {
  const newFiber = createNewFiberNode(
    {
      key,
      deepIndex,
      fiberParent,
      effect,
      dom,
    },
    vdom
  );

  pushPosition(newFiber, previousRenderFiber);

  return newFiber;
};

/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: 'PLACEMENT' | 'UPDATE' | 'POSITION'}} param
 * @param {MyReactVDom} vdom
 */
const createUpdatedFiberNode = (
  { key, deepIndex, fiberParent, fiberAlternate, effect },
  vdom
) => {
  const newFiber = new MyReactFiberNode(
    key,
    deepIndex,
    fiberParent,
    fiberAlternate,
    effect
  );

  newFiber.initialParent();

  newFiber.updateFromAlternate();

  newFiber.installVDom(vdom);

  newFiber.checkVDom(vdom);

  return newFiber;
};

/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: 'PLACEMENT' | 'UPDATE' | 'POSITION'}} param
 * @param {MyReactVDom} vdom
 */
const createUpdatedFiberNodeWithUpdate = (
  { key, deepIndex, fiberParent, fiberAlternate, effect },
  vdom
) => {
  const newFiber = createUpdatedFiberNode(
    { key, deepIndex, fiberParent, fiberAlternate, effect },
    vdom
  );

  if (newFiber.__isTextNode__ || newFiber.__isPlainNode__) {
    if (newFiber.dom) {
      pushUpdate(newFiber);
    } else {
      console.error("error");
    }
  }

  return newFiber;
};

/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: 'PLACEMENT' | 'UPDATE' | 'POSITION'}} param
 * @param {MyReactVDom} vdom
 * @param {MyReactFiberNode} previousRenderFiber
 */
const createUpdatedFiberNodeWithUpdateAndPosition = (
  { key, deepIndex, fiberParent, fiberAlternate, effect },
  vdom,
  previousRenderFiber
) => {
  const newFiber = createUpdatedFiberNodeWithUpdate(
    { key, deepIndex, fiberParent, fiberAlternate, effect },
    vdom
  );

  if (fiberAlternate !== previousRenderFiber) {
    pushPosition(newFiber, previousRenderFiber);
  }

  return newFiber;
};

export {
  createNewFiberNode,
  createUpdatedFiberNode,
  createNewFiberNodeWithMount,
  createNewFiberNodeWithPosition,
  createUpdatedFiberNodeWithUpdate,
  createUpdatedFiberNodeWithUpdateAndPosition,
};
