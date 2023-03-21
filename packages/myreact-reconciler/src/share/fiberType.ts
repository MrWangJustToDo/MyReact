export enum NODE_TYPE {
  __initial__ = 0,
  // ==== component node ==== //
  __isClassComponent__ = 1 << 0,
  __isFunctionComponent__ = 1 << 1,
  __isDynamicNode__ = NODE_TYPE.__isClassComponent__ | NODE_TYPE.__isFunctionComponent__,
  // ==== object node, use create function to define node ==== //
  __isLazy__ = 1 << 2,
  __isMemo__ = 1 << 3,
  __isForwardRef__ = 1 << 4,
  __isContextProvider__ = 1 << 5,
  __isContextConsumer__ = 1 << 6,
  __isPortal__ = 1 << 7,
  __isObjectNode__ = NODE_TYPE.__isMemo__ |
    NODE_TYPE.__isLazy__ |
    NODE_TYPE.__isForwardRef__ |
    NODE_TYPE.__isContextProvider__ |
    NODE_TYPE.__isContextConsumer__ |
    NODE_TYPE.__isPortal__,
  __isNullNode__ = 1 << 8,
  __isTextNode__ = 1 << 9,
  __isEmptyNode__ = 1 << 10,
  __isPlainNode__ = 1 << 11,
  __isStrictNode__ = 1 << 12,
  __isSuspenseNode__ = 1 << 13,
  __isFragmentNode__ = 1 << 14,
  __isKeepLiveNode__ = 1 << 15,
  __isScopeNode__ = 1 << 16,
  __isCommentNode__ = 1 << 17,
}
