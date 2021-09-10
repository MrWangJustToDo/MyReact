const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (oldProps, newProps) => (key) => oldProps[key] !== newProps[key];
const isGone = (newProps) => (key) => !(key in newProps);

let deg = true;

function isNormalEqual(src, target) {
  if (typeof src === "object") {
    let flag = true;
    if (Array.isArray(src)) {
      if (src.length !== target.length) {
        return false;
      }
    }
    for (let key in src) {
      if (key === "fiber") {
        continue;
      }
      flag = flag && Object.is(src[key], target[key]);
      if (!flag) {
        break;
      }
    }
    return flag;
  } else {
    return src === target;
  }
}

function isEqual(src, target, withChildren = true) {
  if (typeof src === "object") {
    let flag = true;
    for (let key in src) {
      if (key === "fiber") {
        continue;
      }
      if (!withChildren && key === "children") {
        continue;
      }
      flag = flag && isEqual(src[key], target[key], withChildren);
      if (!flag) {
        break;
      }
    }
    return flag;
  } else {
    return src === target;
  }
}

function debounce(action, time) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => action(...args), time);
  };
}

function debug(...args) {
  if (deg) {
    console.log("[debug]", args.length > 1 ? args : args[0]);
  }
}

// ========= //

// transform运行状态
let needLoop = false;
// 组件容器
let currentContainer = null;
// 根fiber节点，一个组件只有一个rootFiber
let currentRootFiber = null;
// 记录当前函数组件中的hook索引
let hookIndex = 0;
// 当前函数组件的fiber
let currentFunctionFiber = null;
// 修改过的所有fiber节点
let modifiedFiberArray = [];
// 待更新的所有fiber节点
let needUpdateFiberArray = [];
// effect 数组
let effectNodeArray = [];
// 需要卸载的fiber节点
let unmountFiberArray = [];
// 上次更新的时间
let lastUpdateTime = null;

// 当前需要转换的fiber数组
let currentTransformFiberArray = [];
// 下一层需要转换的fiber数组
let nextTransformFiberArray = [];

function createVDOM(name, tagName, create, props, children) {
  return { name, tagName, create, props, children };
}

function processChildren(props, children) {
  children = children
    .concat(props.children || [])
    .reduce((p, c) => p.concat(c), [])
    .filter((c) => c !== undefined && c !== null);

  props.children = children;

  return children;
}

function createElement(type, props, ...children) {
  props = props || {};
  children = processChildren(props, children);

  if (typeof type === "function") {
    return createVDOM(type.name || "anonymous", null, type, props, children);
  } else {
    return createVDOM(type, type, null, props, children);
  }
}

function updateDom(element, oldProps, newProps) {
  Object.keys(oldProps)
    .filter(isEvent)
    .filter((key) => isGone(newProps)(key) || isNew(oldProps, newProps)(key))
    .forEach((key) => {
      const eventName = key.toLowerCase().slice(2);
      element.removeEventListener(eventName, oldProps[key]);
    });

  Object.keys(oldProps)
    .filter(isProperty)
    .filter(isGone(newProps))
    .forEach((key) => (element[key] = ""));

  Object.keys(newProps)
    .filter(isProperty)
    .filter(isNew(oldProps, newProps))
    .forEach((key) => (element[key] = newProps[key]));

  Object.keys(newProps)
    .filter(isEvent)
    .filter(isNew(oldProps, newProps))
    .forEach((key) => {
      const eventName = key.toLowerCase().slice(2);
      element.addEventListener(eventName, newProps[key]);
    });

  return element;
}

function createDom(fiber) {
  const textNode = fiber.isTextNode;

  const dom = textNode
    ? document.createTextNode(fiber.__vdom__)
    : document.createElement(fiber.__vdom__.tagName);

  updateDom(dom, {}, fiber.__vdom__.props || {});

  return dom;
}

function processFiberNode(fiber, vdom) {
  fiber.__vdom__ = vdom;

  fiber.isTextNode = typeof vdom !== "object";

  fiber.isPlainNode =
    typeof vdom === "object" && !Boolean(vdom.create) && Boolean(vdom.tagName);

  const parent = fiber.parent;

  const previous = fiber.previous;

  if (parent) {
    fiber.fiberIndex = +parent.fiberIndex + 1;
    if (previous === parent) {
      parent.child = fiber;
    }
    parent.children.push(fiber);
  }

  if (!fiber.dom && (fiber.isTextNode || fiber.isPlainNode)) {
    fiber.dom = createDom(fiber);
  }

  vdom.__fiber__ = fiber;
}

