import { delay } from "./delay";
import { log } from "./log";

class NodeItem<T, K> {
  previous: NodeItem<T, K> | undefined;
  next: NodeItem<T, K> | undefined;
  constructor(readonly key: T, readonly value: K) {}
}

class ListNode<T, K> {
  private head: NodeItem<T, K> | undefined;
  private foot: NodeItem<T, K> | undefined;

  constructor(key?: T, value?: K) {
    if (key !== undefined && value !== undefined) {
      const nodeItem = new NodeItem<T, K>(key, value);
      this.head = nodeItem;
      this.foot = nodeItem;
    }
  }

  deleteItem(item: NodeItem<T, K>) {
    const validate = this.checkInTheList(item);
    if (!validate) {
      return false;
    }
    const pre = this.getPre(item);
    const next = this.getNext(item);
    item.next = undefined;
    item.previous = undefined;
    if (!pre && !next) {
      // 前一个后一个都不存在，当前就只有一个链表项
      this.head = undefined;
      this.foot = undefined;
    } else if (!pre) {
      // 如果前一个不存在，表示当前就是第一个
      this.head = next;
      next && (next.previous = undefined);
    } else if (!next) {
      // 如果后一个不存在，表示当前就是最后一个
      this.foot = pre;
      pre && (pre.next = undefined);
    } else {
      // 两边都有
      pre.next = next;
      next.previous = pre;
    }
    return true;
  }

  checkInTheList(item: NodeItem<T, K>) {
    if (!this.head) {
      return false;
    }
    let temp: NodeItem<T, K> | undefined = this.head;
    while (temp && temp !== item) {
      temp = temp.next;
    }
    if (temp) {
      return true;
    } else {
      return false;
    }
  }

  getPre(item: NodeItem<T, K>): NodeItem<T, K> | undefined {
    return item.previous;
  }

  getNext(item: NodeItem<T, K>): NodeItem<T, K> | undefined {
    return item.next;
  }

  add(key: T, value: K, deleteTime?: number): NodeItem<T, K> {
    const item = new NodeItem<T, K>(key, value);
    if (!this.head) {
      // 第一次添加或者前面的删除空了
      this.head = item;
      this.foot = item;
    } else if (this.foot) {
      const lastFoot = this.foot;
      lastFoot.next = item;
      item.previous = lastFoot;
      this.foot = item;
    } else {
      log(`listNode error！`, "error");
    }
    if (deleteTime !== undefined) {
      delay(deleteTime, () => this.deleteItem(item));
    }
    return item;
  }

  getNode(key: T): NodeItem<T, K> | undefined {
    let targetItem;
    let tempItem = this.foot;
    while (tempItem && tempItem.key !== key) {
      tempItem = tempItem.previous;
    }
    if (tempItem && tempItem.key === key) {
      targetItem = tempItem;
    }
    return targetItem;
  }

  // for map attribute, useful for cache object

  get(key: T): K | undefined {
    const r = this.getNode(key);
    return r?.value;
  }

  has(key: T) {
    return !!this.get(key);
  }

  set(key: T, value: K) {
    this.add(key, value);
    return this;
  }

  delete(key: T) {
    const currentItem = this.getNode(key);
    if (currentItem !== undefined) {
      const r = this.deleteItem(currentItem);
      return r;
    } else {
      return false;
    }
  }
}

export { ListNode };
