const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (oldProps, newProps) => (key) => oldProps[key] !== newProps[key];
const isGone = (newProps) => (key) => !(key in newProps);

const deg = true;

const empty = {};

const type = {
  0: "vdom",
  1: "fiber",
  2: "hook",
};

// transform运行状态
let needLoop = false;
// 组件容器
let currentRootContainer = null;
// 根fiber节点，一个组件只有一个rootFiber
let currentRootFiber = null;
// 记录当前函数组件中的hook索引
let hookDepIndex = 0;
// 当前函数组件的fiber
let currentFunctionFiber = null;
// 修改过的所有fiber节点
let modifiedFiberArray = [];
// 待更新的所有fiber节点
let needUpdateFiberArray = [];
// effect 数组
let effectHookNodeArray = [];
// 需要卸载的fiber节点
let unmountFiberArray = [];
// 上次更新的时间
let lastUpdateTime = null;
// 当前需要转换的fiber数组
let currentTransformFiberArray = [];
// 下一层需要转换的fiber数组
let nextTransformFiberArray = [];

function debounce(action, time) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => action(...args), time);
  };
}

function throutle(action, time) {
  let allow = true;
  return (...args) => {
    if (allow) {
      allow = false;
      setTimeout(() => (allow = true), time);
      action(...args);
    }
  };
}

