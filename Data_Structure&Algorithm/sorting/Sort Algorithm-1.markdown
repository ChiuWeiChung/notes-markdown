# 排序法演算法筆記-1 (Bubble, Selection, Insertion)

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 之學習筆記，經自己理解歸納後以筆記形式記錄下來，部分程式碼非原創。


在這裡紀錄學習 Data Structure & Algorithm 的學習筆記，在這邊會記錄三種排序的演算法，分別為 1. Bubble Sort , 2. Selection Sort , 3. Insertion Sort 。

## 1. Bubble sort

將陣列內的數字，兩兩作比對，數字較小移到前面，反之則不動，持續進行，時間複雜度在一般情況下為 O(n^2) ，但是若針對 `幾乎已排列完成` 的數列而言，時間複雜度則是 O(n) 。

``` js
const arr = [8, 1, 2, 3, 4, 5, 6, 7];

function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
            }
        }
    }
    return arr
}
bubbleSort(arr);
```

## 1-2 優化後的Bubble sort

在 Bubble Sort 內定義一個用來監控的變數 `noSwaps` ，假如最近的一次 loop 沒有進行陣列上的交換，則立即跳出 loop ，避免後續無意義的運算。

``` js
const arr = [8, 1, 2, 3, 4, 5, 6, 7];

function bubbleSort(arr) {
    var noSwawps;
    for (let i = arr.length; i > 0; i--) {
        noSwaps = true // 先定義為 true 
        for (let j = 0; j < i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
                noSwaps = false // 若有進行交換，則傳回 false 
            }
        }
        // 倘若最近一次 loop 沒有進行交換 (noSwaps = true) ，則跳出迴圈
        if (noSwaps) break;
    }
    return arr
}
bubbleSort(arr);
```

## 2. Selection Sort 

該演算法的概念是透過每一步都將陣列內的最小值放到陣列的最前頭，最好以及最壞的情況下，它的時間複雜度皆為 O(n^2) 。

``` js
function selectionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[minIndex] > arr[j]) {
                minIndex = j;
            }
        }
        if (i !== minIndex) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
        }
    }
    return arr
}

const arr = [44, 5, 38, 19, 47, 15]
selectionSort(arr)
```

## 3. Insertion Sort

概念是擇一數字放置於比它大的左邊，比它小的右邊，時間複雜度是 O(n^2) ，但是若針對 `幾乎已排列完成` 的數列而言，時間複雜度則是 O(n) 。

``` js
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let tempIndex = i;
        for (let j = i - 1; j >= 0; j--) {
            if (arr[j] > arr[tempIndex]) {
                [arr[tempIndex], arr[j]] = [arr[j], arr[tempIndex]];
                tempIndex = j;
            }
        }
    }
    return arr;
}
const arr = [2, 1, 9, 7, 6, 4];
insertionSort(arr)
```

也可以寫成

``` js
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let currentVal = arr[i];
        for (var j = i - 1; j >= 0 && arr[j] > currentVal; j--) {
            arr[j + 1] = arr[j]
        }
        arr[j + 1] = currentVal
    }
    return arr;
}
const arr = [2, 1, 9, 7, 6, 4];
insertionSort(arr)
```

```js       
// ==========Insertion Sort==========
// arr = [2, 1, 9, 7, 6, 4];  original
// arr = [1, 2, 9, 7, 6, 4];  i = 1
// arr = [1, 2, 9, 7, 6, 4];  i = 2
// arr = [1, 2, 7, 9, 6, 4];  i = 3
// arr = [1, 2, 6, 7, 9, 4];  i = 4
// arr = [1, 2, 4, 6, 7, 9];  i = 5
```

## 比較上述三種演算法的 Big O Time Complexity

  Algorithm     | Best condition| Average  |   Worst  | Space complexity
  ----------    |:-------------:|:--------:|:--------:|:-----------:
  Bubble Sort   |     O(n)      |   O(n^2) |   O(n^2) |     O(1)
  Insertion Sort|     O(n)      |   O(n^2) |   O(n^2) |     O(1)
  Selection Sort|     O(n^2)    |   O(n^2) |   O(n^2) |     O(1)

基本上 Bubble , Selection , Insertion 三種方法的時間複雜度在一般的情況下(隨機排列的數字)，都是一樣的 (O(n^2)) ，若要將其降至 O(n^2) 以下，就需要靠較複雜的演算法，相關比較記錄在[排序法演算法筆記-2](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/data%20structure%26algorithm/sorting/Sort%20Algorithm-2.markdown)。

