export enum PATCH_TYPE {
  __initial__ = 0,
  __pendingCreate__ = 1 << 0,
  __pendingUpdate__ = 1 << 1,
  __pendingAppend__ = 1 << 2,
  __pendingPosition__ = 1 << 3,
  __pendingContext__ = 1 << 4,
  __pendingEffect__ = 1 << 5,
  __pendingLayoutEffect__ = 1 << 6,
  __pendingUnmount__ = 1 << 7,
  __pendingRef__ = 1 << 8,

  __pendingGenerateUpdateList__ = PATCH_TYPE.__pendingCreate__ |
    PATCH_TYPE.__pendingUpdate__ |
    PATCH_TYPE.__pendingAppend__ |
    PATCH_TYPE.__pendingPosition__ |
    PATCH_TYPE.__pendingContext__ |
    PATCH_TYPE.__pendingEffect__ |
    PATCH_TYPE.__pendingLayoutEffect__ |
    PATCH_TYPE.__pendingUnmount__ |
    PATCH_TYPE.__pendingRef__,
}
