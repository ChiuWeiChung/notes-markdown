## Challenges

#### Write a function called sameFrequency. Given two positive integers, find out if the two numbers have the same frequenecy of digits.

``` js
function sameFrequency(num1, num2) {
    // good luck. Add any arguments you deem necessary.
    const str1 = num1.toString()
    const str2 = num2.toString()
    if (num1.length !== num2.length) return false
    const obj1 = {}
    const obj2 = {}
    for (let item of str1) {
        obj1[item] = (obj1[item] || 0) + 1
    }
    for (let item of str2) {
        obj2[item] = (obj2[item] || 0) + 1
    }
    for (let key in obj1) {
        if (!obj2[key]) return false
        if (obj1[key] !== obj2[key]) return false
    }
    return true
}
sameFrequency(182, 281) //true
sameFrequency(32, 14) //false
sameFrequency(3589578, 5879385) //true
sameFrequency(22, 222) //false
```

## Frequency Counter/Multiple Pointers

#### Implement a function called areThereDuplicates which accepts a variable number of arguments, and checks whether there are any duplicates among the arguments passed in. You can solve this using the frequency counter pattern OR the multiple pointers pattern.

``` js
function areThereDuplicates() {
    const arr = [...arguments]
    const obj = {}
    for (let item of arr) {
        obj[item] = (obj[item] || 0) + 1
        if (obj[item] > 1) return true
    }
    return false
}

function areThereDuplicates() {
    const arr = [...arguments]
    arr.sort((a, b) => a - b)
    console.log(arr)
    for (let i = 0; i < arr.length; i++) {
        if (i + 1 === arr.length) return false
        if (arr[i] === arr[i + 1]) return true
    }
    return false
}
areThereDuplicates(1,2,3) //false
areThereDuplicates(1,2,2) //true
areThereDuplicates('a','b','c','a') //true
```

## Multiple Pointers - averagePair

#### Write a function called averagePair. Given a sorted array of integers and a target average, determine if there is a pair of values in the array where the average of the pair equals the target average. There may be more than one pair that matches the average target.

``` js
function averagePair(arr, avg) {
    const ans = avg * 2
    let left = 0;
    let right = arr.length - 1
    while (left < right) {
        const sum = arr[left] + arr[right];
        if (sum === ans) {
            return true
        } else if (sum < ans) {
            left++
        } else {
            right--
        }
    }
    return false
}

console.log(averagePair([1, 2, 3], 2.5)) // true
console.log(averagePair([1, 3, 3, 5, 6, 7, 10, 12, 19], 8)) // true
console.log(averagePair([-1, 0, 3, 4, 5, 6], 4.1)) //false
console.log(averagePair([], 4)) //false
```

## Multiple Pointers - isSubsequence

#### Write a function called isSubsequence which takes in two strings and checks whether the characters in the first string form a subsequence of the characters in the second string. In other words, the function should check whether the characters in the first string appear somewhere in the second string, without their order changing.

``` js
function isSubsequence(str1, str2) {
    if (!str1) return true
    if (str1.length > str2.length) return false
    let index = 0

    for (var i = 0; i < str2.length; i++) {
        if (str1[index] === str2[i]) index += 1

        if (index === str1.length) return true
    }
    return false
}

console.log(isSubsequence('hello', 'hello world')) //true
console.log(isSubsequence('sing', 'stedislnsg')) //true
console.log(isSubsequence('abc', 'abracadabra')) //true
console.log(isSubsequence('abc', 'acb')) //false (order matter)
```

## Sliding Window - maxSubarraySum

#### Given an array of integers and a number, write a function called maxSubarraySum, which finds the maximum sum of a subarray with thelength of the number passed to the function. Note that a subarray must consist of consecutive elements from the original array. In the first example below, [100, 200, 300] is a subarray of the original array, but [100, 300] is not.

``` js
function maxSubarraySum(arr, num) {
    if (arr.length < num) return null
    let maxSum = 0
    let tempSum = 0
    for (let i = 0; i < num; i++) {
        maxSum += arr[i]
    }
    tempSum = maxSum
    for (let i = 1; i < arr.length - num + 1; i++) {
        tempSum = tempSum - arr[i - 1] + arr[i + num - 1];
        if (tempSum > maxSum) {
            maxSum = tempSum
        }
    }
    return (maxSum)
}

console.log(maxSubarraySum([100, 200, 300, 400], 2)) //700
console.log(maxSubarraySum([1, 4, 2, 10, 23, 3, 1, 0, 20], 4)) //39
console.log(maxSubarraySum([-3, 4, 0, -2, 6, -1], 2)) //5
console.log(maxSubarraySum([3, -2, 7, -4, 1, -1, 4, -2, 1], 2)) //5
console.log(maxSubarraySum([2, 3], 3)) //null
```

## Sliding Window - minSubArrayLen

#### Write a function called minSubArrayLen which accepts two parameters - an array of positive integers and a positive integer. This function should return the minimal length of a contiguous subarray of which the sum is greater than or equal to the integer passed to the function. If there isn't one, return 0 instead.

``` js
function minSubArrayLen(arr, num) {
    let total = 0;
    let start = 0;
    let end = 0;
    let minLen = Infinity;
    while (start < arr.length) {
        if (total < num && end < arr.length) {
            total += arr[end];
            end++;
        } else if (total >= num) {
            minLen = Math.min(minLen, end - start);
            total -= arr[start];
            start++
        } else {
            break;
        }
    }
    return minLen === Infinity ? 0 : minLen;
}

console.log(minSubArrayLen([2, 3, 1, 2, 4, 3], 7)) //2
console.log(minSubArrayLen([2, 1, 6, 5, 4], 9)) //2
console.log(minSubArrayLen([3, 1, 7, 11, 2, 9, 8, 21, 62, 33, 19], 52)) //1
console.log(minSubArrayLen([1, 4, 16, 22, 5, 7, 8, 9, 10], 39)) //3
console.log(minSubArrayLen([1, 4, 16, 22, 5, 7, 8, 9, 10], 55)) //5
console.log(minSubArrayLen([4, 3, 3, 8, 1, 2, 3], 11)) //2
console.log(minSubArrayLen([1, 4, 16, 22, 5, 7, 8, 9, 10], 95)) //0
```

## Sliding Window - findLongestSubstring

#### Write a function called findLongestSubstring, which accepts a string and returns the length of the longest substring with all distinct characters.

``` js
function findLongestSubstring(str) {
    let start = 0;
    let longest = 0;
    let obj = {};
    for (let i = 0; i < str.length; i++) {
        if (obj[str[i]]) {
            start = Math.max(start, obj[str[i]]);
        }
        longest = Math.max(longest, i - start + 1)
        obj[str[i]] = i + 1
    }
    return longest
}

console.log(findLongestSubstring('')); //0
console.log(findLongestSubstring('rithmschool')) //7
console.log(findLongestSubstring('thisisawesome')) //6
console.log(findLongestSubstring('thecatinthehat')) //7
console.log(findLongestSubstring('bbbbbb')) //1
console.log(findLongestSubstring('longestsubstring')) //8
console.log(findLongestSubstring('thisishowwedoit')) //6
```