function createFiberNode(
  {
    fiberIndex,
    parent,
    alternate,
    previous,
    slibing,
    child = null,
    children = [],
    mount = true,
    dom,
    effect,
    needUpdate = true,
    hookLength = 0,
    firstHookNode,
    lastHookNode,
  },
  vdom
) {
  const { key } = vdom.props || {};
  const fiber = {
    key,
    fiberIndex,
    parent,
    alternate,
    previous,
    slibing,
    child,
    children,
    dom,
    mount,
    effect,
    needUpdate,
    hookLength,
    firstHookNode,
    lastHookNode,
  };

  processFiberNode(fiber, vdom);

  return fiber;
}

function render(element, container) {
  currentContainer = container;
  const currentVDOM = createElement(null, null, element);
  const currentFiber = createFiberNode({ fiberIndex: 0 }, currentVDOM);

  currentRootFiber = currentFiber;

  currentFiber.__root__ = true;

  startLoop(currentFiber);
}

function startLoop(fiber) {
  needLoop = true;

  needUpdateFiberArray.push(fiber);

  currentTransformFiberArray.push(fiber);

  requestIdleCallback(workLoop());
}

function workLoop() {
  return (deadline) => {
    let shouldYield = false;
    while (currentTransformFiberArray.length && !shouldYield) {
      const fiber = currentTransformFiberArray.shift();
      const childrenFiber = nextWork(fiber);
      nextTransformFiberArray.push(...childrenFiber);
      shouldYield = deadline.timeRemaining() < 1;
      if (!currentTransformFiberArray.length) {
        currentTransformFiberArray = nextTransformFiberArray;
        nextTransformFiberArray = [];
      }
    }

    if (!currentTransformFiberArray.length) {
      needLoop = false;
      commitStart();
    } else {
      requestIdleCallback(workLoop());
    }
  };
}

function nextWork(fiber) {
  let childrenFiberArray = [];

  if (fiber.needUpdate) {
    if (!fiber.isTextNode) {
      // 函数节点
      if (fiber.__vdom__.create) {
        hookIndex = 0;
        currentFunctionFiber = fiber;
        const children = fiber.__vdom__.create(fiber.__vdom__.props);
        childrenFiberArray = transformChildren(fiber, [children]);
        currentFunctionFiber = null;
      } else {
        childrenFiberArray = transformChildren(
          fiber,
          fiber.__vdom__.props.children
        );
      }
    } else {
      // debug('nextWork', '文本节点', fiber)
    }
  } else {
    debug("意外的fiber情况", fiber);
  }

  fiber.dom && (fiber.dom.__fiberChildren__ = fiber.children);

  fiber.needUpdate = false;

  return childrenFiberArray;
}

function sameTypeNode(vdom, previousRenderFiber, isTextNode) {
  if (!vdom) {
    return false;
  }
  if (isTextNode) {
    return previousRenderFiber && previousRenderFiber.isTextNode;
  } else {
    return (
      previousRenderFiber &&
      !previousRenderFiber.isTextNode &&
      vdom.tagName === previousRenderFiber.__vdom__.tagName
    );
  }
}

function processPreviousRenderFiber(previousRenderFiber, unmount) {
  if (previousRenderFiber) {
    previousRenderFiber.needUpdate = false;
    if (unmount) {
      previousRenderFiber.mount = false;
      previousRenderFiber.effect = "DELETE";
      pushUnmount(previousRenderFiber);
    }
  }
}

