export class ListTreeNode<T> {
  value: T;
  prev: ListTreeNode<T> | null = null;
  next: ListTreeNode<T> | null = null;
  children: ListTreeNode<T>[] = [];

  constructor(value: T) {
    this.value = value;
  }
}

export class LinkTreeList<T> {
  rawArray: T[] = [];

  scopeRoot = { index: -1, value: new ListTreeNode<any>(false) };

  scopeArray: Array<{ index: number; value: ListTreeNode<T> }> = [];
  // listArray: ListTreeNode<T>[][] = [];

  scopeLength = 0;

  length = 0;

  head: ListTreeNode<T> | null = null;
  foot: ListTreeNode<T> | null = null;

  scopePush(scopeItem: { index: number; value: ListTreeNode<T> }) {
    while (this.scopeLength && this.scopeArray[this.scopeLength - 1].index >= scopeItem.index) {
      this.scopeArray.pop();
      this.scopeLength--;
    }
    if (this.scopeLength) {
      this.scopeArray[this.scopeLength - 1].value.children.push(scopeItem.value);
    } else {
      this.scopeRoot.value.children.push(scopeItem.value);
    }
    this.scopeArray.push(scopeItem);
    this.scopeLength++;
  }

  append(node: T, index: number) {
    this.length++;
    this.rawArray.push(node);
    const listNode = new ListTreeNode(node);
    this.push(listNode);
    this.scopePush({ index, value: listNode });
    // if (this.listArray[index]) {
    //   const array = this.listArray[index];
    //   array.push(listNode);
    // } else {
    //   this.listArray[index] = [listNode];
    // }
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

  reconcile(action: (p: T) => void) {
    const reconcileScope = (node: ListTreeNode<T>) => {
      if (node.children) {
        node.children.forEach(reconcileScope);
      }
      action(node.value);
    };
    if (this.scopeLength) {
      this.scopeRoot.value.children.forEach(reconcileScope);
    }
    // for (let i = this.listArray.length - 1; i >= 0; i--) {
    //   const array = this.listArray[i];
    //   if (array) {
    //     array.forEach((p) => action(p.value));
    //   }
    // }
  }

  has() {
    return this.head !== null;
  }
}
