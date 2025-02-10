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

  head: ListTreeNode<T> | null;

  foot: ListTreeNode<T> | null;

  stickyHead: ListTreeNode<T> | null;

  stickyFoot: ListTreeNode<T> | null;

  constructor() {
    let _stickyHead: ListTreeNode<T> | null = null;

    Object.defineProperty(this, "stickyHead", {
      get() {
        return _stickyHead;
      },

      set(v: ListTreeNode<T> | null) {
        _stickyHead = v;
      },
    });

    let _stickyFoot: ListTreeNode<T> | null = null;

    Object.defineProperty(this, "stickyFoot", {
      get() {
        return _stickyFoot;
      },

      set(v: ListTreeNode<T> | null) {
        _stickyFoot = v;
      },
    });

    let _head: ListTreeNode<T> | null = null;

    Object.defineProperty(this, "head", {
      get() {
        return _head;
      },

      set(v: ListTreeNode<T> | null) {
        _head = v;
      },
    });

    let _foot: ListTreeNode<T> | null = null;

    Object.defineProperty(this, "foot", {
      get() {
        return _foot;
      },

      set(v: ListTreeNode<T> | null) {
        _foot = v;
      },
    });
  }

  push(node: T) {
    const listNode = new ListTreeNode(node);
    this.length++;
    if (!this.foot) {
      this.head = listNode;
      this.foot = listNode;
    } else {
      this.foot.next = listNode;
      listNode.prev = this.foot;
      this.foot = listNode;
    }
  }

  pushToLast(node: T) {
    if (this.stickyFoot) {
      const node = this.stickyFoot;

      this.push(node.value);

      this.stickyFoot = null;
    } else {
      this.length++;
    }

    const listNode = new ListTreeNode(node);

    this.stickyFoot = listNode;
  }

  pushToHead(node: T) {
    if (this.stickyHead) {
      const node = this.stickyHead;

      this.unshift(node.value);

      this.stickyHead = null;
    } else {
      this.length++;
    }

    const listNode = new ListTreeNode(node);

    this.stickyHead = listNode;
  }

  pop() {
    const foot = this.stickyFoot || this.foot || this.stickyHead;
    if (foot) {
      this.delete(foot);
      return foot.value;
    } else {
      return null;
    }
  }

  unshift(node: T) {
    const listNode = new ListTreeNode(node);
    this.length++;
    if (!this.head) {
      this.head = listNode;
      this.foot = listNode;
    } else {
      this.head.prev = listNode;
      listNode.next = this.head;
      this.head = listNode;
    }
  }

  unshiftToHead(node: T) {
    if (this.stickyHead) {
      const node = this.stickyHead;

      this.unshift(node.value);

      this.stickyHead = null;
    } else {
      this.length++;
    }

    const listNode = new ListTreeNode(node);

    this.stickyHead = listNode;
  }

  unshiftToFoot(node: T) {
    if (this.stickyFoot) {
      const node = this.stickyFoot;

      this.push(node.value);

      this.stickyFoot = null;
    } else {
      this.length++;
    }

    const listNode = new ListTreeNode(node);

    this.stickyFoot = listNode;
  }

  shift() {
    const head = this.stickyHead || this.head || this.stickyFoot;
    if (head) {
      this.delete(head);
      return head.value;
    } else {
      return null;
    }
  }

  pickHead() {
    return this.stickyHead?.value || this.head?.value;
  }

  pickFoot() {
    return this.stickyFoot?.value || this.foot?.value;
  }

  listToFoot(action: (p: T) => void) {
    if (this.stickyHead) {
      action(this.stickyHead.value);
    }
    let node = this.head;
    while (node) {
      action(node.value);
      node = node.next;
    }
    if (this.stickyFoot) {
      action(this.stickyFoot.value);
    }
  }

  listToHead(action: (p: T) => void) {
    if (this.stickyFoot) {
      action(this.stickyFoot.value);
    }
    let node = this.foot;
    while (node) {
      action(node.value);
      node = node.prev;
    }
    if (this.stickyHead) {
      action(this.stickyHead.value);
    }
  }

  toArray() {
    const re: T[] = [];

    this.listToFoot((v) => re.push(v));

    return re;
  }

  delete(node: ListTreeNode<T>) {
    if (this.stickyHead === node) {
      this.stickyHead = null;
      this.length--;
    } else if (this.stickyFoot === node) {
      this.stickyFoot = null;
      this.length--;
    } else if (this.head === node) {
      const next = node.next;
      node.next = null;
      if (next) {
        this.head = next;
        next.prev = null;
      } else {
        this.head = null;
        this.foot = null;
      }
      this.length--;
    } else if (this.foot === node) {
      const prev = node.prev;
      node.prev = null;
      if (prev) {
        this.foot = prev;
        prev.next = null;
      } else {
        this.head = null;
        this.foot = null;
      }
      this.length--;
    } else if (this.hasNode(node)) {
      const prev = node.prev;
      const next = node.next;
      node.prev = null;
      node.next = null;
      prev.next = next;
      next.prev = prev;
      this.length--;
    }
  }

  size() {
    return this.length;
  }

  hasNode(node: ListTreeNode<T>) {
    if (this.stickyHead && Object.is(this.stickyHead, node)) return true;
    if (this.stickyFoot && Object.is(this.stickyFoot, node)) return true;
    let listNode = this.head;
    while (listNode) {
      if (Object.is(listNode, node)) return true;
      listNode = listNode.next;
    }
    return false;
  }

  hasValue(node: T) {
    if (this.stickyHead && Object.is(this.stickyHead.value, node)) return true;
    if (this.stickyFoot && Object.is(this.stickyFoot.value, node)) return true;
    let listNode = this.head;
    while (listNode) {
      if (Object.is(listNode.value, node)) return true;
      listNode = listNode.next;
    }
    return false;
  }

  some(iterator: (node: T) => boolean | undefined) {
    let re = false;
    this.listToFoot((node) => {
      re = re || iterator(node);
    });
    return re;
  }

  every(iterator: (node: T) => boolean | undefined) {
    let re = true;

    this.listToFoot((node) => {
      re = re && iterator(node);
    });

    return re;
  }

  concat(list: ListTree<T>) {
    const newList = new ListTree<T>();

    this.listToFoot((node) => newList.push(node));

    list.listToFoot((node) => newList.push(node));

    return newList;
  }

  clone(): ListTree<T> {
    const newList = new ListTree<T>();

    this.listToFoot((v) => newList.push(v));

    return newList;
  }

  clear() {
    this.length = 0;
    this.head = null;
    this.foot = null;
    this.stickyHead = null;
    this.stickyFoot = null;
  }
}

if (__DEV__) {
  Object.defineProperty(ListTree.prototype, "_debugToArray", {
    get(this: ListTree<unknown>) {
      return this.toArray();
    },
  });
}