function transformChildren(fiber, children) {
  let index = 0;
  let newFiber = null;
  let currentFiber = null;
  let previousRenderChildren = fiber.alternate
    ? fiber.alternate.children
    : fiber.children;
  let nextTransform = [];

  fiber.child = null;
  fiber.children = [];

  while (index < children.length || index < previousRenderChildren.length) {
    const newVdom = children[index];
    const previousRenderFiber = previousRenderChildren[index];
    const isTextNode = typeof newVdom !== "object";
    let needUpdate = true;

    const sameType = sameTypeNode(newVdom, previousRenderFiber, isTextNode);

    if (sameType) {
      newFiber = createFiberNode(
        {
          parent: fiber,
          alternate: previousRenderFiber,
          previous: currentFiber || fiber,
          dom: previousRenderFiber.dom,
          hookLength: previousRenderFiber.hookLength,
          firstHookNode: previousRenderFiber.firstHookNode,
          lastHookNode: previousRenderFiber.lastHookNode,
          effect: isTextNode
            ? newVdom === previousRenderFiber.__vdom__
              ? "NOTHING"
              : "UPDATE"
            : isEqual(newVdom.props, previousRenderFiber.__vdom__.props, false)
            ? "NOTHING"
            : "UPDATE",
        },
        newVdom
      );
    } else if (!sameType && newVdom !== undefined && newVdom !== null) {
      newFiber = createFiberNode(
        {
          parent: fiber,
          alternate: previousRenderFiber,
          previous: currentFiber || fiber,
          effect: previousRenderFiber ? "REPLACE" : "PLACEMENT",
        },
        newVdom
      );
    }

    processPreviousRenderFiber(previousRenderFiber, !sameType);

    if (currentFiber) {
      currentFiber.slibing = newFiber;
    }

    if (newFiber && needUpdate) {
      nextTransform.push(newFiber);
    }

    currentFiber = newFiber;
    // 重置当前fiber
    newFiber = null;
    index++;
  }

  return nextTransform;
}

// ============= //
function commitStart() {
  lastUpdateTime = Date.now();
  needUpdateFiberArray.forEach((fiber) => {
    if (fiber.mount) {
      let parentFiber = fiber.parent;
      let parentDom = null;
      while (parentFiber) {
        if (parentFiber.dom) {
          parentDom = parentFiber.dom;
          break;
        } else {
          parentFiber = parentFiber.parent;
        }
      }
      parentDom = parentDom || currentContainer;
      try {
        commitLoop(fiber, parentDom);
      } catch (e) {
        console.error(e);
      }
    } else {
      debug("commitStart", "卸载的fiber节点", fiber);
    }
  });

  runUnmount();
  runEffect();

  needUpdateFiberArray = [];
}
function getAlternate(fiber) {
  if (fiber) {
    if (fiber.effect === "REPLACE" && fiber.alternate) {
      const re = fiber.alternate;
      fiber.effect = null;
      fiber.alternate = null;
      return re;
    } else {
      return getAlternate(fiber.parent);
    }
  }
}
function getReplaceDom(fiber) {
  if (fiber) {
    if (fiber.dom) {
      return fiber.dom;
    } else {
      return getReplaceDom(fiber.child);
    }
  }
}
function commitLoop(currentFiber, parentDom) {
  if (currentFiber) {
    if (currentFiber.dom) {
      if (
        currentFiber.effect === "REPLACE" ||
        currentFiber.effect === "PLACEMENT"
      ) {
        const oldDom = getReplaceDom(getAlternate(currentFiber));
        if (oldDom) {
          parentDom.replaceChild(currentFiber.dom, oldDom);
        } else {
          parentDom.appendChild(currentFiber.dom);
        }
      } else if (currentFiber.effect === "UPDATE") {
        if (currentFiber.isTextNode) {
          currentFiber.dom.textContent = currentFiber.__vdom__;
        } else {
          updateDom(
            currentFiber.dom,
            currentFiber.alternate.__vdom__.props,
            currentFiber.__vdom__.props
          );
        }
      }
      currentFiber.dom.__fiber__ = currentFiber;
      currentFiber.dom.__props__ = currentFiber.__vdom__.props;
      currentFiber.dom.__children__ = currentFiber.__vdom__.children;
      currentFiber.dom.__fiberChildren__ = currentFiber.children;
    }
    pushEffect(currentFiber);
    commitLoop(currentFiber.slibing, parentDom);
    commitLoop(currentFiber.child, currentFiber.dom || parentDom);
    currentFiber.effect = null;
    currentFiber.alternate = null;
  }
}

