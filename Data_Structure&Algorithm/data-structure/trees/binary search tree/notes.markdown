# 資料結構筆記-樹(Tree)

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 之學習筆記，經自己理解歸納後以筆記形式記錄下來，部分程式碼非原創。

## 樹 (Tree) 的名詞介紹

樹 (Tree) 在與 List 不同，屬於非線性的一種資料結構，如下方示意圖。

* Root: 樹的頂端稱為 root。
* Child: A- D Nodes 都是 Root Node 的 Child 。
* Parent: Root Node 是 A-D Nodes 的 Parent 。
* Siblings: A-Node 與 D-Node 位置同屬同一階，互為兄弟 (Siblings)。
* Leaf: B-D Nodes 沒有 Child ，所以稱為 Leaf 。
* Edge:  Node 與 Node 之間的連結稱為 Edge 。

```js
//      Tree Data Structure
// 
//           Node(Root)
//           /     \
//       A-Node    D-Node
//       /     \
//    B-Node  C-Node
```

## 樹的常見應用

* HTML DOM
* JSON
* 網路的路由 (Network routing)
* Abstract syntax tree
* 人工智慧 (AI)
* 電腦系統內的資料夾操作系統

## 二元樹 (Binary tree) 以及二元搜尋樹 (Binary search tree)

樹的種類有許多種，一般常見的樹為二元樹 (每個 Parent Node 至多僅能含有兩個 Children Node，)，其中的二元搜尋樹在搜尋 (Searching) 方面因為速度較快的特性而有廣泛的應用，其結構特性為:

* 每個 Parent Node 至多僅能含有兩個 Children Node 。
* 左方 Child Node 的值比其 Parent Node 小
* 右方 Child Node 的值比其 Parent Node 大


## 透過JavaScript實現二元搜尋樹 (Binary Search Tree)

樹的每一個節點 (Node) 都含有值 (val) 以及其 Child Node (left 和right) 的性質，且基本的功能包括:

* 插入 (Insert) : 在樹 (Tree) 上新增新的節點。
* 尋找 (Find) : 尋找並回傳在樹 (Tree) 上的節點。

```js
class Node {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }
}
```

## Insert Method (迭代方法)

```js
class BinarySearchTree {
    ...
    insert(val) {
        let newNode = new Node(val);
        if (!this.root) {
            this.root = newNode;
            return this
        }
        let currentNode = this.root;
        while (true) {
            if (val === currentNode.val) return undefined
            if (val > currentNode.val) {
                if (!currentNode.right) {
                    currentNode.right = newNode;
                    return this
                }
                currentNode = currentNode.right;
            } else if (val < currentNode.val) {
                if (!currentNode.left) {
                    currentNode.left = newNode;
                    return this
                }
                currentNode = currentNode.left;
            }
        }
    }
}
```

## Insert Method (遞迴方法)

```js
class BinarySearchTree {
    ...
    insert(val) {
        let node = new Node(val)
        if (!this.root) {
            this.root = node;
            return this;
        }
        let currentNode = this.root;

        function help(currentNode) {
            if (currentNode.val === val) return undefined
            if (val > currentNode.val) {
                if (!currentNode.right) return currentNode.right = node;
                currentNode = currentNode.right;
            } else {
                if (!currentNode.left) return currentNode.left = node;
                currentNode = currentNode.left;
            }
            return help(currentNode)
        }
        help(currentNode);
        return this;
    }
```

## Find Method

```js
class BinarySearchTree {
    ...
    find(val) {
        let currentNode = this.root;
        if (!currentNode) return false
        let found = false
        while (currentNode && !found) {
            if (val > currentNode.val) {
                currentNode = currentNode.right;
            } else if (val < currentNode.val) {
                currentNode = currentNode.left;
            } else {
                found = true;
            }
        }
        if (!found) return false
        return currentNode
    }
}
```

## 二元搜尋樹 (Binary Search Tree) 的時間複雜度

插入 (insert) 以及尋找 (find) 這兩個函式所需要的時間複雜度為 O (log n) ，其中 log 是以 2 為底的對數，因此當資料數量變成兩倍時，插入及搜尋的時間所需要的迭代次數僅會增加一次。

* Insertion - O (log n)
* Searching - O (log n)

需要注意的是二元搜尋樹有個特例，也就是資料結構呈現線性的情況，如下方程式碼，這時候的新增以及尋找的時間複雜度就會變成 O (n) ，倘若資料變成長鏈狀而非樹狀時，就要考慮是否改成線性的資料結構會比較合適。

