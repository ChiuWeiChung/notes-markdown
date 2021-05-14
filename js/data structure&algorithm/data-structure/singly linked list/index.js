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

    push(val) {
        const newNode = new Node(val)
        if (!this.head) {
            this.head = newNode
            this.tail = this.head
        } else {
            //將數值移到tail的後方，並同步更新this.head.next=newNode
            this.tail.next = newNode;
            // 將tail property指向newNode上
            this.tail = newNode;
            //此時this.head.next以及this.tail都指向同一個reference (也就是newNode)因此，若push method再度被執行的話，newNode除了會傳入this.tail.next，也會同步傳入this.head.next.next
        }
        this.length++;
        return this;
    }

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

    unshift(val) {
        if (!this.head) return this.push(val);
        let newNode = new Node(val);
        newNode.next = this.head;
        this.head = newNode;
        this.length++;
        return this
    }

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

    set(index, val) {
        let foundNode = this.get(index);
        if (foundNode) {
            foundNode.val = val;
            return true;
        }
        return false;
    }

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

    remove(index) {
        if (index < 0 || index >= this.length) return undefined;
        if (index === 0) return this.shift();
        if (index === this.length - 1) return this.pop();

        let leftNode = this.get(index - 1);
        let removeNode = leftNode.next;
        leftNode.next = removeNode.next;
        this.length--

    }

    reverse() {
        // 將head以及tail互換
        let temp = this.head;
        this.head = this.tail;
        this.tail = temp;
        console.log(temp);
        let prev = null;
        let next;
        for (var i = 0; i < this.length; i++) {
            next = temp.next;   // 先將當前的temp.next存起來
            temp.next = prev;   // 再將prev指向當前的node.next (i=0時，temp為this.tail，將temp.next指向null)
            prev = temp;    // 將當前temp做為下一個prev
            temp = next;    // 將node.next做為下一個temp
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

const list = new SinglyLinkedList()
// console.log(list)
// console.log(list.push(1))
// console.log(list.push(2))
// console.log(list.push(3))
// console.log(list.push(1))
// console.log(list)
list.push('1')
list.push('2')
list.push('3')
list.push('4')

console.log(list.reverse());
