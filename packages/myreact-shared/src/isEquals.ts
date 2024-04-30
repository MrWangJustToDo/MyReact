export const isNormalEquals = (
  src: Record<string, unknown> | string | number | boolean | null,
  target: Record<string, unknown> | string | number | boolean | null,
  isSkipKey?: (key: string) => boolean
) => {
  const isEquals = Object.is(src, target);

  if (isEquals) return true;

  const hasSkipKeyFunction = typeof isSkipKey === "function";

  if (typeof src === "object" && typeof target === "object" && src !== null && target !== null) {
    const srcKeys = Object.keys(src);

    const targetKeys = Object.keys(target);

    if (srcKeys.length !== targetKeys.length) return false;

    let res = true;

    if (hasSkipKeyFunction) {
      for (const key of srcKeys) {
        if (isSkipKey(key) && key in target) {
          continue;
        } else {
          res = res && Object.is(src[key], target[key]);
        }

        if (!res) return res;
      }
    } else {
      for (const key of srcKeys) {
        res = res && Object.is(src[key], target[key]);

        if (!res) return res;
      }
    }

    return res;
  }

  return false;
};

export const isArrayEquals = (src: unknown[], target: unknown[]) => {
  const isEquals = Object.is(src, target);

  if (isEquals) return true;

  if (Array.isArray(src) && Array.isArray(target) && src.length === target.length) {
    let re = true;

    for (const key in src) {
      re = re && Object.is(src[key], target[key]);

      if (!re) return re;
    }

    return re;
  }

  return false;
};
