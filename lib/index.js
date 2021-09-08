// transform运行状态
let needLoop = false;
// 组件容器
let currentContainer = null;
// 根fiber节点，一个组件只有一个rootFiber
let currentRootFiber = null;
// 需要删除的dom数组
let needDelete = [];
// 记录当前函数组件中的hook索引
let hookIndex = 0;
// 当前函数组件的fiber
let currentFunctionFiber = null;
// 修改过的所有fiber节点
let modifiedFiberArray = [];
// 待更新的所有fiber节点
let needUpdateFiberArray = [];
// effect 数组
let effectArray = [];
// 上次更新的时间
let lastUpdateTime = null;

// 尝试对于字符串的children不进行对象转换  done

// todo 一次性转换所有fiber后再执行循环

// 创建一个VDOM
function createElement(type, props, ...children) {
  // 不转换children中的字符串
  children = children.reduce((p, c) => p.concat(c), []);
  // 原始React中会默认覆盖   此处直接拼接吧
  if (props && props.children) {
    children = children.concat(props.children);
  }

  children = children.filter(Boolean)

  // 两种类型，函数组件  普通组件字面量
  if (typeof type === "function") {
    return {
      type: type.name || "anonymous",
      create: type,
      key: props ? props.key : null,
      props: {
        ...props,
        children,
      },
    };
  } else {
    return {
      type,
      create: null,
      key: props ? props.key : null,
      props: {
        ...props,
        children,
      },
    };
  }
}

function render(element, container) {
  currentContainer = container;

  const currentVDOM = {
    type: null,
    create: null,
    key: null,
    props: {
      children: [element],
    },
  };
  // root fiber
  const currentFiber = {
    dom: container,
    vdom: currentVDOM,
    parent: null,
    alternate: null,
    fiberIndex: 0,
    needUpdate: true,
  };

  currentVDOM.fiber = currentFiber;

  currentRootFiber = currentFiber;

  // 修改为按层遍历
  startLoop(currentFiber);
}

function memo(functionComponent) {
  functionComponent.memo = true;
  return functionComponent;
}

// 按层更新的fiber数组
let currentTransformFiberArray = [];
let nextTransformFiberArray = [];

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
      modifiedFiberArray = modifiedFiberArray.filter(
        (fiber) => fiber.needUpdate
      );
      if (
        modifiedFiberArray.length &&
        lastUpdateTime &&
        Date.now() - lastUpdateTime < 17
      ) {
        asyncLoop();
      } else {
        commitStart();
      }
    } else {
      requestIdleCallback(workLoop());
    }
  };
}

function nextWork(fiber) {
  fiber.children = [];
  if (typeof fiber.vdom !== "object") {
    fiber.isTextNode = true;
  } else {
    fiber.isTextNode = false;
  }
  if (!fiber.child) {
    if (!fiber.isTextNode && fiber.vdom.create) {
      if (
        !fiber.needUpdate &&
        fiber.vdom.create.memo &&
        fiber.alternate &&
        fiber.alternate.child &&
        isEqual(fiber.vdom.props, fiber.alternate.vdom.props)
      ) {
        const previousFiber = fiber.alternate;
        fiber.child = previousFiber.child;
        fiber.children = previousFiber.children;
        previousFiber.child.previous = fiber;
        previousFiber.child.parent = fiber;
        let temp = previousFiber.child;
        while (temp.slibing) {
          temp = temp.slibing;
          temp.parent = fiber;
        }
      } else {
        hookIndex = 0;
        currentFunctionFiber = fiber;
        const children = fiber.vdom.create(fiber.vdom.props);
        transformChildren(fiber, [children]);
        currentFunctionFiber = null;
      }
    } else {
      if (!fiber.dom) {
        fiber.dom = createDom(fiber);
      }
      fiber.dom.__fiber__ = fiber;
      if (!fiber.isTextNode) {
        transformChildren(fiber, fiber.vdom.props.children);
      }
    }
  }
  // 按层更新  自己控制的更加精细
  return fiber.children;
}

