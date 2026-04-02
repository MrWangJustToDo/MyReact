export enum PATCH_TYPE {
  __initial__ = 0,
  __create__ = 1 << 0,
  __update__ = 1 << 1,
  __append__ = 1 << 2,
  __position__ = 1 << 3,
  __effect__ = 1 << 4,
  __layoutEffect__ = 1 << 5,
  __insertionEffect__ = 1 << 6,
  __unmount__ = 1 << 7,
  __ref__ = 1 << 8,
}
