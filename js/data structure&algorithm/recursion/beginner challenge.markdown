## 遞迴初級挑戰

定義一個function，第一個argument為底數，第二個argument為指數，該函數執行後須回傳該指數的值。

``` js
function power(base, exp) {
    if (exp === 0) return 1
    return base * power(base, exp - 1)
}
power(2, 0) // 1
power(2, 2) // 4
power(2, 4) // 16
```

定義一個function，並接收一數字，函數執行後回傳該數字的階乘值

``` js
function factorial(num) {
    if (num === 0 || num === 1) {
        return 1
    }
    return num * factorial(num - 1)
}
factorial(3) // 6
factorial(2) // 2
factorial(5) // 120
```

定義一個function，並接收一數字陣列，函數執行須回傳該陣列內數字的乘積

``` js
function productOfArray(arr) {
    if (arr.length === 1) return arr[0]
    return arr[0] * productOfArray(arr.slice(1))
}

productOfArray([1, 2, 3]) //6
productOfArray([3, 4, 5]) //60
```

定義一個function，並接收一數字，函數執行須回傳0至該數字的總和

``` js
function recursiveRange(num) {
    if (num === 0) return num
    return num + recursiveRange(num - 1)
}

recursiveRange()
```

定義一個function，函數執行須回傳費波那契數 (Fibonacci number: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...) 

``` js
function fib(step) {
    let oldValue = 0;
    let plusValue = 1;
    let value = 0;

    function helper() {
        if (step === 0) return value
        value = oldValue + plusValue
        plusValue = oldValue
        oldValue = value
        step--
        return helper()
    }
    return helper()
}

fib(3) //2
fib(5) //5
```

```js
function fib(n){
    if(n<=2) return 1;
    return fib(n-1)+fib(n-2)
}
fib(5) // 5
//                         f(5)
//                       /      \
//                     f(4)     f(3)
//                    /    \    /    \
//                  f(3) f(2) f(2)  f(1)
//                  /   \  1     1     1
//               f(2)  f(1) 
//                 1     1       
```
