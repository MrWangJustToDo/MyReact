export class ListTreeNode<T> {
  value: T;
  prev: ListTreeNode<T> | null = null;
  next: ListTreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class LinkTreeList<T> {
  rawArray: T[] = [];

  length = 0;

  head: ListTreeNode<T> | null = null;
  foot: ListTreeNode<T> | null = null;

  append(node: T) {
    this.length++;
    this.rawArray.push(node);
    const listNode = new ListTreeNode(node);
    this.push(listNode);
  }

  unshift(node: ListTreeNode<T>) {
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
      return re;
    } else {
      return null;
    }
  }

  push(node: ListTreeNode<T>) {
    if (!this.foot) {
      this.head = node;
      this.foot = node;
    } else {
      this.foot.next = node;
      node.prev = this.foot;
      this.foot = node;
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
      return re;
    } else {
      return null;
    }
  }

  pickHead() {
    return this.head;
  }

  pickFoot() {
    return this.foot;
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

  has() {
    return this.head !== null;
  }
}

const listToFoot = <T>(list: SimpleLinkList<T>, action: (p: T) => void) => {
  let node = list.head;
  while (node) {
    action(node.value);
    node = node.next;
  }
};

export class SimpleLinkList<T> {
  length = 0;

  head: ListTreeNode<T> | null = null;
  foot: ListTreeNode<T> | null = null;

  append(node: T) {
    this.length++;
    const listNode = new ListTreeNode(node);
    this._push(listNode);
  }

  push(node: T) {
    this.length++;
    const listNode = new ListTreeNode(node);
    this._push(listNode);
  }

  unshift(node: ListTreeNode<T>) {
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
      return re;
    } else {
      return null;
    }
  }

  _push(node: ListTreeNode<T>) {
    if (!this.foot) {
      this.head = node;
      this.foot = node;
    } else {
      this.foot.next = node;
      node.prev = this.foot;
      this.foot = node;
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
      return re;
    } else {
      return null;
    }
  }

  pickHead() {
    return this.head;
  }

  pickFoot() {
    return this.foot;
  }

  toArray() {
    const re: T[] = [];
    listToFoot(this, (v) => re.push(v));
    return re;
  }

  has() {
    return this.head !== null;
  }
}