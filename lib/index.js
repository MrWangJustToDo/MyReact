const isEvent = (key) => key.startsWith("on");

const isProperty = (key) =>
  key !== "children" && !isEvent(key) && !isStyle(key);

const isNew = (oldProps, newProps) => (key) => oldProps[key] !== newProps[key];

const isGone = (newProps) => (key) => !(key in newProps);

const isStyle = (key) => key === "style";

const isHighLightUpdate = false;

const isAsyncUpdate = true;

const enableKeyDiff = true;

const empty = {};

const type = {
  vdom: "vdom",
  fiber: "fiber",
  hook: "hook",
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
// 当前需要运行的修改过的节点
let _modifiedFiberArray = [];
// 需要更新的所有fiber节点
let needUpdateFiberArray = [];
// 需要更新位置的所有的节点
let needPositionFiberArray = [];
// 需要卸载的fiber节点
let needUnmountFiberArray = [];
// 需要运行的effect数组
let needEffectNodeArray = [];
// 需要同步运行的effect数组
let needLayoutEffectNodeArray = [];
// 需要转换的所有fiber数组
let pendingTransformFiberArray = [];
// 当前需要转换的fiber数组
let currentTransformFiberArray = [];
// 下一次需要转换的fiber数组
let nextTransformFiberArray = [];
// highLight parent
let highLightDomContainer = null;
// 是否是已经挂载的状态
let isMounted = false;
// 当前运行的fiber
let currentRunningFiber = null;

// ============ //  tool
function once(func) {
  let flag = false;
  return (...args) => {
    if (!flag) {
      flag = true;
      func.call(null, ...args);
    }
  };
}

// 简单判断两个对象的成员是否相等
function isNormalEqual(src, target) {
  if (
    typeof src === "object" &&
    typeof target === "object" &&
    src !== null &&
    target !== null
  ) {
    let flag = true;
    for (let key in src) {
      flag = flag && Object.is(src[key], target[key]);
      if (!flag) {
        return flag;
      }
    }
    return flag;
  }
  return Object.is(src, target);
}

// 判断props是否改变过
function isEqual(src, target) {
  if (typeof src === "object" && typeof target === "object") {
    let flag = true;
    for (let key in src) {
      if (key !== "children") {
        flag = flag && isEqual(src[key], target[key]);
      }
    }
    return flag;
  }
  return Object.is(src, target);
}

// ============= // dom

function _highLightDom(fiber) {
  if (fiber.__isPlainNode__) {
    const dom = fiber.dom;
    if (!fiber.__highLightCover__) {
      const cover = document.createElement("div");
      highLightDomContainer.append(cover);
      fiber.__highLightCover__ = cover;
    }

    const left = dom.offsetLeft;
    const top = dom.offsetTop;
    const width = dom.offsetWidth + 4;
    const height = dom.offsetHeight + 4;
    const positionLeft = left - 2;
    const positionTop = top - 2;
    fiber.__highLightCover__.style.cssText = `
      position: absolute;
      width: ${width}px;
      height: ${height}px;
      left: ${positionLeft}px;
      top: ${positionTop}px;
      pointer-events: none;
      box-shadow: .0625rem .0625rem .0625rem red, -0.0625rem -0.0625rem .0625rem red;
      transition: boxShadow 0.3s
      `;
    setTimeout(() => {
      fiber.__highLightCover__.style.boxShadow = "none";
    }, 100);
  } else {
    _highLightDom(fiber.parent);
  }
}

function highLightDom(fiber) {
  if (isHighLightUpdate) {
    _highLightDom(fiber);
  }
}

function startHighLight() {
  if (isHighLightUpdate) {
    highLightDomContainer = document.createElement("div");
    highLightDomContainer.style.cssText = `
    position: absolute;
    z-index: 9999999;
    width: 100%;
    left: 0rem;
    top: 0rem;
    `;
    document.body.append(highLightDomContainer);
  }
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

function updateDom(element, oldProps, newProps, fiber) {
  if (fiber.__isTextNode__) {
    element.textContent = fiber.__vdom__;
  } else if (fiber.__isPlainNode__) {
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

    Object.keys(newProps)
      .filter(isStyle)
      .forEach((styleKey) => {
        Object.keys(newProps[styleKey])
          .filter(isNew(oldProps[styleKey] || empty, newProps[styleKey]))
          .forEach((styleName) => {
            element.style[styleName] = newProps[styleKey][styleName];
          });
      });
  }
  return element;
}

function createDom(fiber) {
  const dom = fiber.__isTextNode__
    ? document.createTextNode(fiber.__vdom__)
    : document.createElement(fiber.__vdom__.tagName);

  updateDom(
    dom,
    empty,
    fiber.__isTextNode__ ? empty : fiber.__vdom__.rawProps,
    fiber
  );

  return dom;
}

// =========== // instance
class MyReactVDom {
  constructor(name, tagName, create, props, children, rawType) {
    const { key, ref, ...resProps } = props || {};
    this.type = type.vdom;
    this.name = name;
    this.create = create;
    this.tagName = tagName;
    this.key = key;
    this.ref = ref;
    this.props = resProps;
    this.children = children;
    this.rawType = rawType;
    this._initialProps();
    this._initialType();
  }

  _initialProps() {
    if (this.props.children) {
      this.rawProps = {
        ...this.props,
        children: Array.isArray(this.props.children)
          ? this.props.children.map((i) =>
              typeof i === "object" ? i.rawProps : i
            )
          : typeof this.props.children === "object"
          ? this.props.children.rawProps
          : this.props.children,
      };
    } else {
      this.rawProps = this.props;
    }
  }

  _initialType() {
    this.__isEmptyNode__ = false;
    this.__isPlainNode__ = false;
    this.__isClonedNode__ = false;
    this.__isContextNode__ = false;
    this.__isContextProvider__ = false;
    this.__isContextConsumer__ = false;
    this.__isFragmentNode__ = false;
    this.__isDynamicNode__ = false;
    this.__isClassComponent__ = false;
    this.__isFunctionComponent__ = false;
  }
}

class MyReactFiberNode {
  constructor(
    key,
    deepIndex,
    parent,
    alternate,
    previous,
    slibing,
    child,
    mount,
    dom,
    effect,
    initial,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance,
    last
  ) {
    this.key = key;
    this.type = type.fiber;

    // fiber 深度
    this.deepIndex = deepIndex;
    // 父级fiber
    this.parent = parent;
    // 更新前一次的fiber
    this.alternate = alternate;
    // fiber链的前一个  可能是同级或者父级
    this.previous = previous;
    this.slibing = slibing;
    this.child = child;
    // 前一次render对应位置的fiber
    this.last = last;

    this.mount = mount;
    this.dom = dom;
    this.effect = effect;
    this.initial = initial;
    this.hookHead = hookHead;
    this.hookFoot = hookFoot;
    this.hookList = hookList;
    this.listeners = listeners;
    this.instance = instance;
    this._initialState();
    this._initialUpdate();
    this._initialType();
  }

  _initialState() {
    this.memoProps = null;
    this.memoState = null;
    this.children = [];
    this.hookList = this.hookList || [];
    this.listeners = this.listeners || new Set();
  }

  _initialUpdate() {
    this.__needUpdate__ = false;
    // 子元素需要调整位置
    this.__pendingIndex__ = false;
    // 当前需要更新
    this.__pendingUpdate__ = false;
    // 当前需要卸载  类型不同
    this.__pendingUnmount__ = false;
    // 更新运行次数
    this.__renderCount__ = 1;
    this.__highLightCover__ = null;
    this.__updateTimeStep__ = Date.now();
    this.__lastUpdateTimeStep__ = null;
  }

  _initialType() {
    this.__isTextNode__ = false;
    this.__isEmptyNode__ = false;
    this.__isPlainNode__ = false;
    this.__isDynamicNode__ = false;
    this.__isContextNode__ = false;
    this.__isFragmentNode__ = false;
    // === //
    this.__isContextProvider__ = false;
    this.__isContextConsumer__ = false;
    this.__isClassComponent__ = false;
    this.__isFunctionComponent__ = false;
  }

  addListener(node) {
    this.listeners.add(node);
  }

  removeListener(node) {
    this.listeners.delete(node);
  }

  update() {
    // 或许需要更多的更新情况
    if (this.mount) {
      pushFiber(this);
    } else {
      console.error("unmount update");
    }
  }
}

class MyReactHookNode {
  constructor(
    hookIndex,
    value,
    depArray,
    hookType,
    nextHook,
    prevHook,
    cancel,
    effect
  ) {
    this.type = type.hook;
    this.hookIndex = hookIndex;
    this.value = value;
    this.depArray = depArray;
    this.hookType = hookType;
    this.nextHook = nextHook;
    this.prevHook = prevHook;
    this.cancel = cancel;
    this.effect = effect;
    this._initialHook();
    this._initialDeps();
  }

  setValue = (value) => {
    this.value = value;

    this.prevResult = this.result;

    if (typeof value === "function") {
      this.result = value(this.result);
    } else {
      this.result = value;
    }
    if (!Object.is(this.result, this.prevResult)) {
      Promise.resolve().then(() => this.__fiber__.update());
    }
  };

  _initialHook() {
    this.result = null;
    this.prevResult = null;
  }

  _initialDeps() {
    this.__fiber__ = null;
    this.__context__ = null;
    this.__pendingEffect__ = null;
  }
}

class MyReactComponent {
  constructor(props, context) {
    this.props = props;
    this.context = context;
  }

  __fiber__ = null;

  __context__ = null;

  __prevProps__ = null;

  __nextProps__ = null;

  __prevState__ = null;

  __nextState__ = null;

  __pendingEffect__ = null;

  get isMyReactComponent() {
    return true;
  }

  setState = (newValue) => {
    let newState = newValue;
    if (typeof newValue === "function") {
      newState = newValue(this.state);
    }
    this.__nextState__ = newState;
    if (!Object.is(this.state, this.__nextState__)) {
      this.forceUpdate();
    }
  };

  forceUpdate = () => {
    Promise.resolve().then(() => this.__fiber__.update());
  };
}

class MyReactPureComponent extends MyReactComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isNormalEqual(this.props, nextProps) ||
      !isNormalEqual(this.state, nextState)
    );
  }
}

