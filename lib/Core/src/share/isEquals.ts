export const isNormalEquals = (
  src: Record<string, unknown> | string | number | boolean | null,
  target: Record<string, unknown> | string | number | boolean | null,
  children = true
) => {
  if (
    typeof src === 'object' &&
    typeof target === 'object' &&
    src !== null &&
    target !== null
  ) {
    const srcKeys = Object.keys(src);
    const targetKeys = Object.keys(target);
    if (srcKeys.length !== targetKeys.length) return false;
    let res = true;
    for (const key in src) {
      if (key === 'children') {
        if (children) {
          res = res && Object.is(src[key], target[key]);
        } else {
          continue;
        }
      } else {
        res = res && Object.is(src[key], target[key]);
      }
      if (!res) return res;
    }
    return res;
  }

  return Object.is(src, target);
};

export const isArrayEquals = (src: any[], target: any[]) => {
  if (
    Array.isArray(src) &&
    Array.isArray(target) &&
    src.length === target.length
  ) {
    let re = true;
    for (const key in src) {
      re = re && Object.is(src[key], target[key]);
      if (!re) return re;
    }
    return re;
  }
  return false;
};
