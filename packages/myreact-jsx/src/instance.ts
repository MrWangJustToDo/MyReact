import { __my_react_internal__ } from "@my-react/react";
import { TYPEKEY, Element, Fragment, Lazy } from "@my-react/react-shared";

import { checkArrayChildrenKey, checkSingleChildrenKey, checkValidElement } from "./check";

import type {
  CreateElementProps,
  MixinMyReactClassComponent,
  MixinMyReactFunctionComponent,
  MyReactElement,
  MyReactElementType,
  Props,
  MaybeArrayMyReactElementNode,
} from "@my-react/react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const createTask = __DEV__ && console.createTask ? console.createTask : () => null;

const getOwner = () => {
  if (__DEV__) {
    return __my_react_internal__.currentComponentFiber.current;
  }
  return null;
};

function getTaskName(type) {
  if (type === Fragment) {
    return "<>";
  }
  if (typeof type === "object" && type !== null && type.$$typeof === Lazy) {
    // We don't want to eagerly initialize the initializer in DEV mode so we can't
    // call it to extract the type so we don't know the type of this component.
    return "<...>";
  }
  try {
    // __my_react_internal__.dis
    const name = __my_react_internal__.getMyReactElementTypeName(type);
    return name ? "<" + name + ">" : "<...>";
  } catch {
    return "<...>";
  }
}

const ownerStackLimit = 1e4;

const ownerStackTraceLimit = 10;

function UnknownOwner() {
  return (() => Error("react-stack-top-frame"))();
}
const createFakeCallStack = {
  react_stack_bottom_frame: function (callStackForError) {
    return callStackForError();
  },
};

let unknownOwnerDebugStack;
let unknownOwnerDebugTask;

if (__DEV__) {
  // We use this technique to trick minifiers to preserve the function name.
  unknownOwnerDebugStack = createFakeCallStack.react_stack_bottom_frame.bind(createFakeCallStack, UnknownOwner)();
  unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
}

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

export { Fragment } from "@my-react/react-shared";

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.transitional.element') to check
 * if something is a React Element.
 *
 * @internal
 */
function MyReactElementJSX(
  type: MyReactElementType,
  key: MyReactElement["key"],
  ref: MyReactElement["ref"],
  props: MyReactElement["props"],
  owner: MyReactElement["_owner"],
  debugStack,
  debugTask
) {
  let element;
  if (__DEV__) {
    element = {
      // This tag allows us to uniquely identify this as a React Element
      [TYPEKEY]: Element,

      // Built-in properties that belong on the element
      type,
      key,
      ref,

      props,

      // Record the component responsible for creating this element.
      _owner: owner,
    };
  } else {
    // In prod, `ref` is a regular property and _owner doesn't exist.
    element = {
      // This tag allows us to uniquely identify this as a React Element
      [TYPEKEY]: Element,

      // Built-in properties that belong on the element
      type,
      key,
      ref,

      props,
    };
  }

  if (__DEV__) {
    element._store = {};

    // debugInfo contains Server Component debug information.
    Object.defineProperty(element, "_debugInfo", {
      configurable: false,
      enumerable: false,
      writable: true,
      value: null,
    });
    Object.defineProperty(element, "_debugStack", {
      configurable: false,
      enumerable: false,
      writable: true,
      value: debugStack,
    });
    Object.defineProperty(element, "_debugTask", {
      configurable: false,
      enumerable: false,
      writable: true,
      value: debugTask,
    });
  }

  return element;
}

/**
 * @public
 */
