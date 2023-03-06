export class UniqueArray<T> extends Array<T> {
  set = new Set();

  constructor(...args) {
    super(...args);
  }

  pop() {
    const v = super.pop();
    this.set.delete(v);
    return v;
  }

  push(v: T) {
    if (this.set.has(v)) return 0;
    this.set.add(v);
    super.push(v);
  }

  shift() {
    const v = super.shift();
    this.set.delete(v);
    return v;
  }

  unshift(v: T) {
    if (this.set.has(v)) return 0;
    this.set.add(v);
    super.unshift(v);
  }
}
