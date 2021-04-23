# 排序法的筆記-1 (Bubble, Selection, Insertion)

#### 在這裡紀錄學習Data Structure& Algorithm的學習筆記，在這邊會記錄三種排序的演算法，分別為 1. Bubble Sort, 2. Selection Sort, 3. Insertion Sort.

## 1. Bubble sort

#### 將陣列內的數字，兩兩作比對，數字較小移到前面，反之則不動，持續進行，其時間複雜度在一般情況下為O(n^2)，但是若針對 `幾乎已排列完成` ，的數列而言，時間複雜度則是O(n)

``` js
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
const arr = [8, 1, 2, 3, 4, 5, 6, 7];
bubbleSort(arr);
```

## 1-2. 優化後的Bubble sort

#### 在bubbleSort內定義一個用來監控的變數 `noSwaps` ，假如最近的一次loop沒有進行陣列上的交換，則立即跳出loop，避免後續無意義的運算

``` js
function bubbleSort(arr) {
    var noSwawps;
    for (let i = arr.length; i > 0; i--) {
        // 先定義為true
        noSwaps = true
        for (let j = 0; j < i - 1; j++) {
            console.log(arr, arr[j], arr[j + 1])
            if (arr[j] > arr[j + 1]) {
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
                // 若有進行交換，則傳回false
                noSwaps = false
            }
        }
        // 倘若最近一次loop沒有進行交換(noSwaps = true)，則跳出迴圈
        if (noSwaps) break;
    }
    return arr
}
const arr = [8, 1, 2, 3, 4, 5, 6, 7];
bubbleSort(arr);
```

## 2. Selection Sort 

#### 該演算法的概念是透過每一步都將陣列內的最小值放到陣列的最前頭，最好以及最壞的情況下，它的時間複雜度皆為O(n^2)，

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
console.log(selectionSort(arr))
console.log(selectionSort([11, 3, 54, 23, 2, 4, 5, 1]))
```
