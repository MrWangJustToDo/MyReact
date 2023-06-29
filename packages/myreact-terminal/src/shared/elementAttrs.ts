import { kebabCase } from "./kebabCase";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateGetRawAttrKey = (map: string) => {
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

export const propsToAttrMap: Record<string, string | undefined> = {
  className: "class",
};
