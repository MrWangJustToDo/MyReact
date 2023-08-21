export enum STATE_TYPE {
  __initial__ = 0,
  __create__ = 1 << 0,
  __stable__ = 1 << 1,
  __skippedConcurrent__ = 1 << 2,
  __skippedSync__ = 1 << 3,
  __inherit__ = 1 << 4,
  __triggerConcurrent__ = 1 << 5,
  __triggerSync__ = 1 << 6,
  __unmount__ = 1 << 7,
  __hmr__ = 1 << 8,
}
