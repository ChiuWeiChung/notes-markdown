# 資料結構筆記-堆疊(Stack)&佇列(Queue)

## 堆疊 (Stack)

堆疊屬於LIFO(Last In, First Out)的線性資料結構: 也就是最後新增(add)的Stack的資料，在移除(remove)時也會是第一個被移出的。常見的Stack例子如 1. JavaScript中的function在[Call Stack]()中堆疊過程 2. 網頁的瀏覽紀錄(上一頁&下一頁)。

堆疊可以簡單的透過JavaSciprt的Array來執行，將資料加在陣列最尾端可透過Array.push()實現、將最後加入的資料移除則可以透過Array.pop()來實現，且時間複雜度都是O(1); 此外，若要讓資料從前端開始堆疊，Array.shift(), Array.unshift()也可以達到一樣的效果，但是會改變陣列內資料的次序(index)，因此時間複雜度會變為O(n)，若想讓時間複雜度降至O(1)，我們可以透過JavaScript中的Class實現，由於是線性結構，方法與[Singly Linked List]()中的`shift`以及`unshift`相同，如下方Code。

``` js
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class Stack {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }
    unshift(val) {
        let newNode = new Node(val)
        if (!this.first) {
            this.first = newNode
            this.last = this.first;
            return this
        }
        newNode.next = this.first
        this.first = newNode;
        this.size++
        return this
    }
    shift() {
        if (!this.size) return null
        let removedNode = this.first;
        if (this.size === 1) this.last = null;
        this.first = this.first.next;
        this.size--
        return removedNode.val
    }
}
const stack = new Stack()
stack.unshift(1)
stack.unshift(2)
stack.shift() // 2
```



## 佇列 (Queue)

佇列 (Queu)與堆疊的特性相反，屬於FIFO (First In, First Out)的線性結構，最先加入的資料也會在移除階段優先被移出，類似排隊的概念，在許多系統中的背景程式會用到佇列的概念來處理，又或是商城訂單系統，先下訂的買家可以優先被商家處理訂單。

佇列同樣的可以透過JavaScript的Array來實現，加入資料時透過Array.push()或Array.unshift()實現，移除資料透過Array.shift()或Array.pop()實現，然而，透過1.前端加入後端移除(unshift, pop)或是2. 後端加入前端移除(push, shift)，兩者的其中一種method都會使時間複雜度變為O(n)，因此將加入、移除的時間複雜度降至O(1)，同樣可以透過Class來達到。方法與[Singly Linked List]()中的`push`以及`pop`相同，如下方Code。

```js
class Queue {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }
    push(val) { //enqueue
        let newNode = new Node(val);
        if (!this.first) {
            this.first = newNode;
            this.last = this.first;
        } else {
            this.last.next = newNode;
            this.last = newNode;
        }
        this.size++
        return this
    }
    shift() { //dequeue
        if (!this.size) return null;
        let removedNode = this.first;
        if (this.size === 1) {
            // this.first=null;
            this.last = null;
        }
        this.first = this.first.next;
        // removedNode.next=null;
        this.size--;
        return removedNode.val
    }
}
const queue = new Queue();
queue.push(1)
queue.push(2)
queue.shift(); //1
```



## 堆疊(Stack)&佇列(Queue)的時間複雜度
Data Structure| Insertion| Removal  | Searching| Access
  ----------  |:--------:|:--------:|:--------:|:-------:
    Stack     |   O(1)   |   O(1)   |   O(n)   | O(n)
    Queue     |   O(1)   |   O(1)   |   O(n)   | O(n)