// ============ //  vdom
function processVDomType(vdom) {
  let rawType = vdom.rawType;
  // for context node
  if (typeof vdom.rawType === "object" && vdom.rawType !== null) {
    vdom.__isContextNode__ = true;
    rawType = vdom.rawType.type;
  }
  if (rawType === MReact.Fragment) {
    vdom.__isFragmentNode__ = true;
  } else if (rawType === MReact.Provider) {
    vdom.__isContextProvider__ = true;
  } else if (rawType === MReact.Consumer) {
    vdom.__isContextConsumer__ = true;
  } else if (vdom.tagName && !vdom.create) {
    vdom.__isPlainNode__ = true;
  } else if (!vdom.tagName && vdom.create) {
    vdom.__isDynamicNode__ = true;
    // support class component
    if (vdom.create.prototype.isMyReactComponent) {
      vdom.__isClassComponent__ = true;
    } else {
      vdom.__isFunctionComponent__ = true;
    }
  } else {
    vdom.__isEmptyNode__ = true;
  }
}

function createVDom(name, tagName, create, props, children, rawType) {
  const vdom = new MyReactVDom(name, tagName, create, props, children, rawType);

  processVDomType(vdom);

  return vdom;
}

function _processCheckChildrenKey(children) {
  // check children
  if (
    children.some((child) => isValidElement(child) && child.key === undefined)
  ) {
    console.error(
      "each array child need a key props",
      logFiber(currentRunningFiber)
    );
  }
}

const processCheckChildrenKey = once(_processCheckChildrenKey);

function processEmptyChildren(children) {
  if (Array.isArray(children)) {
    return children.filter((c) => c !== undefined).map((c) => c ?? "");
  } else {
    return children ?? "";
  }
}

function processValidChildren(children, type) {
  if (children.some((c) => typeof c === "object" && !isValidElement(c))) {
    throw new Error(`invalid vdom type ${logFiber(currentRunningFiber)}`);
  }
  if (typeof type === "object" && type?.type === MReact.Consumer) {
    if (children.length > 1) {
      throw new Error(
        `Context consumer have more than one children ${logFiber(
          currentRunningFiber
        )}`
      );
    }
    if (typeof children[0] !== "function") {
      throw new Error(
        `Context consumer need function as children ${logFiber(
          currentRunningFiber
        )}`
      );
    }
  }
  return children;
}

function processFlattenChildren(children) {
  children.forEach((child) => {
    if (Array.isArray(child)) {
      processCheckChildrenKey(child);
    }
  });

  children = children.reduce((p, c) => p.concat(c), []);

  children = processEmptyChildren(children);

  processValidChildren(children);

  return children;
}

function _createElement(type, props, children, rawType) {
  if (type === MReact.Context)
    throw new Error(
      "look like you use <Context /> not <Context.Provider /> in the component"
    );
  if (type === MReact.Provider)
    return createVDom("Context.Provider", null, null, props, children, rawType);
  if (type === MReact.Consumer)
    return createVDom("Context.Consumer", null, null, props, children, rawType);
  if (type === MReact.Fragment)
    return createVDom("Fragment", null, null, props, children, rawType);
  if (typeof type === "function")
    return createVDom(
      type.name || "Unknown",
      null,
      type,
      props,
      children,
      rawType
    );
  return createVDom(type, type, null, props, children, rawType);
}

