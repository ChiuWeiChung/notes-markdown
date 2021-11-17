# 資料結構筆記-二元堆積 (Binary heap)

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。


## 介紹


二元堆積 (Binary Heap) 的結構與二元搜尋樹 (Binary Search Tree) 非常相似，其中二元堆積又可以分成 1. **Max Binary Heap** 以及 2. **Min Binary Heap** ， Max Binary Heap 的 Parent Node 的值永遠比他的 Child Node 還大，反之， Min Binary Heap 的 Child Node 值永遠比他的 Parent Node 還大。

## 二元堆積 (Binary Heap) 的特性

* 每一個Parent至多只能有兩個 Child Node 。
* 對於 Max Heap 而言， Parent Node 的值永遠大於他的 Child Node。
* 對於 Min Heap 而言， Parent Node 的值永遠小於他的 Child Node。
* 新增資料時，會優先從 Left Node 開始，因此 Binary Heap 會傾向呈現較緻密的結構，而非線性、鬆散的結構。

```js
// ===== Max Binary Heap ========
//         41
//        /  \
//      39    33
//     / \    /
//    18 27  12 

// ===== Min Binary Heap ========
//          1
//        /   \
//       2      3
//      / \    / \
//     17 19  36  7

// ======不是 Binary Heap =====
//          33
//         /  \
//       18    41
//      / \   /
//     12 27 39
```

## 以 JavaScript 實現 Max Binary Heap

Binary Heap 可以透過 Array 的方式來模擬，假設某一個Node的index=N，則它兩個 Child 的 index 分別為 (2 N + 1) 以及 (2 N + 2) ，透過這樣的關係即可建構 Binary Heap 的資料結構。

```js
class MaxBinaryHeap {
    constructor() {
        this.values = []
    }
```

## 新增 (Insert) 及排序 (Bubble Up)

```js
class MaxBinaryHeap {
    insert(val) {
        let currentIndex = this.values.length;
        if (!currentIndex) return this.values.push(val);
        //先將資料放在陣列最後端
        this.values.push(val);
        //透過bubbleUp機制將資料提升至正確的位置
        this.bubbleUp(currentIndex);
        return this
    }

    bubbleUp(currentIndex) {
        // 倘若該資料在資料最頂部，停止遞迴
        if (currentIndex === 0) return
        // 確認該資料目前的Parent Index
        let swapIndex = currentIndex % 2 ? ((currentIndex - 1) / 2) : ((currentIndex - 2) / 2);
        if (this.values[swapIndex] < this.values[currentIndex]) {
            // 如果它的Parent比較小，則互相交換位置
            [this.values[swapIndex], this.values[currentIndex]] = [this.values[currentIndex], this.values[swapIndex]];
            // 交換後，再次呼叫遞迴函式，並將目前位置傳入
            this.bubbleUp(swapIndex);
        }
    }
}
```

## 刪除根節點 (Extract) 以及排序 (Bubble Down)

```js
class MaxBinaryHeap {
    extractMax() {
        let max = this.values[0];
        let currentIndex = this.values.length - 1
        if (currentIndex === 0) {
            this.values.pop();
            return max
        }
        if (currentIndex < 0) return undefined
        this.values[0] = this.values.pop();
        this.bubbleDown(0);
        return max
    }

    bubbleDown(currentIndex) {
        let leftIndex = currentIndex * 2 + 1;
        let rightIndex = currentIndex * 2 + 2;
        let leftElement = this.values[leftIndex];
        let rightElement = this.values[rightIndex];
        if (leftElement && rightElement) {
            let index = rightElement > leftElement ? rightIndex : leftIndex;
            if (this.values[index] > this.values[currentIndex]) {
                [this.values[index], this.values[currentIndex]] = [this.values[currentIndex], this.values[index]];
                this.bubbleDown(index);
            }
        } else if (leftElement && !rightElement) {
            if (leftElement > this.values[currentIndex]) {
                [this.values[leftIndex], this.values[currentIndex]] = [this.values[currentIndex], this.values[leftIndex]];
            }
        }
    }
}
```

## 二元堆積 (Binary Heap) 的應用層面

Binary Heap時常用來實現 1. 優先佇列 (Priority Queue) 以及 2. [圖遍歷(Graph Traversal Algorithm)](https://github.com/ChiuWeiChung/notes-markdown/blob/main/data%20structure%26algorithm/data-structure/graph/note.markdown) 的資料結構。其中的優先佇列 (Priority Queue) 是指資料內的每個元素都有優先值 (Priority) 的特性，因此可以透過優先值大小來決定哪一個元素要優先被處理，那些元素可以先擱置。

## 二元堆積 (Binary Heap) 的時間複雜度

* Insertion - O(log N)
* Remove Max/Remove Min - O(log N)
* Search - O(n)

Data Structure| Insertion|Removal Max/Min|Searching |
  ----------  |:--------:|:-------------:|:--------:|
  Binary Heap | O(log N) |  O(log N)     |   O(n)   |
