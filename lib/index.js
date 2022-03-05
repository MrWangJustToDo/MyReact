const isEvent = (key) => key.startsWith("on");
const isProperty = (key) =>
  key !== "children" && !isEvent(key) && !isStyle(key);
const isNew = (oldProps, newProps) => (key) => oldProps[key] !== newProps[key];
const isGone = (newProps) => (key) => !(key in newProps);
const isStyle = (key) => key === "style";

const deg = false;

const degWithFiber = false;

const isHighLightUpdate = false;

const isAsyncUpdate = false;

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
// 需要运行的effect数组
let needEffectHookNodeArray = [];
// 需要卸载的fiber节点
let needUnmountFiberArray = [];
// 当前需要转换的fiber数组
let currentTransformFiberArray = [];
// 下一层需要转换的fiber数组
let nextTransformFiberArray = [];
// highLight parent
let highLightDomContainer = null;

// 挂载的根fiber
let mountFiber = null;

let isMounted = false;

// 当前运行的fiber
let currentRunningFiber = null;

// ============ //  tool
let lastTimeStep = null;

function debounce(action, time) {
  let id;
  return (...args) => {
    if (lastTimeStep && Date.now() - lastTimeStep < time) {
      clearTimeout(id);
    }
    id = setTimeout(() => {
      lastTimeStep = Date.now();
      action(...args);
    }, time);
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
    if (!flag) {
      return flag;
    }
  }
  return flag;
}

function shouldNotUpdate(fiber, alternate) {
  return (
    // 必须判断props中的 children
    isEqual(fiber.memoProps, alternate.memoProps) &&
    // for classComponent, current not support
    isEqual(fiber.memoState, alternate.memoState)
  );
}

function debug(...args) {
  if (deg) {
    console.log(
      "[debug]",
      ...args.map((it) => (it instanceof MyReactFiberNode ? logFiber(it) : it))
    );
  }
}

function debugWithCurrentFiber(...args) {
  if (degWithFiber) {
    console.log(
      "[debug]",
      ...args.map((it) => (it instanceof MyReactFiberNode ? logFiber(it) : it)),
      logFiber(currentRunningFiber)
    );
  }
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
        children: this.props.children.map((i) =>
          typeof i === "object" ? i.rawProps : i
        ),
      };
    } else {
      this.rawProps = this.props;
    }
  }

  _initialType() {
    this.__isEmptyNode__ = false;
    this.__isPlainNode__ = false;
    this.__isClonedNode__ = false;
    this.__isDynamicNode__ = false;
    this.__isContextNode__ = false;
    this.__isFragmentNode__ = false;
    this.__isClassComponent__ = false;
    this.__isFunctionComponent__ = false;
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
    initial,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance
  ) {
    this.key = key;
    this.type = type.fiber;

    this.fiberIndex = fiberIndex;
    this.parent = parent;
    this.alternate = alternate;
    this.previous = previous;
    this.slibing = slibing;
    this.child = child;

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
    this.memoProps = [];
    this.memoState = [];
    this.children = [];
    this.hookList = this.hookList || [];
    this.listeners = this.listeners || [];
  }

  _initialUpdate() {
    this.__needUpdate__ = false;
    this.__pendingUpdate__ = false;
    this.__renderCount__ = this.alternate
      ? this.alternate.__renderCount__ + 1
      : 1;
    this.__updateTimeStep__ = Date.now();
    this.__lastUpdateTimeStep__ = this.alternate
      ? this.alternate.__updateTimeStep__
      : null;
    this.__highLightCover__ = null;

    // 通过旧节点可以找到新节点
    // if (this.alternate) {
    //   this.alternate.alternate = this;
    // }
  }

  _initialType() {
    this.__isTextNode__ = false;
    this.__isEmptyNode__ = false;
    this.__isPlainNode__ = false;
    this.__isDynamicNode__ = false;
    this.__isContextNode__ = false;
    this.__isFragmentNode__ = false;
  }

  addListener(node) {
    if (this.listeners.every((n) => n !== node)) {
      this.listeners.push(node);
    }
  }

  removeListener(node) {
    this.listeners = this.listeners.filter((n) => n !== node);
  }

  update() {
    // 获取需要更多的更新情况
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
    set,
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
    this.set = set;
    this.nextHook = nextHook;
    this.prevHook = prevHook;
    this.cancel = cancel;
    this.effect = effect;
    this._initialHook();
    this._initialFiber();
  }

  _initialHook() {
    this.result = null;
    this.context = null;
    this.prevResult = null;
  }

  _initialFiber() {
    this.__fiber__ = null;
  }
}

