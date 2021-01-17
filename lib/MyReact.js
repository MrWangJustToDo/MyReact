// 用于babel解析创建的方法  className 的原因??
function createElement(type, props, ...children) {
  const element = {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
  return element;
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
function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

// 当前需要执行的任务
let nextUnitOfWork = null;
// 记录当前root fiber
let wipRoot = null;
// 记录前一个root fiber
let currentRoot = null;
// 需要删除的fiber
let deleteArray = null;

function render(element, container) {
  // 使用root节点初始化需要运行的任务
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot, // 为每一个fiber节点添加上次渲染生成的节点，用于进行操作判断
  };
  deleteArray = [];
  nextUnitOfWork = wipRoot;
}
const Didact = {
  createElement,
  render,
};

// fiber 分块逻辑

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 执行当前任务并返回下一个需要执行的任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 根据当前的时间状态更新执行状态
    shouldYield = deadline.timeRemaining() < 1;
  }
  // 如果没有下一次的任务，代表performUnitOfWork方法已经执行完了全部的任务，此时需要开始从root开始更新dom
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  // 如果不能执行了，放入下一个任务回调执行
  requestIdleCallback(workLoop);
}

function commitRoot() {
  deleteArray.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (oldProps, newProps) => (key) => oldProps[key] !== newProps[key];
const isGone = (newProps) => (key) => !(key in newProps);

function updateDom(element, oldProps, newProps) {
  // remove old eventListener
  Object.keys(oldProps)
    .filter(isEvent)
    .filter(isGone(newProps))
    .filter(isNew(oldProps, newProps))
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

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  if (fiber.effect === "PLACEMENT" && fiber.dom != null) {
    domParentFiber.dom.appendChild(fiber.dom);
  } else if (fiber.effect === "DELETE") {
    domParentFiber.dom.removeChild(fiber.dom);
  } else if (fiber.effect === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }
  commitWork(fiber.child);
  commitWork(fiber.slibing);
}

// 开始第一次执行
requestIdleCallback(workLoop);

// 执行当前任务
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 返回新的fiber
  // 如果当前fiber有直接子fiber 直接返回
  if (fiber.child) {
    return fiber.child;
  }
  // 如果没有直接子fiber，返回当前fiber的slibings fiber
  let lastFiber = fiber;
  while (lastFiber) {
    if (lastFiber.slibing) {
      return lastFiber.slibing;
    }
    // 如果没有slibings fiber  则通过parent向上层找 一直到root fiber
    lastFiber = lastFiber.parent;
  }
}

function updateHostComponent(fiber) {
  // 执行当前任务，并且返回下一个任务
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  reconcileChildren(fiber, fiber.props.children);
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

// 创建新的fiber
function reconcileChildren(parentFiber, elements) {
  let index = 0;
  let slibings = null;
  // 为每一个新创建的fiber添加上一次创建的同级fiber的标记
  let oldChildFiber = parentFiber.alternate && parentFiber.alternate.child;
  // 将当前filber的children全部转换为filber，每一个fiber链表节点就是一个work
  // 当前有旧fiber或者当前有element都需要进行判断
  while (index < elements.length || oldChildFiber != null) {
    // 获取当前element对象
    const element = elements[index];
    let newFiber = null;
    const sameType =
      oldChildFiber && element && element.type === oldChildFiber.type;
    if (sameType) {
      // 当前旧fiber与新的element type 一致  只需要更新dom
      newFiber = {
        type: element.type,
        dom: oldChildFiber.dom,
        parent: parentFiber,
        alternate: oldChildFiber,
        props: element.props,
        effect: "UPDATE",
      };
    } else if (element && !sameType) {
      // 当前element存在 对应 旧filber不存在  添加操作
      newFiber = {
        type: element.type,
        dom: null,
        parent: parentFiber,
        alternate: null,
        props: element.props,
        effect: "PLACEMENT",
      };
    } else if (oldChildFiber && !sameType) {
      // 旧fiber存在而新的fiber不存在  删除操作
      oldChildFiber.effect = "DELETE";
      deleteArray.push(oldChildFiber);
    }

    if (oldChildFiber) {
      oldChildFiber = oldChildFiber.slibing;
    }

    // 如果是第一个元素，将新创建的fiber标记为当前fiber的child，并将新创建的fiber标记为slibings
    // 如果不是第一个元素，将新创建的fiber标记为当前slibings的slibings节点，同时更新当前slibings节点，如此循环
    if (index === 0) {
      parentFiber.child = newFiber;
    } else if (element) {
      slibings.slibing = newFiber;
    }
    slibings = newFiber;
    index++;
  }
}

window.Didact = Didact;