// support a plain children
function createElement(type, props, children) {
  let childrenLength = arguments.length - 2;

  props = props || {};

  if (childrenLength > 1) {
    children = Array.from(arguments).slice(2);
    children = processFlattenChildren(children);
  } else if (Array.isArray(children)) {
    children = processEmptyChildren(children);
    processValidChildren(children);
    processCheckChildrenKey(children);
  } else if (children) {
    processValidChildren([children], type);
  }

  // 将children参数自动添加到props中
  if (
    (Array.isArray(children) && children.length) ||
    (children !== null && children !== undefined)
  ) {
    props.children = children;
  }

  if (typeof type === "object" && type !== null) {
    const { type: elementType, ...resProps } = type;
    return _createElement(
      elementType,
      { ...resProps, ...props },
      children,
      type
    );
  }

  return _createElement(type, props, children, type);
}

function cloneElement(element, props, children) {
  if (element instanceof MyReactVDom) {
    let clonedElement = createElement(
      element.rawType,
      { ...element.props, ref: element.ref, key: element.key, ...props },
      children,
      ...Array.from(arguments).slice(3)
    );
    clonedElement.__isClonedNode__ = true;
    return clonedElement;
  } else {
    return element;
  }
}

// ================= // fiber

function processFiberParent(fiber) {
  const parent = fiber.parent;

  const previous = fiber.previous;

  if (parent) {
    // 当前fiber是parent的第一个
    if (previous === parent) {
      parent.child = fiber;
    } else {
      // 不是第一个
      previous.slibing = fiber;
    }
    // 当是第一个的时候  判断数组是不是为空
    if (parent.child === fiber && parent.children.length > 1) {
      throw new Error("执行错误");
    }
    parent.children.push(fiber);
  }
}

function processFiberType(fiber) {
  if (!fiber.initial) return;
  const vdom = fiber.__vdom__;
  if (vdom instanceof MyReactVDom) {
    fiber.__isEmptyNode__ = vdom.__isEmptyNode__;

    fiber.__isPlainNode__ = vdom.__isPlainNode__;

    fiber.__isDynamicNode__ = vdom.__isDynamicNode__;

    fiber.__isContextNode__ = vdom.__isContextNode__;

    fiber.__isFragmentNode__ = vdom.__isFragmentNode__;

    fiber.__isClassComponent__ = vdom.__isClassComponent__;

    fiber.__isFunctionComponent__ = vdom.__isFunctionComponent__;

    fiber.__isContextProvider__ = vdom.__isContextProvider__;

    fiber.__isContextConsumer__ = vdom.__isContextConsumer__;
  } else {
    fiber.__isTextNode__ = typeof vdom !== "object";
    // 之前的错误用法造成的这个问题， 现在都不存在了。  暂时保留
    fiber.__isEmptyNode__ = typeof vdom === "object";
  }
}

function processFiberDom(fiber) {
  if (!fiber.initial) return;
  if (!fiber.dom && (fiber.__isTextNode__ || fiber.__isPlainNode__)) {
    fiber.dom = createDom(fiber);
  }
}

function processFiberRef(fiber) {
  if (fiber.__isPlainNode__) {
    const { ref } = fiber.__vdom__;
    if (typeof ref === "object") {
      ref.current = fiber.dom;
    } else if (typeof ref === "function") {
      try {
        ref.call(null, fiber.dom);
      } catch (e) {
        console.error("ref 执行错误");
      }
    }
  }
}

function processConsumerInstance(fiber) {
  if (fiber.__isContextConsumer__) {
    // 如果当前 consumer 的 fiber是一个新创建出来的
    if (fiber.initial) {
      fiber.instance = fiber.instance || new fiber.__vdom__.rawType.Internal();
    }
    fiber.instance.__fiber__ = fiber;
  }
}

function processFiberTree(fiber) {
  fiber.__tree__ = logFiber(fiber);
}

function processFiberUpdateState(fiber) {
  if (fiber.alternate) {
    fiber.alternate.alternate = null;
    fiber.__needUpdate__ = fiber.alternate.__needUpdate__;
    fiber.__renderCount__ = fiber.alternate.__renderCount__ + 1;
    fiber.__lastUpdateTimeStep__ = fiber.alternate.__updateTimeStep__;
  }
  if (fiber.last) fiber.last.last = null;
}

function processFiberNode(fiber, vdom) {
  fiber.__vdom__ = vdom;

  processFiberType(fiber);

  processFiberParent(fiber);

  processFiberDom(fiber);

  processFiberRef(fiber);

  processConsumerInstance(fiber);

  processFiberUpdateState(fiber);

  // processFiberTree(fiber);

  fiber.memoProps = !fiber.__isTextNode__ ? vdom.rawProps : null;
}

function createFiberNode(
  {
    deepIndex,
    parent,
    alternate,
    previous,
    slibing,
    child,
    mount = true,
    dom,
    effect,
    initial = true,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance,
    last,
  },
  vdom
) {
  const { key } = vdom || empty;
  const fiber = new MyReactFiberNode(
    key,
    deepIndex,
    parent,
    alternate,
    previous,
    slibing,
    child,
    mount,
    dom,
    effect,
    initial,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance,
    last
  );

  processFiberNode(fiber, vdom);

  return fiber;
}

// ============ // mount

function render(element, container) {
  currentRootContainer = container;

  if (!element instanceof MyReactVDom) throw new Error("render 参数错误");

  startHighLight();

  const currentVDom = createElement(null, null, element);

  const currentFiber = createFiberNode({ deepIndex: 0 }, currentVDom);

  currentRootFiber = currentFiber;

  currentRootFiber.__root__ = true;

  startRender(currentRootFiber);
}

function startRender(fiber) {
  needLoop = true;

  renderLoopSync(fiber);

  mountStart();

  runLayoutEffect();

  runEffect();

  isMounted = true;

  needLoop = false;
}

function transformCurrent(fiber) {
  if (!fiber.mount) {
    // console.log("unmount fiber", fiber);
    return;
  }
  // 从当前节点触发的更新,需要使用本次此时的children作为比较依据,将已经存在的前一次渲染结果舍弃
  if (fiber.alternate) {
    fiber.alternate = null;
  }
  const childrenFiber = nextWork(fiber);
  currentTransformFiberArray.push(...childrenFiber);
}

function transformNext() {
  const fiber = currentTransformFiberArray.shift();

  if (!fiber.mount) return;

  const childrenFiber = nextWork(fiber);

  nextTransformFiberArray.push(...childrenFiber);
}

function transformAll() {
  while (currentTransformFiberArray.length) {
    transformNext();
  }
  if (nextTransformFiberArray.length) {
    currentTransformFiberArray = nextTransformFiberArray;
    nextTransformFiberArray = [];
    transformAll();
  }
}

function renderLoopSync(fiber) {
  transformCurrent(fiber);
  transformAll();
}

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
          : currentFiber.alternate.__vdom__.rawProps,
        currentFiber.__isTextNode__ ? empty : currentFiber.__vdom__.rawProps,
        currentFiber
      );
      highLightDom(currentFiber);
    }
    currentFiber.dom.__fiber__ = currentFiber;
    currentFiber.dom.__vdom__ = currentFiber.__vdom__;
    currentFiber.dom.__children__ = currentFiber.children;
  }
  currentFiber.effect = null;
}

