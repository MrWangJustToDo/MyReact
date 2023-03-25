export class ListTreeNode<T> {
  value: T;
  prev: ListTreeNode<T> | null = null;
  next: ListTreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class ListTree<T> {
  length = 0;

  head: ListTreeNode<T> | null = null;
  foot: ListTreeNode<T> | null = null;

  append(node: T) {
    const listNode = new ListTreeNode(node);
    this._push(listNode);
  }

  push(node: T) {
    const listNode = new ListTreeNode(node);
    this._push(listNode);
  }

  _push(node: ListTreeNode<T>) {
    this.length++;
    if (!this.foot) {
      this.head = node;
      this.foot = node;
    } else {
      this.foot.next = node;
      node.prev = this.foot;
      this.foot = node;
    }
  }

  unshift(node: T) {
    const listNode = new ListTreeNode(node);
    this._unshift(listNode);
  }

  _unshift(node: ListTreeNode<T>) {
    this.length++;
    if (!this.head) {
      this.head = node;
      this.foot = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
  }

  shift() {
    if (this.head) {
      const re = this.head;
      if (this.head.next) {
        this.head = this.head.next;
        re.next = null;
        this.head.prev = null;
      } else {
        this.head = null;
        this.foot = null;
      }
      this.length--;
      return re.value;
    } else {
      return null;
    }
  }

  pop() {
    if (this.foot) {
      const re = this.foot;
      if (this.foot.prev) {
        this.foot = this.foot.prev;
        re.prev = null;
        this.foot.next = null;
      } else {
        this.head = null;
        this.foot = null;
      }
      this.length--;
      return re.value;
    } else {
      return null;
    }
  }

  pickHead() {
    return this.head.value;
  }

  pickFoot() {
    return this.foot.value;
  }

  listToFoot(action: (p: T) => void) {
    let node = this.head;
    while (node) {
      action(node.value);
      node = node.next;
    }
  }

  listToHead(action: (p: T) => void) {
    let node = this.foot;
    while (node) {
      action(node.value);
      node = node.prev;
    }
  }

  toArray() {
    const re: T[] = [];
    this.listToFoot((v) => re.push(v));
    return re;
  }

  delete(node: ListTreeNode<T>) {
    if (node.prev && node.next) {
      const prev = node.prev;
      node.prev = null;
      const next = node.next;
      node.next = null;
      prev.next = next;
      next.prev = prev;
      this.length--;
    } else if (node.prev) {
      const prev = node.prev;
      node.prev = null;
      prev.next = null;
      this.foot = prev;
      this.length--;
    } else if (node.next) {
      const next = node.next;
      node.next = null;
      next.prev = null;
      this.head = next;
      this.length--;
    } else {
      this.head = null;
      this.foot = null;
      this.length--;
    }
  }

  size() {
    return this.length;
  }

  has(node: T) {
    let listNode = this.head;
    while (listNode) {
      if (Object.is(listNode.value, node)) return true;
      listNode = listNode.next;
    }
    return false;
  }
}
