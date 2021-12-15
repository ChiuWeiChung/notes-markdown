# 資料結構筆記-雙向鏈結串列(Doubly linked list)

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 之學習筆記，經自己理解歸納後以筆記形式記錄下來，部分程式碼非原創。

與 Singly linked list 屬於同一類別的資料結構，差別在於 Doubly linked list 可以進行雙向溝通 ( head 至 tail 或是 tail 至 head )，由於雙向溝通的特性，因此在搜尋 (Searching) 方面相較 Singly linked list 所花費的時間就減少了一半，但也因此會增加記憶體上的空間佔據。

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

## Doubly Linked List 的基本方法 (與 Singly Linked List 相同)

* Push Method: 在 List 的後端(tail)新增一個新的節點 (Node)。
* Pop Method: 將 List 尾端 Node 去除。
* Shift Method: 將 List 最前端 Node 去除。
* Unshift Method: 在 List 最前端新增一個 Node 。
* Get Method: 回傳在 List 中的特定的 Node 
* Set Method: 修改 List 中特定 Node 的值
* Insert Method: 在 List 插入特定 index 的 Node 。
* Removed Method: 刪除 List 中特定 index 的 Node 。

## Push Method

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

## Pop Method

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
            this.tail = poppedNode.prev; //將 tail 指向前一個 Node
            this.tail.next = null;
            poppedNode.prev = null;
        }
        this.length--;
        return poppedNode;
    }
}
```

## Shift Method

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

## Unshift Method

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

## Get Method

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

## Set Method

``` js
class DoublyLinkedList {
    ...
    set(index, val) {
        let node = this.get(index);
        if (!node) return false;
        node.val = val;
        return true;
    }
}
```

## Insert Method

``` js
class DoublyLinkedList {
    ...
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

## Remove Method

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

## 同場加映 Reverse Method

``` js
class DoublyLinkedList {
    ...
    reverse() {
        let temp = this.head;
        this.head = this.tail;
        this.tail = temp;
        let prev = null;
        let next = temp.next;
        for (let i = 0; i < this.length; i++) {
            temp.prev = next;
            temp.next = prev;
            prev = temp;
            temp = next;
            if (!temp) break
            next = temp.next;
        }
        return this;
    }
}
```

## 雙向鏈結串列(Doubly Linked List)的時間複雜度

Doubly linked list 在各項操作上的時間複雜度基本上與 Singly linked list 相當，比較特別的是在 Searching 部分， Doubly linked list 由於可以依照 index 的大小來決定由前端 (head) 或是尾端 (tail) 開始尋找，因此所花的時間為 Singly linked list 的一半，也就是 O (n/2)，但仍然寫成 O (n)。

Data Structure| Insertion| Removal  | Searching| Access
  ----------  |:--------:|:--------:|:--------:|:-------:
Singly Linked |   O(1)   |   O(1)   |   O(n)   | O(n)
