## Sliding Window

#### This pattern involves creating a window which can either be an array or number from one position to another. Depending on a ceratin condition, the window either increases or closes(and a new window is created). Very useful for keeping track of a subset of data in an array/string etc.

#### Navie way, Time complexity =>  N^2

``` js
function maxSubarraySum(arr, num) {
    if (num > arr.length) return null
    var max = -Infinity
    for (let i = 0; i < arr.length - num + 1; i++) {
        let temp = 0;
        for (let j = 0; j < num; j++) {
            temp += arr[i + j]
        }
        if (temp > max) {
            max = temp;
        }
    }
    return max;
}
```

#### Refactored, Time complexity => N
``` js
function maxSubarraySum(arr, num) {
    let maxSum = 0
    let tempSum = 0
    if (arr.length < num) return null
    for (let i = 0; i < num; i++) {
        maxSum += arr[i]
    }
    tempSum = maxSum;
    for (let i = num; i < arr.length; i++) {
        tempSum = tempSum - arr[i - num] + arr[i]
        maxSum = maxSum > tempSum ? maxSum : tempSum
    }
    return maxSum
}
```