function commitLoop(currentFiber, parentDom) {
  if (currentFiber && currentFiber.mount) {
    commitUpdate(currentFiber, parentDom);
    commitLoop(currentFiber.child, currentFiber.dom || parentDom);
    commitLoop(currentFiber.slibing, parentDom);
  }
}

function mountStart() {
  try {
    commitLoop(
      currentRootFiber,
      getDom(currentRootFiber.parent, (fiber) => fiber.parent) ||
        currentRootContainer
    );
  } catch (e) {
    console.error(e);
  }
}

// ============ // update

function startUpdateAll(fibers) {
  needLoop = true;

  pendingTransformFiberArray.push(...fibers);

  isAsyncUpdate ? updateLoopAsync() : updateLoopSync();
}

function updateLoopAsync() {
  requestIdleCallback(workLoop());
}

function workLoop() {
  return (deadLine) => {
    let shouldYield = false;
    while (
      (currentTransformFiberArray.length ||
        nextTransformFiberArray.length ||
        pendingTransformFiberArray.length) &&
      !shouldYield
    ) {
      if (currentTransformFiberArray.length || nextTransformFiberArray.length) {
        transformAll();
      }
      if (pendingTransformFiberArray.length) {
        transformCurrent(pendingTransformFiberArray.shift());
      }
      shouldYield = deadLine && deadLine.timeRemaining() < 1;
    }

    if (
      !nextTransformFiberArray.length &&
      !currentTransformFiberArray.length &&
      !pendingTransformFiberArray.length
    ) {
      Promise.resolve().then(updateStart);
    } else {
      requestIdleCallback(workLoop());
    }
  };
}

function updateLoopSync() {
  pendingTransformFiberArray.forEach(renderLoopSync);

  pendingTransformFiberArray = [];

  updateStart();
}

function updateFiberNode(fiber, parent, previous, newVDdom, last) {
  last !== fiber && (fiber.last = last);
  fiber.parent = parent;
  fiber.previous = previous;
  processFiberNode(fiber, newVDdom);
  return fiber;
}

function processFiberChild(fiber) {
  const alternate = fiber.alternate;
  if (fiber !== alternate) {
    fiber.child = alternate.child;
    fiber.children = alternate.children;
    if (fiber.child) {
      fiber.child.previous = fiber;
    }
    fiber.children.forEach((item) => (item.parent = fiber));
  } else {
    throw new Error("意料之外的情况");
  }
}

function processFiberState(fiber) {
  fiber.initial = false;
  fiber.__needUpdate__ = false;
}

function processFiberAlternate(fiber) {
  if (fiber.alternate) {
    fiber.alternate.mount = false;
    fiber.alternate.__needUpdate__ = false;
  }
  if (!fiber.__pendingUpdate__) {
    fiber.alternate = null;
  }
}

function nextWork(fiber) {
  currentRunningFiber = fiber;
  let children = [];

  needEffectNodeArray[fiber.deepIndex] =
    needEffectNodeArray[fiber.deepIndex] || [];
  needLayoutEffectNodeArray[fiber.deepIndex] =
    needLayoutEffectNodeArray[fiber.deepIndex] || [];

  if (fiber.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.__isContextNode__) children = nextWorkContext(fiber);
  else if (!fiber.__isTextNode__) children = nextWorkCommon(fiber);

  processFiberState(fiber);

  processFiberAlternate(fiber);

  return children;
}

function nextWorkFunctionComponent(fiber) {
  try {
    hookDepIndex = 0;

    currentFunctionFiber = fiber;

    // 不能使用rawProps 进行render  会丢失node类型
    // 函数组件运行
    const children = fiber.__vdom__.create(fiber.__vdom__.props);

    hookDepIndex = 0;

    currentFunctionFiber = null;

    fiber.__vdom__.__dynamicChildren__ = processEmptyChildren(children);

    return transformChildren(fiber, fiber.__vdom__.__dynamicChildren__);
  } catch (e) {
    console.log("运行错误", logFiber(fiber));
    throw e;
  }
}

function updateInstanceStateAndProps(fiber, newProps, newState) {
  const instance = fiber.instance;
  if (instance) {
    if (newProps) {
      instance.__prevProps__ = instance.props;
      instance.props = newProps;
    }
    if (newState) {
      instance.__prevState__ = instance.state;
      instance.state = newState;
    }
  }
  fiber.memoProps = instance.props;
  fiber.memoState = instance.state;
}

function processStateFromProps(fiber) {
  const component = fiber.__vdom__.create;
  if (typeof component.getDerivedStateFromProps === "function") {
    return component.getDerivedStateFromProps(
      fiber.instance.props,
      fiber.instance.state
    );
  } else {
    return fiber.instance.state;
  }
}

function processStateFromPropsUpdate(fiber) {
  const instance = fiber.instance;
  const _newState = processStateFromProps(fiber);
  // setState触发的更新
  if (instance.__nextState__) {
    instance.__nextState__ = Object.assign(
      {},
      _newState,
      instance.__nextState__
    );
  } else if (_newState !== instance.state) {
    // 执行了更新
    instance.__nextState__ = _newState;
  } else {
    instance.__nextState__ = instance.state;
  }
}

function processShouldComponentUpdate(fiber, newProps, newState) {
  const instance = fiber.instance;
  if (typeof instance.shouldComponentUpdate === "function") {
    return instance.shouldComponentUpdate(newProps, newState);
  }
  return true;
}

function processUpdateComponentContext(fiber) {
  // need update context fiber
  if (fiber.instance.__context__ && !fiber.instance.__context__.mount) {
    const contextFiber = getContextFiber(
      fiber,
      fiber.__vdom__.create.contextType
    );
    fiber.instance.__context__ = contextFiber;
    fiber.instance.context = contextFiber.memoProps.value;
    contextFiber.addListener(fiber.instance);
  }
}

function processClassComponentChildren(fiber) {
  try {
    const children = fiber.instance.render();
    fiber.__vdom__.__dynamicChildren__ = processEmptyChildren(children);
    return transformChildren(fiber, fiber.__vdom__.__dynamicChildren__);
  } catch (e) {
    console.log("运行错误", logFiber(fiber));
    throw e;
  }
}

function processComponentUpdate(fiber) {
  processStateFromPropsUpdate(fiber);
  processUpdateComponentContext(fiber);
  fiber.instance.__fiber__ = fiber;
  fiber.instance.__nextProps__ = fiber.__vdom__.props;
  const shouldUpdate = processShouldComponentUpdate(
    fiber,
    fiber.instance.__nextProps__,
    fiber.instance.__nextState__
  );
  updateInstanceStateAndProps(
    fiber,
    fiber.instance.__nextProps__,
    fiber.instance.__nextState__
  );
  fiber.instance.__nextProps__ = null;
  fiber.instance.__nextState__ = null;
  if (shouldUpdate) {
    if (typeof fiber.instance.componentDidUpdate === "function") {
      needLayoutEffectNodeArray[fiber.deepIndex].push(() => {
        fiber.instance.componentDidUpdate(
          fiber.instance.__prevProps__,
          fiber.instance.__prevState__
        );
        fiber.instance.__prevProps__ = null;
        fiber.instance.__prevState__ = null;
      });
    }
    return processClassComponentChildren(fiber);
  } else {
    processFiberChild(fiber);
    return [];
  }
}

