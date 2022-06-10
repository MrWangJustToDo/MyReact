export const isInternal = (key) => key.startsWith("__");

export const isChildren = (key) =>
  key === "children" || key === "dangerouslySetInnerHTML";

export const isEvent = (key) => key.startsWith("on");

export const isStyle = (key) => key === "style";

export const isProperty = (key) =>
  !isChildren(key) && !isEvent(key) && !isStyle(key) && !isInternal(key);

export const isNew = (oldProps, newProps) => (key) =>
  oldProps[key] !== newProps[key];

export const isGone = (newProps) => (key) => !(key in newProps);