class MyReactComponent {
  constructor(props, context) {
    this.props = props;
    this.context = context;
  }

  __fiber__ = null;

  __prevProps__ = null;

  __nextProps__ = null;

  __prevState__ = null;

  __nextState__ = null;

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

// ============ //  vdom
function processVDomType(vdom) {
  let rawType = vdom.rawType;
  if (typeof vdom.rawType === "object" && vdom.rawType !== null) {
    rawType = vdom.rawType.type;
  }
  if (rawType === MReact.Fragment) {
    vdom.__isFragmentNode__ = true;
  } else if (rawType === MReact.Context) {
    vdom.__isContextNode__ = true;
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

function processChildren(props, children) {
  children = children
    .reduce((p, c) => p.concat(c), [])
    .filter((c) => c !== undefined && c !== null);

  if (
    children.some((c) => typeof c === "object" && !(c instanceof MyReactVDom))
  ) {
    debugWithCurrentFiber("processChildren", "invalid vdom type", children);
    throw new Error("invalid vdom type");
  }

  if (children.length) {
    props.children = children;
  }

  return children;
}

function _createElement(type, props, children, rawType) {
  if (type === MReact.Context)
    return createVDom("Context", null, null, props, children, rawType);
  if (type === MReact.Fragment)
    return createVDom("Fragment", null, null, props, children, rawType);
  if (typeof type === "function")
    return createVDom(
      type.name || "anonymous",
      null,
      type,
      props,
      children,
      rawType
    );
  return createVDom(type, type, null, props, children, rawType);
}

function createElement(type, props, ...children) {
  props = props || {};
  children = processChildren(props, children);

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

function cloneElement(element, props, ...children) {
  if (element instanceof MyReactVDom) {
    let clonedElement = createElement(element.rawType, props, ...children);
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
      debugWithCurrentFiber(
        "processFiberNode",
        "fiber关系错误: children长度应为0, 当前",
        parent.children.slice(0)
      );
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
        debugWithCurrentFiber("processFiberRef", "ref 运行错误", e);
      }
    }
  }
}

function processFiberTree(fiber) {
  fiber.__tree__ = logFiber(fiber);
}

function processFiberNode(fiber, vdom) {
  fiber.__vdom__ = vdom;

  processFiberType(fiber);

  processFiberParent(fiber);

  processFiberDom(fiber);

  processFiberRef(fiber);

  // processFiberTree(fiber);

  fiber.memoProps = !fiber.__isTextNode__ ? vdom.rawProps : [];
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
    initial = true,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance,
  },
  vdom
) {
  const { key } = vdom || empty;
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
    initial,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance
  );

  processFiberNode(fiber, vdom);

  return fiber;
}

// ============ // mount

function render(element, container) {
  currentRootContainer = container;

  if (typeof element === "function") {
    debug("please use a element to render function, current is ", element);
    element = createElement(element);
  }

  startHighLight();

  const currentVDom = createElement(null, null, element);

  const currentFiber = createFiberNode({ fiberIndex: 0 }, currentVDom);

  currentRootFiber = currentFiber;

  mountFiber = currentFiber;

  mountFiber.__root__ = true;

  startRender(mountFiber);
}

function startRender(fiber) {
  if (fiber.mount) {
    needLoop = true;

    currentTransformFiberArray.push(fiber);

    renderLoopSync();

    mountStart();

    runEffect();

    isMounted = true;

    needLoop = false;
  }
}

function transformAll() {
  transformNext();
  if (!currentTransformFiberArray.length) {
    currentTransformFiberArray = nextTransformFiberArray;
    nextTransformFiberArray = [];
  }
}

function renderLoopSync() {
  while (currentTransformFiberArray.length) {
    transformAll();
  }
}

function mountStart() {
  try {
    commitLoop(
      mountFiber,
      getDom(mountFiber.parent, (fiber) => fiber.parent) || currentRootContainer
    );
  } catch (e) {
    console.error(e);
  }
}

// ============ // update

function startUpdateAll(fibers) {
  needLoop = true;

  currentTransformFiberArray.push(...fibers);

  isAsyncUpdate ? updateLoopAsync() : updateLoopSync();
}