function initialComponentContext(fiber) {
  const component = fiber.__vdom__.create;
  return getContextFiber(fiber, component.contextType);
}

function processInitialComponentInstance(fiber) {
  const contextFiber = initialComponentContext(fiber);
  fiber.instance = new fiber.__vdom__.create(
    fiber.__vdom__.props,
    contextFiber?.memoProps.value
  );
  fiber.instance.__context__ = contextFiber;
  contextFiber?.addListener(fiber.instance);
}

function processStateFromPropsMount(fiber) {
  const newState = processStateFromProps(fiber);
  updateInstanceStateAndProps(fiber, null, newState);
}

function processComponentMount(fiber) {
  processInitialComponentInstance(fiber);
  processStateFromPropsMount(fiber);
  if (typeof fiber.instance.componentDidMount === "function") {
    needLayoutEffectNodeArray[fiber.deepIndex].push(() => {
      fiber.instance.componentDidMount();
    });
  }
  fiber.instance.__fiber__ = fiber;
  return processClassComponentChildren(fiber);
}

function nextWorkClassComponent(fiber) {
  // class 组件mount
  if (!fiber.instance) {
    return processComponentMount(fiber);
  } else {
    return processComponentUpdate(fiber);
  }
}

function nextWorkComponent(fiber) {
  // 这是一个新创建出来的fiber或者是一个主动触发更新的fiber，对于组件
  // 新创建 --- props改变
  // 待更新 --- 主动触发
  if (fiber.initial || fiber.__needUpdate__) {
    if (fiber.__isFunctionComponent__) {
      return nextWorkFunctionComponent(fiber);
    } else {
      return nextWorkClassComponent(fiber);
    }
  } else {
    return [];
  }
}

function nextWorkContextProvider(fiber) {
  // context更新  所有的依赖节点更新
  isMounted &&
    Promise.resolve().then(() =>
      fiber.listeners.forEach((h) => h.__fiber__.update())
    );
  return nextWorkCommon(fiber);
}

function nextWorkContextConsumer(fiber) {
  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    const contextFiber = getContextFiber(fiber, fiber.__vdom__.rawType.Context);
    fiber.instance.__context__ = contextFiber;
    contextFiber.addListener(fiber.instance);
  }
  fiber.__vdom__.__dynamicChildren__ = fiber.__vdom__.children(
    fiber.instance.__context__.memoProps.value
  );
  return transformChildren(fiber, fiber.__vdom__.__dynamicChildren__);
}

function nextWorkContext(fiber) {
  // 处理context的更新，context provider更新后  initial为true
  // consumer 会被主动触发更新
  if (fiber.initial || fiber.__needUpdate__) {
    if (fiber.__isContextProvider__) {
      return nextWorkContextProvider(fiber);
    } else {
      return nextWorkContextConsumer(fiber);
    }
  }
  return [];
}

function nextWorkCommon(fiber) {
  if (!fiber.__isTextNode__ && fiber.__vdom__.children !== undefined) {
    return transformChildren(fiber, fiber.__vdom__.children);
  }

  if (!fiber.__isTextNode__ && fiber.__vdom__.props.children !== undefined) {
    return transformChildren(fiber, fiber.__vdom__.props.children);
  }

  return [];
}

function isSameTypeNode(vdom, previousVDom) {
  if (previousVDom !== null) {
    // 正常vdom
    if (vdom instanceof MyReactVDom && previousVDom instanceof MyReactVDom) {
      if (vdom.__isEmptyNode__) return previousVDom.__isEmptyNode__;
      if (vdom.__isContextNode__)
        return (
          previousVDom.__isContextNode__ &&
          vdom.rawType === previousVDom.rawType
        );
      if (vdom.__isFragmentNode__) return previousVDom.__isFragmentNode__;
      if (vdom.__isPlainNode__) return vdom.tagName === previousVDom.tagName;
      if (vdom.__isDynamicNode__)
        return (
          previousVDom.__isDynamicNode__ && vdom.create === previousVDom.create
        );
    }
    if (vdom instanceof MyReactVDom) return false;
    if (previousVDom instanceof MyReactVDom) return false;
    // 文本节点
    if (vdom !== null || vdom !== undefined) return previousVDom !== null;
  }
  return false;
}

function processPreviousRenderFiber(fiber, previousRenderFiber) {
  if (fiber) {
    // update
    if (fiber === previousRenderFiber) return;
    previousRenderFiber.mount = false;
    // sameType
    if (fiber.alternate === previousRenderFiber) return;
    pushUnmount(previousRenderFiber);
  } else {
    previousRenderFiber.mount = false;
    pushUnmount(previousRenderFiber);
  }
}

function processFiberHighLightCover(fiber, previousRenderFiber) {
  if (fiber !== previousRenderFiber) {
    fiber.__highLightCover__ = previousRenderFiber.__highLightCover__;
  }
}

function getNewFiber(
  vdom,
  previousRenderFiber,
  parentFiber,
  previousFiber,
  isSameType,
  last
) {
  if (isSameType) {
    if (
      previousRenderFiber.__isTextNode__ &&
      previousRenderFiber.__vdom__ === vdom
    ) {
      return updateFiberNode(
        previousRenderFiber,
        parentFiber,
        previousFiber || parentFiber,
        vdom,
        last
      );
    }

    if (
      previousRenderFiber.__isContextNode__ &&
      previousRenderFiber.__isContextProvider__ &&
      isNormalEqual(
        vdom.rawProps.value,
        previousRenderFiber.__vdom__.rawProps.value
      )
    ) {
      return updateFiberNode(
        previousRenderFiber,
        parentFiber,
        previousFiber || parentFiber,
        vdom,
        last
      );
    }

    if (
      previousRenderFiber.__isContextNode__ &&
      previousRenderFiber.__isContextConsumer__ &&
      isNormalEqual(vdom.children, previousRenderFiber.__vdom__.children)
    ) {
      return updateFiberNode(
        previousRenderFiber,
        parentFiber,
        previousFiber || parentFiber,
        vdom,
        last
      );
    }

    // 其他类型节点，并且props 浅比较没变过
    if (
      !previousRenderFiber.__isTextNode__ &&
      !previousRenderFiber.__isContextNode__ &&
      // dynamic 的children动态生成，因此必须运行nextWork
      !previousRenderFiber.__isDynamicNode__ &&
      isEqual(vdom.rawProps, previousRenderFiber.__vdom__.rawProps)
    ) {
      return updateFiberNode(
        previousRenderFiber,
        parentFiber,
        previousFiber || parentFiber,
        vdom,
        last
      );
    }

    // props变化过
    return createFiberNode(
      {
        parent: parentFiber,
        deepIndex: parentFiber.deepIndex + 1,
        alternate: previousRenderFiber,
        previous: previousFiber || parentFiber,
        dom: previousRenderFiber.dom,
        hookHead: previousRenderFiber.hookHead,
        hookFoot: previousRenderFiber.hookFoot,
        hookList: previousRenderFiber.hookList,
        listeners: previousRenderFiber.listeners,
        instance: previousRenderFiber.instance,
        effect:
          previousRenderFiber.__isTextNode__ ||
          previousRenderFiber.__isPlainNode__
            ? "UPDATE"
            : null,
        last,
      },
      vdom
    );
  }

  if (vdom === null || vdom === undefined) return null;

  return createFiberNode(
    {
      parent: parentFiber,
      deepIndex: parentFiber.deepIndex + 1,
      previous: previousFiber || parentFiber,
      // 当前节点是一个全新的节点, 可以直接append
      effect: "PLACEMENT",
      last,
    },
    vdom
  );
}

