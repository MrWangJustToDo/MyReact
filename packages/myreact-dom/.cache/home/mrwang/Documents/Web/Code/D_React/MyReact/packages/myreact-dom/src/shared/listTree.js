var ListTreeNode = /** @class */ (function () {
    function ListTreeNode(value) {
        this.prev = null;
        this.next = null;
        this.children = [];
        this.value = value;
    }
    return ListTreeNode;
}());
export { ListTreeNode };
var LinkTreeList = /** @class */ (function () {
    function LinkTreeList() {
        this.rawArray = [];
        this.scopeRoot = { index: -1, value: new ListTreeNode(false) };
        this.scopeArray = [];
        // listArray: ListTreeNode<T>[][] = [];
        this.scopeLength = 0;
        this.length = 0;
        this.head = null;
        this.foot = null;
    }
    LinkTreeList.prototype.scopePush = function (scopeItem) {
        while (this.scopeLength && this.scopeArray[this.scopeLength - 1].index >= scopeItem.index) {
            this.scopeArray.pop();
            this.scopeLength--;
        }
        if (this.scopeLength) {
            this.scopeArray[this.scopeLength - 1].value.children.push(scopeItem.value);
        }
        else {
            this.scopeRoot.value.children.push(scopeItem.value);
        }
        this.scopeArray.push(scopeItem);
        this.scopeLength++;
    };
    LinkTreeList.prototype.append = function (node, index) {
        this.length++;
        this.rawArray.push(node);
        var listNode = new ListTreeNode(node);
        this.push(listNode);
        this.scopePush({ index: index, value: listNode });
        // if (this.listArray[index]) {
        //   const array = this.listArray[index];
        //   array.push(listNode);
        // } else {
        //   this.listArray[index] = [listNode];
        // }
    };
    LinkTreeList.prototype.unshift = function (node) {
        if (!this.head) {
            this.head = node;
            this.foot = node;
        }
        else {
            this.head.prev = node;
            node.next = this.head;
            this.head = node;
        }
    };
    LinkTreeList.prototype.shift = function () {
        if (this.head) {
            var re = this.head;
            if (this.head.next) {
                this.head = this.head.next;
                re.next = null;
                this.head.prev = null;
            }
            else {
                this.head = null;
                this.foot = null;
            }
            return re;
        }
        else {
            return null;
        }
    };
    LinkTreeList.prototype.push = function (node) {
        if (!this.foot) {
            this.head = node;
            this.foot = node;
        }
        else {
            this.foot.next = node;
            node.prev = this.foot;
            this.foot = node;
        }
    };
    LinkTreeList.prototype.pop = function () {
        if (this.foot) {
            var re = this.foot;
            if (this.foot.prev) {
                this.foot = this.foot.prev;
                re.prev = null;
                this.foot.next = null;
            }
            else {
                this.head = null;
                this.foot = null;
            }
            return re;
        }
        else {
            return null;
        }
    };
    LinkTreeList.prototype.pickHead = function () {
        return this.head;
    };
    LinkTreeList.prototype.pickFoot = function () {
        return this.foot;
    };
    LinkTreeList.prototype.listToFoot = function (action) {
        var node = this.head;
        while (node) {
            action(node.value);
            node = node.next;
        }
    };
    LinkTreeList.prototype.listToHead = function (action) {
        var node = this.foot;
        while (node) {
            action(node.value);
            node = node.prev;
        }
    };
    LinkTreeList.prototype.reconcile = function (action) {
        var reconcileScope = function (node) {
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
    };
    LinkTreeList.prototype.has = function () {
        return this.head !== null;
    };
    return LinkTreeList;
}());
export { LinkTreeList };
//# sourceMappingURL=listTree.js.map