function updateLoopAsync() {
  while (currentTransformFiberArray.length) {
    transformNext();
  }
  requestIdleCallback(workLoop());
}

function updateLoopSync() {
  renderLoopSync();

  needLoop = false;

  commitStart();
}

function transformNext() {
  const fiber = currentTransformFiberArray.shift();
  if (!fiber.mount) {
    console.log("unmount fiber", fiber);
    return;
  }
  const childrenFiber = nextWork(fiber);
  nextTransformFiberArray.push(...childrenFiber);
}

function workLoop() {
  return (deadline) => {
    let shouldYield = false;
    while (
      (currentTransformFiberArray.length || nextTransformFiberArray.length) &&
      !shouldYield
    ) {
      if (!currentTransformFiberArray.length) {
        currentTransformFiberArray = nextTransformFiberArray;
        nextTransformFiberArray = [];
      }
      while (currentTransformFiberArray.length) {
        transformNext();
      }
      shouldYield = deadline && deadline.timeRemaining() < 1;
    }

    if (!currentTransformFiberArray.length && !nextTransformFiberArray.length) {
      needLoop = false;
      Promise.resolve().then(() => commitStart());
    } else {
      requestIdleCallback(workLoop());
    }
  };
}

function updateFiberNode(fiber, parent, previous, newVDdom) {
  debug("updateFiberNode", fiber);
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
    debug("processFiberChild", "相同节点", fiber, alternate);
  }
}

function processFiberHook(fiber) {
  fiber.hookList.forEach((hook) => (hook.__fiber__ = fiber));
}

function processMemoUpdate(fiber) {
  if (fiber.__vdom__.create.memo && fiber.alternate) {
    // 当前节点不是主动触发的节点并且属性没有变化
    if (
      !fiber.alternate.__needUpdate__ &&
      shouldNotUpdate(fiber, fiber.alternate)
    ) {
      processFiberChild(fiber);
      processFiberHook(fiber);
      return true;
    }
  }

  return false;
}

// context 如果value被更新过  就会执行
function processContextUpdate(fiber) {
  // context更新  所有的依赖节点更新
  if (fiber.__isContextNode__) {
    const listeners = fiber.listeners.slice(0);
    Promise.resolve().then(() =>
      listeners.forEach((h) => h.__fiber__.update())
    );
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
  // 当前不是待更新节点，并且alternate已经使用过了
  if (!fiber.__pendingUpdate__) {
    fiber.alternate = null;
  }
}

function nextWork(fiber) {
  currentRunningFiber = fiber;
  let children = [];

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
    // const children = fiber.__vdom__.create(fiber.__vdom__.rawProps);
    const children = fiber.__vdom__.create(fiber.__vdom__.props);
    hookDepIndex = 0;
    currentFunctionFiber = null;
    fiber.__vdom__.__dynamicChildren__ = [children];

    return transformChildren(fiber, fiber.__vdom__.__dynamicChildren__);
  } catch (e) {
    console.log("运行错误", logFiber(fiber));
    throw e;
  }
}