function transformChildren(fiber, children) {
  let index = 0;
  let currentFiber = null;
  let newFiber = null;
  let previousFiber = fiber.alternate && fiber.alternate.child;

  if (fiber.alternate) {
    fiber.alternate.needUpdate = false;
  }

  // 分离work和commit后不能置为空  因为此时不是一次更新 一次commit
  // 移入到使用后进行清除
  // if (fiber.alternate && fiber.alternate.alternate) {
  //   fiber.alternate.alternate = null;
  // }

  // 梳理流程  done
  while (index < children.length || previousFiber) {
    const newVdom = children[index];
    const isTextNode = typeof newVdom !== "object";

    // sameType 的判断条件  都是文本节点  或者都不是并且type一致
    const sameType =
      newVdom &&
      previousFiber &&
      ((isTextNode && previousFiber.isTextNode) ||
        (!isTextNode &&
          !previousFiber.isTextNode &&
          newVdom.type === previousFiber.vdom.type));
    if (sameType) {
      newFiber = {
        vdom: newVdom,
        key: !isTextNode ? newVdom.key : undefined,
        parent: fiber,
        alternate: previousFiber,
        isTextNode,
        effect: isTextNode
          ? newVdom === previousFiber.vdom
            ? "NOTHING"
            : "UPDATE"
          : isEqual(newVdom.props, previousFiber.vdom.props)
            ? "NOTHING"
            : "UPDATE",
        dom: previousFiber.dom,
        hooks: previousFiber.hooks,
      };

      newVdom.fiber = newFiber;

      if (newFiber.dom) {
        newFiber.dom.__fiber__ = newFiber;
      }
      // 需要验证字符串长度为0的情况是否会有问题
    } else if (!sameType && newVdom !== undefined && newVdom !== null) {
      if (previousFiber) {
        previousFiber.effect = "DELETE";
        if (previousFiber.dom) {
          needDelete.push(previousFiber);
        }
      }

      if (isTextNode) {
        newFiber = {
          vdom: newVdom,
          key: undefined,
          isTextNode,
          parent: fiber,
          alternate: previousFiber,
          effect: "PLACEMENT",
          dom: null,
        };
      } else {
        newFiber = {
          vdom: newVdom,
          key: newVdom.key,
          isTextNode,
          parent: fiber,
          alternate: previousFiber,
          effect: "PLACEMENT",
          dom: null,
        };
        newVdom.fiber = newFiber;
      }
    } else if (!sameType && previousFiber) {
      previousFiber.effect = "DELETE";
      if (previousFiber.dom) {
        needDelete.push(previousFiber);
      }
    } else {
      throw new Error("预料之外的转换情况");
    }
    if (previousFiber) {
      previousFiber.needUpdate = false;
      previousFiber = previousFiber.slibing;
    }

    if (index === 0) {
      fiber.child = newFiber;
      newFiber && (newFiber.previous = fiber);
    } else if (newVdom) {
      if (!currentFiber) {
        throw new Error("意料之外的转换错误");
      }
      currentFiber.slibing = newFiber;
      newFiber.previous = currentFiber;
    }
    if (newFiber) {
      // 记录下当前层级
      newFiber.fiberIndex = +fiber.fiberIndex + 1;
      // 将所有的child fiber放到parent fiber的children
      fiber.children = fiber.children || [];
      fiber.children.push(newFiber);
    }
    currentFiber = newFiber;
    // 重置当前fiber
    newFiber = null;
    index++;
  }
}

// === hook === //

