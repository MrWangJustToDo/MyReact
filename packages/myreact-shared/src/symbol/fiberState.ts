export enum STATE_TYPE {
  __initial__ = 1 << 0,
  __stable__ = 1 << 1,
  __skipped__ = 1 << 2,
  __inherit__ = 1 << 3,
  __trigger__ = 1 << 4,
  __unmount__ = 1 << 5,
}