function updateInstanceStateAndProps(fiber, newProps, newState) {
  const instance = fiber.instance;
  if (instance) {
    if (newProps && newProps !== instance.props) {
      instance.__prevProps__ = instance.props;
      instance.props = newProps;
    }
    if (newState && newState !== instance.state) {
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

function processComponentUpdate(fiber) {
  fiber.instance.__fiber__ = fiber;
  processStateFromPropsUpdate(fiber);
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
    const children = fiber.instance.render();
    fiber.__vdom__.__dynamicChildren__ = [children];
    return transformChildren(fiber, fiber.__vdom__.__dynamicChildren__);
  } else {
    processFiberChild(fiber);
    return [];
  }
}

function processComponentInstance(fiber) {
  const instance = new fiber.__vdom__.create(
    fiber.__vdom__.props,
    fiber.__vdom__.create.context
  );
  fiber.instance = instance;
  instance.__fiber__ = fiber;
}

function processStateFromPropsMount(fiber) {
  const newState = processStateFromProps(fiber);
  updateInstanceStateAndProps(fiber, null, newState);
}

function processComponentMount(fiber) {
  processComponentInstance(fiber);
  processStateFromPropsMount(fiber);
  const children = fiber.instance.render();
  fiber.__vdom__.__dynamicChildren__ = [children];
  return transformChildren(fiber, fiber.__vdom__.__dynamicChildren__);
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
    const notNeedRun = processMemoUpdate(fiber);
    if (notNeedRun) return [];
    if (fiber.__vdom__.__isFunctionComponent__) {
      return nextWorkFunctionComponent(fiber);
    } else {
      return nextWorkClassComponent(fiber);
    }
  } else {
    return [];
  }
}

function nextWorkContext(fiber) {
  // 处理context的更新，context更新后  initial为true
  if (fiber.initial) {
    processContextUpdate(fiber);
    return nextWorkCommon(fiber);
  }
  return [];
}

function nextWorkCommon(fiber) {
  if (
    !fiber.__isTextNode__ &&
    fiber.__vdom__.children &&
    fiber.__vdom__.children.length
  ) {
    return transformChildren(fiber, fiber.__vdom__.children);
  }

  if (
    !fiber.__isTextNode__ &&
    fiber.__vdom__.props.children &&
    fiber.__vdom__.props.children.length
  ) {
    debug("不统一的行为", fiber);
    return transformChildren(fiber, fiber.__vdom__.props.children);
  }

  return [];
}

function isSameTypeNode(vdom, previousVDom) {
  if (previousVDom !== null) {
    // 正常vdom
    if (vdom instanceof MyReactVDom && previousVDom instanceof MyReactVDom) {
      if (vdom.__isEmptyNode__) return previousVDom.__isEmptyNode__;
      if (vdom.__isContextNode__) return previousVDom.__isContextNode__;
      if (vdom.__isFragmentNode__) return previousVDom.__isFragmentNode__;
      if (vdom.__isPlainNode__) return vdom.tagName === previousVDom.tagName;
      if (vdom.__isDynamicNode__) return vdom.create === previousVDom.create;
    }
    if (vdom instanceof MyReactVDom) return false;
    if (previousVDom instanceof MyReactVDom) return false;
    // 文本节点
    if (vdom !== null || vdom !== undefined) return previousVDom !== null;
  }
  return false;
}

function processFiberReplaceEffect(fiber, previousRenderFiber) {
  // 这是一个卸载节点，使用原来的dom作为替换的占位符
  if (previousRenderFiber) {
    if (fiber.dom || previousRenderFiber.dom) {
      fiber.effect = "REPLACE";
      fiber.replaceDom = getDom(previousRenderFiber, (fiber) => fiber.child);
      fiber.parentDom = getDom(
        previousRenderFiber.parent,
        (fiber) => fiber.parent
      );
    }
  }
}

// 按照需要将父fiber的 replace 状态转移到子fiber上
function processParentFiberReplaceEffect(parentFiber, fiber) {
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
      // 还原parent的状态, 父元素肯定是没有dom的，并不关心effect状态，使用占位符替代
      parentFiber.effect = "PLACEHOLDER";
      parentFiber.replaceDom = null;
      parentFiber.parentDom = null;
    }
  }
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
  isSameType
) {
  if (isSameType) {
    // 文本节点，并且内容没有变过
    if (
      previousRenderFiber.__isTextNode__ &&
      previousRenderFiber.__vdom__ === vdom
    ) {
      return updateFiberNode(
        previousRenderFiber,
        parentFiber,
        previousFiber || parentFiber,
        vdom
      );
    }

    // 其他类型节点，并且props变过
    if (
      !previousRenderFiber.__isTextNode__ &&
      // dynamic 的children动态生成，因此必须运行nextWork
      !previousRenderFiber.__isDynamicNode__ &&
      isEqual(vdom.rawProps, previousRenderFiber.__vdom__.rawProps, false)
    ) {
      return updateFiberNode(
        previousRenderFiber,
        parentFiber,
        previousFiber || parentFiber,
        vdom
      );
    }

    // props变化过
    return createFiberNode(
      {
        parent: parentFiber,
        fiberIndex: parentFiber.fiberIndex + 1,
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
      },
      vdom
    );
  }
  if (vdom === null || vdom === undefined) return null;
  return createFiberNode(
    {
      parent: parentFiber,
      fiberIndex: parentFiber.fiberIndex + 1,
      previous: previousFiber || parentFiber,
      effect: "PLACEMENT",
    },
    vdom
  );
}

