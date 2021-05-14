# 遞迴函式 (Recursion)

## 甚麼是遞回函式?

#### 在函式內部再次呼叫該函式的一個過程 ，且在Javascript中有利用到遞迴的例子有許多:

* (JSON.parse/JSON.stringify)
* document.getElementById and DOM traversal algorithms
* Object traversal
* Javascript的Call Stack (執行堆疊)

## Call Stack(執行堆疊, Execution Stack)

#### 在[Execution Stack筆記](/#javascript/knowJs3)有提到，屬於一種資料結構，被JavaScript執行的function都會依序被放置於Call Stack上，當該函式執行結束或是遇到return時，就會從Call Stack上移除，透過這樣的機制，可將同個函式在Call Stack上持續堆疊，就可以形成遞迴函式。

## 如何執行遞迴?

#### 下方的例子定義了一個 `countDown` 的函式，並在函式內部再執行一次 `countDown` ，並引入不同的input; 需要注意的是，為了避免函式永無止境的在Call Stack上堆疊(稱為Stack Overflow)而造成程式崩潰，需要在遞迴函式內定義Base Case，也就是該函式要在甚麼狀況、條件下結束(return)。

``` js
// 遞迴
function countDown(num) {
    if (num <= 0) { //此為Base Case，明確定義input在<=0時結束該函式
        console.log('All done!');
        return;
    }
    console.log(num);
    num--;
    countDown(num);
}
```

#### 透過迭代方式(for loop)也可以達到遞迴的效果，因此在不同情況或是使用者習慣下，選擇要使用迭代或是遞迴。

``` js
// 迭代
function countDown(num) {
    for (let i = num; i > 0; i--) {
        console.log(i)
    }
    console.log('All done!')
}
```

## Helper method recursion

#### 也可以在函式內另外定義一個helper method，該helper method才會是在Call Stack上持續堆疊直到遇見Base Case才結束的遞迴函式; 下方範例定義了一個函式，接收一個Array，並回傳Array內只含奇數的部分。

``` js
let resullt = [];

function collectOddValues(arr) {
    let result = [];
    function helper(helperInput) {
        if (helperInput.length === 0) return
        if (helperInput[0] % 2 !== 0) result.push(helperInput[0])
        helper(helperInput.slice(1))
    }
    helper(arr);
    return result
}
collectOddValues([1, 2, 3, 4, 5]) //[1,3,5]
```

#### 也可以寫成沒有Helper method的遞迴函式

``` js
function collectOddValues(arr) {
    let newArr = [];
    if (arr.length === 0) return newArr;
    if (arr[0] % 2 !== 0) newArr.push(arr[0])
    newArr = newArr.concat(collectOddValues(arr.slice(1)));
    return newArr
}
collectOddValues([1, 2, 3, 4, 5])//[1,3,5]
```

<!-- ## Second recursive function

#### Call stack illustration

``` js
function sumRange(num) {
    if (num === 1) return 1;
    return num + sumRange(num - 1);
}
sumRange(3) // 6
```

``` js
// iterative
function factorial(num) {
    let total = 1;
    for (i = num; i > 1; i--) {
        total *= i
    }
    return total;
}
```

``` js
// recursive 
function factorial(num) {

    if (num == 1) return num;
    return num * factorial(num - 1)

}
``` -->
