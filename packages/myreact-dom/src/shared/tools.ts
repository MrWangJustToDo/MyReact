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
