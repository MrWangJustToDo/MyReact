import { checkArrayChildrenKey, checkSingleChildrenKey } from "./tool.js";

class MyReactVDom {
  __dynamicChildren__;

  constructor(type, props, children) {
    const { key, ref, dangerouslySetInnerHTML, ...resProps } = props || {};
    // for fast refresh
    this['$$typeof'] = type;
    this.type = type;
    this.key = key;
    this.ref = ref;
    this.props = resProps;
    this.children = dangerouslySetInnerHTML?.__html || children;
  }
}

function createVDom({ type, props, children }) {
  return new MyReactVDom(type, props, children || props.children);
}

function createElement(type, props, children) {
  const childrenLength = arguments.length - 2;

  props = props || {};

  props = Object.assign({}, props);

  if (type?.defaultProps) {
    Object.keys(type.defaultProps).forEach((propKey) => {
      props[propKey] =
        props[propKey] === undefined
          ? type.defaultProps[propKey]
          : props[propKey];
    });
  }

  if (childrenLength > 1) {
    children = Array.from(arguments).slice(2);
    checkArrayChildrenKey(children);
  } else {
    checkSingleChildrenKey(children);
  }

  if (
    (Array.isArray(children) && children.length) ||
    (children !== null && children !== undefined)
  ) {
    props.children = children;
  }

  return createVDom({ type, props, children });
}

export { MyReactVDom, createElement };