function useState(init) {
  const currentHookIndex = hookIndex;
  const currentHookFiber = currentFunctionFiber;

  hookIndex++;

  if (currentHookFiber.hooks) {
    let hook = currentHookFiber.hooks;
    hook.previous = currentHookFiber;
    while (hook && currentHookIndex !== hook.index) {
      hook = hook.next;
    }
    if (hook && hook.index === currentHookIndex) {
      return [hook.value, hook.set];
    }
  }
  const currentHook = {
    hookFlag: true,
    index: currentHookIndex,
    value: typeof init === "function" ? init() : init,
    previousValue: null,
    set: null,
    next: null,
    previous: null,
    type: "useState",
    deps: null,
  };
  if (!currentHookFiber.hooks) {
    if (currentHookIndex !== 0) {
      throw new Error("索引和hook不匹配");
    }
    currentHookFiber.hooks = currentHook;
    currentHook.previous = currentHookFiber;
  } else {
    let last = currentHookFiber.hooks;
    let index = 1;
    while (last.next) {
      last = last.next;
      index++;
    }
    if (index !== currentHookIndex) {
      throw new Error("索引与hook的index不匹配");
    }
    last.next = currentHook;
    currentHook.previous = last;
  }
  function setValue(value) {
    let currentHook = this;
    while (currentHook.hookFlag) {
      currentHook = currentHook.previous;
    }
    if (!currentHook) {
      throw new Error("hook未连接fiber");
    }

    this.previousValue = this.value;

    if (typeof value === "function") {
      this.value = value(this.value);
    } else {
      this.value = value;
    }
    if (!Object.is(this.value, this.previousValue)) {
      pushFiber(currentHook);
    }
  }
  currentHook.set = setValue.bind(currentHook);
  return [currentHook.value, currentHook.set];
}

function useEffect(action, deps) {
  const currentHookIndex = hookIndex;
  const currentHookFiber = currentFunctionFiber;

  hookIndex++;

  if (deps && !Array.isArray(deps)) {
    throw new Error("useEffect deps must a array");
  }

  let preHook = null;

  if (currentHookFiber.hooks) {
    let hook = currentHookFiber.hooks;
    hook.previous = currentHookFiber;
    while (hook && hook.index !== currentHookIndex) {
      hook = hook.next;
    }
    preHook = hook;
  }

  if (preHook) {
    if (preHook.deps) {
      let temp = false;
      for (let key in deps) {
        if (!Object.is(deps[key], preHook.deps[key])) {
          temp = true;
          break;
        }
      }
      if (temp) {
        preHook.value = action;
        preHook.effect = true;
        preHook.deps = deps;
      }
    } else {
      preHook.value = action;
      preHook.effect = true;
    }
  } else {
    const currentHook = {
      hookFlag: true,
      index: currentHookIndex,
      value: action,
      previousValue: null,
      deps,
      set: null,
      next: null,
      previous: null,
      type: "useEffect",
      effect: true,
      cancel: null,
    };
    if (!currentHookFiber.hooks) {
      if (currentHookIndex !== 0) {
        throw new Error("索引和hook不匹配");
      }
      currentHookFiber.hooks = currentHook;
      currentHook.previous = currentHookFiber;
    } else {
      let last = currentHookFiber.hooks;
      let index = 1;
      while (last.next) {
        last = last.next;
        index++;
      }
      if (index !== currentHookIndex) {
        throw new Error("索引与hook的index不匹配");
      }
      last.next = currentHook;
      currentHook.previous = last;
    }
  }
}

// === commit === //

const debounceUpdate = debounce(asyncLoop, 0);

function pushFiber(fiber) {
  fiber.needUpdate = true;
  // 将整条链标记为需要更新
  let parent = fiber.parent;
  while (parent) {
    parent.needUpdate = true;
    parent = parent.parent;
  }
  modifiedFiberArray.push(fiber);
  debounceUpdate();
}

function asyncLoop() {
  if (!needLoop) {
    modifiedFiberArray = modifiedFiberArray.filter((fiber) => fiber.needUpdate);
    if (modifiedFiberArray.length) {
      const currentUpdateFiber = replaceFiberTree(modifiedFiberArray.shift());
      startLoop(currentUpdateFiber);
    }
  }
}

function replaceFiberTree(currentFiber) {
  const newHookFiber = Object.assign({}, currentFiber);
  newHookFiber.vdom.fiber = newHookFiber;
  const currentHooks = currentFiber.hooks;
  newHookFiber.alternate = currentFiber;
  newHookFiber.children = [];
  newHookFiber.child = null;
  currentHooks && (currentHooks.previous = newHookFiber);
  const previousFiber = currentFiber.previous;
  if (previousFiber) {
    if (previousFiber.slibing && previousFiber.slibing === currentFiber) {
      previousFiber.slibing = newHookFiber;
    } else if (previousFiber.child && previousFiber.child === currentFiber) {
      previousFiber.child = newHookFiber;
    } else {
      throw new Error("不应该出现的错误");
    }
    newHookFiber.previous = previousFiber;
  }
  return newHookFiber;
}

