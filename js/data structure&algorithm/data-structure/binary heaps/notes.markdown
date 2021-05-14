# Binary Heap

## What is a Binary Heap?

* Very similar to a binary search tree, but with some differnt rules!
* In a MaxBinaryHeap, parent nodes are always larger than child nodes. In a MinBinary Heap, parent ndoes are always smaleer than child nodes.

``` js
// =====Max Binary Heap========
//         41
//        /  \
//      39    33
//     / \    /
//    18 27  12 

// =====Min Binary Heap========
//          1
//        /   \
//       2      3
//      / \    / \
//     17 19  36  7

// ======Not Binary Heap=====
//          33
//         /  \
//       18    41
//      / \   /
//     12 27 39
```

## Max Binary Heap

* Each parent has at most two child nodes
* The value of each parent node is always greater than its child nodes
* In a max Binary Heap the parent is greater than the children, but there are no guarantees between sibling nodes.
* A binary heap is as compact as possible. All the children of each node are as full as they can be and left children are filled out first. 

## Why do we need to know this

* Binarys heaps are used to implement `priority queues`, which are very commonly used data structures.
* They are also used quite a bit, with greaph traversal algorithms.

## What is Priority Queue?

#### A data structure where each element has a priority. Elements with higher priorities are served before lements with lower priorities

#### There are different way to implement priority queue

``` js
// A Naive Version
[3, 1, 2, 5, 4]
// Iterate over the entire thing to find th highest priority element
```


## Big O of BInary Heaps

* Insertion - O(log N)
* Removal - O(log N)
* Search - O(n)

## Recap
* Binary Heaps are very useful data structures for sorting, and implementing other data structures like priority queues.
* Binary Heaps are either MaxBinaryHeaps or MinBInaryHeaps with parents either being smaller or larger than their children.
* With just a little bit of math, we ca nrepresent heaps using arrays.