function pushPosition(fiber) {
  if (!fiber.__pendingIndex__) {
    fiber.__pendingIndex__ = true;
    needPositionFiberArray.push(fiber);
  }
}

// 提前将previousChildren顺序排好  匹配当前的vdom Children
function processPreviousRenderChildren(vdomChildren, previousRenderChildren) {
  if (!isMounted) return previousRenderChildren;
  if (!enableKeyDiff) return previousRenderChildren;
  const usedState = Array(previousRenderChildren.length).fill(false);
  const assignPreviousRenderChildren = Array(
    previousRenderChildren.length
  ).fill(null);
  // 优先处理有key的
  vdomChildren.forEach((vdom, index) => {
    if (vdom instanceof MyReactVDom && vdom.key !== undefined) {
      const targetIndex = previousRenderChildren.findIndex(
        (fiber, _index) => !usedState[_index] && fiber.key === vdom.key
      );
      if (targetIndex !== -1) {
        usedState[targetIndex] = true;
        assignPreviousRenderChildren[index] =
          previousRenderChildren[targetIndex];
      }
    }
  });
  // 剩下的填满位置
  for (let i = 0, j = 0; i < assignPreviousRenderChildren.length; i++) {
    if (!assignPreviousRenderChildren[i]) {
      while (usedState[j]) {
        j++;
      }
      if (j >= usedState.length) {
        throw new Error("排序children索引错误");
      }
      usedState[j] = true;
      assignPreviousRenderChildren[i] = previousRenderChildren[j];
    }
  }
  return assignPreviousRenderChildren;
}

function transformChildren(parentFiber, children) {
  // children 索引
  let index = 0;
  // 当前的fiber
  let newFiber = null;
  // 同级的前一个fiber
  let previousFiber = null;
  // 对于第一次更新，使用已经渲染出来的children作为前一次的渲染结果
  const previousRenderChildren = parentFiber.alternate
    ? parentFiber.alternate.children
    : parentFiber.children;

  parentFiber.child = null;

  parentFiber.children = [];

  children = Array.isArray(children) ? children : [children];

  let needPosition = false;

  const assignPreviousRenderChildren = processPreviousRenderChildren(
    children,
    previousRenderChildren
  );

  while (index < children.length || index < previousRenderChildren.length) {
    const newVDom = children[index];

    const previousRenderFiber = assignPreviousRenderChildren[index];

    const lastRenderFiber = previousRenderChildren[index];

    const previousRenderVDom = previousRenderFiber
      ? previousRenderFiber.__vdom__
      : null;

    const isSameType = isMounted && isSameTypeNode(newVDom, previousRenderVDom);

    newFiber = getNewFiber(
      newVDom,
      previousRenderFiber,
      parentFiber,
      previousFiber,
      isSameType,
      lastRenderFiber
    );

    isMounted &&
      newFiber &&
      isSameType &&
      processFiberHighLightCover(newFiber, previousRenderFiber);

    isMounted &&
      previousRenderFiber &&
      processPreviousRenderFiber(newFiber, previousRenderFiber);

    // 需要更新
    isMounted &&
      newFiber &&
      newFiber.dom &&
      newFiber.effect &&
      pushUpdate(newFiber);

    // 新mount的节点和前一次不是同一个类型  需要调整当前节点的所有子节点位置
    isMounted &&
      newFiber &&
      !isSameType &&
      previousRenderFiber &&
      (needPosition = true);

    isMounted &&
      isSameType &&
      lastRenderFiber !== previousRenderFiber &&
      (needPosition = true);

    previousFiber = newFiber;

    newFiber = null;

    index++;
  }

  isMounted && needPosition && pushPosition(parentFiber);

  return parentFiber.children;
}

function insertBefore(fiber, beforeDom, parentDom) {
  if (!fiber) {
    throw new Error("意料之外的错误");
  }
  // 所有位置变换的fiber都不能再是其他状态
  fiber.effect = null;
  if (fiber.dom) {
    parentDom.insertBefore(fiber.dom, beforeDom);
  } else {
    // 是一个其他节点,不包含dom  应该把这个节点的所有子节点按照深搜进行排序
    fiber.children.forEach((fiber) => {
      insertBefore(fiber, beforeDom, parentDom);
    });
  }
}

function positionUpdate(fiber) {
  const children = fiber.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const fiber = children[i];
    if (!fiber.alternate && fiber.last) {
      insertBefore(
        fiber,
        getDom(
          fiber.slibing ? fiber.slibing : fiber.last,
          (fiber) => fiber.child
        ),
        getDom(fiber.parent, (fiber) => fiber.parent)
      );
    }
  }
}

function updateStart() {
  positionStart();

  commitStart();

  runUnmount();

  runLayoutEffect();

  runEffect();

  needLoop = false;
}

