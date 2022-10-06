export const isNormalEquals = (
  src: Record<string, unknown> | string | number | boolean | null,
  target: Record<string, unknown> | string | number | boolean | null,
  isSkipKey: (key: string) => boolean = () => false
) => {
  if (typeof src === "object" && typeof target === "object" && src !== null && target !== null) {
    const srcKeys = Object.keys(src);
    const targetKeys = Object.keys(target);
    if (srcKeys.length !== targetKeys.length) return false;
    let res = true;
    for (const key in src) {
      if (isSkipKey(key)) {
        continue;
      } else {
        res = res && Object.is(src[key], target[key]);
      }
      if (!res) return res;
    }
    return res;
  }

  return Object.is(src, target);
};
