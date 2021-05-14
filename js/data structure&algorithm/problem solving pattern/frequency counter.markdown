## Frequency Counter 手法

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

```js
validAnagram('fried','fired') //true
validAnagram('slient','listen') //true
validAnagram('four','ourd') //false
```

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
