import { updateDom } from "./dom.js";
import {
  empty,
  needLoop,
  pendingEffectArray,
  pendingLayoutEffectArray,
  pendingModifyFiberArray,
  pendingPositionFiberArray,
  pendingUnmountFiberArray,
  pendingUpdateFiberArray,
  rootContainer,
} from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { renderLoopSync } from "./render.js";
import { getDom, map, safeCall } from "./tools.js";

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
function commitUpdate(currentFiber, parentDom) {
  if (currentFiber.dom) {
    // 新增
    if (currentFiber.effect === "PLACEMENT") {
      parentDom.appendChild(currentFiber.dom);
      // 更新
    } else if (currentFiber.effect === "UPDATE") {
      updateDom(
        currentFiber.dom,
        currentFiber.__isTextNode__
          ? empty
          : currentFiber.fiberAlternate.__vdom__.props,
        currentFiber.__isTextNode__ ? empty : currentFiber.__vdom__.props,
        currentFiber
      );
      // highLightDom(currentFiber);
    }
    currentFiber.dom.__fiber__ = currentFiber;
    currentFiber.dom.__vdom__ = currentFiber.__vdom__;
    currentFiber.dom.__children__ = currentFiber.children;
  }
  currentFiber.fiberAlternate = null;
  currentFiber.effect = null;
}

function startUpdateAll(updateFiberArray) {
  needLoop.current = true;

  safeCall(() => updateFiberArray.forEach(renderLoopSync));

  runPosition();

  runUpdate();

  runUnmount();

  runLayoutEffect();

  runEffect();

  needLoop.current = false;
}

function updateStart() {
  if (!needLoop.current) {
    const pendingUpdate = pendingModifyFiberArray.current
      .slice(0)
      .filter((f) => f.__needUpdate__ && f.mount);

    pendingUpdate.sort((f1, f2) => (f1.deepIndex - f2.deepIndex > 0 ? 1 : -1));

    pendingModifyFiberArray.current = [];

    startUpdateAll(pendingUpdate);
  }
}

const asyncUpdate = () => Promise.resolve().then(updateStart);

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function pushFiber(fiber) {
  if (!fiber.__needUpdate__) {
    fiber.__needUpdate__ = true;

    fiber.fiberAlternate = fiber;

    pendingModifyFiberArray.current.push(fiber);
  }

  asyncUpdate();
}

