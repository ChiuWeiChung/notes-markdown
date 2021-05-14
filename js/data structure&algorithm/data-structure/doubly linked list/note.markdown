# 資料結構-雙向鏈結串列(Doubly linked list)筆記

``` js
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
}
const List = new DoublyLinkedList();

```

``` js
class DoublyLinkedList {
    ...
    push(val) {
        const newNode = new Node(val);
        if (!this.head) {
            this.head = newNode;
            this.tail = this.head;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.length++;
        return this;
    }
}
```

``` js
class DoublyLinkedList {
    ...
    pop() {
        if (!this.head) return undefined;
        let poppedNode = this.tail;
        if (this.length === 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = poppedNode.prev; //將tail指向前一個Node
            this.tail.next = null;
            poppedNode.prev = null;
        }
        this.length--;
        return poppedNode;
    }
}
```

``` js
class DoublyLinkedList {
    ...
    shift() {
        if (!this.head) return undefined
        let shiftedNode = this.head;
        if (this.length === 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = shiftedNode.next;
            this.head.prev = null;
            shiftedNode.next = null;
        }
        this.length--
        return shiftedNode;
    }

}
```

``` js
class DoublyLinkedList {
    ...
    unshift(val) {
        if (!this.head) return this.push(val);
        let newNode = new Node(val);
        newNode.next = this.head;
        this.head.prev = newNode;
        this.head = newNode;
        this.length++;
        return this;
    }
}
```

``` js
class DoublyLinkedList {
    ...
    get(index) {
        if (index < 0 || index >= this.length) return null;
        if (index > Math.floor(this.length / 2)) {
            let node = this.tail;
            for (let i = this.length - 1; i > index; i--) {
                node = node.prev;
            }
            return node
        }
        let node = this.head;
        for (let i = 0; i < index; i++) {
            node = node.next
        }
        return node
    }
}
```

``` js
class DoublyLinkedList {
    ...
    set(index, val) {
        let node = this.get(index);
        if (!node) return false;
        node.val = val;
        return true;
    }

    insert(index, val) {
        if (index === 0) return this.unshift(val);
        if (index === this.length) return this.push(val);

        let node = this.get(index);
        if (!node) return false;
        let newNode = new Node(val);
        newNode.next = node;
        newNode.prev = node.prev;
        node.prev.next = newNode;
        node.prev = newNode;
        this.length++;
        return true;
    }
}
```

``` js
class DoublyLinkedList {
    ...
    remove(index) {
        if (index === 0) return this.shift()
        if (index === this.length - 1) return this.pop()
        let node = this.get(index);
        if (!node) return false;
        let beforeNode = node.prev;
        let afterNode = node.next;
        afterNode.prev = beforeNode;
        beforeNode.next = afterNode;
        node.prev = null;
        node.next = null;
        this.length--
        return node
    }
}
```
