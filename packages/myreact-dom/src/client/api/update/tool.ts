const noProps = ["href", "list", "form", "tabIndex", "download", "src"];

/**
 * @internal
 */
export const getAllKeys = (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
  const oldKeys = Object.keys(obj1);
  const newKeys = Object.keys(obj2);
  const allKeys = new Set([...oldKeys, ...newKeys]);
  return allKeys;
};

/**
 * @internal
 */
export const isSameInnerHTML = (dom: Element, innerHTML: string) => {
  const tempDom = document.createElement("i");

  tempDom.innerHTML = innerHTML;

  return tempDom.innerHTML === dom.innerHTML;
};

/**
 * @internal
 */
export const isNoProps = (_ele: Element, key: string) => {
  return noProps.includes(key);
};
