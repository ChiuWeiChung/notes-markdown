# 資料結構-單向鏈結串列(Singly linked list)筆記

#### Singly linked list是Linked listed中最基本的版本，在這條Link上，每一個節點都儲存著資料(val)，且節點之間只能單向溝通(由head至tail)，透過Javascript中的Class可以用來實現這樣的資料結構，如下方code，建立了兩個class( `Node` & `SinglyLinkedList` )，而 `SinglyLinkedList` 即本體，內部可由多個 `Node` 所連結而成，每個 `Node` 可存放val以及通往下個 `Node` 的property(val, next)，詳細請參考[我的github]()。

``` js
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
}
const List = new SinglyLinkedList();
console.log(List); //SinglyLinkedList {head: null, tail: null, length: 0}
```

## Singly Linked List的基本方法

* Push Method: 在List的後端(tail)新增一個新的節點(Node)。
* Pop Method: 將List尾端Node去除。
* Shift Method: 將List最前端Node去除。
* Unshift Method: 在List最前端新增一個Node。
* Get Method: 回傳在List中的特定的Node
* Set Method: 修改List中特定Node的值
* Insert Method: 在List插入特定index的Node。
* Removed Method: 刪除List中特定index的Node。

## 1. Push Method

``` js
class SinglyLinkedList {
    ...
    push(val) {
        // 將新的Node傳入名為newNode的變數
        const newNode = new Node(val)
        // 倘若head不存在，則在頭尾新增newNode，
        if (!this.head) {
            this.head = newNode
            this.tail = this.head
            // 此時的head以及tail都指向同一個reference(newNode)
        } else {
            // 因此當this.tail.next指向newNode的同時，this.head.next也會指向newNode
            this.tail.next = newNode;
            // 再將this.tail重新指向newNode；
            this.tail = newNode;
            //此時this.head.next以及this.tail都指向同一個reference (也就是newNode)，
            // 若push method再度被執行的話，newNode除了會傳入this.tail.next
            // ，也會同步傳入this.head.next.next
        }
        this.length++;
        return this;
    }
}
```

## 2. Pop Method

``` js
class SinglyLinkedList {
    ...
    pop() {
        if (!this.head) return undefined
        let current = this.head;
        let newTail = current;
        while (current.next) {
            newTail = current;
            current = current.next;
        }
        this.tail = newTail;
        this.tail.next = null;
        this.length--;
        if (this.length === 0) {
            this.head = null;
            this.tail = null;
        }
        return current
    }
}
```

## 3. Shift Method

``` js
class SinglyLinkedList {
    ...
    shift() {
        if (!this.head) return undefined;
        let currentHead = this.head;
        this.head = currentHead.next;
        this.length--;
        if (this.length === 0) {
            this.head = null;
            this.tail = null;
        }
        return currentHead;
    }
}
```

## 4. Unshift Method

``` js
class SinglyLinkedList {
    ...
    unshift(val) {
        if (!this.head) return this.push(val);
        let newNode = new Node(val);
        newNode.next = this.head;
        this.head = newNode;
        this.length++;
        return this
    }
}
```

## 5. Get Method

``` js
class SinglyLinkedList {
    ...
    get(index) {
        if (index >= this.length || index < 0) return null
        let i = 0;
        let currentNode = this.head
        while (i !== index) {
            currentNode = currentNode.next;
            i++;
        }
        return currentNode;
    }
}
```

## Set Method

``` js
class SinglyLinkedList {
    ...
    set(index, val) {
        let foundNode = this.get(index);
        if (foundNode) {
            foundNode.val = val;
            return true;
        }
        return false;
    }
}
```

## Insert Method

``` js
class SinglyLinkedList {
    ...
    insert(index, val) {
        if (index > this.length || index < 0) return false;
        if (index === 0) return this.unshift(val);
        if (index === this.length) return this.push(val);
        let newNode = new Node(val);
        let leftNode = this.get(index - 1);
        let rightNode = leftNode.next;
        leftNode.next = newNode;
        newNode.next = rightNode;
        this.length++;
        return true
    }
}
```

## Remove Method

``` js
class SinglyLinkedList {
    ...
    remove(index) {
        if (index < 0 || index >= this.length) return undefined;
        if (index === 0) return this.shift();
        if (index === this.length - 1) return this.pop();
        let leftNode = this.get(index - 1);
        let removeNode = leftNode.next;
        leftNode.next = removeNode.next;
        this.length--
    }
}
```

## 同場加映 Reverse Method

#### 意即將整個linked list反轉，一開始先將 `head` 以及 `tail` 互換，在for loop過程中，i=0的情況下，temp=this.tail，但temp.next仍指向值為2的node，因此先將temp.next存放在next的變數，再將prev(null)傳入temp.next(意即將temp.next指向null)，為了下一步(i=1)做準備，故將temp傳入prev，將next傳入temp。

``` js
class SinglyLinkedList {
    ...
    reverse() {
        // 將head以及tail互換
        let temp = this.head;
        this.head = this.tail;
        this.tail = temp;
        let prev = null;
        let next;
        for (var i = 0; i < this.length; i++) {
            next = temp.next; // 先將當前的temp.next存起來
            temp.next = prev; // 再將prev指向當前的node.next (i=0時，temp為this.tail，將temp.next指向null)
            prev = temp; // 將當前temp做為下一個prev
            temp = next; // 將node.next做為下一個temp
        }
        return this;
    }
}
```

``` js
//              Reverse 示意圖
//                      (head)          (tail)
// 原list:                1--->2--->3--->4
// =================================================
//                      (tail)          (head)
// tail、head互換後       1--->2--->3--->4
// =================================================
// i=0時                (tail)          (head)
//                null<---1--->2--->3--->4
//                prev  temp  next
// =================================================
// i=1時                (tail)          (head)
//                null<---1<---2--->3--->4
//                      prev  temp  next
// =================================================
// i=2時                (tail)          (head)
//                null<---1<---2<---3--->4
//                           prev  temp  next
// =================================================
// i=3時                (tail)          (head)
//                null<---1<---2<---3<---4     null
//                                 prev  temp  next
```

## Singly Linked List的Big O Notation

#### 當一組資料需要頻繁的在前端或尾端(head, tail)進行新增(Insertion)或是刪除(Removal)的動作時，Singly Linked List可以是個很好的替代方案 (相較於使用Array而言)，原因在針對Array進行前端的新增(Array.shift( ))或刪減(Array.unshift( ))時，Array上所有的資料次序會因此變動(a[1]->a[0], a[2]->a[1]...)，因此時間複雜度為O(n)，若是透過Singly Linked List來操作時，時間複雜度為O(1)。 

Data Structure| Insertion| Removal  | Searching| Access
  ----------  |:--------:|:--------:|:--------:|:-------:
Singly Linked |   O(1)   |O(1)或O(n)|   O(n)   | O(n)
