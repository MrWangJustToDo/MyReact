export enum UPDATE_TYPE {
  __initial__ = 0,
  __inheritUpdate__ = 1 << 0,
  __triggerUpdate__ = 1 << 1,

  __needUpdate__ = UPDATE_TYPE.__inheritUpdate__ | UPDATE_TYPE.__triggerUpdate__,
}
