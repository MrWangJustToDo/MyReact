export class UniqueArray<T> {
  private set = new Set<T>();
  private arr = new Array<T>();

  length = 0;

  uniPop() {
    const v = this.arr.pop();
    this.set.delete(v);
    this.length--;
    return v;
  }

  uniPush(v: T) {
    if (this.set.has(v)) return 0;
    this.set.add(v);
    this.arr.push(v);
    this.length++;
  }

  uniShift() {
    const v = this.arr.shift();
    this.set.delete(v);
    this.length--;
    return v;
  }

  uniUnshift(v: T) {
    if (this.set.has(v)) return 0;
    this.set.add(v);
    this.arr.unshift(v);
    this.length++;
  }

  uniDelete(v: T) {
    if (this.set.has(v)) {
      this.set.delete(v);
      this.arr = this.arr.filter((i) => i !== v);
      this.length--;
    }
  }

  clear() {
    this.length = 0;
    this.set.clear();
    this.arr.length = 0;
  }

  getAll() {
    return this.arr;
  }
}
