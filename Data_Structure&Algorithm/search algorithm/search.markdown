# 搜尋演算法總覽

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 之學習筆記，經自己理解歸納後以筆記形式記錄下來，部分程式碼非原創。

這篇筆記會介紹幾種常見的搜尋演算法，包括：線性搜尋、二分搜尋以及簡單的字串搜尋。，包括：線性搜尋、二分搜尋以及簡單的字串搜尋。

---

## 線性搜尋演算法（Linear Search）

* 適用於**任何類型的陣列**（不需要排序）。
* 一個個往下找，直到找到符合的項目。
* **時間複雜度：** O(N)

```js
function linearSearch(arr, num) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === num) return i;
    }
    return -1;
}

linearSearch([34, 21, 37, 98], 98); // 回傳 3
```

---

## 二分搜尋演算法（Binary Search）

* 陣列**必須是排序好的**。
* 每次都從中間切一半，決定往左或往右繼續找。
* **時間複雜度：** O(log N)

### 寫法 1：使用遞迴

```js
function binarySearch(arr, num) {
    let start = 0;
    let end = arr.length - 1;

    function helper(arr, num) {
        let middle = Math.floor((end + start) / 2);
        if (start > end) return null;
        if (num > arr[middle]) {
            start = middle + 1;
            return helper(arr, num);
        }
        if (num < arr[middle]) {
            end = middle - 1;
            return helper(arr, num);
        }
        if (num === arr[middle]) return middle;
    }

    return helper(arr, num);
}
```

### 寫法 2：使用 while 迴圈

```js
function binarySearch(arr, num) {
    let start = 0;
    let end = arr.length - 1;
    let middle = Math.floor((start + end) / 2);

    while (arr[middle] !== num && start <= end) {
        if (num < arr[middle]) end = middle - 1;
        else start = middle + 1;
        middle = Math.floor((start + end) / 2);
    }

    return arr[middle] === num ? middle : -1;
}
```

---

## Naive 字串搜尋演算法（Naive String Search）

* 找出一段目標字串在主字串中**出現幾次**。
* 透過兩層迴圈，暴力比對字元是否一致。
* **時間複雜度（最差）：** O(N \* M)，其中 N 是主字串長度，M 是目標字串長度。

```js
function naiveStringSearch(str, target) {
    let count = 0;
    for (let i = 0; i <= str.length - target.length; i++) {
        for (let j = 0; j < target.length; j++) {
            if (str[i + j] !== target[j]) break;
            if (j === target.length - 1) count++;
        }
    }
    return count;
}

naiveStringSearch('wowomgzomg', 'omg'); // 回傳 2
```

