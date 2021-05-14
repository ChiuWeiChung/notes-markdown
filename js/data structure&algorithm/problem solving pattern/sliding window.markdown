## Sliding Window


#### 此手法透過建立一個window(可以是array, index)，透過不同情況下來修改window，用以追蹤subset data。

## Example 1 

#### 定義一個函式，其接收一陣列以及數字(arr, n)，該函式會回傳陣列內n個數字總和的最大值。

#### Navie way, Time complexity =>  N^2


```js
maxSubarraySum([10,2,11,3,3],2) // 14
maxSubarraySum([1,21,5,7,3],3) // 33
maxSubarraySum([1,3,5,7,9,31,2,45,31],3) // 78
```

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
