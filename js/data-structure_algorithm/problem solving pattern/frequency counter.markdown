## Frequency Counter
#### This pattern uses objects or sets to collect values/frequencies of values. This can often avoid the need for nested lops or O(N^2) operations with arrays/strings.


#### Write a function called same, which accepts two arrays. The function should return true if every value in the array has it's corresponding value squared inthe second array. The frequency of values must be the same.

#### Time Complexity => N^2
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

``` js
function same(arr1, arr2) {
    if (arr1.length !== arr2.length) return false
    const isSqrArr = arr1.map((el) => {
        const index = arr2.findIndex(item => {
            return item === el ** 2
        });
        if (index === -1) return false
        arr2.splice(index, 1)
        return true
    });
    return isSqrArr.includes(false) ? false : true
}
```

## Refactored

#### Time Complexity=> N

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

## Anagrams condition

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

#### Colt Steele 的方法，我的方法，Time complexity 為N

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
