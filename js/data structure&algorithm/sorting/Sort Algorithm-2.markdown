# 排序演算法筆記-2 (Merge, Quick , Radix)

* 關於數字排序的演算有許多種，但因為方法不同，其時間複雜度可以從O(n^2) to O(nlogn)。
* 一般而言，越有效率的algorithm，其內部的觀念都很tricky，想法上並不是很直覺性的，也因此需要更多時間去理解。
* 並沒有萬用的演算法，因為不同情況下(random排序, 近乎正排序, 近乎倒排序)，不同的演算法所展現的效率並不同，因此針對情況選擇適合的演算法才是最佳解。

## 1. Meger Sort

* 結合`merging`以及`sorting`兩種方法
* 將Array拆成無數個小array(length=2 or 1)，並將其重組成新的陣列
* Works by decomposing and array into smaller arrays of 0 or 1 elements, then building up a newly sorted array

#### 先定義merge method，該function接受兩個陣列，將其組合成一個已排序的陣列。

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
// const arr2 = [ 100];
// const arr1 = [1, 2,3,5,6];
// console.log(merge(arr1, arr2))  //[1,2,3,5,6,100]
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

// const arr = [4, 3, 6, 9, 2, 5, 7, 12, 42, 31, 20]
const arr = [24, 10, 76, 73]

console.log(mergeSort(arr))
```

## Merge Sort的 Big O notation

  Algorithm     | Best condition| Average  |   Worst  | Space complexity
  ----------    |:-------------:|:--------:|:--------:|:-----------:

    Merge Sort  |     O(nlogn)  | O(nlogn) | O(nlogn) |     O(n)

---

## 2. Quick Sort

#### 概念在陣列中先選定一數字做為pivot(下方例子以arr[0]作為pivot)，並將小於pivot的數字放在其左方，大於pivot的數字放置於其右方。

``` js
function pivot(arr, start = 0, end = arr.length - 1) {
    let index = start;
    let pivot = arr[start]
    for (let i = start + 1; i < end + 1; i++) {
        if (pivot > arr[i]) {
            // 先將比pivot小的數字放在其右邊
            index++;
            [arr[i], arr[index]] = [arr[index], arr[i]]
        }
        console.log(arr);
    }
    // 把pivot和最後一個抓到的數字對調，如此一來pivot左方都是比它小的數字
    [arr[start], arr[index]] = [arr[index], arr[start]]
    console.log(arr);
    return index
}

const arr = [15, 44, 38, 5, 47, 3, 36, 26, 27, 2, 46, 4, 19, 50, 48]
console.log(pivot(arr))
```

``` js
function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        let pivotIndex = pivot(arr, left, right)
        //left
        quickSort(arr, left, pivotIndex - 1)
        //right
        quickSort(arr, pivotIndex + 1, right)
    }

    return arr
}

const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48]
console.log(quickSort(arr))
```

## Big O of Merge Sort

#### 最糟的情況發生在針對 `近乎排列的Array` 上，pivot是選在第一個數字時發生; 倘若最初pivot的選擇是隨機的，則可避免將一開始將最小數字放入pivot進行運算

  Algorithm     | Best condition| Average  |   Worst  | Space complexity
  ----------    |:-------------:|:--------:|:--------:|:-----------:
  Quick Sort    |   O(nlogn)    | O(nlog n) | O(n^2) |     O(log n)

---

## 3. Radix Sort

``` js
// function getDigit(num, index) {
//     const str = String(num)
//     const digit = str.length;
//     return str[digit - index-1]
// }

// Another way

function getDigit(num, index) {
    return Math.floor(Math.abs(num) / Math.pow(10, index) % 10)
}

// console.log(getDigit(4321, 3))

// ===================================================================

// function digitCount(num) {
//     return String(num).length
// }

// Another way  
function digitCount(num) {
    if (num === 0) return 1
    return Math.floor(Math.log10(num)) + 1
}

// console.log(digitCount(4321))

// ===================================================================
function mostDigits(arr) {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        let countDigits = digitCount(arr[i])
        max = max < countDigits ? countDigits : max
    }
    return max
}

// console.log(mostDigits([21,311,42,1,32]))
// ===================================================================

// Anotehr way

function radixSort(arr) {
    const loopTime = mostDigits(arr);
    for (let k = 0; k < loopTime; k++) {
        let digitBuckets = Array.from({
            length: 10
        }, () => []);
        console.log(`k:${k}`)
        for (let i = 0; i < arr.length; i++) {
            // console.log(getDigit(arr[i], k))
            let digit = getDigit(arr[i], k);
            digitBuckets[digit].push(arr[i])
        }
        console.log(digitBuckets)
        arr = [].concat(...digitBuckets)
        console.log(arr)
    }
    return arr
}

console.log(radixSort([43221, 1, 10, 9680, 577, 9420, 7, 5622]))
// console.log(radixSort([20,300,4000,1,5,7]))
```

#### O(nk)中的n表示陣列的長度，k則表示陣列中最大數字的位數(digits)

   Algorithm  | Best condition| Average  |   Worst  | Space complexity
  ----------  |:-------------:|:--------:|:--------:|:-----------:
  Radix Sort  |     O(nk)     |  O(nk)   |   O(nk)  |     O(n+k)
