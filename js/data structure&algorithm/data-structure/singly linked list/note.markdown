# 資料結構-單向鏈結串列(Singly linked list)筆記

#### Singly linked list是Linked listed中最基本的版本，在這條Link上，每一個節點都儲存著資料(val)，且節點之間只能單向溝通(head->tail)，透過Javascript中的Class可以用來實現這樣的資料結構，index.js參考[我的github]()，如下方code，建立了兩個class( `Node` & `SinglyLinkedList` )，而 `SinglyLinkedList` 即本體，內部可由多個 `Node` 所連結而成，每個 `Node` 可存放val以及通往下個 `Node` 的property(val, next)。

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

## 1. Push Method

#### Push Method即在List後端(tail)新增一個新的節點(Node)，倘若List在這之前沒有Node，則頭尾(this.head, this.node)都會是新增的Node

``` js
class SinglyLinkedList {
    ...
    push(val) {
        // 將新的Node傳入名為newNode的變數
        const newNode = new Node(val)
        // 倘若head不存在，則在頭尾新增newNode，此時的head以及tail都指向同一個reference(newNode)
        if (!this.head) {
            this.head = newNode
            this.tail = this.head
        } else {
            //若head已經存在，由於最初的this.head以及this.tail都指向同一reference，
            // 因此當this.tail.next指向newNode的同時，也會使this.head.next指會向newNode
            this.tail.next = newNode;
            // 再將this.tail重新指向newNode；
            this.tail = newNode;
            //此時this.head.next以及this.tail都指向同一個reference (也就是newNode)，
        }
        // 若push method再度被執行的話，newNode除了會傳入this.tail.next，也會同步傳入this.head.next.next
        this.length++;
        return this;
    }
}
const List = new SinglyLinkedList();
console.log(List.push(1));
// {
//    head: Node {val: 1, next: null}
//    length: 1
//    tail: Node {val: 1, next: null}
// }
console.log(List.push(2));
// {
//    head: Node {val: 1, next: {val:2,next:null}}
//    tail: Node {val: 2, next: null}}
//    length: 2
// }
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

``` js
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
```

``` js
    unshift(val) {
        if (!this.head) return this.push(val);
        let newNode = new Node(val);
        newNode.next = this.head;
        this.head = newNode;
        this.length++;
        return this
    }
```

``` js
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
```

``` js
    set(index, val) {
        let foundNode = this.get(index);
        if (foundNode) {
            foundNode.val = val;
            return true;
        }
        return false;
    }
```

``` js
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
```

``` js
    remove(index) {
        if (index < 0 || index >= this.length) return undefined;
        if (index === 0) return this.shift();
        if (index === this.length - 1) return this.pop();

        let leftNode = this.get(index - 1);
        let removeNode = leftNode.next;
        leftNode.next = removeNode.next;
        this.length--

    }
```

``` js
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

    print() {
        const arr = [];
        let node = this.head;
        for (let i = 0; i < this.length; i++) {
            arr.push(node.val);
            node = node.next
        }
        return arr;
    }
    }
```

``` js
list.push(1);
list.push(2);
list.push(3);
list.push(4);
list.reverse();
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

## reverse method

#### 意即將整個linked list反轉，一開始先將 `head` 以及 `tail` 互換，在for loop過程中，i=0的情況下，temp=this.tail，但temp.next仍指向值為2的node，因此先將temp.next存放在next的變數，再將prev(null)傳入temp.next(意即將temp.next指向null)，為了下一步(i=1)做準備，故將temp傳入prev，將next傳入temp。
