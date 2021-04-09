// 一，用于jsx转换的createElement方法；二，render方法；三，hook函数逻辑

// 这个函数的运行时机,因为现在的实现是从一个深度优先模型,所以会从最低层开始

// 对于JSX表达式  会在render开始转换,render函数中接收到的是一个嵌套的{type:, props:}对象
// 对于函数组件  则会在函数组件运行之后再执行,

// 尝试实现 state的异步汇总更新机制，减少函数调度运行不及时的错误   done

// 梳理hook逻辑，修复props的bug，尝试更改hook的数据结构 数组 ---> 链表  done

// 存在绑定多个事件的情况，hook逻辑存在一点问题，尝试修复  done

// 重新整理流程

// 基本函数 createElement 用于babel编辑JSX后的转换函数
function createElement(type, props, ...children) {
  /*
  // children 来源两处  1. <P><a>123</a></P>
                        2. <P children={<a>123</a>}></P>
  */

  // 来源一：
  // 问题：
  // 存在多层没有dom的fiber是正常的。多层函数组件嵌套，通过debugger发现存在双重children数组的情况，统一进行处理，flatten还是必要的，有必要debugger跟踪看一下过程...
  children = children
    // 结果：
    // 经过分析  必须进行这样处理的原因是函数组件使用props.children时已经是一个数组，作为参数传进来的
    // 时候又会加上一层数组，所以会出现本应是同级却嵌套的情况，和函数组件嵌套没关系，与使用props.children有关
    // 此处来处理这种问题，初步研究发现嵌套最深不会超过一层。
    .reduce((p, c) => p.concat(c), [])
    .map((child) =>
      typeof child !== "object" ? createTextElement(child) : child
    );

  // 来源二：
  if (props && props.children) {
    children = children.concat(
      typeof props.children !== "object"
        ? createTextElement(props.children)
        : props.children
    );
  }

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
      create: null,
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

// 再次引入数组
let updateFiberArray = [];
let updateFiberIndex = {};

// 渲染入口函数，从当前位置开始递归进行渲染
function render(element, container) {
  // 初始化当前root fiber 以及 当前fiber任务

  // root fiber
  const currentFiber = {
    dom: container,
    props: {
      children: [element],
    },
    parent: null,
    alternate: previousRootFiber,
    fiberIndex: 0,
  };
  // 此时的element是经过babel转换jsx之后的函数，通过MReact.createElement进行转换
  window.rootFiber = currentFiber;
  // 设置当前root fiber
  currentRootFiber = currentFiber;
  // 开始
  startLoop(currentFiber);
}

// ========== update ================

// 异步更新，原理：为所有的fiber节点添加一个index索引，当fiber更改时，将当前fiber推送到更新数组中，判断是否有同级的fiber存在
// 如果有同级的存在，直接找到上一级push进入更新数组，如果没有再到上一级，再使用本级来进行更新

// 不需要使用数组，直接记录最早更新的节点

// 直接使用节点的方式，触发高频事件时会出现更新出错，还是使用数组的方式  需要理解一下为什么 。。。
function asyncLoop() {
  // 如果更新数组存在需要更新的任务
  if (updateFiberArray.length) {
    updateFiberArray.sort((o1, o2) => (o1.fiberIndex > o2.fiberIndex ? 1 : -1));
    const currentUpdateRootFiber = replaceFiberTree(updateFiberArray[0]);
    startLoop(currentUpdateRootFiber);
    updateFiberArray = [];
    updateFiberIndex = {};
  }
}

const debounceUpdate = debounce(asyncLoop, 1);

function pushFiber(fiber) {
  if (fiber.fiberIndex in updateFiberIndex) {
    if (fiber.type !== updateFiberIndex[fiber.fiberIndex]) {
      updateFiberIndex[fiber.parent.fiberIndex] = fiber.parent.type;
      updateFiberArray.push(fiber.parent);
    }
  } else {
    updateFiberIndex[fiber.fiberIndex] = fiber.type;
    updateFiberArray.push(fiber);
  }
  debounceUpdate();
}

// fiber 树替换
function replaceFiberTree(currentFiber) {
  const newHookFiber = Object.assign({}, currentFiber);
  const currentHooks = currentFiber.hooks;
  if (!currentHooks) {
    // 用于测试
    throw new Error("未发生hook更新，不应该触发的...");
  }
  newHookFiber.alternate = currentFiber;
  newHookFiber.child = null;
  // newHookFiber.hooks = currentHooks;
  currentHooks.previous = newHookFiber;
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

// ================ hook ================

function useState(init) {
  // 创建闭包变量
  const currentHookIndex = hookIndex;
  const currentHookFiber = currentFunctionFiber;

  hookIndex++;

  if (currentHookFiber.hooks) {
    let hook = currentHookFiber.hooks;
    // 重新设置当前hook链表头指针
    hook.previous = currentHookFiber;
    while (hook && currentHookIndex !== hook.index) {
      hook = hook.next;
    }
    if (hook && hook.index === currentHookIndex) {
      // hook更新
      return [hook.value, hook.set];
    }
  }
  // hook初始化
  // 生成当前hook
  const currentHook = {
    hookFlag: true,
    index: currentHookIndex,
    value: typeof init === "function" ? init() : init,
    previousValue: null,
    set: null,
    next: null,
    previous: null,
  };
  // 是当前fiber的第一个hook
  if (!currentHookFiber.hooks) {
    if (currentHookIndex !== 0) {
      throw new Error("索引和hook不匹配");
    }
    currentHookFiber.hooks = currentHook;
    currentHook.previous = currentHookFiber;
  } else {
    const last = currentHookFiber.hooks;
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
  // hook数据结构
  // fiber.hooks = {hookFlag: boolean, index: number, value: any, previousValue: any, set: function, next: nextHook, previous: preHook of fiber}
  function setValue(value) {
    // 根据链表获取当前fiber
    let currentFiber = this;
    while (currentFiber.hookFlag) {
      currentFiber = currentFiber.previous;
    }
    if (!currentFiber) {
      throw new Error("hook未连接fiber");
    }

    // 分离两次render的hook状态
    // const newHookFiber = replaceFiberTree(currentFiber);

    // 支持useState的函数调用，得到的数据会默认进行浅合并
    this.previousValue = this.value;
    if (typeof value === "function") {
      const newValue = value(this.value);
      if (typeof newValue === "object" && typeof this.value === "object") {
        this.value = {
          ...this.value,
          ...newValue,
        };
      } else {
        this.value = newValue;
      }
    } else {
      if (typeof value === "object" && typeof this.value === "object") {
        this.value = {
          ...this.value,
          ...value,
        };
      } else {
        this.value = value;
      }
    }
    // 将当前fiber推送到更新数组中
    pushFiber(currentFiber);

    // startLoop(newHookFiber);
  }
  currentHook.set = setValue.bind(currentHook);
  return [currentHook.value, currentHook.set];
}

// ================ 运行逻辑 ===============

function startLoop(currentFiber) {
  console.log("循环开始", currentFiber);
  // 设置当前needLoop
  needLoop = true;
  // 从当前fiber任务开始进行更新，因此更新时也从当前任务开始
  updateRootFiber = currentFiber;
  // 逻辑开始
  requestIdleCallback(workLoop(currentFiber));
}

// 通过浏览器调用自动执行，用于调用nextWork 转换fiber 以及并返回下一个需要转换的fiber
function workLoop(currentFiber) {
  return (deadLine) => {
    let shouldYield = false;
    while (currentFiber && !shouldYield) {
      currentFiber = nextWork(currentFiber);
      // 根据当前的时间状态更新执行状态
      shouldYield = deadLine.timeRemaining() < 1;
    }

    // 如果没有了下一个fiber任务，说明所有的都循环完了，此时需要进行dom更新操作
    if (!currentFiber) {
      commitStart(updateRootFiber);
    }

    // 还有下一个任务 但是没有资源执行了   注册任务  由浏览器在合适的时机自动调用
    if (needLoop) {
      requestIdleCallback(workLoop(currentFiber));
    }
  };
}

// ================== dom update =================

// 开始进行dom更新
function commitStart(currentFiber) {
  // 取消这个地方的删除
  needDelete.forEach((fiber) => fiber.dom.remove());
  console.log("从当前fiber开始进行更新：", currentFiber);
  try {
    // 现在的调度实现完全由浏览器控制，存在不可控，因此快速进行复杂操作会出现错误
    // 使用异步更新可以有效解决问题
    commitLoop(currentFiber.child);
  } catch (e) {
    console.error(e);
    console.log("调度问题,函数运行不即时！！");
  }
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
        // 不能直接简单append，因为条件渲染时会有插入的情况
        // 向slibing找一个currentFiber为UPDATE并且有dom的fiber，执行插入就能保证dom的添加顺序了
        const afterDom = getSlibingWithDom(currentFiber.slibing);
        if (afterDom) {
          parentDom.insertBefore(currentFiber.dom, afterDom);
        } else {
          parentDom.appendChild(currentFiber.dom);
        }
      } else if (currentFiber.effect === "UPDATE") {
        updateDom(
          currentFiber.dom,
          currentFiber.alternate.props,
          currentFiber.props
        );
      } else if (currentFiber.effect === "DELETE") {
        // 应该不需要进行这一步了，因为更新之前就已经删除过了

        // 删除元素  和预期表现不一样
        console.log("正在删除", currentFiber.dom);
        currentFiber.dom.remove();
      }
    }
    currentFiber.effect = null;
    commitLoop(currentFiber.child);
    commitLoop(currentFiber.slibing);
  }
}

