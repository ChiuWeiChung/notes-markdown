## What is Stack

* LIFO data structure: The last element added to the stack will be the first element removed from the stack

* example: Execution context in callstack
* Where stacks are use: 1. Managing function invocations 2. Undo/Redo 3. Routing(the history object) is treated like a stack!

``` js
let stack = [];
// push and pop is better way because it doesn't require reindexing the entire array.
stack.push()
stack.push()
stack.push()
stack.pop()

// 
stack.unshift()
stack.unshift()
stack.unshift()
stack.shift() ㄤ
```

## What is a Queue

* A FIFO data structure!
* Waiting in line
* Where to queues are used: 1. backgroun tasks, 2. uploading resources 3. Printing/Task processing

``` js
let q = [];

q.push();
q.push();
q.push();
q.shift();

//
q.unshift();
q.unshift();
q.unshift();
q.pop();
```
