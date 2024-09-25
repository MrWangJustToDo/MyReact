import { type MyReactFiberNode } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

type ControlledElement = HTMLSelectElement;

/**
 * @internal
 */
export const isReadonlySelectElement = (fiber: MyReactFiberNode) => hasControlledSelectProps(fiber) && !fiber.pendingProps.onChange;

/**
 * @internal
 */
export const isControlledSelectElement = (fiber: MyReactFiberNode) => hasControlledSelectProps(fiber) && typeof fiber.pendingProps.onChange === "function";

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
export const generateSelectOnChangeFun = (fiber: MyReactFiberNode) => {
  const onChange = function onChange(...args) {
    const originalOnChange = fiber.pendingProps.onChange;

    const targetOnChange =
      typeof originalOnChange !== "function"
        ? generateEmptyChangeFun(fiber)
        : function targetOnChange(...args) {
            originalOnChange?.call?.(null, ...args);
          };

    targetOnChange?.call?.(null, ...args);

    requestAnimationFrame(function afterEventDispatch() {
      const dom = fiber.nativeNode;

      const props = fiber.pendingProps;

      const typedDom = dom as ControlledElement;

      const key = "value";

      if (key in props) {
        (typedDom as any)[key] = props[key];
      }
    });
  };

  return onChange;
};

/**
 * @internal
 */
export const hasControlledSelectProps = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  const key = "value";

  return props[key] !== undefined;
};

/**
 * @internal
 */
export const updateControlSelectElement = (fiber: MyReactFiberNode) => {
  const pendingProps = fiber.pendingProps;

  const memoizedProps = fiber.memoizedProps;

  const key = "value";

  if (__DEV__) {
    if (pendingProps[key] !== undefined) {
      if (!(key in memoizedProps) || memoizedProps[key] === undefined) {
        log(fiber, "warn", `current component change from 'unControlled' to 'controlled', this may case some bug`);
      }
    } else {
      if (memoizedProps[key] !== undefined) {
        log(fiber, "warn", `current component change from 'controlled' to 'unControlled', this may case some bug`);
      }
    }
  }
};

function updateOptions(node: HTMLSelectElement, multiple: boolean, propValue: string | string[], setDefaultSelected: boolean) {
  const options: HTMLOptionsCollection = node.options;

  if (multiple) {
    const selectedValues = propValue as Array<string>;
    const selectedValue: { [key: string]: boolean } = {};
    for (let i = 0; i < selectedValues.length; i++) {
      // Prefix to avoid chaos with special keys.
      selectedValue["$" + selectedValues[i]] = true;
    }
    for (let i = 0; i < options.length; i++) {
      const selected = Object.prototype.hasOwnProperty.call(selectedValue, "$" + options[i].value);
      if (options[i].selected !== selected) {
        options[i].selected = selected;
      }
      if (selected && setDefaultSelected) {
        options[i].defaultSelected = true;
      }
    }
  } else {
    // Do not set `select.value` as exact behavior isn't consistent across all
    // browsers for all cases.
    const selectedValue = String(propValue);
    let defaultSelected = null;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === selectedValue) {
        options[i].selected = true;
        if (setDefaultSelected) {
          options[i].defaultSelected = true;
        }
        return;
      }
      if (defaultSelected === null && !options[i].disabled) {
        defaultSelected = options[i];
      }
    }
    if (defaultSelected !== null) {
      defaultSelected.selected = true;
    }
  }
}

export const initSelect = (fiber: MyReactFiberNode) => {
  const element = fiber.nativeNode as HTMLSelectElement;
  const multiple = fiber.pendingProps.multiple;
  const value = fiber.pendingProps.value;
  const defaultValue = fiber.pendingProps.defaultValue;
  const node = element;
  node.multiple = !!multiple;
  if (value != null) {
    updateOptions(node, !!multiple, value, false);
  } else if (defaultValue != null) {
    updateOptions(node, !!multiple, defaultValue, true);
  }
};

export const updateSelect = (fiber: MyReactFiberNode) => {
  const element = fiber.nativeNode as HTMLSelectElement;
  const multiple = fiber.pendingProps.multiple;
  const value = fiber.pendingProps.value;
  const defaultValue = fiber.pendingProps.defaultValue;
  const wasMultiple = fiber.memoizedProps.multiple;
  const node = element;

  if (value != null) {
    updateOptions(node, !!multiple, value, false);
  } else if (!!wasMultiple !== !!multiple) {
    // For simplicity, reapply `defaultValue` if `multiple` is toggled.
    if (defaultValue != null) {
      updateOptions(node, !!multiple, defaultValue, true);
    } else {
      // Revert the select back to its default unselected state.
      updateOptions(node, !!multiple, multiple ? [] : "", false);
    }
  }
};
