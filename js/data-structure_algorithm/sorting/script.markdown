## Javascript Sort Method

``` js
['hi', 'this', 'are', 'two', 'apple'].sort()
//["apple", "are", "hi", "this", "two"]

[1, 5, 8, 11, 4, 2, 21].sort()
// [1, 11, 2, 21, 4, 5, 8]
```

## Bubble Sort 

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
```js
// or 
function bubbleSort(arr) {
    for (let i = arr.length; i > 0; i--) {
        for (let j = 0; j < i - 1; j++) {
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

## Optimized Bubble Sort

``` js
function bubbleSort(arr) {
    var noSwawps;

    for (let i = arr.length; i > 0; i--) {
        noSwaps = true
        for (let j = 0; j < i - 1; j++) {
            console.log(arr, arr[j], arr[j + 1])
            if (arr[j] > arr[j + 1]) {
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
                noSwaps = false
            }
        }
        if (noSwaps) break;
    }
    return arr
}
const arr = [8, 1, 2, 3, 4, 5, 6, 7];
bubbleSort(arr);
```


## Big O Complexity

#### O(n^2), best condition(nearly sorted)=>O(n)


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