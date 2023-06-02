
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
        } else {
            newNode.next = this.first
            this.first = newNode;
        }

        this.size++
        return this
    }

    shift() {
        if (!this.size) return null
        let removedNode = this.first;
        if (this.size === 1) {
            // this.first = null;
            this.last = null;
        }
        this.first = this.first.next;
        // removedNode.next = null;
        this.size--
        return removedNode.val
    }
}

const stack = new Stack()

stack.unshift(1)
stack.unshift(2)
stack.unshift(3)
console.log(stack.shift())
console.log(stack.shift())
console.log(stack.shift())
console.log(stack)

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
queue.push(12)
queue.push(13)
console.log(queue);
queue.shift();
console.log(queue);