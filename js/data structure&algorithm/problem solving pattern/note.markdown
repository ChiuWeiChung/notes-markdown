# 一些資料處理手法的筆記(Multiple Pointers, Frequency Counter, Sliding Window)

## 1.Multiple pointers手法:

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
---

## 2. Frequency Counter 手法

#### 該方法透過loop，將陣列內的每一個值傳入物件作為其中一個property。用以避免出現O(n^2)

## Example 1

#### 定義一個函式，其接收兩個陣列，倘若其中一陣列內的值的平方可以對應另一陣列的值，且值的出現次數相同，則回傳true，若不然，則回傳false

#### 較粗糙的手法，Time Complexity => N^2

``` js
same([1, 4, 9], [1, 2, 3]); //true
same([16, 25, 36], [4, 5, 6]) //true
same([4, 1, 49], [2, 1) //false
```

``` js
function same(arr1, arr2) {
    if (arr1.length !== arr2.length) return false
    for (let i = 0; i < arr1.length; i++) {
        let correctIndex = arr2.indexOf(arr1[i] ** 2);
        if (correctIndex === -1) {
            return false
        }
        arr2.splice(correctIndex, 1)
    }
    return true
}
```

#### 優化後的函式，Time Complexity=> N

``` js
function same(arr1, arr2) {
    if (arr1.length !== arr2.length) return false
    let counter1 = {}
    let counter2 = {}
    for (let val of arr1) {
        counter1[val] = (counter1[val] || 0) + 1
    }
    for (let val of arr2) {
        counter2[val] = (counter2[val] || 0) + 1
    }
    for (let key in counter1) {
        if (!(key ** 2 in counter2)) {
            return false
        }
        if (counter2[key ** 2] !== counter1[key]) {
            return false
        }
    }
    return true

}
```

## Example 2

## Anagrams condition(易位構詞遊戲)，定義一個函式，其接收兩個string，確認兩個string是否互為anagrams。

#### 我的方法，Time complexity 為N

``` js
function validAnagram(str1, str2) {
    if (str1.length !== str2.length) return false
    let obj1 = {}
    let obj2 = {}
    for (item of str1) {
        obj1[item] = (obj1[item] || 0) + 1
    }
    for (item of str2) {
        obj2[item] = (obj2[item] || 0) + 1
    }
    for (key in obj1) {
        if (!obj2[key]) return false
        if (obj1[key] !== obj2[key]) return false
    }
    return true

}
```

#### 其他方法，Time complexity 為N

``` js
function validAnagram(str1, str2) {
    if (str1.length !== str2.length) return false
    let letter = {}
    for (el of str1) {
        letter[el] ? letter[el]++ : letter[el] = 1
    }

    for (el of str2) {
        if (!letter[el]) return false
        letter[el]--
        // 當letter[el]的值為0時若for loop還沒結束，則代表兩字串不同
    }
    return true

}
```
```js
validAnagram('fried','fired') //true
validAnagram('slient','listen') //true
validAnagram('four','ourd') //false
```

---
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