function transformChildren(parentFiber, children) {
  let index = 0;
  let newFiber = null;
  let currentFiber = null;
  // 对于第一次更新，使用已经渲染出来的children作为前一次的渲染结果
  let previousRenderChildren = parentFiber.alternate
    ? parentFiber.alternate.children
    : parentFiber.children;

  parentFiber.child = null;
  parentFiber.children = [];

  while (index < children.length || index < previousRenderChildren.length) {
    const newVDom = children[index];

    const previousRenderFiber = previousRenderChildren[index];

    const previousVDom = previousRenderFiber
      ? previousRenderFiber.__vdom__
      : null;

    const isSameType = isMounted && isSameTypeNode(newVDom, previousVDom);

    newFiber = getNewFiber(
      newVDom,
      previousRenderFiber,
      parentFiber,
      currentFiber,
      isSameType
    );

    isMounted &&
      newFiber &&
      !isSameType &&
      processFiberReplaceEffect(newFiber, previousRenderFiber);

    isMounted &&
      newFiber &&
      processParentFiberReplaceEffect(parentFiber, newFiber);

    isMounted &&
      newFiber &&
      isSameType &&
      processFiberHighLightCover(newFiber, previousRenderFiber);

    isMounted &&
      previousRenderFiber &&
      processPreviousRenderFiber(newFiber, previousRenderFiber);

    isMounted &&
      newFiber &&
      newFiber.dom &&
      newFiber.effect &&
      pushUpdate(newFiber);

    currentFiber = newFiber;

    newFiber = null;

    index++;
  }

  return parentFiber.children;
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
    } else {
      debug("commitStart", "卸载的fiber节点", fiber);
    }
  });

  runUnmount();

  runEffect();

  needUpdateFiberArray = [];
}

function commitUpdate(currentFiber, parentDom) {
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
  currentFiber.alternate && (currentFiber.alternate.alternate = null);
  currentFiber.alternate = null;
}

function commitLoop(currentFiber, parentDom) {
  if (currentFiber && currentFiber.mount) {
    commitUpdate(currentFiber, parentDom);
    commitLoop(currentFiber.child, currentFiber.dom || parentDom);
    commitLoop(currentFiber.slibing, parentDom);
  }
}

// =============== //  hook

function processValidHookNode(hookNode) {
  if (
    hookNode.hookType === "useMemo" ||
    hookNode.hookType === "useEffect" ||
    hookNode.hookType === "useCallback"
  ) {
    if (typeof hookNode.value !== "function") {
      debugWithCurrentFiber(
        "processCheckHookNode",
        `${hookNode.hookType} 初始化错误`
      );
      throw new Error(`${hookNode.hookType} 初始化错误`);
    }
  }

  if (hookNode.hookType === "useContext") {
    if (typeof hookNode.value !== "object" || hookNode.value === null) {
      debugWithCurrentFiber(
        "processCheckHookNode",
        `${hookNode.hookType} 初始化错误`
      );
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

function getContextFiber(fiber, ContextObject) {
  if (fiber) {
    if (fiber.__isContextNode__ && fiber.__vdom__.rawType === ContextObject) {
      return fiber;
    } else {
      return getContextFiber(fiber.parent, ContextObject);
    }
  }
}

function processHookNodeValue(hookNode, fiber) {
  if (hookNode.hookType === "useState") {
    hookNode.result =
      typeof hookNode.value === "function"
        ? hookNode.value.call(null)
        : hookNode.value;
  } else if (hookNode.hookType === "useEffect") {
    hookNode.effect = true;
  } else if (hookNode.hookType === "useCallback") {
    hookNode.result = hookNode.value;
  } else if (hookNode.hookType === "useMemo") {
    hookNode.result = hookNode.value.call(null);
  } else if (hookNode.hookType === "useContext") {
    const contextFiber = getContextFiber(fiber, hookNode.value);
    if (!contextFiber || !(contextFiber instanceof MyReactFiberNode)) {
      throw new Error("useContext need Provider");
    }
    contextFiber.addListener(hookNode);
    hookNode.context = contextFiber;
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
    if (!isNotChange || !hookNode.context.mount) {
      hookNode.value = newAction;
      const contextFiber = getContextFiber(newFiber, hookNode.value);
      hookNode.context = contextFiber;
      hookNode.result = contextFiber.memoProps.value;
    }
    hookNode.context.addListener(hookNode);
  }
}

const emptyHookNode = { value: undefined, set: () => {} };

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
      debug("getHookNode", "\n" + re, "\n----------------\n", fiber);
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
    hookNode.set = setValue.bind(hookNode);
  }
  fiber.memoState[hookIndex] = hookNode.result;

  if (hookNode.hookType === "useEffect" && hookNode.effect) {
    needEffectHookNodeArray.unshift(hookNode);
  }

  hookNode.__fiber__ = fiber;

  return hookNode;
}

function setValue(value) {
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
      f1.fiberIndex - f2.fiberIndex > 0 ? 1 : -1
    );
    _modifiedFiberArray = modifiedFiberArray;
    modifiedFiberArray = [];
    startUpdateAll(_modifiedFiberArray);
  }
}

