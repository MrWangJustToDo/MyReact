export const isArrayEquals = (src: unknown[], target: unknown[]) => {
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
