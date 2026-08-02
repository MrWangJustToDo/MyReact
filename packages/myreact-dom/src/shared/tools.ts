import { kebabCase } from "./kebab-case";

/**
 * @internal
 */
export function isInternal(key: string) {
  return key.startsWith("_");
}

/**
 * @internal
 */
export function isKeep(key: string) {
  return key === "suppressContentEditableWarning" || key === "suppressHydrationWarning";
}

/**
 * @internal
 */
export function isChildren(key: string) {
  return key === "children" || key === "dangerouslySetInnerHTML";
}

/**
 * @internal
 */
export function isEvent(key: string) {
  return key.startsWith("on");
}

/**
 * @internal
 */
export function isStyle(key: string) {
  return key === "style";
}

/**
 * @internal
 */
export function isProperty(key: string) {
  return !isChildren(key) && !isEvent(key) && !isStyle(key) && !isInternal(key) && !isKeep(key);
}

/**
 * @internal
 */
export function isNew(oldProps: Record<string, unknown>, newProps: Record<string, unknown>) {
  return (key: string) => oldProps[key] !== newProps[key];
}

/**
 * @internal
 */
export function isGone(newProps: Record<string, unknown>) {
  return (key: string) => !(key in newProps);
}

/**
 * @internal
 */
export function makeMap(src: string) {
  const tags = src.split(",");
  return tags.reduce<Record<string, true>>((p, c) => ((p[c] = true), p), Object.create(null));
}

/**
 * @internal
 */
export function generateGetRawAttrKey(map: string) {
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
}

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function debounce<T extends Function>(callback: T, time?: number): T {
  let id = null;
  return ((...args) => {
    clearTimeout(id);
    id = setTimeout(() => {
      callback.call(null, ...args);
    }, time || 40);
  }) as unknown as T;
}
