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
  __pendingDeactivate__ = 1 << 8,
  __pendingRef__ = 1 << 9,
}
