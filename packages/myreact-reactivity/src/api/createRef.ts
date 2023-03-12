function createRef<T = any>(value: T) {
  return { current: value };
}

export { createRef };