function commitStart() {
  lastUpdateTime = Date.now();
  needDelete.forEach((fiber) => fiber.dom && fiber.dom.remove());
  needUpdateFiberArray.forEach((fiber) => {
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
      runEffect();
    } catch (e) {
      console.error(e);
    }
  });
  needUpdateFiberArray = [];
  needDelete = [];
}

function commitLoop(currentFiber, parentDom) {
  if (currentFiber) {
    if (currentFiber.dom) {
      if (currentFiber.effect === "PLACEMENT") {
        const afterDom = getSlibingWithDom(currentFiber.slibing);
        if (afterDom) {
          parentDom.insertBefore(currentFiber.dom, afterDom);
        } else {
          parentDom.appendChild(currentFiber.dom);
        }
      } else if (currentFiber.effect === "UPDATE") {
        if (currentFiber.isTextNode) {
          currentFiber.dom.textContent = currentFiber.vdom
        } else {
          updateDom(
            currentFiber.dom,
            currentFiber.alternate.vdom.props,
            currentFiber.vdom.props
          );
        }
      }
    }
    currentFiber.effect = null;
    pushEffect(currentFiber);
    commitLoop(currentFiber.child, currentFiber.dom || parentDom);
    commitLoop(currentFiber.slibing, parentDom);
    currentFiber.alternate = null;
  }
}

function pushEffect(fiber) {
  if (fiber.hooks) {
    let hook = fiber.hooks;
    while (hook) {
      if (hook.hookFlag && hook.type === "useEffect" && hook.effect) {
        effectArray.push(hook);
      }
      hook = hook.next;
    }
  }
}

function runEffect() {
  const allEffect = effectArray.slice(0);
  allEffect.forEach((effect) => {
    effect.effect = false;
    effect.cancel && effect.cancel();
    effect.cancel = effect.value();
  });
  effectArray = [];
}

// === tool === //
function getSlibingWithDom(fiber) {
  if (fiber) {
    if (fiber.effect === "UPDATE" && fiber.dom) {
      return fiber.dom;
    } else {
      return getSlibingWithDom(fiber.slibing);
    }
  }
}

function createDom(fiber) {
  if (fiber.vdom && typeof fiber.vdom.type === "object") {
    throw new Error("类型错误, jsx表达式不应该被调用");
  }

  const textNode = typeof fiber.vdom !== "object";

  const dom = textNode
    ? document.createTextNode(fiber.vdom)
    : document.createElement(fiber.vdom.type);

  !textNode && updateDom(dom, {}, fiber.vdom.props);

  return dom;
}

const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (oldProps, newProps) => (key) => oldProps[key] !== newProps[key];
const isGone = (newProps) => (key) => !(key in newProps);

function updateDom(element, oldProps, newProps) {
  // remove old eventListener
  Object.keys(oldProps)
    .filter(isEvent)
    .filter((key) => isGone(newProps)(key) || isNew(oldProps, newProps)(key))
    .forEach((key) => {
      const eventName = key.toLowerCase().slice(2);
      element.removeEventListener(eventName, oldProps[key]);
    });
  // remove old props
  Object.keys(oldProps)
    .filter(isProperty)
    .filter(isGone(newProps))
    .forEach((key) => (element[key] = ""));

  // set new props
  Object.keys(newProps)
    .filter(isProperty)
    .filter(isNew(oldProps, newProps))
    .forEach((key) => (element[key] = newProps[key]));
  // set new eventListener
  Object.keys(newProps)
    .filter(isEvent)
    .filter(isNew(oldProps, newProps))
    .forEach((key) => {
      const eventName = key.toLowerCase().slice(2);
      element.addEventListener(eventName, newProps[key]);
    });

  return element;
}

function isNormalEqual(src, target) {
  if (typeof src === "object") {
    let flag = true;
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
      flag = flag && isEqual(src[key], target[key]);
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

MReact = {
  createElement,
  render,
  useState,
  useEffect,
  memo,
};
