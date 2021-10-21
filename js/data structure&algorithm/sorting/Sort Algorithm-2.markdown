# 排序演算法筆記-2 (Merge, Quick , Radix)

* 關於數字排序的演算有許多種，但因為方法不同，其時間複雜度可以從O(n^2)變成O(nlogn)，(這裡的log是以2為底的對數)
* 一般而言，越有效率的algorithm，其內部的觀念都很tricky，想法上並不是很直覺性的，也因此需要更多時間去理解。
* 並沒有萬用的演算法，因為不同情況下(random排序, 近乎正排序, 近乎倒排序)，不同的演算法所展現的效率並不同，因此針對不同情況而選擇適合演算法才是最佳解。

## 1. Meger Sort

* 結合`merging`以及`sorting`兩種方法
* 將Array拆成無數個小array(length=2 or 1)，並將其重組成新的陣列

先定義merge method，該function接受 `兩個各別已排序之陣列` ，將其合併成一個已排序的大陣列。

``` js
function merge(arr1, arr2) {
    const newArr = [];
    let index1 = 0;
    let index2 = 0;
    let loopTime = 0
    while (loopTime < (arr1.length + arr2.length)) {
        if (arr1[index1] >= arr2[index2] || !arr1[index1]) {
            newArr.push(arr2[index2]);
            index2++
            loopTime++
        } else if (arr2[index2] > arr1[index1] || !arr2[index2]) {
            newArr.push(arr1[index1]);
            index1++
            loopTime++
        }
    }
    return newArr
}
const arr1 = [3, 16, 25],
    arr2 = [1, 5, 20];
merge(arr1, arr2) // [1, 3, 5, 16, 20, 25]
```

``` js
function mergeSort(arr) {
    // 倘若陣列的長度在1以下，則回傳該陣列
    if (arr.length <= 1) return arr;
    //定義該陣列的middle index，並透過slice將陣列分為left&right 
    let midIndex = Math.floor(arr.length / 2)
    // 透過recursion方式將陣列不斷的分離剩下長度在1以下
    let left = mergeSort(arr.slice(0, midIndex));
    let right = mergeSort(arr.slice(midIndex));
    // 將所有長度於1以下的陣列透過merge結合，並排序
    return merge(left, right);
};

const arr = [4, 12, 9, 6, 5, 2, 1, 3]
mergeSort(arr)
```

``` js
//                               示意圖
// ==============透過遞迴函式將大陣列分成長度低於1的小陣列========
//                 [4, 12, 9, 6, 5, 2, 1, 3]               
//                   /                   \               LoopTime=1 
//          [4, 12, 9, 6]            [ 5, 2, 1, 3]       
//           /       \                  /       \        LoopTime=2
//       [4, 12]    [9, 6]           [5, 2]    [1, 3] 
//        /   \     /   \            /   \     /   \     LoopTime=3
//      [4]  [12] [9]  [6]          [5]  [2]  [1]  [3]
// ================Merge State(將各個小陣列合併成大陣列)=================
//              [4] [12] [9] [6] [5] [2] [1] [3]
//                \  /    \  /    \  /    \   /          
//               [4, 12] [6, 9]  [2, 5]   [1, 3]
//                   \    /          \     /
//                [4, 6, 9, 12]   [1, 2, 3, 5]
//                       \            /
//                 [1, 2, 3, 4, 5, 6, 9 ,12]    
```

## 1-2 Merge Sort的 Big O notation

由於Merge Sort是將一個陣列拆分成無數個長度為1的小陣列，此過程所需的次數為log(陣列總長)，其中的log為以2為底的對數，假如是長度為8的陣列，將其拆分成各個長度為1的小陣列所需次數為3次，再將所有小陣列組合成一個已排的大陣列所需的次數為8次(總長度)，因此對於一個長度為8的陣列而言，透過Merge Sort處理的時間複雜度為24次(8 X log8=24); 其時間複雜度相較於Bubble、Selection、Insertion的時間複雜度(O(n^2))，但犧牲的是空間複雜度提升至O(n)

  Algorithm     | Best condition| Average  |   Worst  | Space complexity
  ----------    |:-------------:|:--------:|:--------:|:-----------:

    Merge Sort  |     O(nlogn)  | O(nlogn) | O(nlogn) |     O(n)

---

## 2. Quick Sort

概念是在陣列中先選定一數字做為pivot(下方例子以arr[0]作為pivot)，並將小於pivot的數字放在其左方，大於pivot的數字放置於其右方。

``` js
// ====將input內的arr[0]定為pivot，並回傳最後pivot的Index====
function pivot(arr, start = 0, end = arr.length - 1) {
    let index = start;
    let pivot = arr[start]
    for (let i = start + 1; i < end + 1; i++) {
        // 先將比pivot小的數字放在其右邊
        if (pivot > arr[i]) {
            index++;
            [arr[i], arr[index]] = [arr[index], arr[i]];
        }
    }
    // 把pivot和最後一個抓到的數字對調，如此一來pivot左方都是比它小的數字
    [arr[start], arr[index]] = [arr[index], arr[start]]
    return index
}

// ========定義quickSort function，將pivot function納入========
function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        let pivotIndex = pivot(arr, left, right)
        quickSort(arr, left, pivotIndex - 1)//left
        quickSort(arr, pivotIndex + 1, right)//right
    }
    return arr
}
const arr = [7, 2, 9, 6, 13, 5]
quickSort(arr) // [1, 2, 3, 4, 5, 6, 9, 12]
```

