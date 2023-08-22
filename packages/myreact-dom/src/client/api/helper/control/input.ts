import { MyWeakMap, type MyReactFiberNode } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

type ControlledElement = HTMLInputElement;

const inputEventMap = new MyWeakMap<MyReactFiberNode, () => void>();

const changeEventMap = new MyWeakMap<MyReactFiberNode, () => void>();

const controlElementSet = new Set<MyReactFiberNode>();

const readOnlyElementSet = new Set<MyReactFiberNode>();

/**
 * @internal
 */
export const isReadonlyInputElement = (fiber: MyReactFiberNode) => readOnlyElementSet.has(fiber);

/**
 * @internal
 */
export const isControlledInputElement = (fiber: MyReactFiberNode) => controlElementSet.has(fiber);

/**
 * @internal
 */
export const generateOnChangeFun = (fiber: MyReactFiberNode) => {
  const _onChange = (...args) => {
    const originalOnChange = changeEventMap.get(fiber);

    originalOnChange?.call?.(null, ...args);

    requestAnimationFrame(() => {
      const dom = fiber.nativeNode;

      const props = fiber.pendingProps;

      const typedDom = dom as ControlledElement;

      const { type } = props;

      const key = type === "radio" || type === "checkbox" ? "checked" : "value";

      if (key in props) {
        (typedDom as any)[key] = props[key];
      }
    });
  };

  const onChange = inputEventMap.get(fiber) || _onChange;

  inputEventMap.set(fiber, onChange);

  return onChange;
};

const generateEmptyChangeFun = (fiber: MyReactFiberNode) => {
  return () => {
    if (__DEV__) {
      log(fiber, "warn", `current controlled element is a readonly element, please provider a 'onChange' props to make the value update`);
    }
  };
};

/**
 * @internal
 */
export const prepareControlInputProp = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  const { type } = props;

  changeEventMap.set(fiber, props.onChange || generateEmptyChangeFun(fiber));

  if (type === "radio" || type === "checkbox") {
    if ("checked" in props) {
      fiber.pendingProps = { ...props, ["onChange"]: generateOnChangeFun(fiber) };
      if (__DEV__) {
        controlElementSet.add(fiber);
        if (!props["onChange"]) {
          readOnlyElementSet.add(fiber);
        } else {
          readOnlyElementSet.delete(fiber);
        }
      }
    } else {
      fiber.pendingProps = { ...props };
      if (__DEV__) {
        controlElementSet.delete(fiber);
        readOnlyElementSet.delete(fiber);
      }
    }
  } else {
    if ("value" in props) {
      fiber.pendingProps = { ...props, ["onChange"]: generateOnChangeFun(fiber) };
      if (__DEV__) {
        controlElementSet.add(fiber);
        if (!props["onChange"]) {
          readOnlyElementSet.add(fiber);
        } else {
          readOnlyElementSet.delete(fiber);
        }
      }
    } else {
      fiber.pendingProps = { ...props };
      if (__DEV__) {
        controlElementSet.delete(fiber);
        readOnlyElementSet.delete(fiber);
      }
    }
  }
};

/**
 * @internal
 */
export const mountControlInputElement = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  const { type } = props;

  if (type === "radio" || type === "checkbox") {
    if (!("checked" in props) && "defaultChecked" in props) {
      props["checked"] = props["defaultChecked"];
    }
  } else {
    if (!("value" in props) && "defaultValue" in props) {
      props["value"] = props["defaultValue"];
    }
  }

  delete props["defaultValue"];

  delete props["defaultChecked"];
};

/**
 * @internal
 */
export const updateControlInputElement = (fiber: MyReactFiberNode) => {
  const pendingProps = fiber.pendingProps;

  const memoizedProps = fiber.memoizedProps;

  const { type } = pendingProps;

  const key = type === "radio" || type === "checkbox" ? "checked" : "value";

  if (__DEV__) {
    if (key in pendingProps) {
      if (!(key in memoizedProps)) {
        log(fiber, "warn", `current component change from 'unControlled' to 'controlled', this may case some bug`);
      }
    } else {
      if (key in memoizedProps) {
        log(fiber, "warn", `current component change from 'controlled' to 'unControlled', this may case some bug`);
      }
    }
  }
};

/**
 * @internal
 */
export const unmountControlInputElement = (fiber: MyReactFiberNode) => {
  inputEventMap.delete(fiber);
  if (__DEV__) {
    controlElementSet.delete(fiber);
    readOnlyElementSet.delete(fiber);
  }
};