function isEqual(src, target, withChildren = true) {
  if (typeof src === "object") {
    let flag = true;
    for (let key in src) {
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

function isNormalEqual(src, target) {
  let flag = true;
  for (let key in src) {
    if (key === "fiber") {
      continue;
    }
    flag = flag && Object.is(src[key], target[key]);
  }
  return flag;
}

function shouldNotUpdate(fiber, alternate) {
  return (
    isEqual(fiber.memoState, alternate.memoState) &&
    isEqual(fiber.memoProps, alternate.memoProps)
  );
}

function debug(...args) {
  if (deg) {
    args.map(it => it instanceof MyReactFiberNode ? log(it) : it)
    console.log('[debug]', ...args.map(it => it instanceof MyReactFiberNode ? log(it) : it))
    // console.log("[debug]", args.length > 1 ? args : args[0]);
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

function getDom(fiber, transfer = (fiber) => fiber.parent) {
  if (fiber) {
    if (fiber.dom) {
      return fiber.dom;
    } else {
      return getDom(transfer(fiber), transfer);
    }
  }
}

class MyReactVDom {
  constructor(name, tagName, create, props, children) {
    this.type = type[0];
    this.name = name;
    this.create = create;
    this.tagName = tagName;
    this.props = props;
    this.children = children;
    this.processProps();
  }

  processProps() {
    this.__props__ = {
      ...this.props,
      children: this.props.children.map((i) =>
        typeof i === "object" ? i.__props__ : i
      ),
    };
  }
}

class MyReactFiberNode {
  constructor(
    key,
    fiberIndex,
    parent,
    alternate,
    previous,
    slibing,
    child,
    mount,
    dom,
    effect,
    needUpdate,
    firstHook,
    lastHook
  ) {
    this.key = key;
    this.type = type[1];

    this.fiberIndex = fiberIndex;
    this.parent = parent;
    this.alternate = alternate;
    this.previous = previous;
    this.slibing = slibing;
    this.child = child;

    this.mount = mount;
    this.dom = dom;
    this.effect = effect;
    this.needUpdate = needUpdate;
    this.firstHook = firstHook;
    this.lastHook = lastHook;
    this.memoProps = null;
    this.memoState = null;
    this.processFiber();
  }

  processFiber() {
    this.__children__ = [];
    this.__hookList__ = [];
  }
}

class MyReactHookNode {
  constructor(
    hookIndex,
    value,
    depArray,
    hookType,
    fiber,
    set,
    nextHook,
    prevHook,
    cancel,
    effect
  ) {
    this.type = type[2];
    this.hookIndex = hookIndex;
    this.value = value;
    this.depArray = depArray;
    this.hookType = hookType;
    this.fiber = fiber;
    this.set = set;
    this.nextHook = nextHook;
    this.prevHook = prevHook;
    this.cancel = cancel;
    this.effect = effect;
    this.result = null;
    this.prevResult = null;
  }
}

function createVDom(name, tagName, create, props, children) {
  return new MyReactVDom(name, tagName, create, props, children);
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
    return createVDom(type.name || "anonymous", null, type, props, children);
  } else {
    return createVDom(type, type, null, props, children);
  }
}

function createDom(fiber) {
  const isTextNode = fiber.isTextNode;

  const dom = isTextNode
    ? document.createTextNode(fiber.__vdom__)
    : document.createElement(fiber.__vdom__.tagName);

  updateDom(dom, empty, fiber.isTextNode ? empty : fiber.__vdom__.props);

  return dom;
}

function processFiberParent(fiber) {
  const parent = fiber.parent;

  const previous = fiber.previous;

  if (parent) {
    fiber.fiberIndex = +parent.fiberIndex + 1;
    if (previous === parent) {
      parent.child = fiber;
    } else {
      previous.slibing = fiber;
    }
    if (parent.child === fiber && parent.__children__.length > 1) {
      debug(
        "processFiberNode",
        "fiber关系错误: children长度应为0, 当前",
        parent.__children__.slice(0)
      );
    }
    parent.__children__.push(fiber);
  }
}

function processFiberNode(fiber, vdom) {
  fiber.__vdom__ = vdom;

  fiber.isTextNode = typeof vdom !== "object";

  fiber.isPlainNode =
    typeof vdom === "object" && !Boolean(vdom.create) && Boolean(vdom.tagName);

  processFiberParent(fiber);

  if (!fiber.dom && (fiber.isTextNode || fiber.isPlainNode)) {
    fiber.dom = createDom(fiber);
  }

  fiber.memoProps = fiber.isTextNode ? vdom : vdom.__props__;

  fiber.memoState = [];
}

function processFiberHookNode(fiber) {
  if (fiber.firstHook) {
    let hookNode = fiber.firstHook;
    if (fiber.__hookList__.length) {
      debug(
        "processFiberHookNode",
        "hook关系错误: children长度应为0, 当前",
        fiber.__hookList__.slice(0)
      );
    }
    while (hookNode) {
      hookNode.fiber = fiber;
      fiber.__hookList__.push(hookNode);
      hookNode = hookNode.nextHook;
    }
  }
}

function createFiberNode(
  {
    fiberIndex,
    parent,
    alternate,
    previous,
    slibing,
    child,
    mount = true,
    dom,
    effect,
    needUpdate = true,
    firstHook,
    lastHook,
  },
  vdom
) {
  const { key } = vdom.props || empty;
  const fiber = new MyReactFiberNode(
    key,
    fiberIndex,
    parent,
    alternate,
    previous,
    slibing,
    child,
    mount,
    dom,
    effect,
    needUpdate,
    firstHook,
    lastHook
  );

  processFiberNode(fiber, vdom);

  processFiberHookNode(fiber);

  return fiber;
}

function updateFiberNode(fiber, parent, previous) {
  debug("updateFiberNode", "update", fiber);
  fiber.parent = parent;
  fiber.previous = previous;
  processFiberParent(fiber);
  return fiber;
}

function render(element, container) {
  currentRootContainer = container;

  const currentVDom = createElement(null, null, element);

  const currentFiber = createFiberNode({ fiberIndex: 0 }, currentVDom);

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
      const canLoopTime = lastUpdateTime && Date.now() - lastUpdateTime <= 66;
      if (canLoopTime && modifiedFiberArray.length) {
        asyncLoop();
      } else {
        commitStart();
      }
    } else {
      requestIdleCallback(workLoop());
    }
  };
}

function processFiberChild(fiber) {
  const alternate = fiber.alternate;
  if (fiber !== alternate) {
    fiber.child = alternate.child;
    fiber.__children__ = alternate.__children__;
    if (fiber.child) {
      fiber.child.previous = fiber;
    }
    fiber.__children__.forEach((item) => (item.parent = fiber));
  } else {
    debug("processFiberChild", "相同节点", fiber, alternate);
  }
  fiber.needUpdate = false;
}

function nextWork(fiber) {
  let childrenFiberArray = [];

  if (fiber.needUpdate) {
    if (!fiber.isTextNode) {
      // 函数节点
      if (fiber.__vdom__.create) {
        // memo  not stable
        if (fiber.__vdom__.create.memo && fiber.alternate) {
          if (shouldNotUpdate(fiber, fiber.alternate)) {
            debug("fiber 状态相同 不执行更改", fiber, fiber.alternate);
            processFiberChild(fiber);
            return [];
          }
        }
        hookDepIndex = 0;
        currentFunctionFiber = fiber;
        if (fiber.__vdom__.children.length) {
          debug("nextWork", "函数组件存在children", fiber.__vdom__.children);
        }
        const children = fiber.__vdom__.create(fiber.__vdom__.props);
        fiber.__vdom__.__children__ = [children];
        childrenFiberArray = transformChildren(
          fiber,
          fiber.__vdom__.__children__
        );
        currentFunctionFiber = null;
      } else {
        childrenFiberArray = transformChildren(fiber, fiber.__vdom__.children);
      }
    }
  } else {
    debug("意外的fiber情况", fiber, fiber.effect);
  }

  fiber.needUpdate = false;

  return childrenFiberArray;
}

function isSameTypeNode(newVdom, previousRenderFiber, isTextNode) {
  if (newVdom === undefined || newVdom === null) {
    return false;
  }
  if (isTextNode) {
    return previousRenderFiber && previousRenderFiber.isTextNode;
  } else {
    return (
      previousRenderFiber &&
      !previousRenderFiber.isTextNode &&
      newVdom.tagName === previousRenderFiber.__vdom__.tagName
    );
  }
}

function processNewFiber(fiber, previousRenderFiber, sameType) {
  if (fiber) {
    if (!sameType) {
      fiber.alternate = null;

      if (previousRenderFiber) {
        if (fiber.dom || previousRenderFiber.dom) {
          fiber.effect = "REPLACE";
          fiber.replaceDom = getDom(
            previousRenderFiber,
            (fiber) => fiber.child
          );
          fiber.parentDom = getDom(
            previousRenderFiber.parent,
            (fiber) => fiber.parent
          );
        }
      }
    }
  }
}

// 按照需要将父fiber的 replace 状态转移到子fiber上
function processParentFiber(parentFiber, fiber) {
  // 只转移到child的fiber, 这是replace唯一会出现的情况
  if (parentFiber.child === fiber) {
    if (
      parentFiber.effect === "REPLACE" &&
      !parentFiber.dom &&
      parentFiber.replaceDom
    ) {
      fiber.effect = "REPLACE";
      fiber.replaceDom = parentFiber.replaceDom;
      fiber.parentDom = parentFiber.parentDom;
      // 还原parent的状态
      parentFiber.effect = "PLACEMENT";
      parentFiber.replaceDom = null;
      parentFiber.parentDom = null;
    }
  }
}

function processPreviousRenderFiber(previousRenderFiber, unmount) {
  if (previousRenderFiber) {
    previousRenderFiber.mount = false;
    previousRenderFiber.needUpdate = false;
    if (unmount) {
      previousRenderFiber.effect = "DELETE";
      pushUnmount(previousRenderFiber);
    }
  }
}

function transformChildren(parentFiber, children) {
  let index = 0;
  let newFiber = null;
  let currentFiber = null;
  let previousRenderChildren = parentFiber.alternate
    ? parentFiber.alternate.__children__
    : parentFiber.__children__;

  parentFiber.child = null;
  parentFiber.__children__ = [];

  while (index < children.length || index < previousRenderChildren.length) {
    const newVdom = children[index];
    const previousRenderFiber = previousRenderChildren[index];
    const isTextNode = typeof newVdom !== "object";

    const sameType = isSameTypeNode(newVdom, previousRenderFiber, isTextNode);

    if (sameType) {
      if (previousRenderFiber.effect) {
        newFiber = updateFiberNode(
          previousRenderFiber,
          parentFiber,
          currentFiber || parentFiber
        );
      } else {
        newFiber = createFiberNode(
          {
            parent: parentFiber,
            alternate: previousRenderFiber.effect
              ? previousRenderFiber.alternate
              : previousRenderFiber,
            previous: currentFiber || parentFiber,
            dom: previousRenderFiber.dom,
            firstHook: previousRenderFiber.firstHook,
            lastHook: previousRenderFiber.lastHook,
            effect: isTextNode
              ? newVdom === previousRenderFiber.__vdom__
                ? "NOTHING"
                : "UPDATE"
              : isEqual(
                  newVdom.props,
                  previousRenderFiber.__vdom__.props,
                  false
                )
              ? "NOTHING"
              : "UPDATE",
          },
          newVdom
        );
      }
      // if (previousRenderFiber.effect === "UPDATE") {
      //   console.log("需要跟进属性更新");
      // } else {
      //   console.log(previousRenderFiber.effect);
      // }
    } else if (newVdom !== undefined && newVdom !== null) {
      newFiber = createFiberNode(
        {
          parent: parentFiber,
          previous: currentFiber || parentFiber,
          effect: "PLACEMENT",
        },
        newVdom
      );
    }

    processNewFiber(newFiber, previousRenderFiber, sameType);

    processParentFiber(parentFiber, newFiber);

    processPreviousRenderFiber(previousRenderFiber, !sameType);

    currentFiber = newFiber;
    newFiber = null;
    index++;
  }

  return parentFiber.__children__;
}

function commitStart() {
  lastUpdateTime = Date.now();
  needUpdateFiberArray.forEach((fiber) => {
    if (fiber.mount) {
      const parentDom =
        getDom(fiber.parent, (fiber) => fiber.parent) || currentRootContainer;
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

function commitLoop(currentFiber, parentDom) {
  if (currentFiber) {
    if (currentFiber.dom) {
      if (currentFiber.effect === "REPLACE") {
        (currentFiber.parentDom || parentDom).replaceChild(
          currentFiber.dom,
          currentFiber.replaceDom
        );
        currentFiber.parentDom = null;
        currentFiber.replaceDom = null;
      } else if (currentFiber.effect === "PLACEMENT") {
        parentDom.appendChild(currentFiber.dom);
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
      currentFiber.dom.__vdom__ = currentFiber.__vdom__;
      currentFiber.dom.__children__ = currentFiber.__children__;
    }
    pushEffect(currentFiber);
    commitLoop(currentFiber.child, currentFiber.dom || parentDom);
    commitLoop(currentFiber.slibing, parentDom);
    currentFiber.effect = null;
    currentFiber.alternate = null;
  }
}

// =============== //
function processHookNode(hookNode, fiber) {
  if (hookNode.hookType === "useState") {
    hookNode.result =
      typeof hookNode.value === "function"
        ? hookNode.value.call(null)
        : hookNode.value;
  } else if (hookNode.hookType === "useEffect") {
    if (typeof hookNode.value !== "function") {
      throw new Error("useEffect 初始化需要传入函数");
    }
    hookNode.effect = true;
  } else if (hookNode.hookType === "useCallback") {
    if (typeof hookNode.value !== "function") {
      throw new Error("useCallback 初始化需要传入函数");
    }
    hookNode.result = hookNode.value;
  } else if (hookNode.hookType === "useMemo") {
    if (typeof hookNode.value !== "function") {
      throw new Error("useMemo 初始化需要传入函数");
    }
    hookNode.result = hookNode.value.call(null);
  } else {
    hookNode.result = hookNode.value;
  }
  if (fiber.firstHook) {
    fiber.lastHook.nextHook = hookNode;
    hookNode.prevHook = fiber.lastHook;
    fiber.lastHook = hookNode;
  } else {
    fiber.firstHook = hookNode;
    fiber.lastHook = hookNode;
  }
  fiber.__hookList__.push(hookNode);
}
function createHookNode({ hookIndex, value, depArray, hookType }, fiber) {
  const currentHookNode = new MyReactHookNode(
    hookIndex,
    value,
    depArray,
    hookType,
    fiber,
    null,
    null,
    null,
    null,
    null,
    null
  );

  processHookNode(currentHookNode, fiber);

  return currentHookNode;
}
function updateHookNode(hookNode, action, depArray) {
  if (hookNode.hookType === "useEffect") {
    if (depArray) {
      if (!hookNode.depArray) {
        throw new Error("依赖状态变更");
      }
      const isNotChange = isNormalEqual(hookNode.depArray, depArray);
      if (!isNotChange) {
        hookNode.value = action;
        hookNode.effect = true;
        hookNode.depArray = depArray;
      }
    } else {
      hookNode.value = action;
      hookNode.effect = true;
    }
  } else if (hookNode.hookType === "useCallback") {
    const isNotChange = isNormalEqual(hookNode.hookType, depArray);
    if (!isNotChange) {
      hookNode.value = action;
      hookNode.result = action;
      hookNode.depArray = depArray;
    }
  } else if (hookNode.hookType === "useMemo") {
    const isNotChange = isNormalEqual(hookNode.hookType, depArray);
    if (!isNotChange) {
      hookNode.value = action;
      hookNode.result = action.call(null);
      hookNode.depArray = depArray;
    }
  }
}
function getHookNode(fiber, hookIndex, hookType, value, depArray) {
  let hookNode = { value: 0, set: () => {} };
  if (fiber) {
    if (fiber.__hookList__.length > hookIndex) {
      let hook = fiber.firstHook;
      while (hook && hookIndex !== hook.hookIndex) {
        hook = hook.nextHook;
      }
      hookNode = hook;
      if (!hookNode) {
        throw new Error("hook index 错误");
      }
      updateHookNode(hookNode, value, depArray);
    } else {
      hookNode = createHookNode(
        {
          hookIndex,
          value,
          hookType,
          depArray,
        },
        fiber
      );
      hookNode.set = setValue.bind(hookNode);
    }
    fiber.memoState[hookIndex] = hookNode.result;
  }
  return hookNode;
}
function setValue(value) {
  const currentHookFiber = this.fiber;
  if (!currentHookFiber) {
    debug("setValue", currentHookFiber);
    throw new Error("错误的hook调用，未处于fiber节点中");
  }

  this.value = value;

  this.prevResult = this.result;

  if (typeof value === "function") {
    this.result = value(this.result);
  } else {
    this.result = value;
  }
  if (!Object.is(this.result, this.prevResult)) {
    pushFiber(currentHookFiber);
  }
}
function useState(init) {
  const currentHookIndex = hookDepIndex;
  const currentHookFiber = currentFunctionFiber;

  hookDepIndex++;

  const currentHookNode = getHookNode(
    currentHookFiber,
    currentHookIndex,
    "useState",
    init
  );

  return [currentHookNode.result, currentHookNode.set];
}
function useEffect(action, depArray) {
  const currentHookIndex = hookDepIndex;
  const currentHookFiber = currentFunctionFiber;

  hookDepIndex++;

  if (depArray && !Array.isArray(depArray)) {
    throw new Error("useEffect 依赖必须为一个数组");
  }

  getHookNode(
    currentHookFiber,
    currentHookIndex,
    "useEffect",
    action,
    depArray
  );
}
function useCallback(action, depArray) {
  const currentHookIndex = hookDepIndex;
  const currentHookFiber = currentFunctionFiber;

  hookDepIndex++;

  if (!depArray || !Array.isArray(depArray)) {
    throw new Error("useCallback 需要指定依赖");
  }

  return getHookNode(
    currentHookFiber,
    currentHookIndex,
    "useCallback",
    action,
    depArray
  ).result;
}
function useMemo(action, depArray) {
  const currentHookIndex = hookDepIndex;
  const currentHookFiber = currentFunctionFiber;

  hookDepIndex++;

  if (depArray && !Array.isArray(depArray)) {
    throw new Error("useMemo 依赖必须为一个数组");
  }

  return getHookNode(
    currentHookFiber,
    currentHookIndex,
    "useMemo",
    action,
    depArray
  ).result;
}
function useRef(value) {
  const currentHookIndex = hookDepIndex;
  const currentHookFiber = currentFunctionFiber;

  hookDepIndex++;

  return getHookNode(currentHookFiber, currentHookIndex, "useRef", {
    current: value,
  }).result;
}

// ============== //
function asyncLoop() {
  if (!needLoop) {
    modifiedFiberArray = modifiedFiberArray.filter(
      (fiber) => fiber.needUpdate && fiber.mount
    );
    modifiedFiberArray.sort((f1, f2) =>
      f1.fiberIndex - f2.fiberIndex > 0 ? 1 : -1
    );
    if (modifiedFiberArray.length) {
      startLoop(modifiedFiberArray.shift());
    } else {
      debug("asyncLoop", "没有需要更新的节点");
    }
  } else {
    debug("asyncLoop", "transform 运行中  不能更新");
  }
}

const debounceUpdate = debounce(asyncLoop, 20);

const throutleUpdate = throutle(asyncLoop, 20);

function pushFiber(fiber) {
  if (!fiber.needUpdate) {
    if (!fiber.mount) {
      console.log("fiber", fiber);
    }
    fiber.needUpdate = true;

    modifiedFiberArray.push(fiber);
  } else {
    debug("pushFiber", "已经存在更新队列中", fiber);
  }

  throutleUpdate();
}

function pushEffect(fiber) {
  if (fiber.firstHook) {
    let hook = fiber.firstHook;
    while (hook) {
      if (hook.hookType === "useEffect" && hook.effect) {
        // children effect run first
        effectHookNodeArray.unshift(hook);
      }
      hook = hook.nextHook;
    }
  }
}

function runEffect() {
  const allEffect = effectHookNodeArray.slice(0);
  allEffect.forEach((effect) => {
    effect.effect = false;
    effect.cancel && effect.cancel();
    effect.cancel = effect.value();
  });
  effectHookNodeArray = [];
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
      fiber.__children__.forEach(clearFiberNode);
    }
    if (fiber.firstHook) {
      let hook = fiber.firstHook;
      while (hook) {
        if (hook.hookType === "useEffect") {
          debug("clearFiberNode", "执行了 effect 清除", hook);
          hook.cancel();
        }
        hook = hook.nextHook;
      }
    }
    if (fiber.dom) {
      fiber.dom.remove();
    }
    fiber.mount = false;
    fiber.needUpdate = false;
  }
}

function log(fiber) {
  if (fiber.__root__) {
    return "fond in --> <Root />";
  } else {
    let re = 'fond in --> ' + `<${fiber.__vdom__.name} />`;
    while (fiber.parent) {
      fiber = fiber.parent;
      if (fiber.__root__) {
        re = ''.padStart(12) + `<Root />\n${re}`;
      } else {
        re = ''.padStart(12) + `<${fiber.__vdom__.name} />\n${re}`;
      }
    }
    return '\n' + re;
  }
}

function memo(functionComponent) {
  function memoComponent() {
    return functionComponent(arguments);
  }
  // memoComponent.memo = true;
  return memoComponent;
}

MReact = {
  createElement,
  render,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
};
