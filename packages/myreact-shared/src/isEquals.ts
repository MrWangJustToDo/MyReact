export const isNormalEquals = (
  src: Record<string, unknown> | string | number | boolean | null,
  target: Record<string, unknown> | string | number | boolean | null,
  isSkipKey?: (key: string) => boolean
) => {
  const isEquals = Object.is(src, target);

  if (isEquals) return true;

  if (typeof src === "object" && typeof target === "object" && src !== null && target !== null) {
    const srcKeys = Object.keys(src);
    const targetKeys = Object.keys(target);
    if (srcKeys.length !== targetKeys.length) return false;
    const hasSkipKeyFunction = typeof isSkipKey === "function";
    let res = true;
    if (hasSkipKeyFunction) {
      for (const key in src) {
        if (isSkipKey(key)) {
          continue;
        } else {
          res = res && Object.is(src[key], target[key]);
        }
        if (!res) return res;
      }
    } else {
      for (const key in src) {
        res = res && Object.is(src[key], target[key]);
        if (!res) return res;
      }
    }
    return res;
  }

  return false;
};
