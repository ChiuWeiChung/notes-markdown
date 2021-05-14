// class MaxBinaryHeap {
//     constructor() {
//         this.values = [];
//     }

//     insert(val) {
//         let currentIndex = this.values.length;
//         if (!currentIndex) return this.values.push(val);
//         this.values.push(val);

//         this.bubbleUp(currentIndex);
//     }

//     bubbleUp(index) {
//         if (index === 0) return
//         let swapIndex = index % 2 ? ((index - 1) / 2) : ((index - 2) / 2);
//         if (this.values[index] >= this.values[swapIndex]) {
//             [this.values[index], this.values[swapIndex]] = [this.values[swapIndex], this.values[index]];
//             this.bubbleUp(swapIndex);
//         }
//     }


//     extractMax() {
//         let index = this.values.length - 1;
//         let max = this.values[0];
//         if (index === 0) {
//             this.values.pop();
//             return this.values;
//         }
//         if (index < 0) return undefined;
//         this.values[0] = this.values.pop()
//         this.bubbleDown(0)
//         return max;
//     }

//     bubbleDown(index) {
//         let childIndex = index * 2;
//         let leftIndex = childIndex + 1;
//         let rightIndex = childIndex + 2;
//         let leftChild = this.values[leftIndex];
//         let rightChild = this.values[rightIndex];

//         if (leftChild !== undefined && rightChild !== undefined) {
//             let nextIndex = this.values[leftIndex] > this.values[rightIndex] ? leftIndex : rightIndex;
//             if (this.values[index] < this.values[nextIndex]) {
//                 [this.values[index], this.values[nextIndex]] = [this.values[nextIndex], this.values[index]]
//                 this.bubbleDown(nextIndex);
//             }
//         } else if (rightChild === undefined && leftChild !== undefined) {
//             if (this.values[index] < leftChild) {
//                 [this.values[index], this.values[leftIndex]] = [this.values[leftIndex], this.values[index]]
//             }
//         }
//     }
// }


// const Heap = new MaxBinaryHeap();
// Heap.insert(37)
// Heap.insert(26)
// Heap.insert(1)
// Heap.insert(19)
// Heap.insert(49)
// Heap.insert(27)
// Heap.insert(2)
// Heap.insert(31)
// Heap.insert(19)
// Heap.insert(7)
// Heap.extractMax();
// console.log(Heap.values);



//         55
//      /       \
//     45          41
//     /  \       /  \  
//   39    27    12  33
//  /  \
// 1    18      
// =====================
//         45
//      /       \
//     39         41
//     /  \       /  \  
//   18    27    12  33
//  /  
// 1       
// =====================
//         41
//      /       \
//     39         33
//     /  \       /  \  
//   18    27    12  1
// =====================
//         39
//      /       \
//     27        33
//     /  \       /  
//   18    1    12  
// =====================
//         33
//      /       \
//     27        12
//     /  \      
//   18    1      
// =========Another case============
//         45
//      /       \
//     27        35
//     /  \     /   \
//   18    1   33    32 
// =========Another case============
//         35
//      /       \
//     27        33
//     /  \     /   
//   18    1   32    

// ================================Priority Queue====================

class Node {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority
    }
}


class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(val, priority) {
        let newNode = new Node(val, priority);
        let currentIndex = this.values.length;
        if (!currentIndex) return this.values.push(newNode);
        this.values.push(newNode);
        this.bubbleUp(currentIndex);
    }

    bubbleUp(index) {
        if (index === 0) return
        let parentIndex = index % 2 ? ((index - 1) / 2) : ((index - 2) / 2);
        if (this.values[parentIndex].priority >= this.values[index].priority) {
            [this.values[parentIndex], this.values[index]] = [this.values[index], this.values[parentIndex]];
            this.bubbleUp(parentIndex);
        }
    }


    dequeue() {
        let index = this.values.length - 1;
        let min = this.values[0];
        if (index === 0) {
            this.values.pop();
            return this.values;
        }
        if (index < 0) return undefined;
        this.values[0] = this.values.pop()
        this.bubbleDown(0)
        return min;
    }

    bubbleDown(index) {
        let childIndex = index * 2;
        let leftIndex = childIndex + 1;
        let rightIndex = childIndex + 2;
        let leftChild = this.values[leftIndex];
        let rightChild = this.values[rightIndex];

        if (leftChild !== undefined && rightChild !== undefined) {
            let nextIndex = this.values[leftIndex].priority < this.values[rightIndex].priority ? leftIndex : rightIndex;
            if (this.values[index].priority > this.values[nextIndex].priority) {
                [this.values[index], this.values[nextIndex]] = [this.values[nextIndex], this.values[index]]
                this.bubbleDown(nextIndex);
            }
        } else if (rightChild === undefined && leftChild !== undefined) {
            if (this.values[index].priority > leftChild.priority) {
                [this.values[index], this.values[leftIndex]] = [this.values[leftIndex], this.values[index]]
            }
        }
    }
}


const Queue = new PriorityQueue();
Queue.enqueue('common cold', 5);
Queue.enqueue('gunshot wound', 1);
Queue.enqueue('high fever', 4);
Queue.enqueue('broken arm', 2);
Queue.enqueue('glass in foot', 3);
console.log(Queue.values)
Queue.dequeue();
console.log(Queue.values)

