# 資料結構筆記-單向鏈結串列(Singly linked list)

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

Singly linked list 是 Linked listed 中最基本的版本，在這條 Link 上，每一個節點都儲存著資料 (val) ，且節點之間只能單向溝通 (由 head 至 tail )，透過 JavaScript 中的 Class 可以用來實現這樣的資料結構，如下方 code ，建立了兩個 class ( `Node` & `SinglyLinkedList` ) ，而 `SinglyLinkedList` 即本體，內部可由多個 `Node` 所連結而成，每個 `Node` 可存放val以及通往下個 `Node` 的 property (val, next) 。

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

## Singly Linked List 的基本方法

* Push Method: 在 List 的後端 (tail) 新增一個新的節點 (Node) 。
* Pop Method: 將 List 尾端 Node 去除。
* Shift Method: 將 List 最前端 Node 去除。
* Unshift Method: 在 List 最前端新增一個 Node 。
* Get Method: 回傳在 List 中的特定的 Node 
* Set Method: 修改 List 中特定 Node 的值
* Insert Method: 在 List 插入特定 index 的 Node 。
* Removed Method: 刪除 List 中特定 index 的 Node 。

## 1. Push Method

``` js
class SinglyLinkedList {
    ...
    push(val) {
        // 將新的 Node 傳入名為 newNode 的變數
        const newNode = new Node(val)
        // 倘若 head 不存在，則在頭尾新增 newNode ，
        if (!this.head) {
            this.head = newNode
            this.tail = this.head
            // 此時的 hea 以及 tail 都指向同一個 reference (newNode)
        } else {
            // 因此當 this.tail.next 指向 newNode 的同時， this.head.next 也會指向 newNode
            this.tail.next = newNode;
            // 再將 this.tail 重新指向 newNode；
            this.tail = newNode;
            //此時 this.head.next 以及 this.tail 都指向同一個 reference (也就是 newNode )，
            // 若 push method 再度被執行的話， newNode 除了會傳入 this.tail.next
            // ，也會同步傳入 this.head.next.next
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

意即將整個 linked list 反轉，一開始先將 `head` 以及 `tail` 互換，在 for loop 過程中， i= 0 的情況下， `temp=this.tail` ，但 `temp.next` 仍指向值為 2 的 node ，因此先將 `temp.next` 存放在 next 的變數，再將 prev (null) 傳入 `temp.next` ( 意即將 temp.next 指向 null ) ，為了下一步 ( i= 1 ) 做準備，故將 temp 傳入 prev ，將 next 傳入 temp 。

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

## 單向鏈結串列 (Singly Linked List) 的時間複雜度

當一組資料需要頻繁的在前端或尾端 ( head, tail ) 進行新增 ( Insertion ) 或是刪除 ( Removal ) 的動作時， Singly Linked List 可以是個很好的替代方案 (相較於使用 Array 而言) ，原因在針對 Array 進行前端的新增 (`Array.shift()`) 或刪減 (`Array.unshift()`) 時， Array 上所有的資料次序會因此變動( a[1] -> a[0] , a[2]-> a[1]...)，因此時間複雜度為 O (n) ，若是透過 Singly Linked List 來操作時，時間複雜度為O (1) 。 

Data Structure| Insertion| Removal  | Searching| Access
  ----------  |:--------:|:--------:|:--------:|:-------:
Singly Linked |   O(1)   |O(1)或O(n)|   O(n)   | O(n)