// ============= //
function processHookNode(hookNode, fiber) {
  if (fiber.firstHookNode) {
    fiber.hookLength++;
    fiber.lastHookNode.nextNode = hookNode;
    hookNode.prevNode = fiber.lastHookNode;
    fiber.lastHookNode = hookNode;
  } else {
    fiber.firstHookNode = hookNode;
    fiber.lastHookNode = hookNode;
    fiber.hookLength = 1;
  }
}
function createHookNode({ hookIndex, value, type, deps }, fiber) {
  const currentHookNode = {
    isHookNode: true,
    hookIndex,
    value,
    deps,
    type,
    fiber,
    set: null,
    nextNode: null,
    prevNode: null,
    prevValue: null,
    cancel: null,
    effect: type === "useEffect",
  };

  processHookNode(currentHookNode, fiber);

  return currentHookNode;
}
function updateHookNode(hookNode, action, deps) {
  if (hookNode.type === "useEffect") {
    if (deps) {
      if (!hookNode.deps) {
        throw new Error("依赖状态变更");
      }
      const isChanged = isNormalEqual(hookNode.deps, deps);
      if (isChanged) {
        hookNode.value = action;
        hookNode.effect = true;
        hookNode.deps = deps;
      }
    } else {
      hookNode.value = action;
      hookNode.effect = true;
    }
  }
}
function getHookNode(fiber, index, type, init, deps) {
  let hookNode = null;
  if (fiber.hookLength > index) {
    let hook = fiber.firstHookNode;
    hook.prevNode = fiber;
    while (hook && index !== hook.hookIndex) {
      hook.fiber = fiber;
      hook = hook.nextNode;
    }
    hook.fiber = fiber;
    hookNode = hook;
    if (!hookNode) {
      throw new Error("hook index 错误");
    }
    updateHookNode(hookNode, init, deps);
  } else {
    hookNode = createHookNode(
      { hookIndex: index, value: init, type, deps },
      fiber
    );
    hookNode.set = setValue.bind(hookNode);
  }
  return hookNode;
}
function setValue(value) {
  const currentHookFiber = this.fiber;
  if (!currentHookFiber) {
    throw new Error("错误的hook调用，未处于fiber节点中");
  }
  this.previousValue = this.value;

  if (typeof value === "function") {
    this.value = value(this.value);
  } else {
    this.value = value;
  }
  if (!Object.is(this.value, this.previousValue)) {
    pushFiber(currentHookFiber);
  }
}
function useState(init) {
  const currentHookIndex = hookIndex;
  const currentHookFiber = currentFunctionFiber;

  hookIndex++;

  const currentHookNode = getHookNode(
    currentHookFiber,
    currentHookIndex,
    "useState",
    init
  );

  return [currentHookNode.value, currentHookNode.set];
}
function useEffect(action, deps) {
  const currentHookIndex = hookIndex;
  const currentHookFiber = currentFunctionFiber;

  hookIndex++;

  if (deps && !Array.isArray(deps)) {
    throw new Error("useEffect 依赖必须为一个数组");
  }

  getHookNode(currentHookFiber, currentHookIndex, "useEffect", action, deps);
}

// =============== //
function asyncLoop() {
  if (!needLoop) {
    modifiedFiberArray = modifiedFiberArray.filter((fiber) => fiber.needUpdate);
    if (modifiedFiberArray.length) {
      startLoop(modifiedFiberArray.shift());
    } else {
      debug("asyncLoop", "没有需要更新的节点");
    }
  } else {
    debug("asyncLoop", "transform 运行中  不能更新");
  }
}

const debounceUpdate = debounce(asyncLoop, 0);

function pushFiber(fiber) {
  fiber.needUpdate = true;

  modifiedFiberArray.push(fiber);

  debounceUpdate();
}

function pushEffect(fiber) {
  if (fiber.hookLength) {
    let hook = fiber.firstHookNode;
    while (hook) {
      if (hook.isHookNode && hook.type === "useEffect" && hook.effect) {
        effectNodeArray.push(hook);
      }
      hook = hook.nextNode;
    }
  }
}

function runEffect() {
  const allEffect = effectNodeArray.slice(0);
  allEffect.forEach((effect) => {
    effect.effect = false;
    effect.cancel && effect.cancel();
    effect.cancel = effect.value();
  });
  effectNodeArray = [];
}

function pushUnmount(fiber) {
  unmountFiberArray.push(fiber);
}

function runUnmount() {
  const allUnmount = unmountFiberArray.slice(0);
  allUnmount.forEach(clearFiberNode);
  unmountFiberArray = [];
}

function clearFiberNode(fiber) {
  if (fiber) {
    if (fiber.child) {
      fiber.children.forEach(clearFiberNode);
    }
    if (fiber.hookLength) {
      let hook = fiber.firstHookNode;
      while (hook) {
        if (hook.isHookNode && hook.type === "useEffect") {
          debug("clearFiberNode", "执行了 effect 清除", hook);
          hook.cancel();
        }
        hook = hook.nextNode;
      }
    }
    if (fiber.dom) {
      fiber.dom.remove();
    }
    fiber.mount = false;
    fiber.needUpdate = false;
  }
}

MReact = {
  createElement,
  render,
  useState,
  useEffect,
  memo: () => {},
};
