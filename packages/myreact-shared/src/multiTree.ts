// used for generate stable `useId` tree structure

// TODO
export class MultiTreeNode<T> {
  value: T;

  parent: MultiTreeNode<T> | null = null;

  children: MultiTreeNode<T>[] = [];

  constructor(value: T) {
    this.value = value;
  }

  appendChild(node: MultiTreeNode<T>) {
    node.parent = this;
    this.children.push(node);
  }
}

export class MultiTree<T extends Record<string, any>> {
  length = 0;

  root: MultiTreeNode<T> | null = null;

  nodeToConfigMap: WeakMap<T, { currentIndex: number }> = new Map();

  nodeToTreeNodeMap: WeakMap<T, MultiTreeNode<T>> = new Map();

  append(node: T, parent?: T) {
    if (!this.root && !parent) {
      const treeNode = new MultiTreeNode(node);
      this.nodeToConfigMap.set(node, { currentIndex: 0 });
      this.nodeToTreeNodeMap.set(node, treeNode);
      this.root = treeNode;
      this.length++;
      return;
    }
    if (this.nodeToConfigMap.has(node) && this.nodeToTreeNodeMap.has(node)) {
      return;
    }
    if (this.nodeToTreeNodeMap.has(parent) && this.nodeToConfigMap.has(parent)) {
      const parentConfig = this.nodeToConfigMap.get(parent);
      const parentTreeNode = this.nodeToTreeNodeMap.get(parent);
      const treeNode = new MultiTreeNode(node);
      parentTreeNode.appendChild(treeNode);
      this.nodeToTreeNodeMap.set(node, treeNode);
      this.nodeToConfigMap.set(node, { currentIndex: parentConfig.currentIndex + 1 });
      this.length++;
    } else {
      if (__DEV__) {
        console.error(`[@my-react/react-shared] some error happen in the "multiTree" generate, look like a bug for internal logic`);
      }
    }
  }

  getTreeConfig(node: T) {
    if (this.nodeToConfigMap.has(node)) {
      const config = this.nodeToConfigMap.get(node);
      const treeNode = this.nodeToTreeNodeMap.get(node);
      const parentNode = treeNode.parent;
      if (parentNode) {
        return { c: config.currentIndex, p: parentNode.children.indexOf(treeNode) };
      } else {
        return { c: config.currentIndex, p: 0 };
      }
    } else {
      return {};
    }
  }

  delete(node: T) {
    const loopDelate = (node: T) => {
      if (this.nodeToTreeNodeMap.has(node)) {
        const treeNode = this.nodeToTreeNodeMap.get(node);
        if (treeNode === this.root) {
          this.root = null;
        }
        treeNode.parent = null;
        this.nodeToConfigMap.delete(node);
        this.nodeToTreeNodeMap.delete(node);
        this.length--;
        treeNode.children.forEach((c) => loopDelate(c.value))
        treeNode.children.length = 0;
      }
    };
    loopDelate(node)
  }
}
