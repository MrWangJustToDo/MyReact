import { kebabCase } from "./kebabCase";

/**
 * @internal
 */
export const isInternal = (key: string) => key.startsWith("_");

/**
 * @internal
 */
export const isChildren = (key: string) => key === "children" || key === "dangerouslySetInnerHTML";

/**
 * @internal
 */
export const isEvent = (key: string) => key.startsWith("on");

/**
 * @internal
 */
export const isStyle = (key: string) => key === "style";

/**
 * @internal
 */
export const isProperty = (key: string) => !isChildren(key) && !isEvent(key) && !isStyle(key) && !isInternal(key);

/**
 * @internal
 */
export const isNew = (oldProps: Record<string, unknown>, newProps: Record<string, unknown>) => (key: string) => oldProps[key] !== newProps[key];

/**
 * @internal
 */
export const isGone = (newProps: Record<string, unknown>) => (key: string) => !(key in newProps);

/**
 * @internal
 */
export const makeMap = (src: string) => {
  const tags = src.split(",");
  return tags.reduce<Record<string, true>>((p, c) => ((p[c] = true), p), Object.create(null));
};

/**
 * @internal
 */
export const generateGetRawAttrKey = (map: string) => {
  const cache: Record<string, string | false> = {};
  const keyMap: Record<string, 1> = {};
  map.split(",").forEach((attrName) => {
    keyMap[attrName] = 1;
  });
  return (key: string) => {
    if (key in cache) {
      return cache[key];
    }
    if (keyMap[key]) {
      return key;
    }

    const lowerCaseKey = key.toLowerCase();

    if (keyMap[lowerCaseKey]) {
      cache[key] = lowerCaseKey;
      return lowerCaseKey;
    }

    const kebabCaseKey = kebabCase(key);

    if (keyMap[kebabCaseKey]) {
      cache[key] = kebabCaseKey;
      return kebabCaseKey;
    }
    return false;
  };
};

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = <T extends Function>(callback: T, time?: number): T => {
  let id = null;
  return ((...args) => {
    clearTimeout(id);
    id = setTimeout(() => {
      callback.call(null, ...args);
    }, time || 40);
  }) as unknown as T;
};