``` js
//                          示意圖
//                    [7, 2, 9, 6, 13, 5]
//                            |
//                     pivot(arr,0,6)
//                            |
//                    [5, 2, 6, 7, 13, 9] pivotIndex:3 
//                      /             \ 
//  quickSort(arr,left=0,right=2)   quickSort(arr,left=4,right=5) 
//                    /                 \ 
//             [5, 2 ,6...]         [...13, 9]
//                  |                    |
//             pivot(arr,0,2)       pivot(arr,4,5)
//                  |                    |
//  pivotIndex:1 [2, 5, 6...]       [...9, 13] pivotIndex:5
//                  end                 end 
//  ====================================================
//              arr = [2, 5, 6, 7, 9, 13]
```

## 2-2 Quick Sort的Big O notation

一般情況下(隨機排列的陣列)，其實時間複雜度為O(nlogn)，但最糟的情況會發生在 `已近乎排列的陣列` 上，因為對於 `已近乎排列的陣列` 而言，arr[0]有極大機率是是陣列內最小的數字，又因為最初的pivot是選在arr[0]，因此有可能導致pivot function回傳的pivotIndex仍為0，也因此所需要的迭代次數就會增加，時間複雜度變為O(n^2)。

  Algorithm     | Best condition| Average  |   Worst  | Space complexity
  ----------    |:-------------:|:--------:|:--------:|:-----------:
  Quick Sort    |   O(nlogn)    | O(nlog n) | O(n^2) |     O(log n)

---

## 3. Radix Sort

Radix Sort(基數排序法)比較特別，屬於 `non-comparative`的排序演算法，針對每一位數來達到排序的目的，下方code中的getDigit function接收input(num &index)，並回傳該num在某位數(index)的值。

``` js
// ========回傳input中的num在特定位數(index)的值========
function getDigit(num, index) {
    return Math.floor(Math.abs(num) / Math.pow(10, index) % 10)
}
// ========定回傳input中的num有幾位數========
function digitCount(num) {
    if (num === 0) return 1
    return Math.floor(Math.log10(num)) + 1
}
// ========回傳input中的陣列(array)內的位數最大值========
function mostDigits(arr) {
    let max = -Infinity;
    for (let i = 0; i < arr.length; i++) {
        let countDigits = digitCount(arr[i]);
        max = Math.max(max, countDigits)
    }
    return max
}
// ========定義radixSort函式，將上面的函數組合起來========
function radixSort(arr) {
    const loopTime = mostDigits(arr); //loopTime=最多有機位數
    for (let k = 0; k < loopTime; k++) {
        // 建立一個array，內涵10個空array，分別代表數字0-9
        let digitBuckets = Array.from({
            length: 10
        }, () => []);
        for (let i = 0; i < arr.length; i++) {
        // 將a[i]內的k位數的值放入相對應的digitBuckets內
            let digit = getDigit(arr[i], k);
            digitBuckets[digit].push(arr[i])
        }
        arr = [].concat(...digitBuckets)
    }
    return arr
}

radixSort([43221, 1, 20, 322, 9420, 7, 99])
//[1, 7, 10, 577, 5622, 9420, 9680, 43221]
```
```js
//             示意圖
// 原arr=[43221, 1, 20, 322, 9420, 7, 99] 
//                  |  k=0
// [[20, 9420], [43221,1], [322], [], [], [], [], [7], [], [99]]
// [20, 9420, 43221, 1, 322, 7, 99](Concat之後的arr)
//                  |  k=1
// [[1, 7], [], [20, 9420, 43221, 322], [], [], [], [], [], [], [99]
// [1, 7, 20, 9420, 43221, 322, 99] (Concat之後的arr)
//                  |  k=2
// [[1, 7, 20, 99], [], [43221], [322], [9420], [], [], [], [], []]
// [1, 7, 20, 99, 43221, ,322, 9420] (Concat之後的arr)
//                  |  k=3
// [[1, 7, 20, 99, 322], [], [], [43221], [], [], [], [], [], [9420]]
// [1, 7, 20, 99, 322, 43221, 9420] (Concat之後的arr)
//                  |  k=4
//  [1, 7, 20, 99, 322, 9420], [], [], [], [43221], [], [], [], [], []]
//  1, 7, 20, 99, 322, 9420, 43221] (Concat之後的arr)
```

## 3-3 Radix Sort的Big O notation

O(nk)中的n表示陣列的長度，k則表示陣列中最大數字的位數(digits)，由於在任何情況下的時間複雜度皆相同(O(nk))。

   Algorithm  | Best condition| Average  |   Worst  | Space complexity
  ----------  |:-------------:|:--------:|:--------:|:-----------:
  Radix Sort  |     O(nk)     |  O(nk)   |   O(nk)  |     O(n+k)
