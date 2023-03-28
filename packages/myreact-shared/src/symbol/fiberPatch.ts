export enum PATCH_TYPE {
  __initial__ = 0,
  __create__ = 1 << 0,
  __update__ = 1 << 1,
  __append__ = 1 << 2,
  __position__ = 1 << 3,
  __context__ = 1 << 4,
  __effect__ = 1 << 5,
  __layoutEffect__ = 1 << 6,
  __unmount__ = 1 << 7,
  __ref__ = 1 << 8,

  __needCommit__ = PATCH_TYPE.__create__ |
    PATCH_TYPE.__update__ |
    PATCH_TYPE.__append__ |
    PATCH_TYPE.__position__ |
    PATCH_TYPE.__context__ |
    PATCH_TYPE.__effect__ |
    PATCH_TYPE.__layoutEffect__ |
    PATCH_TYPE.__unmount__ |
    PATCH_TYPE.__ref__,
}
