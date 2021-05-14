## 線性搜尋演算法 (Linear search)

#### 時間複雜度(Time complexity)=> O(N)

``` js
function linearSearch(arr, num) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === num) return i
    }
    return -1
}
linearSearch([34, 21, 37, 98], 98) // 3
```

## 二分搜尋演算法 (Binary Search)

``` js
function binarySearch(arr, num) {
    let start = 0;
    let end = arr.length - 1;
    function helper(arr, num) {
        let middle = Math.floor((end + start) / 2);
        if (start > end) return null
        if (num > arr[middle]) {
            start = middle + 1;
            return helper(arr, num)
        }
        if (num < arr[middle]) {
            end = middle - 1;
            return helper(arr, num)
        }
        if (num === arr[middle]) return middle
    }

    return helper(arr, num);
}
```

``` js
function binarySearch(arr, num) {
    let start = 0;
    let end = arr.length - 1;
    let middle = Math.floor((start + end) / 2);
    while (arr[middle] !== num && start <= end) {
        if (num < arr[middle]) end = middle - 1
        else start = middle + 1
        middle = Math.floor((start + end) / 2)
    }
    console.log(start,end)
    return arr[middle] === num ? middle : -1
}
```
## Naive String Search

#### 尋找有多少次目標字串出現在主要字串當中

```js
function naiveStringSearch(str, target) {
    let count = 0;
    for (let i = 0; i <= str.length - target.length; i++) {
        for (let j = 0; j < target.length; j++) {
            if (str[i + j] !== target[j]) break
            if (j === target.length - 1) count++
        }
    }
    return count;

}
naiveStringSearch('wowomgzomg', 'omg')

```