export const jsx = (
  type: MyReactElementType,
  config: Props,
  maybeKey: string | null,
  source: CreateElementProps["_source"],
  self: CreateElementProps["_self"]
) => {
  const props: Props = {};

  let key: string | null = null;

  let ref: CreateElementProps["ref"] = null;

  if (maybeKey !== undefined) {
    key = "" + maybeKey;
  }

  // <div {...props} /> we can not make sure this usage will contain `key` of not
  if (config?.key !== undefined) {
    key = "" + config.key;
  }

  if (config?.ref) {
    ref = config.ref as CreateElementProps["ref"];
  }

  for (const propsName in config) {
    if (Object.prototype.hasOwnProperty.call(config, propsName) && !Object.prototype.hasOwnProperty.call(RESERVED_PROPS, propsName)) {
      props[propsName] = config[propsName];
    }
  }

  if (type && (typeof type === "function" || typeof type === "object")) {
    const typedType = type as MixinMyReactClassComponent | MixinMyReactFunctionComponent;

    Object.keys(typedType?.defaultProps || {}).forEach((key) => {
      props[key] = props[key] === undefined ? typedType.defaultProps?.[key] : props[key];
    });
  }

  const element = MyReactElementJSX(type, key, ref, props, getOwner(), undefined, undefined);

  if (__DEV__) {
    element._jsx = true;

    element._self = self;

    Object.defineProperty(element, "_source", {
      configurable: false,
      enumerable: false,
      writable: true,
      value: source,
    });

    if (typeof Object.freeze === "function") {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * @public
 */
export const jsxDEV = (
  type: MyReactElementType,
  config: Props,
  maybeKey: string | null,
  isStaticChildren: boolean,
  source: CreateElementProps["_source"],
  self: CreateElementProps["_self"]
) => {
  const trackActualOwner = __DEV__ && __my_react_internal__.recentlyCreatedOwnerStacks.current++ < ownerStackLimit;
  let debugStackDEV: any = false;

  if (__DEV__) {
    if (trackActualOwner) {
      const previousStackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = ownerStackTraceLimit;
      debugStackDEV = Error("react-stack-top-frame");
      Error.stackTraceLimit = previousStackTraceLimit;
    } else {
      debugStackDEV = unknownOwnerDebugStack;
    }
  }

  const props: Props = {};

  let key: string | null = null;

  let ref: CreateElementProps["ref"] = null;

  if (maybeKey !== undefined) {
    key = "" + maybeKey;
  }

  // <div {...props} /> we can not make sure this usage will contain `key` of not
  if (config?.key !== undefined) {
    key = "" + config.key;
  }

  if (config?.ref) {
    ref = config.ref as CreateElementProps["ref"];
  }

  for (const propsName in config) {
    if (Object.prototype.hasOwnProperty.call(config, propsName) && !Object.prototype.hasOwnProperty.call(RESERVED_PROPS, propsName)) {
      props[propsName] = config[propsName];
    }
  }

  if (type && (typeof type === "function" || typeof type === "object")) {
    const typedType = type as MixinMyReactClassComponent | MixinMyReactFunctionComponent;

    Object.keys(typedType?.defaultProps || {}).forEach((key) => {
      props[key] = props[key] === undefined ? typedType.defaultProps?.[key] : props[key];
    });
  }

  const element = MyReactElementJSX(
    type,
    key,
    ref,
    props,
    getOwner(),
    debugStackDEV,
    __DEV__ && (trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask)
  );

  if (__DEV__) {
    element._jsx = true;

    element._self = self;

    Object.defineProperty(element, "_source", {
      configurable: false,
      enumerable: false,
      writable: true,
      value: source,
    });

    if (typeof Object.freeze === "function") {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  if (config.children) {
    const children = config.children as MaybeArrayMyReactElementNode;

    if (isStaticChildren) {
      if (Array.isArray(children)) {
        checkArrayChildrenKey(children);

        Object.freeze(children);
      } else {
        console.warn(`[@my-react/react] static children should always be an array`);
      }
      if (!Array.isArray(children)) {
        console.warn(`[@my-react/react] static children should always be an array.`);
      }
    } else {
      checkSingleChildrenKey(children);
    }
  }

  if (Object.prototype.hasOwnProperty.call(config, "key")) {
    console.warn(
      `[@my-react/react] A props object containing a "key" prop is being spread into JSX. This is not recommended and may cause unexpected behavior. Instead, use the "key" prop directly on the JSX element.`
    );
  }

  checkValidElement(element);

  return element;
};

/**
 * @public
 */
export const jsxs = (type: MyReactElementType, config: Props, key: string | null, source: CreateElementProps["_source"], self: CreateElementProps["_self"]) => {
  if (__DEV__) {
    return jsxDEV(type, config, key, true, source, self);
  } else {
    return jsx(type, config, key, source, self);
  }
};
