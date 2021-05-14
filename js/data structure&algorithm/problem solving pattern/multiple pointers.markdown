## Multiple pointers手法:

## Example 1:

#### 在一個已排序好的陣列中，找出一對最先出現且和為0的數字。並回傳該組數字，若無符合則回傳undefined。

``` js
sumZero([-3, -2, -1, 0, 1, 2, 3]) //[-3,3]
sumZero([-2, 0, 1, 3]) // undefined
sumZero([1, 2, 3]) // undefined
```

#### 較粗糙的解法，時間複雜度為O(n^2)

``` js
function sumZero(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] ===0 ) {
                return [arr[i], arr[j]]
            }
        }
    }
}
```

#### 優化後的解法，時間複雜度為O(n)

``` js
function sumZero(arr) {
    let left = 0
    let right = arr.length - 1
    while (left < right) {
        if (arr[left] + arr[right] === 0) {
            return [arr[left], arr[right]]
        } else if (arr[left] + arr[right] > 0) {
            right--
        } else {
            left++
        }
    }
}
```

****
## Example 2:
#### 回傳在一個已排列的陣列中，有多少個unique values


```js
countUniqueValues([1,2,3,4,4,5,6,6]) // 6
countUniqueValues([1,1,1]) // 1
countUniqueValues([1,2,3,4,5]) // 5
```


``` js
function countUniqueValues(arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== arr[i + 1]) {
            count++
        }
    }
    return count
}
```

