import { NODE_TYPE, type MyReactFiberNode } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { logOnce } from "./debug";
import { isProperty, isStyle } from "./tools";

const checkValidSelectProps = (fiber: MyReactFiberNode) => {
  const valuePropNames = ["value", "defaultValue"];
  const props = fiber.pendingProps;
  const value = props[valuePropNames[0]];
  const defaultValue = props[valuePropNames[1]];
  if (value !== null && value !== undefined && defaultValue !== null && defaultValue !== undefined) {
    logOnce(fiber, "error", "invalid select props", `invalid select value props, select element can not contain both "value" and "defaultValue" props.`);
  }
  if (props.multiple) {
    if (value !== null && value !== undefined && !Array.isArray(value)) {
      logOnce(fiber, "error", "invalid select props", `invalid select props, The "value" prop supplied to <select> must be an array if "multiple" is true.`);
    }
    if (defaultValue !== null && defaultValue !== undefined && !Array.isArray(defaultValue)) {
      logOnce(
        fiber,
        "error",
        "invalid select props",
        `invalid select props, The "defaultValue" prop supplied to <select> must be an array if "multiple" is true.`
      );
    }
  } else {
    if (value !== null && value !== undefined && Array.isArray(value)) {
      logOnce(fiber, "error", "invalid select props", `invalid select props, The "value" prop supplied to <select> must be a scalar if "multiple" is false.`);
    }
    if (defaultValue !== null && defaultValue !== undefined && Array.isArray(defaultValue)) {
      logOnce(
        fiber,
        "error",
        "invalid select props",
        `invalid select props, The "defaultValue" prop supplied to <select> must be a scalar if "multiple" is false.`
      );
    }
  }
};

const checkValidInoutProps = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;
  const type = props.type;
  if (typeof type === "function" || typeof type === "symbol" || typeof type === "boolean") {
    logOnce(fiber, "error", "invalid input props", `invalid input type props, input element can not contain a "type" props that is a function or symbol`);
  }
  if (props.value !== null && props.value !== undefined && props.defaultValue !== null && props.defaultValue !== undefined) {
    logOnce(fiber, "error", "invalid input value props", `invalid input props, input element can not contain both "value" and "defaultValue" props.`);
  }
  if (props.checked !== null && props.checked !== undefined && props.defaultChecked !== null && props.defaultChecked !== undefined) {
    logOnce(fiber, "error", "invalid input checked props", `invalid input props, input element can not contain both "checked" and "defaultChecked" props.`);
  }
};

const checkValidTextareaProps = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;
  if (props.value !== null && props.value !== undefined && props.defaultValue !== null && props.defaultValue !== undefined) {
    logOnce(fiber, "error", "invalid textarea value props", `invalid textarea props, textarea element can not contain both "value" and "defaultValue" props.`);
  }
};

/**
 * @internal
 */
export const validDomProps = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__plain__)) {
    const props = fiber.pendingProps;

    Object.keys(props).forEach((key) => {
      if (isProperty(key) && props[key] && typeof props[key] === "object" && props[key] !== null) {
        logOnce(
          fiber,
          "warn",
          "invalid dom props, expect a string or number but get a object.",
          `invalid dom props, expect a string or number but get a object. key: ${key}, value: ${props[key]}`
        );
      }
      if (isStyle(key) && props[key] && typeof props[key] !== "object") {
        throw new Error("[@my-react/react-dom] style or the element props should be a object");
      }
    });

    if (props["children"] && props["dangerouslySetInnerHTML"]) {
      throw new Error("[@my-react/react-dom] can not render contain `children` and `dangerouslySetInnerHTML` for current element");
    }

    if (props["dangerouslySetInnerHTML"]) {
      if (typeof props["dangerouslySetInnerHTML"] !== "object" || !("__html" in props["dangerouslySetInnerHTML"])) {
        throw new Error(`[@my-react/react-dom] invalid "dangerouslySetInnerHTML" props, should be a object like {__html: htmlString}`);
      }
    }

    if (fiber.elementType === "select") {
      checkValidSelectProps(fiber);
    }

    if (fiber.elementType === "input") {
      checkValidInoutProps(fiber);
    }

    if (fiber.elementType === "textarea") {
      checkValidTextareaProps(fiber);
    }
  }
};