function positionStart() {
  needPositionFiberArray.forEach((fiber) => {
    fiber.__pendingIndex__ = false;
    if (fiber.mount) {
      try {
        positionUpdate(fiber);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log("卸载节点", fiber);
    }
  });

  needPositionFiberArray = [];
}

function commitStart() {
  needUpdateFiberArray.forEach((fiber) => {
    fiber.__pendingUpdate__ = false;
    if (fiber.mount) {
      const parentDom =
        getDom(fiber.parent, (fiber) => fiber.parent) || currentRootContainer;
      try {
        commitUpdate(fiber, parentDom);
      } catch (e) {
        console.error(e);
      }
    }
  });

  needUpdateFiberArray = [];
}

// =============== //  hook

function processValidHookNode(hookNode) {
  if (
    hookNode.hookType === "useMemo" ||
    hookNode.hookType === "useEffect" ||
    hookNode.hookType === "useCallback" ||
    hookNode.hookType === "useLayoutEffect"
  ) {
    if (typeof hookNode.value !== "function") {
      throw new Error(`${hookNode.hookType} 初始化错误`);
    }
  }

  if (hookNode.hookType === "useContext") {
    if (typeof hookNode.value !== "object" || hookNode.value === null) {
      throw new Error(`${hookNode.hookType} 初始化错误`);
    }
  }
}

function processValidHookUseAge(hookType, depArray) {
  if (hookType === "useEffect" || hookType === "useLayoutEffect") {
    if (depArray && !Array.isArray(depArray)) {
      throw new Error(`${hookType} 用法错误`);
    }
  } else {
    if (!depArray || !Array.isArray(depArray)) {
      throw new Error(`${hookType} 用法错误`);
    }
  }
}

function _getContextFiber(fiber, ContextObject) {
  if (fiber) {
    if (
      fiber.__isContextNode__ &&
      fiber.__isContextProvider__ &&
      fiber.__vdom__.rawType === ContextObject
    ) {
      return fiber;
    } else {
      return _getContextFiber(fiber.parent, ContextObject);
    }
  }
}

function getContextFiber(fiber, ContextObject) {
  if (!ContextObject) return;
  if (!ContextObject.Provider) throw new Error("非法的Context用法");
  const contextFiber = _getContextFiber(fiber, ContextObject.Provider);
  if (!contextFiber || !(contextFiber instanceof MyReactFiberNode)) {
    throw new Error("Context need Provider");
  }
  return contextFiber;
}

function processHookNodeValue(hookNode, fiber) {
  if (hookNode.hookType === "useState") {
    hookNode.result =
      typeof hookNode.value === "function"
        ? hookNode.value.call(null)
        : hookNode.value;
  } else if (
    hookNode.hookType === "useEffect" ||
    hookNode.hookType === "useLayoutEffect"
  ) {
    hookNode.effect = true;
  } else if (hookNode.hookType === "useCallback") {
    hookNode.result = hookNode.value;
  } else if (hookNode.hookType === "useMemo") {
    hookNode.result = hookNode.value.call(null);
  } else if (hookNode.hookType === "useContext") {
    const contextFiber = getContextFiber(fiber, hookNode.value);
    contextFiber.addListener(hookNode);
    hookNode.__context__ = contextFiber;
    hookNode.result = contextFiber.memoProps.value;
  } else {
    hookNode.result = hookNode.value;
  }
}

function processHookList(hookNode, fiber) {
  if (fiber.hookHead) {
    fiber.hookFoot.nextHook = hookNode;
    hookNode.prevHook = fiber.hookFoot;
    fiber.hookFoot = hookNode;
  } else {
    fiber.hookHead = hookNode;
    fiber.hookFoot = hookNode;
  }
  fiber.hookList.push(hookNode);
}

function processHookNode(hookNode, fiber) {
  processValidHookNode(hookNode);

  processHookNodeValue(hookNode, fiber);

  processHookList(hookNode, fiber);
}

function createHookNode({ hookIndex, value, depArray, hookType }, fiber) {
  const currentHookNode = new MyReactHookNode(
    hookIndex,
    value,
    depArray,
    hookType,
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

function updateHookNode(hookNode, newAction, newDepArray, newFiber) {
  if (
    hookNode.hookType === "useEffect" ||
    hookNode.hookType === "useLayoutEffect"
  ) {
    if (newDepArray) {
      if (!hookNode.depArray) {
        throw new Error("依赖状态变更");
      }
      const isNotChange = isNormalEqual(hookNode.depArray, newDepArray);
      if (!isNotChange) {
        hookNode.value = newAction;
        hookNode.effect = true;
        hookNode.depArray = newDepArray;
      }
    } else {
      hookNode.value = newAction;
      hookNode.effect = true;
    }
  } else if (hookNode.hookType === "useCallback") {
    const isNotChange = isNormalEqual(hookNode.depArray, newDepArray);
    if (!isNotChange) {
      hookNode.value = newAction;
      hookNode.result = newAction;
      hookNode.depArray = newDepArray;
    }
  } else if (hookNode.hookType === "useMemo") {
    const isNotChange = isNormalEqual(hookNode.depArray, newDepArray);
    if (!isNotChange) {
      hookNode.value = newAction;
      hookNode.result = newAction.call(null);
      hookNode.depArray = newDepArray;
    }
  } else if (hookNode.hookType === "useContext") {
    const isNotChange = isNormalEqual(hookNode.value, newAction);
    if (!isNotChange || !hookNode.__context__.mount) {
      hookNode.value = newAction;
      const contextFiber = getContextFiber(newFiber, hookNode.value);
      hookNode.result = contextFiber.memoProps.value;
      hookNode.__context__ = contextFiber;
    }
    hookNode.__context__.addListener(hookNode);
  }
}

const emptyHookNode = { value: undefined, setValue: () => {} };

// 函数组件运行可以正确绑定fiber   memo时也许需要绑定（在memoUpdate中处理）
function getHookNode(fiber, hookIndex, hookType, value, depArray) {
  let hookNode = emptyHookNode;

  if (!fiber) throw new Error("hook 的调用必须位于组件中");

  if (fiber.hookList.length > hookIndex) {
    hookNode = fiber.hookList[hookIndex];

    if (hookNode.hookType !== hookType) {
      let re = logHookNode(hookNode.prevHook);
      re +=
        `${hookNode.hookIndex}. -->`.padEnd("9") +
        `${hookNode.hookType.padEnd("20")} ${hookType}`;
      throw new Error(re);
    }

    updateHookNode(hookNode, value, depArray, fiber);
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
  }

  hookNode.__fiber__ = fiber;

  if (hookNode.effect) {
    pushEffect(hookNode);
  }

  return hookNode;
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

  return [currentHookNode.result, currentHookNode.setValue];
}

function useEffect(action, depArray) {
  const currentHookIndex = hookDepIndex;
  const currentHookFiber = currentFunctionFiber;

  hookDepIndex++;

  processValidHookUseAge("useEffect", depArray);

  getHookNode(
    currentHookFiber,
    currentHookIndex,
    "useEffect",
    action,
    depArray
  );
}

function useLayoutEffect(action, depArray) {
  const currentHookIndex = hookDepIndex;
  const currentHookFiber = currentFunctionFiber;

  hookDepIndex++;

  processValidHookUseAge("useLayoutEffect", depArray);

  getHookNode(
    currentHookFiber,
    currentHookIndex,
    "useLayoutEffect",
    action,
    depArray
  );
}

function useCallback(action, depArray) {
  const currentHookIndex = hookDepIndex;
  const currentHookFiber = currentFunctionFiber;

  hookDepIndex++;

  processValidHookUseAge("useCallback", depArray);

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

  processValidHookUseAge("useMemo", depArray);

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

function useContext(Context) {
  const currentHookIndex = hookDepIndex;
  const currentHookFiber = currentFunctionFiber;

  hookDepIndex++;

  return getHookNode(currentHookFiber, currentHookIndex, "useContext", Context)
    .result;
}

// ============== //  update start
function syncLoop() {
  if (!needLoop) {
    modifiedFiberArray = modifiedFiberArray.filter(
      (fiber) => fiber.__needUpdate__ && fiber.mount
    );
    modifiedFiberArray.sort((f1, f2) =>
      f1.deepIndex - f2.deepIndex > 0 ? 1 : -1
    );
    _modifiedFiberArray = modifiedFiberArray;
    modifiedFiberArray = [];
    startUpdateAll(_modifiedFiberArray);
  } else {
    console.log("更新运行中");
  }
}

const asyncUpdate = () => Promise.resolve().then(() => setTimeout(syncLoop));

// TODO
function processUpdateFiber(fiber) {}

function pushFiber(fiber) {
  if (!fiber.__needUpdate__) {
    if (!fiber.mount) {
      console.log("update unmount fiber", logFiber(fiber));
      return;
    }

    fiber.__needUpdate__ = true;

    modifiedFiberArray.push(fiber);
  }

  asyncUpdate();
}

function pushUpdate(fiber) {
  if (!fiber.__pendingUpdate__) {
    fiber.__pendingUpdate__ = true;
    needUpdateFiberArray.push(fiber);
  }
}

function pushEffect(node) {
  if (!node.__pendingEffect__) {
    node.__pendingEffect__ = true;
    const deepIndex = node.__fiber__.deepIndex;
    node.hookType === "useLayoutEffect"
      ? needLayoutEffectNodeArray[deepIndex].push(node)
      : needEffectNodeArray[deepIndex].push(node);
  }
}

function runEffect() {
  const allEffect = needEffectNodeArray.slice(0);
  Promise.resolve().then(() => {
    for (let i = allEffect.length - 1; i >= 0; i--) {
      const effectArray = allEffect[i];
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
  needEffectNodeArray = [];
}

function runLayoutEffect() {
  const allLayoutEffect = needLayoutEffectNodeArray.slice(0);
  for (let i = allLayoutEffect.length - 1; i >= 0; i--) {
    const effectArray = allLayoutEffect[i];
    if (Array.isArray(effectArray)) {
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
  needLayoutEffectNodeArray = [];
}

function pushUnmount(fiber) {
  if (!fiber.__pendingUnmount__) {
    fiber.__pendingUnmount__ = true;
    needUnmountFiberArray.push(fiber);
  }
}

function runUnmount() {
  const allUnmount = needUnmountFiberArray.slice(0);
  allUnmount.forEach(clearFiberNode);
  allUnmount.forEach(clearFiberDom);
  needUnmountFiberArray = [];
}

function clearFiberNode(fiber) {
  if (fiber.child) {
    fiber.children.forEach(clearFiberNode);
  }
  // 清理hook
  fiber.hookList.forEach((hook) => {
    if (hook.hookType === "useEffect" || hook.hookType === "useLayoutEffect") {
      hook.cancel && hook.cancel();
    }
    if (hook.hookType === "useContext") {
      hook.__context__.removeListener(hook);
    }
  });
  // 清理instance
  if (fiber.instance) {
    if (typeof fiber.instance.componentWillUnmount === "function") {
      fiber.instance.componentWillUnmount();
    }
    if (fiber.instance.__context__) {
      fiber.instance.__context__.removeListener(fiber.instance);
    }
  }
  // 清理高亮
  if (fiber.__highLightCover__) fiber.__highLightCover__.remove();
}

function clearFiberDom(fiber) {
  if (fiber.dom) {
    fiber.dom.remove();
  } else {
    const childrenFiber = fiber.children.slice(0);
    childrenFiber.forEach(clearFiberDom);
  }
}

function getNodeNameFromFiber(fiber) {
  if (fiber.__root__) return "<Root />";
  if (fiber.__isTextNode__) return `<text - (${fiber.__vdom__}) />`;
  if (fiber.__isDynamicNode__) return `<${fiber.__vdom__.name} * />`;
  if (fiber.__isPlainNode__) return `<${fiber.__vdom__.name} />`;
  if (fiber.__isFragmentNode__) return `<${fiber.__vdom__.name}>`;
  if (fiber.__isContextNode__)
    return `<${fiber.__vdom__.name} - (${JSON.stringify(
      fiber.__vdom__.props.value
    )}) />`;
  if (fiber.__isEmptyNode__)
    return `<${"empty"} - (${
      typeof fiber.__vdom__ === "object"
        ? JSON.stringify(fiber.__vdom__.rawProps)
        : JSON.stringify(fiber.__vdom__)
    }) />`;
  throw new Error("unknow fiber type");
}

function logFiber(fiber) {
  if (fiber) {
    let parent = fiber.parent;
    let res = `fond in --> ${getNodeNameFromFiber(fiber)}`;
    while (parent) {
      res = "".padStart(12) + `${getNodeNameFromFiber(parent)}\n${res}`;
      parent = parent.parent;
    }
    return "\n" + res;
  } else {
    return "";
  }
}

function logHookNode(hookNode) {
  let re = "";
  while (hookNode) {
    re =
      `${hookNode.hookIndex}.`.padEnd("9") +
      `${hookNode.hookType.padEnd("20")}${hookNode.hookType}\n${re}`;
    hookNode = hookNode.prevHook;
  }
  re =
    "hook:".padEnd("9") + "prev render".padEnd("20") + "current render\n" + re;
  return re;
}

// ========= //  feature
function memo(FunctionComponent) {
  class MemoComponent extends MyReactPureComponent {
    render() {
      return createElement(FunctionComponent, this.props);
    }
  }
  return MemoComponent;
}

function isValidElement(element) {
  return typeof element === "object" && element instanceof MyReactVDom;
}

function map(children, handler) {
  if (Array.isArray(children)) {
    return children.map(handler);
  } else {
    return handler(children);
  }
}

function createContext(value) {
  // 支持对象到vdom，从fiber tree中去掉不必要的树结构

  const ContextObject = {
    type: MReact.Context,
  };

  const Provider = {
    type: MReact.Provider,
    value,
  };

  const Consumer = {
    type: MReact.Consumer,
    Internal: class Internal {
      __fiber__ = null;
      __context__ = null;
    },
  };

  Object.defineProperty(Consumer, "Context", {
    get() {
      return ContextObject;
    },
  });

  ContextObject.Provider = Provider;
  ContextObject.Consumer = Consumer;

  return ContextObject;
}

var MReact = {
  createElement,
  render,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  useLayoutEffect,
  useRef,
  memo,
  isValidElement,
  cloneElement,
  createContext,
  Children: { map },
  createRef: () => ({ current: null }),
  Component: MyReactComponent,
  PureComponent: MyReactPureComponent,
  Fragment: Symbol.for("Fragment"),
  Context: Symbol.for("Context"),
  Provider: Symbol.for("Context.Provider"),
  Consumer: Symbol.for("Context.Consumer"),
};
