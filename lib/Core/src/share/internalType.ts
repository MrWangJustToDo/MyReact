import { NODE_TYPE_KEY } from './nodeType';

export class MyReactInternalType {
  __internal_node_type__ = {
    __isNullNode__: false,
    __isTextNode__: false,
    __isEmptyNode__: false,
    __isPlainNode__: false,
    __isStrictNode__: false,
    __isFragmentNode__: false,
    // ====  object node ==== //
    __isObjectNode__: false,
    __isForwardRef__: false,
    __isPortal__: false,
    __isMemo__: false,
    __isContextProvider__: false,
    __isContextConsumer__: false,
    __isLazy__: false,
    __isSuspense__: false,
    // ==== dynamic node ==== //
    __isDynamicNode__: false,
    __isClassComponent__: false,
    __isFunctionComponent__: false,
  };

  get __isNullNode__() {
    return this.__internal_node_type__.__isNullNode__;
  }

  get __isTextNode__() {
    return this.__internal_node_type__.__isTextNode__;
  }
  get __isEmptyNode__() {
    return this.__internal_node_type__.__isEmptyNode__;
  }
  get __isPlainNode__() {
    return this.__internal_node_type__.__isPlainNode__;
  }
  get __isStrictNode__() {
    return this.__internal_node_type__.__isStrictNode__;
  }
  get __isFragmentNode__() {
    return this.__internal_node_type__.__isFragmentNode__;
  }
  get __isObjectNode__() {
    return this.__internal_node_type__.__isObjectNode__;
  }
  get __isForwardRef__() {
    return this.__internal_node_type__.__isForwardRef__;
  }
  get __isPortal__() {
    return this.__internal_node_type__.__isPortal__;
  }
  get __isMemo__() {
    return this.__internal_node_type__.__isMemo__;
  }
  get __isContextProvider__() {
    return this.__internal_node_type__.__isContextProvider__;
  }
  get __isContextConsumer__() {
    return this.__internal_node_type__.__isContextConsumer__;
  }
  get __isLazy__() {
    return this.__internal_node_type__.__isLazy__;
  }
  get __isSuspense__() {
    return this.__internal_node_type__.__isSuspense__;
  }
  get __isDynamicNode__() {
    return this.__internal_node_type__.__isDynamicNode__;
  }
  get __isClassComponent__() {
    return this.__internal_node_type__.__isClassComponent__;
  }
  get __isFunctionComponent__() {
    return this.__internal_node_type__.__isFunctionComponent__;
  }

  setNodeType(props?: { [key in typeof NODE_TYPE_KEY[number]]?: boolean }) {
    Object.keys(props || {}).forEach((key) => {
      const typeKey = key as typeof NODE_TYPE_KEY[number];
      this.__internal_node_type__[typeKey] = props?.[typeKey] || false;
    });
  }

  isSameType(props?: { [key in typeof NODE_TYPE_KEY[number]]?: boolean }) {
    if (props) {
      return NODE_TYPE_KEY.every((key) =>
        this.__internal_node_type__[key]
          ? Object.is(this.__internal_node_type__[key], props[key])
          : true
      );
    } else {
      return false;
    }
  }
}
