// 一，用于jsx转换的createElement方法；二，render方法；三，hook函数逻辑

function createElement(type, props, ...children) {
  // 所以存在多层没有dom的fiber是正常的。多层函数组件嵌套，flatten还是必要的，有必要debugger跟踪看一下过程...
  children = children
    .reduce((p, c) => p.concat(c), [])
    .map((child) =>
      typeof child !== "object" ? createTextElement(child) : child
    );
  if (typeof type === "function") {
    return {
      type: type.name,
      create: type,
      props: {
        ...props,
        children,
      },
    };
  } else {
    return {
      type,
      props: {
        ...props,
        children,
      },
    };
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

MReact = {
  createElement,
  render,
  useState,
};

// 维护全局状态，标记当前是否需要进行更新
let needLoop = false;
// 记录当前任务的root fiber节点
let currentRootFiber = null;
// 记录之前的root fiber节点
let previousRootFiber = null;
// 需要删除的dom数组
let needDelete = [];
// 记录hook索引
let hookIndex = 0;
// 当前函数组件
let currentFunctionFiber = null;
// 记录更新开始的节点
let updateRootFiber = null;

function render(element, container) {
  // 渲染入口函数，从当前位置开始递归进行渲染
  // 初始化当前root fiber 以及 当前fiber任务
  const currentFiber = {
    dom: container,
    props: {
      children: [element],
    },
    parent: null,
    alternate: previousRootFiber,
  };
  // 此时的element是经过babel转换jsx之后的函数，通过MReact.createElement进行转换
  window.eee = currentFiber;
  // 设置当前root fiber
  currentRootFiber = currentFiber;
  // 开始
  startLoop(currentFiber);
}

function replaceFiberTree(currentFiber) {
  const newHookFiber = {
    create: currentFiber.create,
    alternate: currentFiber,
    type: currentFiber.type,
    props: currentFiber.props,
    dom: currentFiber.dom,
    parent: currentFiber.parent,
    slibing: currentFiber.slibing,
    // 也可以不直接将之前的hook拿过来，丢失了之前的状态，可以重新复制一份
    hooks: currentFiber.hooks,
  };
  // 替换原始树
  const previousFiber = currentFiber.previous;
  if (previousFiber) {
    // 通过slibing进行连接
    if (previousFiber.slibing && previousFiber.slibing === currentFiber) {
      // 进行替换
      previousFiber.slibing = newHookFiber;
    } else if (previousFiber.child && previousFiber.child === currentFiber) {
      // 通过child进行连接
      previousFiber.child = newHookFiber;
    } else {
      throw new Error("不应该出现的错误");
    }
    newHookFiber.previous = previousFiber;
  }
  return newHookFiber;
}

function useState(init) {
  // 应该要进行这个操作的...
  const currentHookIndex = hookIndex;
  const currentHookFiber = currentFunctionFiber;

  // 拿到前一次的hook
  const oldHook =
    currentHookFiber &&
    currentHookFiber.hooks &&
    currentHookFiber.hooks[currentHookIndex];
  if (oldHook) {
    // 增加当前函数组件的hook索引
    hookIndex++;
    // 在这个地方进行hookFiber绑定，避免通过其他更新触发的fiber无法即时同步
    currentHookFiber.hooks.hookFiber = currentHookFiber;
    return oldHook;
  } else {
    // 是初始化
    if (!currentHookFiber.hooks) {
      currentHookFiber.hooks = [];
      currentHookFiber.hooks.hookFiber = currentHookFiber;
    }
    // 现在的实现还是存在问题，形成闭包后不能即时更新其中的引用导致多个hook使用的错乱
    function setValue(value) {
      if (typeof value === "function") {
        this[currentHookIndex][0] = value(this[currentHookIndex][0]);
      } else {
        this[currentHookIndex][0] = value;
      }
      const newHookFiber = replaceFiberTree(this.hookFiber);
      newHookFiber.hooks.hookFiber = newHookFiber;
      // 不能重置这一步，会导致后续的alternate读取不到，因为transfomr逻辑中使用相关逻辑
      // currentHookItem.parent = null;
      // currentHookItem.previous = null;
      // currentHookItem.alternate = null;
      startLoop(newHookFiber);
    }
    currentHookFiber.hooks[currentHookIndex] = [
      init,
      setValue.bind(currentHookFiber.hooks),
    ];
    hookIndex++;
    return currentHookFiber.hooks[currentHookIndex];
  }
}

function startLoop(currentFiber) {
  // 设置当前needLoop
  needLoop = true;
  // 从当前fiber任务开始进行更新，因此更新时也从当前任务开始
  updateRootFiber = currentFiber;
  requestIdleCallback(workLoop(currentFiber));
}

function workLoop(currentFiber) {
  return (deadLine) => {
    let shouldYield = false;
    // const
    while (currentFiber && !shouldYield) {
      currentFiber = nextWork(currentFiber);
      // 根据当前的时间状态更新执行状态
      shouldYield = deadLine.timeRemaining() < 1;
    }

    // 如果没有了下一个fiber任务，说明所有的都循环完了，此时需要进行dom更新操作
    if (!currentFiber) {
      commitStart(updateRootFiber);
    }

    if (needLoop) {
      requestIdleCallback(workLoop(currentFiber));
    }
  };
}

// 开始进行dom更新，两种更新方式：一：从头开始；二：从当前传入的开始(待调研)
function commitStart(currentFiber) {
  needDelete.forEach((fiber) => fiber.dom.remove());
  commitLoop(currentFiber.child);
  // 这个地方应该让每一个fiber都初始拥有alternate，不然后续的hook更新到初始没有alternate的地方就会出错
  if (currentRootFiber) {
    previousRootFiber = currentRootFiber;
    currentRootFiber = null;
  }
  updateRootFiber = null;
  needLoop = false;
  needDelete = [];
}

function commitLoop(currentFiber) {
  if (currentFiber) {
    if (currentFiber.dom) {
      // 因为存在多层函数组件嵌套的原因，当前fiber的parentFiber并不一定会存在dom，应该一直向上找
      let parentFiber = currentFiber.parent;
      let parentDom = parentFiber.dom;
      while (!parentDom) {
        parentFiber = parentFiber.parent;
        parentDom = parentFiber.dom;
      }
      if (currentFiber.effect === "PLACEMENT") {
        parentDom.appendChild(currentFiber.dom);
      } else if (currentFiber.effect === "UPDATE") {
        updateDom(
          currentFiber.dom,
          currentFiber.alternate.props,
          currentFiber.props
        );
        // 文本节点的特殊处理
        if (currentFiber.type === "TEXT_ELEMENT") {
          parentDom.appendChild(currentFiber.dom);
        }
      } else if (currentFiber.effect === "DELETE") {
        currentFiber.dom.remove();
      }
    }
    currentFiber.effect = null;
    commitLoop(currentFiber.child);
    commitLoop(currentFiber.slibing);
  }
}

// 执行当前fiber阶段任务
function nextWork(fiber) {
  // 如果是函数组件，children需要函数组件运行才完整，并且函数组件的fiber没有dom属性
  if (!fiber.child) {
    if (fiber.create) {
      // 函数组件的运行发生地点
      // 重新初始化hook的index
      hookIndex = 0;
      // 记录下当前函数组件，在hook中可以拿到当前fiber
      currentFunctionFiber = fiber;
      transformChildren(fiber, [fiber.create(fiber.props)]);
      currentFunctionFiber = null;
    } else {
      // 不是函数组件，children正常存在props中，并且有dom对象
      if (!fiber.dom) {
        fiber.dom = createDom(fiber);
      }
      // 将当前fiber的children全部转换为fiber，依次标记为children --> slibing --> slibing --> 。。。
      transformChildren(fiber, fiber.props.children);
    }
  }

  // 深搜，返回下一个fiber
  let currentFiber = fiber;
  if (currentFiber.child) {
    return currentFiber.child;
  }
  while (currentFiber && !currentFiber.slibing) {
    currentFiber = currentFiber.parent;
  }
  if (currentFiber) {
    return currentFiber.slibing;
  }
}

// 根据fiber对象生成dom对象
function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  // 为dom对象绑定属性以及方法
  updateDom(dom, {}, fiber.props);
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
}

function transformChildren(fiber, children) {
  // 当前遍历到的索引
  let index = 0;
  // 当前生成的fiber的前一个
  let currentFiber = null;
  // 当前fiber的前一次生成的树的同级节点
  let newFiber = null;
  // 同级前树
  let previousFiber = fiber.alternate && fiber.alternate.child;
  while (index < children.length || previousFiber) {
    // 如果当前没有遍历完全或者前一次tree的fiber还存在，需要继续遍历
    const element = children[index];
    const sameType =
      element && previousFiber && element.type === previousFiber.type;
    if (sameType) {
      // 元素类型一致，执行更新操作
      newFiber = {
        create: element.create,
        type: element.type,
        props: element.props,
        parent: fiber,
        alternate: previousFiber,
        effect: isEqual(element.props, previousFiber.props)
          ? "NOTHING"
          : "UPDATE",
        dom: previousFiber.dom,
        hooks: previousFiber.hooks,
      };
    } else if (!sameType && element) {
      if (previousFiber) {
        previousFiber.effect = "DELETE";
        needDelete.push(previousFiber);
      }
      // 如果类型不同，替换操作
      newFiber = {
        create: element.create,
        type: element.type,
        props: element.props,
        parent: fiber,
        alternate: previousFiber,
        effect: "PLACEMENT",
        dom: null,
      };
    } else if (!sameType && previousFiber) {
      previousFiber.effect = "DELETE";
      needDelete.push(previousFiber);
    }
    // 循环下一个前树fiber
    if (previousFiber) {
      previousFiber = previousFiber.slibing;
    }
    // 如果是第一个元素，将新创建的fiber标记为当前fiber的child，并将新创建的fiber标记为slibings
    // 如果不是第一个元素，将新创建的fiber标记为当前slibings的slibings节点，同时更新当前slibings节点，如此循环

    if (index === 0) {
      fiber.child = newFiber;
      newFiber.previous = fiber;
    } else if (element) {
      currentFiber.slibing = newFiber;
      newFiber.previous = currentFiber;
    }
    currentFiber = newFiber;
    index++;
  }
}

window.MReact = MReact;

function isEqual(src, target) {
  if (typeof src === "object") {
    let flag = true;
    for (let key in src) {
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
