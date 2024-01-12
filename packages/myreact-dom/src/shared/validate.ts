import { NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { isHTMLTag, isProperty, isSVGTag, isStyle, logOnce } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

// TODO

/**
 * @internal
 */
export const validDomNesting = (fiber: MyReactFiberNode, parentFiberWithNode?: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__plain__)) {
    const typedElementType = fiber.elementType;

    if (typedElementType === "p" && parentFiberWithNode?.elementType === "p") {
      logOnce(fiber, "warn", "invalid dom nesting: <p> cannot appear as a child of <p>", `invalid dom nesting: <p> cannot appear as a child of <p>`);
    }

    if (typedElementType === "option" && parentFiberWithNode?.elementType !== "select") {
      logOnce(
        fiber,
        "warn",
        "invalid dom nesting: <option> can only appear as a child of <select>",
        `invalid dom nesting: <option> can only appear as a child of <select>`
      );
    }
  }
};

/**
 * @internal
 */
export const validDomTag = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__plain__)) {
    const tagName = fiber.elementType as string;

    if (!isHTMLTag[tagName] && !isSVGTag[tagName]) {
      logOnce(fiber, "error", "invalid dom tag", `invalid dom tag, current is "${tagName}"`);
    }
  }
};

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
          `invalid dom props, expect a string or number but get a object. key: ${key} value: ${props[key]}`
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
      if (typeof props["dangerouslySetInnerHTML"] !== "object" || typeof props["dangerouslySetInnerHTML"].__html !== "string") {
        throw new Error(`[@my-react/react-dom] invalid "dangerouslySetInnerHTML" props, should be a object like {__html: string}`);
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

/**
 * @internal
 */
export const checkRoot = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__class__)) return;

  if (include(fiber.type, NODE_TYPE.__function__)) return;

  if (include(fiber.type, NODE_TYPE.__portal__)) return;

  return;

  // throw new Error(`[@my-react/react-dom] the root element should be a dynamic node such as 'function' or 'class'`)
};
