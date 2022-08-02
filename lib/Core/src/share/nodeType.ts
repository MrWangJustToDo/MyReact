export const NODE_TYPE_OBJ = {
  __isNullNode__: false,
  __isTextNode__: false,
  __isEmptyNode__: false,
  __isPlainNode__: false,
  __isStrictNode__: false,
  __isFragmentNode__: false,
  // ====  object node ==== //
  __isObjectNode__: false,
  __isMemo__: false,
  __isPortal__: false,
  __isForwardRef__: false,
  __isContextProvider__: false,
  __isContextConsumer__: false,
  __isLazy__: false,
  __isSuspense__: false,
  // ==== dynamic node ==== //
  __isDynamicNode__: false,
  __isClassComponent__: false,
  __isFunctionComponent__: false,
} as const;

export const NODE_TYPE_KEY = Object.keys(NODE_TYPE_OBJ) as Array<
  keyof typeof NODE_TYPE_OBJ
>;
