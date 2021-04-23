## Multiple pointers:

#### Write a function called sumZero which accepts a sorted array of integers. the function should ifnd the first pair where the sum is 0. Return an array that includes both values that sum to zero or undefined if a pair does not exist.

``` js
sumZero([-3, -2, -1, 0, 1, 2, 3]) //[-3,3]
sumZero([-2, 0, 1, 3]) // undefined
sumZero([1, 2, 3]) // undefined
```

#### naive way

``` js
function sumZero(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === ) {
                return [arr[i], arr[j]]
            }
        }
    }
}
```

#### refactored 
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

## countUnique Values

#### Implement a function called countUniqueValues, which accepts a sorted array, and counts the unique values in the array, There can be negative numbers in the array, but it will always be sorted.

``` js
function countUniqueValues(arr) {
    const obj = {};

    for (item of arr) {
        obj[item] ? obj[item]++ : obj[item] = 1
    }

    return Object.keys(obj).length
}
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

## Colt Steele 方法

``` js
function countUniqueValues(arr) {
    let i = 0
    for (let j = 1; j < arr.length; j++) {
        if (arr[i] != arr[j]) {
            i++;
            arr[i] = arr[j]
        }
    }
    return i+1
}
```

