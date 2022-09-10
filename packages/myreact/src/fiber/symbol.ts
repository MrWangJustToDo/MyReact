// use bit flag to define element type and state

export enum NODE_TYPE {
  __initial__ = 0,
  __isNullNode__ = 1,
  __isTextNode__ = 1 << 1,
  __isEmptyNode__ = 1 << 2,
  __isPlainNode__ = 1 << 3,
  __isStrictNode__ = 1 << 4,
  __isFragmentNode__ = 1 << 5,
  // ====  object node ==== //
  __isMemo__ = 1 << 6,
  __isPortal__ = 1 << 7,
  __isForwardRef__ = 1 << 8,
  __isContextProvider__ = 1 << 9,
  __isContextConsumer__ = 1 << 10,
  __isLazy__ = 1 << 11,
  __isSuspense__ = 1 << 12,
  __isObjectNode__ = NODE_TYPE.__isMemo__ |
    NODE_TYPE.__isPortal__ |
    NODE_TYPE.__isForwardRef__ |
    NODE_TYPE.__isContextProvider__ |
    NODE_TYPE.__isContextConsumer__ |
    NODE_TYPE.__isLazy__ |
    NODE_TYPE.__isSuspense__,
  // ==== dynamic node ==== //
  __isClassComponent__ = 1 << 14,
  __isFunctionComponent__ = 1 << 15,
  __isDynamicNode__ = NODE_TYPE.__isFunctionComponent__ | NODE_TYPE.__isClassComponent__,
}

export enum PATCH_TYPE {
  __initial__ = 0,
  __pendingCreate__ = 1,
  __pendingUpdate__ = 1 << 1,
  __pendingAppend__ = 1 << 2,
  __pendingPosition__ = 1 << 3,
  __pendingContext__ = 1 << 4,
  __pendingEffect__ = 1 << 5,
  __pendingLayoutEffect__ = 1 << 6,
  __pendingUnmount__ = 1 << 7,
}

export enum UPDATE_TYPE {
  __initial__ = 0,
  __run__ = 1,
  __update__ = 1 << 1,
  __trigger__ = 1 << 2,
}