function prepareEffectArray(effectArray, index) {
  effectArray[index] = effectArray[index] || [];
  return effectArray[index];
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {Function} effect
 */
function pushLayoutEffect(fiber, effect) {
  prepareEffectArray(pendingLayoutEffectArray.current, fiber.deepIndex).push(
    effect
  );
}

function runLayoutEffect() {
  const allLayoutEffectArray = pendingLayoutEffectArray.current.slice(0);
  for (let i = allLayoutEffectArray.length - 1; i >= 0; i--) {
    const effectArray = allLayoutEffectArray[i];
    if (Array.isArray(effectArray) && effectArray.length) {
      effectArray.forEach((effect) => {
        if (typeof effect === "function") {
          effect();
        } else {
          effect.__pendingEffect__ = false;
          effect.effect = false;
          effect.cancel && effect.cancel();
          effect.cancel = effect.value();
        }
      });
    }
  }
  pendingLayoutEffectArray.current = [];
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {Function} effect
 */
function pushEffect(fiber, effect) {
  prepareEffectArray(pendingEffectArray.current, fiber.deepIndex).push(effect);
}

function runEffect() {
  const allEffectArray = pendingEffectArray.current.slice(0);
  setTimeout(() => {
    for (let i = allEffectArray.length - 1; i >= 0; i--) {
      const effectArray = allEffectArray[i];
      if (Array.isArray(effectArray)) {
        effectArray.forEach((effect) => {
          effect.__pendingEffect__ = false;
          effect.effect = false;
          effect.cancel && effect.cancel();
          effect.cancel = effect.value();
        });
      }
    }
  });
  pendingEffectArray.current = [];
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function pushUpdate(fiber) {
  if (!fiber.__pendingUpdate__) {
    fiber.__pendingUpdate__ = true;
    pendingUpdateFiberArray.current.push(fiber);
  }
}

function runUpdate() {
  const allUpdateArray = pendingUpdateFiberArray.current.slice(0);
  allUpdateArray.forEach((fiber) => {
    fiber.__pendingUpdate__ = false;
    if (fiber.mount) {
      commitUpdate(
        fiber,
        getDom(fiber.fiberParent, (fiber) => fiber.fiberParent) ||
          rootContainer.current
      );
    }
  });
}

/**
 *
 * @param {MyReactFiberNode | MyReactFiberNode[]} fiber
 */
function pushUnmount(fiber) {
  map(
    fiber,
    (f) => f instanceof MyReactFiberNode,
    (f) => {
      if (!f.__pendingUnmount__) {
        f.__pendingUnmount__ = true;
        pendingUnmountFiberArray.current.push(f);
      }
    }
  );
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
      hook.__context__.removeListener(hook);
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

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} beforeDom
 * @param {HTMLElement} parentDom
 */
function insertBefore(fiber, beforeDom, parentDom) {
  if (!fiber) throw new Error("意料之外的错误");
  fiber.effect = null;
  if (fiber.dom) {
    if (!fiber.__isPortal__) {
      parentDom.insertBefore(fiber.dom, beforeDom);
    }
  } else {
    fiber.children.forEach((f) => insertBefore(f, beforeDom, parentDom));
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} parentDom
 */
function append(fiber, parentDom) {
  if (!fiber) throw new Error("意料之外的错误");
  fiber.effect = null;
  if (fiber.dom) {
    if (!fiber.__isPortal__) {
      parentDom.append(fiber.dom);
    }
  } else {
    fiber.children.forEach((f) => append(f, parentDom));
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function pushPosition(fiber) {
  if (!fiber.__pendingPosition__) {
    fiber.__pendingPosition__ = true;
    pendingPositionFiberArray.current.push(fiber);
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parentFiber
 */
function appendToFragment(fiber, parentFiber) {
  const nextFiber = parentFiber.fiberSibling;
  fiber.effect = null;
  if (nextFiber) {
    insertBefore(
      fiber,
      getDom(nextFiber, (fiber) => fiber.fiberChildHead),
      getDom(fiber.fiberParent, (fiber) => fiber.fiberParent) ||
        rootContainer.current
    );
  } else if (parentFiber.fiberParent) {
    if (parentFiber.fiberParent.__isFragmentNode__) {
      appendToFragment(fiber, parentFiber.fiberParent);
    } else {
      append(
        fiber,
        getDom(parentFiber.fiberParent, (fiber) => fiber.fiberParent) ||
          rootContainer.current
      );
    }
  } else {
    console.log("root append");
    append(fiber, rootContainer.current);
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function commitPosition(fiber) {
  const children = fiber.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const fiber = children[i];
    if (fiber.diffMount) {
      if (fiber.diffPrevRender) {
        insertBefore(
          fiber,
          getDom(fiber.diffPrevRender, (fiber) => fiber.fiberChildHead),
          getDom(fiber.fiberParent, (fiber) => fiber.fiberParent) ||
            rootContainer.current
        );
      } else {
        // new create
        if (fiber.fiberSibling) {
          insertBefore(
            fiber,
            getDom(fiber.fiberSibling, (fiber) => fiber.fiberChildHead),
            getDom(fiber.fiberParent, (fiber) => fiber.fiberParent) ||
              rootContainer.current
          );
        } else {
          // last one
          if (fiber.fiberParent.__isFragmentNode__) {
            appendToFragment(fiber, fiber.fiberParent);
          } else {
            append(
              fiber,
              getDom(fiber.fiberParent, (fiber) => fiber.fiberParent) ||
                rootContainer.current
            );
          }
        }
      }
      fiber.diffMount = false;
      fiber.diffPrevRender = null;
    }
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function runPosition(fiber) {
  const allPositionArray = pendingPositionFiberArray.current.slice(0);
  allPositionArray.forEach((fiber) => {
    fiber.__pendingPosition__ = false;
    commitPosition(fiber);
  });
  pendingPositionFiberArray.current = [];
}

export {
  commitUpdate,
  pushFiber,
  pushEffect,
  runEffect,
  pushLayoutEffect,
  runLayoutEffect,
  pushUpdate,
  runUpdate,
  pushUnmount,
  runUnmount,
  pushPosition,
};