// const debounceUpdate = debounce(syncLoop, 20);
// const syncUpdate = () => Promise.resolve().then(syncLoop);
const asyncUpdate = () => Promise.resolve().then(() => setTimeout(syncLoop));

// TODO
function processUpdateFiber(fiber) {
  let _fiber = fiber;
  // 追踪更新链路
  while (
    fiber &&
    !fiber.__needUpdate__ &&
    (!fiber.__recursive__ || !fiber.__recursive__.needUpdate)
  ) {
    fiber.__recursive__ = _fiber;
    fiber = fiber.parent;
  }
}

function pushFiber(fiber) {
  if (!fiber.__needUpdate__) {
    if (!fiber.mount) {
      console.log("update unmount fiber", logFiber(fiber));
      return;
    }
    // processUpdateFiber(fiber);

    fiber.__needUpdate__ = true;

    modifiedFiberArray.push(fiber);
  } else {
    debug("pushFiber", "已经存在更新队列中", fiber);
  }

  // syncUpdate();
  asyncUpdate();
}

function pushUpdate(fiber) {
  if (!fiber.__pendingUpdate__) {
    fiber.__pendingUpdate__ = true;
    needUpdateFiberArray.push(fiber);
  }
}

function runEffect() {
  const allEffect = needEffectHookNodeArray.slice(0);
  Promise.resolve().then(() => {
    allEffect.forEach((effect) => {
      effect.effect = false;
      effect.cancel && effect.cancel();
      effect.cancel = effect.value();
    });
  });
  needEffectHookNodeArray = [];
}

function pushUnmount(fiber) {
  needUnmountFiberArray.push(fiber);
}

function runUnmount() {
  const allUnmount = needUnmountFiberArray.slice(0);
  allUnmount.forEach(clearFiberHook);
  allUnmount.forEach(clearFiberDom);
  if (isHighLightUpdate) {
    allUnmount.forEach(clearFiberHighLight);
  }
  needUnmountFiberArray = [];
}

function clearFiberHook(fiber) {
  if (fiber) {
    if (fiber.child) {
      fiber.children.forEach(clearFiberHook);
    }
    fiber.hookList.forEach((hook) => {
      if (hook.hookType === "useEffect") {
        debug("clearFiberNode", "执行了 effect 清除", hook);
        hook.cancel();
      }
      if (hook.hookType === "useContext") {
        debug("clearFiberNode", "执行 context 取消订阅", hook);
        hook.context.removeListener(hook);
      }
    });
    fiber.mount = false;
    fiber.__needUpdate__ = false;
  }
}

function clearFiberDom(fiber) {
  if (fiber.dom) {
    fiber.dom.remove();
  } else {
    const childrenFiber = fiber.children.slice(0);
    childrenFiber.forEach(clearFiberDom);
  }
}

function clearFiberHighLight(fiber) {
  if (fiber) {
    if (fiber.__highLightCover__) fiber.__highLightCover__.remove();
    fiber.children.forEach(clearFiberHighLight);
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

// ========= //  test
function memo(functionComponent) {
  function memoComponent(...res) {
    return functionComponent.call(null, ...res);
  }
  memoComponent.memo = true;
  return memoComponent;
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

// todo  usage like <Context value={}>...</Context>
function createContext(value) {
  // 支持对象到vdom，从fiber tree中去掉不必要的树结构

  return {
    type: MReact.Context,
    value,
  };

  // return memo(function ({ value = defaultValue, children }) {
  //   console.log("update");
  //   return MReact.createElement(MReact.Context, { value, children });
  // });
}

var MReact = {
  createElement,
  render,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  isValidElement,
  cloneElement,
  createContext,
  map,
  Component: MyReactComponent,
  Fragment: Symbol.for("Fragment"),
  Context: Symbol.for("Context"),
};
