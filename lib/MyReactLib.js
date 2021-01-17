// 一，用于jsx转换的createElement方法；二，render方法；三，hook函数逻辑

function createElement(type, props, ...children) {
  // 这个地方进行转换的话无法追踪fiber节点了，因为函数组件提前运行了
  // if (typeof type === "function") {
  //   // 如果没有以大写字母开头应该给出警告
  //   const nextProps = {
  //     ...props,
  //     children,
  //   };
  //   const element = type(nextProps);
  //   return element;
  // } else {
  // 因为函数组件为childre已经包了一层数组，此时又会包一层数组，此处进行flatten

  // 因为多层函数组件嵌套，此时需要进行flatten
  // children = children
  //   .reduce((p, c) => p.concat(c), [])
  //   .map((child) =>
  //     typeof child === "string" ? createTextElement(child) : child
  //   );
  // return {
  //   type,
  //   props: {
  //     ...props,
  //     children,
  //   },
  // };
  // }

  // 感觉这种实现并不好，多了很多层函数fiber，不方便看数据结构
  // 引入一个新的element状态  create
  /*
  children = children.map((child) =>
    typeof child === "string" ? createTextElement(child) : child
  );
  if (typeof type === "function") {
    return {
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
  */

  // 不对  不应该这么理解  应该说本来就存在两种fiber  一种是浏览器原始的标签  另一种是自定义的组件...

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
// 记录当前的fiber任务
let currentFiberItem = null;
// 需要删除的dom数组
let needDelete = [];
// 记录hook索引
let stateIndex = 0;
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
  currentFiberItem = currentFiber;
  startLoop(currentFiberItem);
}

// 因为有全局的currentFiberItem，可以知道发生hook的函数组件的对应的fiber
function useState(init) {
  console.log("hook发生时", currentFiberItem);
  const currentHookItem = currentFiberItem;
  let val;
  let setVal;
  // 获取当前fiber的前一个树的同级fiber
  const alternate = currentHookItem.alternate;
  // 判断前一个是否存在
  if (alternate) {
    console.log("前一次", alternate);
    // 简单考虑，不用其他判断
    currentHookItem.setUseState = alternate.setUseState;
    currentHookItem.useState = alternate.useState;
    val = currentHookItem.useState[stateIndex];
    setVal = currentHookItem.setUseState[stateIndex];
  } else {
    // 此时是初始化
    if (!currentHookItem.useState) {
      currentHookItem.useState = [];
      currentHookItem.setUseState = [];
    }
    val = init;
    setVal = (val) => {
      currentHookItem.useState[stateIndex] = val;
      if (!currentRootFiber) {
        // 从当前节点开始render
        currentFiberItem = currentHookItem;
        currentHookItem.alternate = currentHookItem;
        startLoop(currentHookItem);
      }
    };
    currentHookItem.useState[stateIndex] = val;
    currentHookItem.setUseState[stateIndex] = setVal;
  }
  // 执行完成，索引增加
  stateIndex++;
  // 获取当前
  return [val, setVal];
}

function startLoop(currentFiber) {
  // 设置当前needLoop
  needLoop = true;
  updateRootFiber = currentFiber;
  needDelete = [];
  requestIdleCallback(workLoop(currentFiber));
}

function workLoop(currentFiber) {
  return (deadLine) => {
    let shouldYield = false;
    while (currentFiber && !shouldYield) {
      currentFiber = nextWork(currentFiber);
      currentFiberItem = currentFiber;
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

// function workLoop(deadLine) {
//   console.log("运行了吗");
//   let shouldYield = false;
//   while (currentFiberItem && !shouldYield) {
//     currentFiberItem = nextWork(currentFiberItem);
//     // 根据当前的时间状态更新执行状态
//     shouldYield = deadLine.timeRemaining() < 1;
//   }

//   // 如果没有了下一个fiber任务，说明所有的都循环完了，此时需要进行dom更新操作
//   if (!currentFiberItem) {
//     commitStart();
//   }

//   if (needLoop) {
//     requestIdleCallback(workLoop);
//   }
// }

// 开始进行dom更新，两种更新方式：一：从头开始；二：从当前传入的开始(待调研)
function commitStart(currentFiber) {
  needDelete.forEach((fiber) => fiber.dom.remove());
  let currentNeedUpdateFiber = currentFiber
    ? currentFiber
    : ((previousRootFiber = currentRootFiber), currentRootFiber);
  commitLoop(currentNeedUpdateFiber.child);
  currentRootFiber = null;
  updateRootFiber = null;
  needLoop = false;
}

function commitLoop(currentFiber) {
  if (currentFiber) {
    // 因为存在多层嵌套的
    let parentFiber = currentFiber.parent;
    let parentDom = parentFiber.dom;
    while (!parentDom) {
      parentFiber = parentFiber.parent;
      parentDom = parentFiber.dom;
    }
    if (currentFiber.effect === "PLACEMENT" && currentFiber.dom) {
      parentDom.appendChild(currentFiber.dom);
    } else if (currentFiber.effect === "UPDATE" && currentFiber.dom) {
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
      if (currentFiber.dom) {
        currentFiber.dom.remove();
      }
    }
    commitLoop(currentFiber.child);
    commitLoop(currentFiber.slibing);
  }
}

// 执行当前fiber阶段任务
function nextWork(fiber) {
  // 如果是函数组件，children需要函数组件运行才完整，并且函数组件的fiber没有dom属性
  if (fiber.create) {
    // 函数组件的运行发生地点
    // 重新初始化hook的index
    stateIndex = 0;
    transformChildren(fiber, [fiber.create(fiber.props)]);
    stateIndex = 0;
  } else {
    // 不是函数组件，children正常存在props中，并且有dom对象
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }
    // 将当前fiber的children全部转换为fiber，依次标记为children --> slibing --> slibing --> 。。。
    transformChildren(fiber, fiber.props.children);
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
  try {
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
  } catch (e) {
    console.log(element);
    console.log(e);
  }
}

// 转换当前fiber的props children为fiber
function transformChildren(fiber, children) {
  // const childrenElements = fiber.props.children;
  // 当前遍历到的索引
  let index = 0;
  // 当前生成的fiber的前一个
  let currentFiber = null;
  // 当前fiber的前一次生成的树的同级节点
  let previousFiber = fiber.alternate && fiber.alternate.child;
  while (index < children.length || previousFiber) {
    let newFiber = null;
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
        effect: "UPDATE",
        dom: previousFiber.dom,
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
      needDelete.push(previousFiber);
      previousFiber.effect = "DELETE";
    }

    // 循环下一个前树fiber
    if (previousFiber) {
      previousFiber = previousFiber.slibing;
    }
    // 如果是第一个元素，将新创建的fiber标记为当前fiber的child，并将新创建的fiber标记为slibings
    // 如果不是第一个元素，将新创建的fiber标记为当前slibings的slibings节点，同时更新当前slibings节点，如此循环
    if (index === 0) {
      fiber.child = newFiber;
    } else if (element) {
      currentFiber.slibing = newFiber;
    }
    currentFiber = newFiber;
    index++;
  }
}

window.MReact = MReact;
