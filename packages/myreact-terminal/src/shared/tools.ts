export const isInternal = (key: string) => key.startsWith("_");

export const isChildren = (key: string) => key === "children" || key === "dangerouslySetInnerHTML";

export const isEvent = (key: string) => key.startsWith("on");

export const isStyle = (key: string) => key === "style";

export const isProperty = (key: string) => !isChildren(key) && !isEvent(key) && !isStyle(key) && !isInternal(key);

export const isNew = (oldProps: Record<string, unknown>, newProps: Record<string, unknown>) => (key: string) => oldProps[key] !== newProps[key];

export const isGone = (newProps: Record<string, unknown>) => (key: string) => !(key in newProps);