function getSlibingWithDom(currentFiber) {
  if (currentFiber) {
    if (currentFiber.effect === "UPDATE" && currentFiber.dom) {
      return currentFiber.dom;
    } else {
      return getSlibingWithDom(currentFiber.slibing);
    }
  }
}

// =================== transform fiber & diff =================

// 核心函数 --> 执行当前fiber阶段任务
function nextWork(fiber) {
  // 如果是函数组件，children需要函数组件运行才完整，并且函数组件的fiber没有dom属性
  if (!fiber.child) {
    // 如果fiber是函数组件类型
    if (fiber.create) {
      // 函数组件的运行发生地点
      // 重新初始化hook的index
      hookIndex = 0;
      // 记录下当前函数组件，在hook中可以拿到当前fiber
      currentFunctionFiber = fiber;
      // 这个地方也是函数组件中  createElement方法运行的地方 会一直运行到结束或者下一个函数组件出现之前
      // console.log(fiber.create(fiber.props));
      // hook的执行也是这个时机
      const children = fiber.create(fiber.props);
      // 因为函数组件中可能存在props.children的用法，props.children = [{type: ,props: }, [{type: props}, {type: props} ...]]
      // children.props.children = children.props.children.reduce((p, c) => p.concat(c), []);  在createElement中处理
      transformChildren(fiber, [children]);
      currentFunctionFiber = null;
    } else {
      // 不是函数组件，children正常存在props中，并且有dom对象
      // 存在潜在的错误情况,当吧一个JSX表达式进行调用时会出现错误
      // const A = <div>123</div>
      // <A />      --->  此时的type为一个对象
      if (!fiber.dom) {
        fiber.dom = createDom(fiber);
      }
      // 将当前fiber的children全部转换为fiber，依次标记为child --> slibing --> slibing --> 。。。
      transformChildren(fiber, fiber.props.children);
    }
  } else {
    // console.log("不需要执行了，已经转换完成");
  }

  // 深搜，返回下一个fiber，然后下次执行使用当前fiber再次进行转换
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
  if (typeof fiber.type === "object") {
    throw new Error("类型错误, jsx表达式不应该被调用");
  }
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
        // 对于没有变化的dom不执行任何操作
        // 如果条件渲染只包含一个dom和文本节点,当两个这种结构切换的时候,因为dom节点的remove,子节点也会一并remove掉
        // 下一次的循环中因为文本节点的type一样  导致了只会出现UPDATA或者NOTHING  没有重新从父节点append
        // 解决方法,判断一下父节点的effect  如果为PLACEMENT,子节点也必须为PLACEMENT
        effect:
          fiber.effect !== "PLACEMENT"
            ? isEqual(element.props, previousFiber.props)
              ? "NOTHING"
              : "UPDATE"
            : "PLACEMENT",
        // 存在文本节点不更新的情况，此处解决
        // 父节点替换后，子文本节点也必须为PLACEMENT
        // 此时为了重用dom 需要更新文本节点的dom
        dom:
          fiber.effect === "PLACEMENT"
            ? updateDom(
                previousFiber.dom,
                previousFiber.props || {},
                element.props || {}
              )
            : previousFiber.dom,
        hooks: previousFiber.hooks,
      };
      // 确实是这个地方的问题，不用在这个地方解决，在hook函数中解决
      /*
      if (previousFiber.hooks) {
        previousFiber.hooks.previous = newFiber;
      }
      */
    } else if (!sameType && element) {
      if (previousFiber) {
        console.log("需要替换的", previousFiber, previousFiber.dom);
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
      console.log("需要删除的", previousFiber, previousFiber.dom);
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
      // 有可能children没有的情况
      newFiber && (newFiber.previous = fiber);
    } else if (element) {
      currentFiber.slibing = newFiber;
      newFiber.previous = currentFiber;
    }
    if (newFiber) {
      newFiber.fiberIndex = +fiber.fiberIndex + 1;
    }
    currentFiber = newFiber;
    index++;
  }
}

window.MReact = MReact;

// 工具函数

function debounce(action, time) {
  let id;
  return () => {
    clearTimeout(id);
    setTimeout(action, time);
  };
}

function throtle(action, time) {
  let flag = false;
  return () => {
    if (!flag) {
      flag = true;
      action();
      setTimeout(() => (flag = false), time);
    }
  };
}

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
