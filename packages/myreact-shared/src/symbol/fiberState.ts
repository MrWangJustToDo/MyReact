export enum STATE_TYPE {
  __initial__ = 0,
  __stable__ = 1 << 0,
  __skippedConcurrent__ = 1 << 1,
  __skippedSync__ = 1 << 2,
  __inherit__ = 1 << 3,
  __triggerConcurrent__ = 1 << 4,
  __triggerSync__ = 1 << 5,
}
