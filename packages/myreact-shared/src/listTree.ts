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

  pop() {
    const foot = this.foot;
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

  shift() {
    const head = this.head;
    if (head) {
      this.delete(head);
      return head.value;
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
    if (this.head === node) {
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
    let listNode = this.head;
    while (listNode) {
      if (Object.is(listNode, node)) return true;
      listNode = listNode.next;
    }
    return false;
  }

  hasValue(node: T) {
    let listNode = this.head;
    while (listNode) {
      if (Object.is(listNode.value, node)) return true;
      listNode = listNode.next;
    }
    return false;
  }
}