```js
Tree.insert(1)
Tree.insert(2)
Tree.insert(3)
Tree.insert(4)
Tree.insert(5)
//  ========此時的 Tree ======
//          Root(1)
//              \
//           right(2)
//                \
//             right(3)
//                  \
//                right(4)
//                    \
//                  right(5)
```

## 樹的遍歷 (Tree Traversal)

Tree Traversal 可以透過兩種方式達到，分別是 1. 廣度優先搜尋 (Breadth-first Search, BFS) 以及 2. 深度優先搜尋 (Depth-first Search, DFS)。

假設一開始的樹結構如下圖:

```js
//建構二元搜尋樹==========結構=========
Tree.insert(10);  //      10
Tree.insert(6)    //     /   \
Tree.insert(15)   //    6    15
Tree.insert(3)    //   / \     \
Tree.insert(8)    //  3   8    20
Tree.insert(20)   // =================
```

## 1. 廣度優先搜尋 (Breadth-first Search, BFS):  

 廣度優先搜尋 (BFS) 會從 Root 開始，針對其每一層的 Child Node 遍歷，遍歷完畢才會進行下一層 Child Node 的遍歷(先進行橫向遍歷，再進行縱向)。

```js
class BinarySearchTree {
    ...
    BFS() {
        // 透過Queue的概念處理遍歷的排程 (First In First Out)
        let data = [];
        let queue = [];
        let node = this.root;
        queue.push(node);
        while (queue.length) {
            node = queue.shift();
            data.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        return data;
    }
}
Tree.BFS(); //[10, 6, 15, 3, 8, 20]
```

`queue` 陣列 在 BFS 內的演變如下:  

```js

// step : 0 data=[] queue=[10]
// step : 1 data=[10] queue=[6,15]
// step : 2 data=[10,6] queue=[15,3,8]
// step : 3 data=[10,6,15] queue=[3,8,20]
// step : 4 data=[10,6,15,3] queue=[8,20]
// step : 5 data=[10,6,15,3,8] queue=[20]
// step : 6 data=[10,6,15,3,8,20] queue=[]
```

## 2. **深度優先搜尋 (Depth-first Search, DFS)** :  
 深度優先搜尋 (DFS) 則是以樹的縱向先進行遍歷，而後才是橫向;兩者的時間複雜度是一樣的，然而對於`結構較寬`的樹而言，廣度優先搜尋會消耗較多的記憶體，而深度優先搜尋則是在`結構較深`的樹會佔據較多的記憶體。

### 2-1 深度優先搜尋 (Depth-first Search, DFS) -前序遍歷 (PreOrder)


前序遍歷 (PreOrder) 函式所回傳的陣列，可以用來複製一模一樣的樹結構。

```js
class BinarySearchTree {
    ...
    DFSPreOrder() {
        let currentNode = this.root;
        let data = [];
        if (!this.root) return data;

        function help(currentNode) {
            data.push(currentNode.val);
            if (currentNode.left) help(currentNode.left)
            if (currentNode.right) help(currentNode.right)
        }
        help(currentNode);
        return data;
    }
}
Tree.DFSPreOrder(); //[10, 6, 3, 8, 15, 20]
```

### 2-2 深度優先搜尋 (Depth-first Search, DFS) -後序遍歷 (PostOrder)

```js
class BinarySearchTree {
    ...
    DFSPostOrder() {
        // let queue = [];
        let data = [];
        let currentNode = this.root;
        if (!this.root) return data;
        function help(currentNode) {
            if (currentNode.left) help(currentNode.left)
            if (currentNode.right) help(currentNode.right)
            data.push(currentNode.val);
        }
        help(currentNode);
        return data;
    }
}
Tree.DFSPostOrder(); //[3, 8, 6, 20, 15, 10]
```

### 2-3 深度優先搜尋 (Depth-first Search, DFS) -中序遍歷 (InOrder)

中序遍歷 (InOrder) 可以用來回傳已排列的資料。

```js
class BinarySearchTree {
    DFSInOrder() {
        let data = [];
        let currentNode = this.root;

        function help(currentNode) {
            if (currentNode.left) help(currentNode.left);
            data.push(currentNode.val);
            if (currentNode.right) help(currentNode.right);
        }
        help(currentNode);
        return data;
    }
}
Tree.DFSInOrder(); //[3, 6, 8, 10, 15, 20]
```
