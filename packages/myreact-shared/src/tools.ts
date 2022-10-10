export function isObject(target: any): target is Record<string, unknown> {
  return typeof target === "object" && target !== null;
}

export function isFunction(target: unknown): target is (...args: unknown[]) => unknown {
  return typeof target === "function";
}

export function isArray(target: unknown): target is Array<unknown> {
  return Array.isArray(target);
}

export function isSymbol(target: unknown): target is symbol {
  return typeof target === "symbol";
}

export function isString(target: unknown): target is string {
  return typeof target === "string";
}

export function isInteger(target: unknown): target is number {
  return Number.isInteger(Number(target));
}

export function isNumber(target: unknown): target is number {
  return typeof target === "number";
}

export function isCollection(target: unknown): target is Iterable<unknown> {
  return target instanceof Map || target instanceof Set || target instanceof WeakMap || target instanceof WeakSet;
}
